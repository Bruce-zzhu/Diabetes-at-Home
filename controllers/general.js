const { Patient, Theme } = require("../models/patient");
const { Clinician } = require("../models/clinician");

const renderAboutUs = (req, res) => {
    res.render('about/aboutUs', {
        style: 'about.css',
        user: req.session.user,
        prevPage: req.session.prevPage,
    });
};
const renderAboutDiabetes = (req, res) => {
    res.render("about/aboutDiabetes", {
        style: "about.css",
        user: req.session.user,
        prevPage: req.session.prevPage,
    });
};

const renderLoginPatient = (req, res) => {
    req.session.user.role = "patient";
    res.render('patient/login', {
        flash: req.flash('error'),
        title: 'Login',
        style:'login.css',
        prevPage: req.session.prevPage,
    })
};

const postLoginPatient = (req, res, next) => {
    req.session.user.email = req.body.username;
    next()
}

const renderLoginClinician = (req, res) => {
    req.session.user.role = "clinician";
    res.render('clinician/login', {
        flash: req.flash('error'),
        title: 'Login',
        style:'login.css',
        prevPage: req.session.prevPage,
    })
};

const postLoginClinician = (req, res, next) => {
    req.session.user.email = req.body.username;
    next()
}

const renderSettings = async (req, res) => {
    res.render("settings", {
        style: "settings.css",
        user: req.session.user,
        prevPage: req.session.prevPage,
    });
}

const renderForgotPassword = (req, res) => {
    res.render('forgotPassword', {
        style: 'forgotPassword.css',
        user: req.session.user,
        prevPage: req.session.prevPage,
    });
};

// remember email corresponding to the forgotten password
const forgotPassword = (req, res) => {
    req.session.resetEmail = req.body.email;
    res.redirect("/reset-password");
}

// make sure unlogged in user has inputted email at forgot-password page
// automatically record a logged-in user's email as email to change password
const renderResetPassword = (req, res) => {
    if (req.session.resetEmail == undefined) {
        if (req.session.user.id == undefined) {
            res.redirect('forgot-password');
        } else {
            req.session.resetEmail = req.session.user.email;
        }
    } 
    res.render('resetPassword', {
        style: 'forgotPassword.css',
        user: req.session.user,
        prevPage: req.session.prevPage,
    });
}

// finds the account corresponding to the user
// then updates the account with hashed password (using save() prehook)
const resetPassword = async (req, res) => {
    var user;
    try {
        switch (req.session.user.role) {
            case "patient":
                user = await Patient.findOne({ email: req.session.resetEmail });
                break;
            case "clinician":
                user = await Clinician.findOne({ email: req.session.resetEmail });
                break;
        }
        if (user) {
            user.password = req.body.password;
            await user.save();
        }
    
    } catch(e) {

    }

    req.session.destroy();
    res.redirect("/");
}

// changes a user's theme based on the theme selected, then refreshes settings page
const setTheme = async (req, res) => {
    try {
        var user;
        var themeName = req.body.themeChosen;
        if (req.session.user.role == "patient") {
            user = await Patient.findOneAndUpdate( {_id: req.session.user.id }, { theme: themeName }, { new: true } );
        } else {
            user = await Clinician.findOneAndUpdate( {_id: req.session.user.id }, { theme: themeName }, { new: true } );
        }
        req.session.user.theme = JSON.stringify(await Theme.findOne( { themeName: user.theme } ).lean());
    } catch (e) {
        console.log(e);
    }
    

    if (req.session.user.role == "patient") {
        res.redirect("/patient/settings");
    } else {
        res.redirect("/clinician/settings");
    }
    
}

// changes a patient's nickname based on input, then refreshes settings page
const setNickname = async (req, res) => {
    try {
        var newNick = req.body.newName;
        var patient = await Patient.findOneAndUpdate( {_id: req.session.user.id }, { nickName: newNick }, { new: true } );
    } catch (e) {
        console.log(e);
    }
    req.session.user.nickName = patient.nickName;
    res.redirect("/patient/settings");
}

const logOut = (req, res) => {
    req.session.destroy();
    req.logout()
    res.redirect("/");
}

module.exports = {
    renderAboutUs,
    renderAboutDiabetes,
    renderLoginPatient,
    renderLoginClinician,
    renderForgotPassword,
    postLoginPatient,
    postLoginClinician,
    forgotPassword,
    renderResetPassword,
    resetPassword,
    renderSettings,
    setTheme,
    setNickname,
    logOut
};
