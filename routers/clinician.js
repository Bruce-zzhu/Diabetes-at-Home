const express = require("express");
const router = express.Router();
const clinician = require("../controllers/clinician");
const general = require('../controllers/general');

// clinician dashboard
router.get("/dashboard", clinician.getDashboardData);

router.get("/register", clinician.renderRegister);
router.post("/register", clinician.insertData);

// view patient page
router
    .route("/view-patient/:id")
    .get(clinician.renderPatientProfile)
    .post(clinician.submitRequirement);

router.post("/view-patient/:id/note", clinician.addNote);

router.post("/view-patient/:id/message", clinician.addMessage);

router.get("/comments", clinician.renderCommentsPage);

// settings page
router.get('/settings', general.renderSettings);
router.post("/settings/theme", general.setTheme);

module.exports = router;
