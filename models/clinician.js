const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const clinicianSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    patients: [
        {
            type: Schema.Types.ObjectId,
            ref: "Patient",
        },
    ],
    password: { type: String, required: true },
});

clinicianSchema.methods.verifyPassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, valid) => {
        // console.log(password)
        // console.log(this)
        callback(err, valid);
    });
};

// Password salt factor
const SALT_FACTOR = 10;
// Hash password before saving
clinicianSchema.pre("save", function save(next) {
    const clinician = this;
    // Go to next if password field has not been modified
    if (!clinician.isModified("password")) {
        return next();
    }
    // Automatically generate salt, and calculate hash
    bcrypt.hash(clinician.password, SALT_FACTOR, (err, hash) => {
        if (err) {
            return next(err);
        }
        // Replace password with hash
        clinician.password = hash;
        next();
    });
});

const noteSchema = new Schema({
    clinician: {
        type: Schema.Types.ObjectId,
        ref: "Clinician",
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
    },
    title: String,
    body: String,
    time: Date,
});

const messageSchema = new Schema({
    clinician: {
        type: Schema.Types.ObjectId,
        ref: "Clinician",
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
    },
    body: String,
    time: Date,
    unread: { type: Boolean, required: true, default: true },
});

const Clinician = mongoose.model("Clinician", clinicianSchema);
const Note = mongoose.model("Note", noteSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { Clinician, Note, Message };
