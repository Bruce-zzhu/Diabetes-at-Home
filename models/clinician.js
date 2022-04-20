const mongoose = require("mongoose");
const { stringify } = require("querystring");
const internal = require("stream");
const Schema = mongoose.Schema;

const clinicianSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Clinician = mongoose.model("Clinician", clinicianSchema);
module.exports = { Clinician };
