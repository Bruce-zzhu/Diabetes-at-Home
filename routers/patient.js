const express = require('express');
const router = express.Router();
const patient = require('../controllers/patient');
const bcrpyt = require('bcrypt');

// Hash Passwords for new patients
router.post("/", async (req, res) => {});

router.post('/new-entry', patient.addEntryData);

router.get('/dashboard', patient.renderPatientDashboard);



module.exports = router;
