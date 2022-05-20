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
//router.get("/login-c", general.renderLoginClinician);
router.get('/login-c', (req, res) => {
    req.session.user.role = "clinician";
    res.render('clinician/login', { flash: req.flash('error'), title: 'Login', style:'login.css' })
})

router.post('/login-c',
    function(req, res, next) {
        req.session.user.email = req.body.username;
        next()
    },
    passport.authenticate('clinician-local', {
        successRedirect: 'clinician/dashboard', failureRedirect: '/login-c', failureFlash: true
    })
)



// Patient Login page
router.get('/login-p', (req, res) => {
    req.session.user.role = "patient";
    res.render('patient/login', { flash: req.flash('error'), title: 'Login', style:'login.css' })
    
})
router.post('/login-p',
    function(req, res, next) {
        req.session.user.email = req.body.username;
        next()
    },
    passport.authenticate('patient-local', {
        successRedirect: 'patient/dashboard', failureRedirect: '/login-p', failureFlash: true
    })
)

// forgot password page
router.get('/forgot-password', general.renderForgotPassword);
router.post('/forgot-password', general.forgotPassword);

// reset password page
router.get('/reset-password', general.renderResetPassword);
router.post('/reset-password', general.resetPassword);

// log off
router.post("/log-out", general.logOut);


module.exports = router;

