const express = require("express");
const router = express.Router();
const general = require('../controllers/general');
const passport = require('../passport');
const { Patient, TimeSeries } = require('../models/patient');

// aboutUs page
router.get("/about-us", general.renderAboutUs);

// aboutDiabetes page
router.get("/about-diabetes", general.renderAboutDiabetes);

// Clinician Login page
router.route("/login-c")
    .get(general.renderLoginClinician)
    .post(general.postClinicianPatient,
        passport.authenticate('clinician-local', {
            successRedirect: 'clinician/dashboard', failureRedirect: '/login-c', failureFlash: true
        })
    );



// Patient Login page
router.route('/login-p')
    .get(general.renderLoginPatient)
    .post(general.postLoginPatient,
        passport.authenticate('patient-local', {
            successRedirect: 'patient/dashboard', failureRedirect: '/login-p', failureFlash: true
        })
        
    );


// forgot password page
router.route('/forgot-password')
    .get(general.renderForgotPassword)
    .post(general.forgotPassword);

// reset password page
router.route('/reset-password')
    .get(general.renderResetPassword)
    .post(general.resetPassword);

// log off
router.post("/log-out", general.logOut);


module.exports = router;

