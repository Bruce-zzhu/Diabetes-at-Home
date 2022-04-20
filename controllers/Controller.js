const patientSample = require("../models/samplePatient");
const timeseriesSample = require("../models/sampleTimeseries");
const { Patient, TimeSeries } = require("../models/patient");
const { Clinician } = require("../models/clinician");

async function createPatient() {
    const finding = await Patient.find();
    if (finding.length > 0) {
        const patient = await Patient.findOne({ nickName: "Pat" });
        return patient.id;
    } else {
        const newPatient = new Patient({
            firstName: "Pat",
            lastName: "T",
            nickName: "Pat",
            age: "0",
            gender: "male",
            email: "pat@diabetemail.com",
            password: "000",
        });
        const patient = await newPatient.save();
        return patient.id;
    }
}
async function createclinician() {
    const finding = await Clinician.find();
    if (finding.length > 0) {
        const clinician = await Clinician.findOne({ firstName: "Chris" });
        return clinician.id;
    } else {
        const newClinician = new Clinician({
            firstName: "Chris",
            lastName: " Q",
            email: "Chris@diabetemail.com",
            password: "000",
        });
        const clinician = await newClinician.save();
        return clinician.id;
    }
}
async function createTimeseires(patientId) {
    const finding = await TimeSeries.find();
    if (finding.length != 0) {
        return finding.id;
    } else {
        const newTimeseries = new TimeSeries({
            patientId: patientId,
            date: new Date(),
        });

        const data = await newTimeseries.save();
        return data.id;
    }
}

module.exports = {
    createPatient,
    createclinician,
    createTimeseires,
};
