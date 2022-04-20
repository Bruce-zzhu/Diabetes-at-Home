const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nickName: { type: String, required: true, unique: true },
    age: { type: Number, required: true, min: 0, max: 150 },
    gender: { type: String, enum: ["male", "female"], required: true },
    engagementRate: { type: Number },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    timeSeries: [
      {
        type: Schema.Types.ObjectId,
        ref: "TimeSeries",
        required: true,
      },
    ],
  },
  {
    timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
  }
);

const timeSeriesSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  date: { type: String, required: true },
  data: {
    bloodGlucose: {
      name: { type: String, default: "Blood Glucose" },
      status: {
        type: String,
        enum: ["recorded", "unrecorded"],
        default: "unrecorded",
      },
      value: { type: Number, default: 8 },
      comment: { type: String, default: "" },
      createdAt: { type: Date, default: null },
    },
    insulin: {
      name: { type: String, default: "Insulin Taken" },
      status: {
        type: String,
        enum: ["recorded", "unrecorded"],
        default: "unrecorded",
      },
      value: { type: Number, default: 2 },
      comment: { type: String, default: "" },
      createdAt: { type: Date, default: null },
    },
    weight: {
      name: { type: String, default: "Weight" },
      status: {
        type: String,
        enum: ["recorded", "unrecorded"],
        default: "unrecorded",
      },
      value: { type: Number, default: 60 },
      comment: { type: String, default: "" },
      createdAt: { type: Date, default: null },
    },
    exercise: {
      name: { type: String, default: "Exercise Completed" },
      status: {
        type: String,
        enum: ["recorded", "unrecorded"],
        default: "unrecorded",
      },
      value: { type: Number, default: 5000 },
      comment: { type: String, default: "" },
      createdAt: { type: Date, default: null },
    },
  },
});

const Patient = mongoose.model("Patient", patientSchema);
const TimeSeries = mongoose.model("TimeSeries", timeSeriesSchema);

module.exports = { Patient, TimeSeries };
