
const { Patient } = require("../models/patient");
const { Clinician } = require("../models/clinician");
const passport = require('passport')
const express = require('express')
const router = express.Router()
const patientRoutes = require('./patient');
const clinicianRoutes = require('./clinician');

// Authentication middleware 
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    // console.log(req.isAuthenticated())
    if (!req.isAuthenticated()) {  
        return res.redirect('/')
    }
    // Otherwise, proceed to next middleware function
    return next()
}

const isClinician = (req, res, next) => {
    // Checks to see if user has role (stored in session cookie) 
    // has role clinician

    // TRY used because req.session.user is undefined before
    // authentication
    try{
        if (req.session.user.role == 'patient'){
            return res.redirect('/')
        }
        if (req.session.user.role == 'clinician'){
            return next()
        }
        else{
            return res.redirect('/')
        }
    } 
    catch (e) {
        return res.redirect('/')
    }
}

const isPatient = (req, res, next) => {
    // Checks to see if user has role (stored in session cookie) has role: 'patient'

    // TRY used because req.session.user is undefined before authentication
    try{
        if (req.session.user.role == 'clinician'){
            return res.redirect('/')
        }
        if (req.session.user.role == 'patient'){
            return next()
        }
        else{
            return res.redirect('/')
        }
    } 
    catch (e) {
        return res.redirect('/')
    }
}


// PATIENT LOGIN AUTHENTICATION
router.use('/patient', isAuthenticated, isPatient, patientRoutes);

// Login page (with failure message displayed upon login failure)
router.get('/login-p', (req, res) => {
    req.session.user.role = "patient";
    res.render('patient/login', { flash: req.flash('error'), title: 'Login', style:'login.css' })
    
})

// Handle Patient login
router.post('/login-p',
    function(req, res, next) {
        req.session.user.email = req.body.username;
        next()
    },
    passport.authenticate('patient-local', {
        successRedirect: 'patient/dashboard', failureRedirect: '/login-p', failureFlash: true
    })
)
// 
// CLINICIAN LOGIN AUTHENTICATION
router.use('/clinician', isAuthenticated, isClinician, clinicianRoutes);

// Login page (with failure message displayed upon login failure)
router.get('/login-c', (req, res) => {
    req.session.user.role = "clinician";
    res.render('clinician/login', { flash: req.flash('error'), title: 'Login', style:'login.css' })
})

// Handle Patient login
router.post('/login-c',
    function(req, res, next) {
        req.session.user.email = req.body.username;
        next()
    },
    passport.authenticate('clinician-local', {
        successRedirect: 'clinician/dashboard', failureRedirect: '/login-c', failureFlash: true
    })
)



// Handle logout
router.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router