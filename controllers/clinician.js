const { Patient, TimeSeries } = require('../models/patient');
const { isSameDay } = require('../public/scripts/js-helpers');

const getTodayTimeSeries = async (patient) => {
    try {
        var today = new Date();
        const timeSeries = await TimeSeries.find({patient: patient._id}).populate('patient').lean();
        // check if it's today's timeseries
        for (ts of timeSeries) {
            if (isSameDay(today, ts.date)) {
                // today's timeseries found
                return ts;
            } 
        }
        
        return null;
        
    } catch(e) {
        console.log(e);
    }
    
}

const createTodayTimeSeries = async (patient) => {
    try {
        const newTimeseries = new TimeSeries({
            patient: patient._id,
            date: new Date(), 
            bloodGlucose: {
                isRequired: true,
                upperBound: 10,
                lowerBound: 6,
            },
            insulin: {
                isRequired: true,
                upperBound: 3,
                lowerBound: 0,
            },
            weight: {
                isRequired: false,
                upperBound: 100,
                lowerBound: 50,
            },
            exercise: {
                isRequired: false,
                upperBound: 100000,
                lowerBound: 0,
            },
        });
        await newTimeseries.save();
    } catch (e) {
        console.log(e);
    }
};

const getDashboardData = async (req, res) => {
    try {
        const patients = await Patient.find({}).lean();
        var timeSeriesList = [];
        for (p of patients) {
            const timeSeries = await getTodayTimeSeries(p).then((data) => data);
            if (timeSeries) {
                // today's timeseries found
                timeSeriesList.push(timeSeries);
            } else {
                // create today's timeseries
                await createTodayTimeSeries(p);
            }
        }
        res.render('clinician/dashboard', {
            style: 'dashboard.css',
            timeSeriesList,
        });
    } catch (e) {
        console.log(e);
    }
};

// get history data
const getPatientTimeSeriesList = async (patient) => {
    try {
        const timeSeriesList = await TimeSeries.find({
            patient: patient._id,
        }).populate('patient').lean();

        // sort with descending order by the date
        timeSeriesList.sort(function (a, b) {
            var c = new Date(a.date);
            var d = new Date(b.date);
            return d - c;
        });
        return timeSeriesList;

    } catch(e) {
        console.log(e)
    }
    
    
}

const renderPatientProfile = async (req, res) => {
    try {
        const pid = req.params.id;
        const patient = await Patient.findById(pid).lean();

        const timeSeriesList = await getPatientTimeSeriesList(patient).then(data => data);

        res.render('clinician/viewPatient', {
            style: 'viewPatient.css',
            patient,
            timeSeriesList
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    getDashboardData,
    renderPatientProfile,
    getTodayTimeSeries,
    createTodayTimeSeries,
    getPatientTimeSeriesList
};
