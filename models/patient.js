const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema(
    {
        clinician: {
            type: Schema.Types.ObjectId,
            ref: "Clinician"
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        nickName: { type: String, required: true, unique: true },
        age: { type: Number, required: true, min: 0, max: 150 },
        gender: { type: String, enum: ["male", "female"], required: true },
        engagementRate: Number,
        email: { type: String, required: true, unique: true },
        password: {type: String, required: true, default: 'password'},
        requirements: {
            type: Schema.Types.ObjectId,
            ref: "TimeSeries"
        },
    },
    {
        timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
    }
);

const timeSeriesSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
    },
    clinicianUse: {type: Boolean, default: false},
    date: { 
        type: Date, 
        required: true 
    },
    bloodGlucose: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        value: Number,
        upperBound: Number,
        lowerBound: Number,
        unit: { type: String, default: "nmol/L" },
        comment: { type: String, default: "" },
        createdAt: Date,
    },
    insulin: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        value: Number,
        upperBound: Number,
        lowerBound: Number,
        unit: { type: String, default: "doses" },
        comment: { type: String, default: "" },
        createdAt: Date,
    },
    weight: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        value: Number,
        upperBound: Number,
        lowerBound: Number,
        unit: { type: String, default: "kg" },
        comment: { type: String, default: "" },
        createdAt: Date,
    },
    exercise: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        value: Number,
        upperBound: Number,
        lowerBound: Number,
        unit: { type: String, default: "steps" },
        comment: { type: String, default: "" },
        createdAt: Date,
    }

});



const Patient = mongoose.model("Patient", patientSchema);
const TimeSeries = mongoose.model("TimeSeries", timeSeriesSchema);

module.exports = { Patient, TimeSeries };
