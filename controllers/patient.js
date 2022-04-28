const { Patient, TimeSeries } = require('../models/patient');
const { getTodayTimeSeries, createTodayTimeSeries } = require('./clinician')



const addEntryData = async (req, res) => {

    const blood = req.body.bloodGlucose;
    const bloodComment = req.body.bloodGlucoseComment;
    const weight = req.body.weight;
    const weightComment = req.body.weightComment;
    const insulin = req.body.insulin;
    const insulinComment = req.body.insulinComment;
    const exercise = req.body.step;
    const exerciseComment = req.body.stepComment;

    const patient = await Patient.findOne({firstName: 'Pat'});
    const timeSeries = await getTodayTimeSeries(patient).then(data => data);

    if (timeSeries) {
        TimeSeries.findOne({id: timeSeries._id}, (err, obj) => {
            obj.bloodGlucose.value = blood;
            obj.bloodGlucose.comment = bloodComment;
            obj.weight.value = weight;
            obj.weight.comment = weightComment;
            obj.insulin.value = insulin;
            obj.insulin.comment = insulinComment;
            obj.exercise.value = exercise;
            obj.exercise.comment = exerciseComment;
            obj.save();
        })
        
    } else {
        // create timeseries
        createTodayTimeSeries(patient);
    }
    
    res.redirect('/patient/dashboard');
}


module.exports = {
    addEntryData
}