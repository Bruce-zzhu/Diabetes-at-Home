const passport = require('passport')
const express = require('express')
const router = express.Router()
const patientRoutes = require('./patient');
const clinicianRoutes = require('./clinician');

// Authentication middleware (REMOVE FOR FINAL)
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    // console.log(req.isAuthenticated())
    if (!req.isAuthenticated()) {  
        return res.redirect('/')
    }
    // Otherwise, proceed to next middleware function
    return next()
}


// PATIENT LOGIN AUTHENTICATION
router.use('/patient', isAuthenticated, patientRoutes);

// Login page (with failure message displayed upon login failure)
router.get('/login-p', (req, res) => {
    res.render('patient/login', { flash: req.flash('error'), title: 'Login', style:'login.css' })
    
})

// Handle Patient login
router.post('/login-p',
    passport.authenticate('patient-local', {
        successRedirect: 'patient/dashboard', failureRedirect: '/login-p', failureFlash: true
    })
)
// 
// CLINICIAN LOGIN AUTHENTICATION
router.use('/clinician', isAuthenticated, clinicianRoutes);

// Login page (with failure message displayed upon login failure)
router.get('/login-c', (req, res) => {
    res.render('clinician/login', { flash: req.flash('error'), title: 'Login', style:'login.css' })
})

// Handle Patient login
router.post('/login-c',
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