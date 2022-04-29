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
    firstName: "Jon",
    lastName: "Snow",
    nickName: "King in the North",
    age: "25",
    gender: "male",
    email: "jon@diabetemail.com",
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


// load sample data into mongodb
const loadDataToDB = async () => {
    // delete the old data
    // await Patient.deleteMany({});
    // await TimeSeries.deleteMany({});
    // await Clinician.deleteMany({});

    // await newPatient.save();
    // await newClinician.save();
    // await newTimeseries.save();
};

loadDataToDB().then(() => {
    mongoose.connection.close();
});
