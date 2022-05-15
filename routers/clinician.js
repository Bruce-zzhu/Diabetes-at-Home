const express = require("express");
const router = express.Router();
const clinician = require('../controllers/clinician');

// clinician dashboard
router.get('/dashboard', clinician.getDashboardData);

// view patient page
router.route('/view-patient/:id')
    .get(clinician.renderPatientProfile)
    .post(clinician.submitRequirement)

router.post('/view-patient/:id/note', clinician.addNote)

router.post('/view-patient/:id/message', clinician.addMessage)

module.exports = router;