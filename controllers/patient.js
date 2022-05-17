const { Patient, TimeSeries, Theme } = require("../models/patient");
const { Message } = require("../models/clinician");
const {
    getTodayTimeSeries,
    createTodayTimeSeries,
    getPatientTimeSeriesList,
} = require("./clinician");
const { getDateInfo } = require("../public/scripts/js-helpers");

// Hardcoded Patient Email
const patientEmail = "pat@diabetemail.com";
// const loginEmailEntry = async(req, res) => {
//     const patientEmail = req.body.loginEmail;
// }

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
        const patient = await Patient.findOne({ email: patientEmail });
        const timeSeries = await getTodayTimeSeries(patient).then(
            (data) => data
        );

        if (timeSeries) {
            TimeSeries.findOne({ _id: timeSeries._id }, (err, doc) => {
                doc.bloodGlucose.value = blood;
                doc.bloodGlucose.comment = bloodComment;
                doc.weight.value = weight;
                doc.weight.comment = weightComment;
                doc.insulin.value = insulin;
                doc.insulin.comment = insulinComment;
                doc.exercise.value = exercise;
                doc.exercise.comment = exerciseComment;
                doc.save();
            });
        } else {
            // create timeseries
            await createTodayTimeSeries(patient);
        }

        // Re-calculate engagement
        var today = new Date();
        const allTS = await TimeSeries.find({
            patient: patient._id,
            clinicianUse: false,
        }).lean();
        var daysActive = 0;
        for (var i = 0; i < allTS.length; i++) {
            var dayTS = allTS[i];
            if (
                (dayTS.bloodGlucose.isRequired &&
                    dayTS.bloodGlucose.value == null) ||
                (dayTS.weight.isRequired && dayTS.weight.value == null) ||
                (dayTS.insulin.isRequired && dayTS.insulin.value == null) ||
                (dayTS.exercise.isRequired && dayTS.exercise.value == null)
            ) {
                continue;
            } else {
                daysActive++;
            }
        }
        var totalDays = Math.ceil(
            (today.getTime() - patient.createTime.getTime()) / 86400000
        );
        console.log(today, patient.createTime);
        await Patient.findOneAndUpdate(
            { _id: patient._id },
            { engagementRate: daysActive / totalDays }
        );

        res.redirect("/patient/dashboard");
    } catch (e) {
        console.log(e);
    }
};

const renderPatientDashboard = async (req, res) => {
    try {
        const patient = await Patient.findOne({ email: patientEmail }).lean();

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

        var allPatEgmts = await Patient.find({}, "nickName engagementRate");
        allPatEgmts.sort((a, b) => b.engagementRate - a.engagementRate);
        allPatEgmts = allPatEgmts.slice(0, 5);
        allPatEgmts = JSON.stringify(allPatEgmts);

        req.session.theme = JSON.stringify(
            await Theme.findOne({ themeName: patient.theme }).lean()
        );

        res.render("patient/dashboard", {
            style: "p-dashboard.css",
            theme: req.session.theme,
            patient,
            todayTimeSeries,
            todayArray,
            averageTimeseries,
            startDateArray,
            endDateArray,
            timeSeriesList,
            histData: JSON.stringify(histData),
            messages,
            allPatEgmts,
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
