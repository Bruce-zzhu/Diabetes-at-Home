const { Patient, TimeSeries } = require('../models/patient');
const {isSameDay} = require('../public/scripts/js-helpers');

const getTodayTimeSeries = async (patient) => {
    try {
        var today = new Date();
        const timeSeries = await TimeSeries.findOne({patient: patient._id}).populate('patient').lean();
        // check if it's today's timeseries
        if (timeSeries && isSameDay(today, timeSeries.date)) {
            // today's timeseries found
            return timeSeries;
        } else {
            return null;
        }
    } catch(e) {
        console.log(e);
    }
    
}

const createTodayTimeSeries = async (patient) => {
    const newTimeseries = new TimeSeries({
        patient: patient._id,
        date: new Date(),
        bloodGlucose: {
            isRequired: true,
            upperBound: 10,
            lowerBound: 6
        },
        insulin: {
            isRequired: true,
            upperBound: 3,
            lowerBound: 0
        },
        weight: {
            isRequired: false,
            upperBound: 100,
            lowerBound: 50
        },
        exercise: {
            isRequired: false,
            upperBound: 100000,
            lowerBound: 0
        }
    })
    await newTimeseries.save();
}

const getDashboardData = async (req, res) => {
    try {
        // .lean() is to solve the handlebars access error
        const patients = await Patient.find({}).lean();
        var timeSeriesList = [];
        var today = new Date();
        for (p of patients) {
            const timeSeries = await getTodayTimeSeries(p).then(data => data);
            if (timeSeries) {
                // today's timeseries found
                timeSeriesList.push(timeSeries)
            } else {
                // create today's timeseries
                createTodayTimeSeries(p);
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