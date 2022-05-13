const { Patient, TimeSeries } = require('../models/patient');
const { isSameDay } = require('../public/scripts/js-helpers');

const getTodayTimeSeries = async (patient) => {
    try {
        var today = new Date();
        const timeSeries = await TimeSeries.find({ patient: patient._id, clinicianUse: false })
            .populate('patient')
            .lean();
        // check if it's today's timeseries
        for (ts of timeSeries) {
            if (isSameDay(today, ts.date)) {
                // today's timeseries found
                return ts;
            }
        }

        return null;
    } catch (e) {
        console.log(e);
    }
};

const createTodayTimeSeries = async (patient) => {
    try {
        const newTimeseries = new TimeSeries({
            patient: patient._id,
            clinicianUse: false,
            date: new Date(),
            bloodGlucose: {
                isRequired: patient.requirements.bloodGlucose.isRequired,
                upperBound: patient.requirements.bloodGlucose.upperBound,
                lowerBound: patient.requirements.bloodGlucose.lowerBound,
            },
            insulin: {
                isRequired: patient.requirements.insulin.isRequired,
                upperBound: patient.requirements.insulin.upperBound,
                lowerBound: patient.requirements.insulin.lowerBound,
            },
            weight: {
                isRequired: patient.requirements.weight.isRequired,
                upperBound: patient.requirements.weight.upperBound,
                lowerBound: patient.requirements.weight.lowerBound,
            },
            exercise: {
                isRequired: patient.requirements.exercise.isRequired,
                upperBound: patient.requirements.exercise.upperBound,
                lowerBound: patient.requirements.exercise.lowerBound,
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
            clinicianUse: false
        })
            .populate('patient')
            .lean();
        

        // sort with descending order by the date
        timeSeriesList.sort(function (a, b) {
            var c = new Date(a.date);
            var d = new Date(b.date);
            return d - c;
        });
        return timeSeriesList;
    } catch (e) {
        console.log(e);
    }
};

const renderPatientProfile = async (req, res) => {
    try {
        const pid = req.params.id;
        const patient = await Patient.findById(pid).populate('requirements').lean();

        const timeSeriesList = await getPatientTimeSeriesList(patient).then((data) => data);

        // no time series found, create one
        if (timeSeriesList.length === 0) {
            await createTodayTimeSeries(patient);
            todayTimeSeries = await getTodayTimeSeries(patient).then((data) => data);
            timeSeriesList.push(todayTimeSeries)
        }

        res.render('clinician/viewPatient', {
            style: 'viewPatient.css',
            patient,
            timeSeriesList,
        });
    } catch (e) {
        console.log(e);
    }
};

const submitRequirement = async (req, res) => {
    const pid = req.params.id;
    const update = {};

    update.bloodGlucose = {};
    if (req.body.bloodRequired) {
        update.bloodGlucose.isRequired = true;
        update.bloodGlucose.lowerBound = req.body.bloodLow;
        update.bloodGlucose.upperBound = req.body.bloodHigh;
    } else {
        update.bloodGlucose.isRequired = false;
        update.bloodGlucose.lowerBound = 0;
        update.bloodGlucose.upperBound = 0;
    }

    update.weight = {};
    if (req.body.weightRequired) {
        update.weight.isRequired = true;
        update.weight.lowerBound = req.body.weightLow;
        update.weight.upperBound = req.body.weightHigh;
    } else {
        update.weight.isRequired = false;
        update.weight.lowerBound = 0;
        update.weight.upperBound = 0;
    }

    update.insulin = {};
    if (req.body.insulinRequired) {
        update.insulin.isRequired = true;
        update.insulin.lowerBound = req.body.insulinLow;
        update.insulin.upperBound = req.body.insulinHigh;
    } else {
        update.insulin.isRequired = false;
        update.insulin.lowerBound = 0;
        update.insulin.upperBound = 0;
    }

    update.exercise = {};
    if (req.body.exerciseRequired) {
        update.exercise.isRequired = true;
        update.exercise.lowerBound = req.body.exerciseLow;
        update.exercise.upperBound = req.body.exerciseHigh;
    } else {
        update.exercise.isRequired = false;
        update.exercise.lowerBound = 0;
        update.exercise.upperBound = 0;
    }

    try {
        const patient = await Patient.findById(pid).populate('requirements').lean();
        await TimeSeries.findOneAndUpdate(
            { _id: patient.requirements._id, clinicianUse: true },
            update
        );
        res.redirect('/clinician/view-patient/' + pid);
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    getDashboardData,
    renderPatientProfile,
    getTodayTimeSeries,
    createTodayTimeSeries,
    getPatientTimeSeriesList,
    submitRequirement,
};
