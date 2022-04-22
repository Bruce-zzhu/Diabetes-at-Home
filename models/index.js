const mongoose = require("mongoose");
const { Patient, TimeSeries } = require("./patient");
const { Clinician } = require("./clinician");

require("dotenv").config();
const connectionURL = process.env.MONGO_URL || "mongodb://localhost:27017/diabetes-at-home";
mongoose.connect(connectionURL);

const db = mongoose.connection;
// event handlers
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("connected to Mongo");
});

// sample data
const newPatient = new Patient({
    firstName: "Pat",
    lastName: "Smith",
    nickName: "Pat",
    age: "30",
    gender: "male",
    email: "pat@diabetemail.com",
});
const newClinician = new Clinician({
    firstName: "Chris",
    lastName: " Lee",
    email: "chris@diabetemail.com",
    patients: [newPatient._id]
});
const newTimeseries = new TimeSeries({
    patient: newPatient._id,
    date: new Date(),
    bloodGlucose: {
        isRequired: true,
        value: 8
    },
    insulin: {
        isRequired: true,
        value: 2
    },
    weight: {
        isRequired: false,
        value: 65
    },
    exercise: {
        isRequired: false,
        value: 2000
    }
})


// load sample data into mongodb
const loadDataToDB = async () => {
    // delete the old data
    await Patient.deleteMany({});
    await TimeSeries.deleteMany({});
    await Clinician.deleteMany({});

    await newPatient.save();
    await newClinician.save();
    await newTimeseries.save();
    
};

loadDataToDB().then(() => {
    mongoose.connection.close();
});
