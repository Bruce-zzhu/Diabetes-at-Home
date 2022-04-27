const { Patient, TimeSeries } = require('../models/patient');
const {isSameDay} = require('../public/scripts/js-helpers');


const getDashboardData = async (req, res) => {
    try {
        // .lean() is to solve the handlebars access error
        const patients = await Patient.find({}).lean();
        var timeSeriesList = [];
        var today = new Date();
        for (p of patients) {
            const timeSeries = await TimeSeries.findOne({patient: p._id}).populate('patient').lean();
            // check if it's today's timeseries
            if (isSameDay(today, timeSeries.date)) {
                // today's timeseries found
                timeSeriesList.push(timeSeries)
            } else {
                // create today's timeseries
            }
        } 
        res.render('clinician/dashboard', {
            style: 'dashboard.css',
            timeSeriesList
        });
    } catch(e) {
        console.log(e);
    }
}


const renderPatientProfile = async (req, res) => {
    try {
        const pid = req.params.id;
        const patient = await Patient.findById(pid).lean();
        res.render('clinician/viewPatient', {
            style: 'viewPatient.css',
            patient,
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getDashboardData,
    renderPatientProfile
}