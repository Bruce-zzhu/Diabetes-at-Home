const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  firstName: String,
  lastName: String,
  nickName: String,
  age: Number,
  gender: String,
  timeSeries: [
    {
      type: Schema.Types.ObjectId,
      ref: "TimeSeries",
    },
  ],
});

const timeSeriesSchema = new Schema({
  name: String,
  value: Number,
  unit: String,
  lowerBound: Number,
  upperBound: Number,
  isRequired: {
    type: Boolean,
    default: true,
  },
  comment: String,
});

const Patient = mongoose.model("Patient", patientSchema);
const TimeSeries = mongoose.model("TimeSeries", timeSeriesSchema);

module.exports = { Patient, TimeSeries };
