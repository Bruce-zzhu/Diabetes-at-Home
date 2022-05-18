const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const patientSchema = new Schema(
    {
        clinician: {
            type: Schema.Types.ObjectId,
            ref: "Clinician",
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        nickName: { type: String, required: true, unique: true },
        age: { type: Number, required: true, min: 0, max: 150 },
        gender: { type: String, enum: ["male", "female", "other"], required: true },
        engagementRate: { type: Number, required: true, default: 0 },
        theme: { type: String, required: true, default: "default" },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, default: "password" },
        requirements: {
            type: Schema.Types.ObjectId,
            ref: "TimeSeries",
        },
    },
    {
        timestamps: { createdAt: "createTime", updatedAt: "updateTime" },
    }
);



// Password comparison function
// Compares the provided password with the stored password
// Allows us to call user.verifyPassword on any returned objects
patientSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        // console.log(password)
        // console.log(this)
        callback(err, valid)
    })
}

// Password salt factor
const SALT_FACTOR = 10
// Hash password before saving
patientSchema.pre('save', function save(next) {
    const patient = this
    // Go to next if password field has not been modified
    if (!patient.isModified('password')) {
        return next()
    }
    // Automatically generate salt, and calculate hash
    bcrypt.hash(patient.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err)
        }
        // Replace password with hash
        patient.password = hash
        next()
    })
})

const timeSeriesSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
    },
    clinicianUse: { type: Boolean, default: false },
    date: {
        type: Date,
        required: true,
    },
    bloodGlucose: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        name: { type: String, default: "Blood Glucose" },
        value: Number,
        upperBound: Number,
        lowerBound: Number,
        unit: { type: String, default: "nmol/L" },
        comment: { type: String, default: "" },
        updateAt: Date,
    },
    insulin: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        name: { type: String, default: "Insulin Taken" },
        value: Number,
        upperBound: Number,
        lowerBound: Number,
        unit: { type: String, default: "doses" },
        comment: { type: String, default: "" },
        updateAt: Date,
    },
    weight: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        name: { type: String, default: "Weight" },
        value: Number,
        upperBound: Number,
        lowerBound: Number,
        unit: { type: String, default: "kg" },
        comment: { type: String, default: "" },
        updateAt: Date,
    },
    exercise: {
        isRequired: {
            type: Boolean,
            default: true,
        },
        name: { type: String, default: "Exercise" },
        value: Number,
        upperBound: Number,
        lowerBound: Number,
        unit: { type: String, default: "steps" },
        comment: { type: String, default: "" },
        updateAt: Date,
    },
});

const themeSchema = new Schema({
    themeName: { type: String, required: true, unique: true },
    logoPath: { type: String, required: true },
    colors: {
        border: { type: String, required: true },
        bg: { type: String, required: true },
        text: { type: String, required: true },
        altText: { type: String, required: true },
        button: { type: String, required: true },
        primary: { type: String, required: true },
        secondary: { type: String, required: true },
        tertiary: { type: String, required: true },
    },
});

const Patient = mongoose.model("Patient", patientSchema);
const TimeSeries = mongoose.model("TimeSeries", timeSeriesSchema);
const Theme = mongoose.model("Theme", themeSchema);

module.exports = { Patient, TimeSeries, Theme };
