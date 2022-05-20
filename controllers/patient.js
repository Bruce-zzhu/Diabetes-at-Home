const { Patient, TimeSeries, Theme } = require("../models/patient");
const { Message } = require("../models/clinician");
const {
    getTodayTimeSeries,
    createTodayTimeSeries,
    getPatientTimeSeriesList,
    calcEgmt,
} = require("./clinician");
const { getDateInfo } = require("../public/scripts/js-helpers");

const addEntryData = async (req, res) => {
    const blood = req.body.bloodGlucose;
    const bloodComment = req.body.bloodGlucoseComment;
    const weight = req.body.weight;
    const weightComment = req.body.weightComment;
    const insulin = req.body.insulin;
    const insulinComment = req.body.insulinComment;
    const exercise = req.body.step;
    const exerciseComment = req.body.stepComment;

    try {
        const patient = await Patient.findOne({ _id: req.session.user.id });
        const timeSeries = await getTodayTimeSeries(patient).then(
            (data) => data
        );

        if (timeSeries) {
            await TimeSeries.updateOne(
                {_id: timeSeries._id}, 
                {$set: {
                    'bloodGlucose.value': blood,
                    'bloodGlucose.comment': bloodComment,
                    'weight.value': weight,
                    'weight.comment': weightComment,
                    'insulin.value': insulin,
                    'insulin.comment': insulinComment,
                    'exercise.value': exercise,
                    'exercise.comment': exerciseComment,
                }}, {new: true});
        } else {
            // create timeseries
            await createTodayTimeSeries(patient);
        }

        res.redirect("/patient/dashboard");
    } catch (e) {
        console.log(e);
    }
};

const renderPatientDashboard = async (req, res) => {
    try {
        var patient = await Patient.findOne({ email: req.session.user.email }).populate('requirements').lean();

        // re-calculate engagement
        currentEgmt = await calcEgmt(patient._id);
        patient = await Patient.findOneAndUpdate(
            { _id: patient._id },
            { engagementRate: currentEgmt },
            { new: true }
        ).populate('requirements').lean();

        req.session.user.id = patient._id;
        req.session.user.firstName = patient.firstName;
        req.session.user.lastName = patient.lastName;
        req.session.user.nickName = patient.nickName;
        req.session.user.theme = JSON.stringify(
            await Theme.findOne({ themeName: patient.theme }).lean()
        );

        var todayTimeSeries = await getTodayTimeSeries(patient).then(
            (data) => data
        );
        // create timeSeries for each patient every day
        if (!todayTimeSeries) {
            await createTodayTimeSeries(patient);
            todayTimeSeries = await getTodayTimeSeries(patient).then(
                (data) => data
            );
        }

        const todayArray = getDateInfo(todayTimeSeries.date);
        const timeSeriesList = await getPatientTimeSeriesList(patient);

        var averageTimeseries = {
            bloodGlucose: 0,
            insulin: 0,
            weight: 0,
            exercise: 0,
        };

        // start date for avg recent data
        var startDateArray;
        if (timeSeriesList.length <= 8) {
            startDateArray = getDateInfo(
                timeSeriesList[timeSeriesList.length - 1].date
            );
        } else {
            startDateArray = getDateInfo(timeSeriesList[7].date);
        }

        // start is the end if there is only one
        var endDateArray = [];
        if (timeSeriesList.length === 1) {
            endDateArray = startDateArray;
        }

        getAverageValue(timeSeriesList, averageTimeseries, endDateArray);

        // get all the date data to display
        var datesArray = [];
        for (ts of timeSeriesList) {
            var date = getDateInfo(ts.date);
            datesArray.push(date);
        }

        // combine date data with timeseries
        var histData = [];
        if (timeSeriesList.length > 1) {
            for (var i = 1; i < timeSeriesList.length; i++) {
                histData.push({
                    date: datesArray[i],
                    timeSeries: timeSeriesList[i],
                });
            }
        }

        const messages = await Message.find({
            patient: patient._id,
            clinician: patient.clinician._id,
        })
            .populate("clinician")
            .lean();
        messages.sort(function (a, b) {
            var c = new Date(a.time);
            var d = new Date(b.time);
            return d - c;
        });

        var preReadMsgs = messages;

        for (m of messages) {
            await Message.findByIdAndUpdate(m._id, { unread: false });
        }

        // get all nickname <-> egagements to use to display leaderboard
        var allPatEgmts = await Patient.find({}, "_id").lean();
        for (pat of allPatEgmts) {
            await Patient.findOneAndUpdate({ _id: pat._id }, { engagementRate: await calcEgmt(pat._id) });
        }
        var allPatEgmts = await Patient.find({}, "nickName engagementRate").lean();
        allPatEgmts.sort((a, b) => b.engagementRate - a.engagementRate);
        for (var i=0; i<allPatEgmts.length; i++) {
            allPatEgmts[i].egmtRate = ((allPatEgmts[i].engagementRate * 100).toFixed(2));
        }

        res.render("patient/dashboard", {
            style: "p-dashboard.css",
            user: req.session.user,
            patient,
            todayTimeSeries,
            todayArray,
            averageTimeseries,
            startDateArray,
            endDateArray,
            timeSeriesList,
            histData: JSON.stringify(histData),
            messages: preReadMsgs,
            allPatEgmts
        });
    } catch (e) {
        console.log(e);
    }
};

