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
    },
    {
        timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
    }
);

const timeSeriesSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    date: { 
        type: String, 
        required: true 
    },
    bloodGlucose: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        value: { type: Number },
        unit: { type: String, default: "nmol/L" },
        comment: { type: String, default: "" },
        createdAt: { type: Date, default: null },
    },
    insulin: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        value: { type: Number },
        unit: { type: String, default: "doses" },
        comment: { type: String, default: "" },
        createdAt: { type: Date, default: null },
    },
    weight: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        value: { type: Number },
        unit: { type: String, default: "kg" },
        comment: { type: String, default: "" },
        createdAt: { type: Date, default: null },
    },
    exercise: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        value: { type: Number },
        unit: { type: String, default: "steps" },
        comment: { type: String, default: "" },
        createdAt: { type: Date, default: null },
    }

});

const Patient = mongoose.model("Patient", patientSchema);
const TimeSeries = mongoose.model("TimeSeries", timeSeriesSchema);

module.exports = { Patient, TimeSeries };
