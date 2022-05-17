const {Patient} = require('../models/patient');

const renderAboutUs = (req, res) => {
    res.render('about/aboutUs', {
        style: 'about.css',
    });
};
const renderAboutDiabetes = (req, res) => {
    res.render("about/aboutDiabetes", {
        style: "about.css",
    });
};
const renderLoginPatient = (req, res) => {
    res.render("patient/login", {
        style: "login.css",
    });
};

// const checkLoginDetails = async(req, res) => {
//     // const patientEmailEntry = req.body.loginEmail;
//     // console.log(patientEmailEntry);
//     // // Get Data about user with this email...
//     // try{
//     //     const thisUser = await Patient.findOne({ email: patientEmailEntry });
//     //     console.log(thisUser);
//     //     // If correct, redirect to patient dashboard, else error
//     //     if (thisUser != null){
//     //         res.redirect('/patient/dashboard');
//     //     }
//     // } 
//     //     // Else if email is not in db then print error
//     // catch(err){
//     //     console.log(err)
//     // }
    
//     // // Nothing is currently passed to the patient.js controller. Currently hardcoded.
//     // // Passwords
// };

const renderLoginClinician = (req, res) => {
    res.render("clinician/login", {
        style: "login.css",
    });
};
const renderForgotPassword = (req, res) => {
    res.render('forgotPassword', {
        style: 'forgotPassword.css'
    });
};
const renderResetPassword = (req, res) => {
    res.render('resetPassword', {
        style: 'forgotPassword.css'
    });
};

module.exports = {
    renderAboutUs,
    renderAboutDiabetes,
    renderLoginPatient,
    renderLoginClinician,
    renderForgotPassword,
    renderResetPassword,
    // checkLoginDetails
};
