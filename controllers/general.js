const { Patient, Theme } = require("../models/patient");
const { Clinician } = require("../models/clinician");

const renderAboutUs = (req, res) => {
    res.render('about/aboutUs', {
        style: 'about.css',
        user: req.session.user,
        theme: req.session.user.theme
    });
};
const renderAboutDiabetes = (req, res) => {
    res.render("about/aboutDiabetes", {
        style: "about.css",
        user: req.session.user,
        theme: req.session.user.theme
    });
};
const renderLoginPatient = (req, res) => {
    res.render("patient/login", {
        style: "login.css",
    });
};

const newFunction1 = (req, res) => {
    const patientEmail = req.body.loginEmail;
    console.log(patientEmail)
    //res.send(req.body);
    res.redirect('/patient/dashboard');
};

const renderLoginClinician = (req, res) => {
    res.render("clinician/login", {
        style: "login.css",
    });
};
const renderForgotPassword = (req, res) => {
    res.render('forgotPassword', {
        style: 'forgotPassword.css',
        theme: req.session.user.theme,
        user: req.session.user,
    });
};
const renderResetPassword = (req, res) => {
    res.render('resetPassword', {
        style: 'forgotPassword.css',
        theme: req.session.user.theme,
        user: req.session.user,
    });
};

const renderSettings = async (req, res) => {

    var user;

    if (req.session.user.type == "patient") {
        user = await Patient.findOne({_id: req.session.user.id });
    } else if (req.session.user.type == "clinician") {
        user = await Clinician.findOne({_id: req.session.user.id });
    }

    user = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        nickName: user.nickName
        // pfp-path
    }

    res.render("settings", {
        style: "settings.css",
        user: req.session.user,
        theme: req.session.user.theme,
    });
}

const setTheme = async (req, res) => {

    try {
        var themeName = req.body.themeChosen;
        var patient = await Patient.findOneAndUpdate( {_id: req.session.user.id }, { theme: themeName }, { new: true } );
        req.session.user.theme = JSON.stringify(await Theme.findOne( { themeName: patient.theme } ).lean());
    } catch (e) {
        console.log(e);
    }
    res.redirect("/settings");
}

const setNickname = async (req, res) => {
    try {
        var newNick = req.body.newName;
        await Patient.findOneAndUpdate( {_id: req.session.user.id }, { nickName: newNick }, { new: true } );
    } catch (e) {
        console.log(e);
    }
    res.redirect("/settings");
}

module.exports = {
    renderAboutUs,
    renderAboutDiabetes,
    renderLoginPatient,
    renderLoginClinician,
    renderForgotPassword,
    renderResetPassword,
    renderSettings,
    setTheme,
    setNickname,
    newFunction1
};