// calculate 7 day's avarage values
function getAverageValue(timeSeriesList, averageTimeseries, endDateArray) {
    // calculate average value until yesterday
    if (timeSeriesList.length > 1) {
        endDateArray.push(...getDateInfo(timeSeriesList[1].date));
    } else {
        endDateArray.push(...getDateInfo(timeSeriesList[0].date));
    }

    // in case there is not enough value for one week
    if (timeSeriesList.length > 1 && timeSeriesList.length <= 7) {
        let bloodGlucose_length = 0;
        let insulin_length = 0;
        let weight_length = 0;
        let exercise_length = 0;
        for (let i = 1; i < timeSeriesList.length; i++) {
            if (timeSeriesList[i].bloodGlucose.value) {
                averageTimeseries.bloodGlucose +=
                    timeSeriesList[i].bloodGlucose.value;
                bloodGlucose_length += 1;
            }
            if (timeSeriesList[i].insulin.value) {
                averageTimeseries.insulin += timeSeriesList[i].insulin.value;
                insulin_length += 1;
            }
            if (timeSeriesList[i].weight.value) {
                averageTimeseries.weight += timeSeriesList[i].weight.value;
                weight_length += 1;
            }
            if (timeSeriesList[i].exercise.value) {
                averageTimeseries.exercise += timeSeriesList[i].exercise.value;
                exercise_length += 1;
            }
        }

        averageTimeseries.bloodGlucose = (
            averageTimeseries.bloodGlucose / bloodGlucose_length
        ).toFixed(2);

        averageTimeseries.insulin = (
            averageTimeseries.insulin / insulin_length
        ).toFixed(2);
        averageTimeseries.weight = (
            averageTimeseries.weight / weight_length
        ).toFixed(2);
        averageTimeseries.exercise = (
            averageTimeseries.exercise / exercise_length
        ).toFixed(2);
    } else if (timeSeriesList.length > 7) {
        let bloodGlucose_length = 0;
        let insulin_length = 0;
        let weight_length = 0;
        let exercise_length = 0;
        for (let i = 1; i < 8; i++) {
            if (timeSeriesList[i].bloodGlucose.value) {
                averageTimeseries.bloodGlucose +=
                    timeSeriesList[i].bloodGlucose.value;
                bloodGlucose_length += 1;
            }
            if (timeSeriesList[i].insulin.value) {
                averageTimeseries.insulin += timeSeriesList[i].insulin.value;
                insulin_length += 1;
            }
            if (timeSeriesList[i].weight.value) {
                averageTimeseries.weight += timeSeriesList[i].weight.value;
                weight_length += 1;
            }
            if (timeSeriesList[i].exercise.value) {
                averageTimeseries.exercise += timeSeriesList[i].exercise.value;
                exercise_length += 1;
            }
        }
        averageTimeseries.bloodGlucose = (
            averageTimeseries.bloodGlucose / bloodGlucose_length
        ).toFixed(2);

        averageTimeseries.insulin = (
            averageTimeseries.insulin / insulin_length
        ).toFixed(2);
        averageTimeseries.weight = (
            averageTimeseries.weight / weight_length
        ).toFixed(2);
        averageTimeseries.exercise = (
            averageTimeseries.exercise / exercise_length
        ).toFixed(2);
    }
}

module.exports = {
    addEntryData,
    renderPatientDashboard,
};
