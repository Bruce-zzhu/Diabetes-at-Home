const mongoose = require("mongoose");
const { Patient, TimeSeries } = require("./patient");

require("dotenv").config();
const connectionURL = process.env.MONGO_URL || "mongodb://localhost:27017/diabetes-at-home";
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

  const bloodGlucose = new TimeSeries({
    name: "Blood Glucose",
    value: 8,
  });
  await bloodGlucose.save();
  const insulin = new TimeSeries({
    name: "Insulin Taken",
    value: 2,
  });
  await insulin.save();
  const weight = new TimeSeries({
    name: "Weight",
    value: 60,
  });
  await weight.save();
  const exercise = new TimeSeries({
    name: "Exercise Completed",
    value: 5000,
  });
  await exercise.save();
  const comment = new TimeSeries({
    name: "Comment",
    comment: "good",
  });
  await comment.save();

  for (let i = 0; i < 5; i++) {
    const patient = new Patient({
      firstName: "Jon",
      lastName: "Snow",
      nickName: "King in the North",
      age: 30,
      gender: "M",
      timeSeries: [bloodGlucose, insulin, weight, exercise, comment],
    });
    await patient.save();
  }
};

loadDataToDB().then(() => {
  mongoose.connection.close();
});
