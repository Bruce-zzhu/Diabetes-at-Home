const express = require("express");
const router = express.Router();
const general = require('../controllers/general');
const req = require('express/lib/request')

// aboutUs page
router.get("/about-us", general.renderAboutUs);

// aboutDiabetes page
router.get("/about-diabetes", general.renderAboutDiabetes);

// Clinician Login page
router.get("/login-c", general.renderLoginClinician);

// Patient Login page

router.get("/login-p", general.renderLoginPatient);
router.post('/login-p', general.newFunction1);
    // passport.authenticate ('local', { failureRedirect: '/login', failureFlash: true }), // if bad login, send user back to login page
    // (reg, res) => {
    //     res.redirect('/') // login was successful, send user to home page
    // }
// )
// forgot password page
router.get('/forgot-password', general.renderForgotPassword)

// reset password page
router.get('/reset-password', general.renderResetPassword);

// settings page
router.get('/settings', general.renderSettings);
router.post("/settings/theme", general.setTheme);
router.post("/settings/nickname", general.setNickname);

module.exports = router;

