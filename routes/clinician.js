const express = require("express");
const router = express.Router();
const clinician = require('../controllers/clinician');

// clinician dashboard
router.get('/dashboard', clinician.getDashboardData);

// view patient page
router.get('/view-patient/:id/overview', clinician.renderPatientProfile);


module.exports = router;