const express = require('express');
const router = express.Router();
const patient = require('../controllers/patient');
const general = require('../controllers/general');
const bcrpyt = require('bcrypt');

// Hash Passwords for new patients
router.post("/", async (req, res) => {});

router.post('/new-entry', patient.addEntryData);

router.get('/dashboard', patient.renderPatientDashboard);

// settings page
router.get('/settings', general.renderSettings);
router.post("/settings/theme", general.setTheme);
router.post("/settings/nickname", general.setNickname);

module.exports = router;
