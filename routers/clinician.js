const express = require("express");
const router = express.Router();
const clinician = require("../controllers/clinician");

// clinician dashboard
router.get("/dashboard", clinician.getDashboardData);

router.get("/insertdata", clinician.insertData);
router.post("/insertdata", clinician.insertData);

// view patient page
router
    .route("/view-patient/:id")
    .get(clinician.renderPatientProfile)
    .post(clinician.submitRequirement);

router.post("/view-patient/:id/note", clinician.addNote);

router.post("/view-patient/:id/message", clinician.addMessage);


router.get('/comments', clinician.renderCommentsPage)

module.exports = router;
