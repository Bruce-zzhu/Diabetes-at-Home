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
}


module.exports = {
    addEntryData
}