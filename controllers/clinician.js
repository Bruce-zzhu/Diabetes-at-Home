const { Note, Message, Clinician } = require("../models/clinician");
const { Patient, TimeSeries, Theme } = require("../models/patient");
const {
    isSameDay,
    getDateInfo,
    toMelbDate,
    isNotBounded
} = require("../public/scripts/js-helpers");

const getTodayTimeSeries = async (patient) => {
    try {
        var today = new Date();
        const timeSeries = await TimeSeries.find({
            patient: patient._id,
            clinicianUse: false,
        })
            .populate("patient")
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

// calculates a patient's engagement rate
const calcEgmt = async (pid) => {
    const patient = await Patient.findById(pid);
    var earliestDay = patient.createTime;

    var today = new Date();
    const allTS = await TimeSeries.find({
        patient: patient._id,
        clinicianUse: false,
    }).lean();
    var daysActive = 0;
    for (var i = 0; i < allTS.length; i++) {
        var dayTS = allTS[i];
        if (dayTS.date < earliestDay) {
            earliestDay = dayTS.date;
        }
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
    var totalDays = 1 + Math.round(
        (today.getTime() - earliestDay.getTime()) / 86400000
    );
    return daysActive / totalDays;
}

const getDashboardData = async (req, res) => {
    const clinician = await Clinician.findOne({
        email: req.session.user.email,
    }).lean();

    // record clinician details in cookie
    req.session.user.id = clinician._id;
    req.session.user.firstName = clinician.firstName;
    req.session.user.lastName = clinician.lastName;
    req.session.user.theme = JSON.stringify(
        await Theme.findOne({ themeName: clinician.theme }).lean()
    );

    
    try {
        var patients = [];
        for (pid of clinician.patients) {
            patients.push(await Patient.findById(pid).populate("requirements").lean());
        }
        
        var timeSeriesList = [];
        for (p of patients) {
            var timeSeries = await getTodayTimeSeries(p).then((data) => data);
            if (timeSeries) {
                // today's timeseries found
                timeSeriesList.push(timeSeries);
            } else {
                // create today's timeseries
                await createTodayTimeSeries(p);
                timeSeries = await getTodayTimeSeries(p).then((data) => data);
                timeSeriesList.push(timeSeries);
            }
        }
        res.render("clinician/dashboard", {
            style: "dashboard.css",
            user: req.session.user,
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
            clinicianUse: false,
        })
            .populate("patient")
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
        var patient = await Patient.findById(pid)
            .populate("requirements")
            .lean();

        currentEgmt = await calcEgmt(patient._id);
        patient = await Patient.findOneAndUpdate(
            { _id: patient._id },
            { engagementRate: currentEgmt },
            { new: true }
        ).populate('requirements').lean();

        const timeSeriesList = await getPatientTimeSeriesList(patient).then(
            (data) => data
        );

        // no time series found, create one
        if (timeSeriesList.length === 0) {
            await createTodayTimeSeries(patient);
            todayTimeSeries = await getTodayTimeSeries(patient).then(
                (data) => data
            );
            timeSeriesList.push(todayTimeSeries);
            
        }

        const notes = await Note.find({
            patient: patient._id,
            clinician: req.session.user.id,
        }).lean();
        // sort with descending order by the time
        notes.sort(function (a, b) {
            var c = new Date(a.time);
            var d = new Date(b.time);
            return d - c;
        });

        const messages = await Message.find({
            patient: patient._id,
            clinician: req.session.user.id,
        })
            .populate("clinician")
            .lean();
        messages.sort(function (a, b) {
            var c = new Date(a.time);
            var d = new Date(b.time);
            return d - c;
        });

        var datesArray = [];
        for (ts of timeSeriesList) {
            var date = getDateInfo(ts.date);
            datesArray.push(date);
        }

        var histData = [];
        if (timeSeriesList.length > 1) {
            for (var i = 1; i < timeSeriesList.length; i++) {
                histData.push({
                    date: datesArray[i],
                    timeSeries: timeSeriesList[i],
                });
            }
        }

        // console.log(messages)
        res.render("clinician/viewPatient", {
            style: "viewPatient.css",
            user: req.session.user,
            patient,
            timeSeriesList,
            notes,
            messages,
            histData: JSON.stringify(histData),
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
        const patient = await Patient.findById(pid)
            .populate("requirements")
            .lean();
        await TimeSeries.findOneAndUpdate(
            { _id: patient.requirements._id, clinicianUse: true },
            update
        );
        res.redirect(`/clinician/view-patient/${pid}`);
    } catch (e) {
        console.log(e);
    }
};

const addNote = async (req, res) => {
    try {
        const pid = req.params.id;
        const patient = await Patient.findById(pid).lean();

        const title = req.body.title;
        const body = req.body.body;

        const newNote = new Note({
            clinician: req.session.user.id,
            patient: patient._id,
            title: title,
            body: body,
            time: Date(),
        });
        await newNote.save();

        res.redirect(`/clinician/view-patient/${pid}`);
    } catch (e) {
        console.log(e);
    }
};

const addMessage = async (req, res) => {
    try {
        const pid = req.params.id;
        const patient = await Patient.findById(pid).lean();

        const body = req.body.body;

        const newMessage = new Message({
            clinician: req.session.user.id,
            patient: patient._id,
            body: body,
            time: Date(),
        });
        await newMessage.save();

        res.redirect(`/clinician/view-patient/${pid}`);
    } catch (e) {
        console.log(e);
    }
};

// registers a new patient
const insertData = async (req, res) => {

    // generates unique nickname
    var newNick = req.body.firstName[0] + req.body.lastName[0] + Math.floor(Math.random() * 10000);
    while (await Patient.findOne({nickName: newNick}).lean()) {
        newNick = req.body.firstName[0] + req.body.lastName[0] + Math.floor(Math.random() * 10000);
    }
    
    // creates the patient
    var newPatient = new Patient({
        createTime: new Date(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nickName: newNick,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        engagementRate: 0,
        age: req.body.age,
        theme: "default",
        clinician: req.session.user.id,
    });
    await newPatient.save();

    // adds the requirements onto the patient
    var newTimeseries = new TimeSeries({
        patient: newPatient._id,
        clinicianUse: true,
        date: new Date(),
        bloodGlucose: {
            upperBound: req.body.bloodHigh ? req.body.bloodHigh : 0,
            lowerBound: req.body.bloodLow ? req.body.bloodLow : 0,
            isRequired: Boolean(req.body.bloodRequired),
        },
        weight: {
            upperBound: req.body.weightHigh ? req.body.weightHigh : 0,
            lowerBound: req.body.weightLow ? req.body.weightLow : 0,
            isRequired: Boolean(req.body.weightRequired),
        },
        insulin: {
            upperBound: req.body.insulinHigh ? req.body.insulinHigh : 0,
            lowerBound: req.body.insulinLow ? req.body.insulinLow : 0,
            isRequired: Boolean(req.body.insulinRequired),
        },
        exercise: {
            upperBound: req.body.exerciseHigh ? req.body.exerciseHigh : 0,
            lowerBound: req.body.exerciseLow ? req.body.exerciseLow : 0,
            isRequired: Boolean(req.body.exerciseRequired),
        },
    });
    await newTimeseries.save();
    var newPatient = await Patient.findOneAndUpdate( {_id: newPatient._id}, {requirements: newTimeseries._id}, {new: true});
    
    // registers the patient under the clinician
    var clin = await Clinician.findOne({_id: req.session.user.id});
    clin.patients.push(newPatient._id);
    await clin.save();

    res.redirect(`/clinician/dashboard`);
};

const renderRegister = (req, res) => {
    res.render("clinician/register", {
        style: "register.css",
        user: req.session.user,
    });
};

const renderCommentsPage = async (req, res) => {
    try {
        const cid = req.session.user.id;
        const clinician = await Clinician.findById({ _id: cid }).lean();
        const patientIDs = clinician.patients;

        var patients = [];
        for (pid of patientIDs) {
            var p = await Patient.findById(pid).lean();
            patients.push(p);
        }

        // get filtered information if any
        const viewAll = req.query.viewAll;
        const { selectedPatientId, selectedDate } = req.query;

        const data = [];
        if (viewAll === "true") {
            // get all timeseries data of each patient
            for (pid of patientIDs) {
                const ts = await TimeSeries.find({
                    patient: pid,
                    clinicianUse: false,
                })
                    .populate("patient")
                    .lean();
                data.push(...ts);
            }
        } else {
            if (selectedPatientId && !selectedDate) {
                // fiter by selected patient
                const ts = await TimeSeries.find({
                    patient: selectedPatientId,
                    clinicianUse: false,
                })
                    .populate("patient")
                    .lean();
                data.push(...ts);
            } else if (selectedDate && !selectedPatientId) {
                // fiter by selected date
                var selectedMelbDate =
                    selectedDate.slice(8, 10) +
                    "/" +
                    selectedDate.slice(5, 7) +
                    "/" +
                    selectedDate.slice(0, 4);

                for (pid of patientIDs) {
                    // find all timeseries and compare date
                    const ts = await TimeSeries.find({
                        patient: pid,
                        clinicianUse: false,
                    })
                        .populate("patient")
                        .lean();
                    for (i of ts) {
                        var tsDate = toMelbDate(i.date);
                        if (selectedMelbDate === tsDate) {
                            data.push(i);
                        }
                    }
                }
            } else if (selectedPatientId && selectedDate) {
                // get timeseries based on patient and date
                var selectedMelbDate =
                    selectedDate.slice(8, 10) +
                    "/" +
                    selectedDate.slice(5, 7) +
                    "/" +
                    selectedDate.slice(0, 4);
                const ts = await TimeSeries.find({
                    patient: selectedPatientId,
                    clinicianUse: false,
                })
                    .populate("patient")
                    .lean();
                for (i of ts) {
                    var tsDate = toMelbDate(i.date);
                    if (selectedMelbDate === tsDate) {
                        data.push(i);
                    }
                }
            } else if (!selectedPatientId && !selectedDate) {
                // default all patients
                for (pid of patientIDs) {
                    const ts = await TimeSeries.find({
                        patient: pid,
                        clinicianUse: false,
                    })
                        .populate("patient")
                        .lean();
                    data.push(...ts);
                }
            }
        }

        // sort comments by time descending
        data.sort(function (a, b) {
            return b.date - a.date;
        });

        res.render("clinician/comments", {
            style: "comments.css",
            user: req.session.user,
            patients,
            data,
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
    getPatientTimeSeriesList,
    submitRequirement,
    calcEgmt,
    addNote,
    addMessage,
    insertData,
    renderCommentsPage,
    renderRegister,
};
