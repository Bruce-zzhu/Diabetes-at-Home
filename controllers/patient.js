const { Patient, TimeSeries } = require('../models/patient');
const { getTodayTimeSeries, createTodayTimeSeries } = require('./clinician');
const { getDateInfo } = require('../public/scripts/js-helpers');

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
        const patient = await Patient.findOne({ firstName: 'Pat' });
        const timeSeries = await getTodayTimeSeries(patient).then((data) => data);
        
        if (timeSeries) {
            TimeSeries.findOne({_id: timeSeries._id}, (err, doc) => {
                doc.bloodGlucose.value = blood;
                doc.bloodGlucose.comment = bloodComment;
                doc.weight.value = weight;
                doc.weight.comment = weightComment;
                doc.insulin.value = insulin;
                doc.insulin.comment = insulinComment;
                doc.exercise.value = exercise;
                doc.exercise.comment = exerciseComment;
                doc.save();
            })
                    
        } else {
            // create timeseries
            await createTodayTimeSeries(patient);
        }
        
        res.redirect('/patient/dashboard');
    } catch (e) {
        console.log(e);
    }
};

const renderPatientDashboard = async (req, res) => {
    try {
        const patient = await Patient.findOne({ firstName: 'Pat' }).lean();

        var todayTimeSeries = await getTodayTimeSeries(patient).then((data) => data);
        // create timeSeries for each patient every day
        if (!todayTimeSeries) {
            await createTodayTimeSeries(patient);
            todayTimeSeries = await getTodayTimeSeries(patient).then((data) => data);
        }

        const todayArray = getDateInfo(todayTimeSeries.localDate);
        const timeSeriesList = await TimeSeries.find({
            patient: patient._id,
        }).populate('patient').lean({virtuals: true});

        var averageTimeseries = {
            bloodGlucose: 0,
            insulin: 0,
            weight: 0,
            exercise: 0,
        };
        var endDateArray = [];

        // sort with descending order by the date
        timeSeriesList.sort(function (a, b) {
            var c = new Date(a.date);
            var d = new Date(b.date);
            return d - c;
        });

        // start date for avg
        const startDateArray = getDateInfo(timeSeriesList[timeSeriesList.length - 1].localDate);

        if (timeSeriesList.length === 1) {
            endDateArray = startDateArray;
        }
        console.log(timeSeriesList)
        
        getAvergaeValue(timeSeriesList, averageTimeseries, endDateArray);

        var datesArray = [];
        for (ts of timeSeriesList) {
            var date = getDateInfo(ts.localDate);
            datesArray.push(date);
        }

        histData = [];
        if (timeSeriesList.length > 1) {
            for (var i = 1; i < timeSeriesList.length; i++) {
                histData.push({
                    date: datesArray[i],
                    timeSeries: timeSeriesList[i],
                });
            }
        }

        res.render('patient/dashboard', {
            style: 'p-dashboard.css',
            patient,
            todayTimeSeries,
            todayArray,
            averageTimeseries,
            startDateArray,
            endDateArray,
            timeSeriesList,
            histData: JSON.stringify(histData),
        });
    } catch (e) {
        console.log(e);
    }
};

// calculate 7 day's avarage values
function getAvergaeValue(timeSeriesList, averageTimeseries, endDateArray) {
    // calculate average value until yesterday
    if (timeSeriesList.length > 1) {
        endDateArray = getDateInfo(timeSeriesList[1].localDate);
    } else {
        endDateArray = getDateInfo(timeSeriesList[0].localDate);
    }

    // in case there is not enough value for one week
    if (timeSeriesList.length > 1 && timeSeriesList.length <= 7) {
        for (let i = 1; i < timeSeriesList.length; i++) {
            averageTimeseries.bloodGlucose += timeSeriesList[i].bloodGlucose.value;
            averageTimeseries.insulin += timeSeriesList[i].insulin.value;
            averageTimeseries.weight += timeSeriesList[i].weight.value;
            averageTimeseries.exercise += timeSeriesList[i].exercise.value;
        }

        averageTimeseries.bloodGlucose = (
            averageTimeseries.bloodGlucose /
            (timeSeriesList.length - 1)
        ).toFixed(2);

        averageTimeseries.insulin = (
            averageTimeseries.insulin /
            (timeSeriesList.length - 1)
        ).toFixed(2);
        averageTimeseries.weight = (averageTimeseries.weight / (timeSeriesList.length - 1)).toFixed(
            2
        );
        averageTimeseries.exercise = (
            averageTimeseries.exercise /
            (timeSeriesList.length - 1)
        ).toFixed(2);
    } else if (timeSeriesList.length > 7){
        for (let i = 1; i < 8; i++) {
            averageTimeseries.bloodGlucose += timeSeriesList[i].bloodGlucose.value;
            averageTimeseries.insulin += timeSeriesList[i].insulin.value;
            averageTimeseries.weight += timeSeriesList[i].weight.value;
            averageTimeseries.exercise += timeSeriesList[i].exercise.value;
        }
        averageTimeseries.bloodGlucose = (averageTimeseries.bloodGlucose / 7).toFixed(2);
        averageTimeseries.insulin = (averageTimeseries.insulin / 7).toFixed(2);
        averageTimeseries.weight = (averageTimeseries.weight / 7).toFixed(2);
        averageTimeseries.exercise = (averageTimeseries.exercise / 7).toFixed(2);
    }
}

module.exports = {
    addEntryData,
    renderPatientDashboard,
};
