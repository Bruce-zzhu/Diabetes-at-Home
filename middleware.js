
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



module.exports = {
    isAuthenticated, 
    isClinician,
    isPatient,
}