const express = require('express');
const router = express.Router();
const patient = require('../controllers/patient');

router.post('/new-entry', patient.addEntryData);

router.get('/dashboard', patient.renderPatientDashboard);



module.exports = router;
