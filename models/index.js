const mongoose = require("mongoose");
const { Patient, TimeSeries } = require("./patient");
const { Clinician } = require("./clinician");
const Controller = require("../controllers/Controller");

require("dotenv").config();
const connectionURL =
  process.env.MONGO_URL || "mongodb://localhost:27017/diabetes-at-home";
mongoose.connect(connectionURL);

const db = mongoose.connection;
// event handlers
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to Mongo");
});

// load sample data into mongodb
const loadDataToDB = async () => {
  // delete the old data
  await Patient.deleteMany({});
  await TimeSeries.deleteMany({});
  await Clinician.deleteMany({});
  const patientId = await Controller.createPatient();
  Controller.createclinician();
  Controller.createTimeseires(patientId);
};

loadDataToDB().then(() => {});
