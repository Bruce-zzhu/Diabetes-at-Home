const mongoose = require("mongoose");
const { Patient, TimeSeries } = require("./patient");
const { Clinician, Note, Message } = require("./clinician");

require("dotenv").config();
const connectionURL = process.env.MONGO_URL || "mongodb://localhost:27017/d-a-h";
mongoose.connect(connectionURL);

const db = mongoose.connection;
// event handlers
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("connected to Mongo");
});

// sample data
const requirements = new TimeSeries({
    clinicianUse: true,
    date: new Date(),
    bloodGlucose: {
        isRequired: false,
        value: 0,
        upperBound: 0,
        lowerBound: 0
    },
    insulin: {
        isRequired: false,
        value: 0,
        upperBound: 0,
        lowerBound: 0
    },
    weight: {
        isRequired: false,
        value: 0,
        upperBound: 0,
        lowerBound: 0
    },
    exercise: {
        isRequired: false,
        value: 0,
        upperBound: 0,
        lowerBound: 0
    }
});

const newPatient = new Patient({
    firstName: "Pat",
    lastName: "Smith",
    nickName: "Pat",
    age: 30,
    gender: "male",
    email: "pat@diabetemail.com",
    password: "password",
    requirements: requirements._id
});

const newClinician = new Clinician({
    firstName: "Chris",
    lastName: " Lee",
    email: "chris@diabetemail.com",
    patients: [newPatient._id],
    password: "password"
});
const newTimeseries = new TimeSeries({
    patient: newPatient._id,
    date: new Date(),
    bloodGlucose: {
        isRequired: true,
        value: 8.1,
        upperBound: 10,
        lowerBound: 6
    },
    insulin: {
        isRequired: true,
        value: 2,
        upperBound: 3,
        lowerBound: 0
    },
    weight: {
        isRequired: false,
        value: 65,
        upperBound: 100,
        lowerBound: 50
    },
    exercise: {
        isRequired: false,
        value: 900,
        upperBound: 100000,
        lowerBound: 0
    }
})

const newNote = new Note({
    clinician: newClinician._id,
    patient: newPatient._id,
    title: "",
    body: "",
    time: Date()
})

const newMessage = new Message({
    clinician: newClinician._id,
    patient: newPatient._id,
    body: "",
    time: Date()
})

// load sample data into mongodb
const loadDataToDB = async () => {
    // delete the old data
    // await Patient.deleteMany({});
    // await TimeSeries.deleteMany({});
    // await Clinician.deleteMany({});
    // await Note.deleteMany({});
    // await Message.deleteMany({});

    // await requirements.save();
    // await newPatient.save();
    // await newTimeseries.save();
    // await newClinician.save();
    // await newNote.save();
    // await newMessage.save();
};

loadDataToDB().then(() => {
    mongoose.connection.close();
});

require('./patient');
