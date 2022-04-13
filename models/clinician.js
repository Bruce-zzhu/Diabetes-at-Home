const mongoose = require("mongoose");
const { stringify } = require("querystring");
const internal = require("stream");
const Schema = mongoose.Schema;

const clinicianSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  patients: [{ type: Schema.Types.ObjectId, ref: "Patient" }],
});

const Clinician = mongoose.model("Clinician", clinicianSchema);
module.exports = { Clinician };
