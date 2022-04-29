const express = require("express");
const router = express.Router();
const general = require('../controllers/general');

// aboutUs page
router.get("/about-us", general.renderAboutUs);

// aboutDiabetes page
router.get("/about-diabetes", general.renderAboutDiabetes);

// Clinician Login page
router.get("/login-c", general.renderLoginClinician);

// Patient Login page
router.get("/login-p", general.renderLoginPatient);

// forgot password page
router.get('/forgot-password', general.renderForgotPassword)

// reset password page
router.get('/reset-password', general.renderResetPassword);

module.exports = router;