const express = require("express");
const router = express.Router();
const general = require('../controllers/general');
const passport = require('../passport');
const req = require('express/lib/request')
const { Patient, TimeSeries } = require('../models/patient');

// aboutUs page
router.get("/about-us", general.renderAboutUs);

// aboutDiabetes page
router.get("/about-diabetes", general.renderAboutDiabetes);

// Clinician Login page
router.get("/login-c", general.renderLoginClinician);

// Patient Login page
router.get("/login-p", general.renderLoginPatient);
// router.post('/login-p', passport.PatientLocalStrategy);
    // passport.authenticate ('local', { failureRedirect: '/login', failureFlash: true }), // if bad login, send user back to login page
    // (reg, res) => {
    //     res.redirect('/') // login was successful, send user to home page
    // }
// )
// forgot password page
router.get('/forgot-password', general.renderForgotPassword);
router.post('/forgot-password', general.forgotPassword);

// reset password page
router.get('/reset-password', general.renderResetPassword);
router.post('/reset-password', general.resetPassword);

// log off
router.post("/log-out", general.logOut);

module.exports = router;

