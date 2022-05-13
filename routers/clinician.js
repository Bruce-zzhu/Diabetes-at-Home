const express = require("express");
const router = express.Router();
const clinician = require('../controllers/clinician');

// clinician dashboard
router.get('/dashboard', clinician.getDashboardData);

// view patient page
router.route('/view-patient/:id')
    .get(clinician.renderPatientProfile)
    .post(clinician.submitRequirement)


module.exports = router;