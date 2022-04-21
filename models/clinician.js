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

const Clinician = mongoose.model("Clinician", clinicianSchema);
module.exports = { Clinician };
