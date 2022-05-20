const { isNotBounded } = require("./public/scripts/js-helpers");
const { Patient, TimeSeries } = require("./models/patient");
const { getTodayTimeSeries } = require("./controllers/clinician");

// module.exports.isLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         req.session.returnTo = req.originalUrl;
//         req.flash('error', 'You must be signed in first!');
//         return res.redirect('/login-p');
//     }
//     next();
// }

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


// Check if any data is outside the threshold
const isSafe = (ts) => {
    if (
        (ts.bloodGlucose.isRequired && isNotBounded(ts.bloodGlucose.value, ts.bloodGlucose.lowerBound, ts.bloodGlucose.upperBound)) ||
        (ts.weight.isRequired && isNotBounded(ts.weight.value, ts.weight.lowerBound, ts.weight.upperBound)) ||
        (ts.insulin.isRequired && isNotBounded(ts.insulin.value, ts.insulin.lowerBound, ts.insulin.upperBound)) || 
        (ts.exercise.isRequired && isNotBounded(ts.exercise.value, ts.exercise.lowerBound, ts.exercise.upperBound))
    ) return false;

    return true;
}

const checkDataSafety = (req, res, next) => {
    
    // Data outside the safety value
    req.flash('info', 'Patient data outside the threshold value');
    next();
}





module.exports = {
    isAuthenticated, 
    isClinician,
    isPatient,
    checkDataSafety
}