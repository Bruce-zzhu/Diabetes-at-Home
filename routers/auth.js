const passport = require('passport')
const express = require('express')
const router = express.Router()
const patientRoutes = require('./patient');

// Authentication middleware (REMOVE FOR FINAL)
const isAuthenticated = (req, res, next) => {
    // If user is not authenticated via passport, redirect to login page
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    // Otherwise, proceed to next middleware function
    return next()
}


// Main page which requires login to access
// router.get('/', isAuthenticated, (req, res) => {
//     res.render('patient/dashboard', { title: 'Patient Dashboard', user: req.user.toJSON() })
// })
router.use('/patient', isAuthenticated, patientRoutes);

// Login page (with failure message displayed upon login failure)
router.get('/login-p', (req, res) => {
    res.render('patient/login', { flash: req.flash('error'), title: 'Login', style:'login.css' })
    
})

// Handle login
router.post('/login-p',
    passport.authenticate('local', {
        successRedirect: 'patient/dashboard', failureRedirect: '/login-p', failureFlash: true
    })
)

// Handle logout
router.post('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router