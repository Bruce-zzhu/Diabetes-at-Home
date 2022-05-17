const { Patient, Theme } = require("../models/patient");
const { Clinician } = require("../models/clinician");

const renderAboutUs = (req, res) => {
    res.render('about/aboutUs', {
        style: 'about.css',
        theme: req.session.theme
    });
};
const renderAboutDiabetes = (req, res) => {
    if (req.session.theme) {
        res.render("about/aboutDiabetes", {
            style: "about.css",
            theme: req.session.theme
        });
    } else {
        res.render("about/aboutDiabetes", {
            style: "about.css"
        });
    }

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
        theme: req.session.theme
    });
};
const renderResetPassword = (req, res) => {
    res.render('resetPassword', {
        style: 'forgotPassword.css',
        theme: req.session.theme
    });
};

const renderSettings = (req, res) => {

    // TODO not hardcode pat
    // const patient = await Patient.findOne

    var tempUser = {
        userType: "patient",
        userId: "628208b8f2e1e34162d3b1df",
        firstName: "Settings",
        lastName: "Tester",
        email: "rllypoggers@pmail.com",
        nickName: "s-name",
    }
    req.session.user = tempUser;

    if (req.session.theme) {
        res.render("settings", {
            style: "settings.css",
            theme: req.session.theme,
            user: req.session.user
        });
    } else {
        res.render("settings", {
            style: "settings.css",
            user: tempUser
            // user: req.session.user
        });
    }
}

const setTheme = async (req, res) => {

    try {
        var themeName = req.body.themeChosen;
        var patient = await Patient.findOneAndUpdate( {_id: req.session.user.userId }, { theme: themeName }, { new: true } );
        req.session.theme = JSON.stringify(await Theme.findOne( { themeName: patient.theme } ).lean());
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
    newFunction1
};
