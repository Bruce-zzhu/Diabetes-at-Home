const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clinicianSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    patients: [
        {
            type: Schema.Types.ObjectId,
            ref: "Patient"
        }
    ]
});


const noteSchema = new Schema({
    clinician: {
        type: Schema.Types.ObjectId,
        ref: "Clinician"
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient"
    },
    title: String,
    body: String,
    time: Date
})

const messageSchema = new Schema({
    clinician: {
        type: Schema.Types.ObjectId,
        ref: "Clinician"
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient"
    },
    body: String,
    time: Date,
    unread: { type: Boolean, required: true, default: true }
})


const Clinician = mongoose.model("Clinician", clinicianSchema);
const Note = mongoose.model("Note", noteSchema);
const Message = mongoose.model("Message", messageSchema);


module.exports = { Clinician, Note, Message };
