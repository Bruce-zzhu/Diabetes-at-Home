const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const patientSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        nickName: { type: String, required: true, unique: true },
        age: { type: Number, required: true, min: 0, max: 150 },
        gender: { type: String, enum: ["male", "female"], required: true },
        engagementRate: Number,
        email: { type: String, required: true, unique: true },
        password: {type: String, required: true, default: 'password'},
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
        required: true,
    },
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

module.exports = { Patient, TimeSeries};
