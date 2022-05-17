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

    var tempUser = {
        userType: "patient",
        // userId: ObjectId("628208b8f2e1e34162d3b1df"),
        firstName: "Settings",
        lastName: "Tester",
        email: "rllypoggers@pmail.com",
        nickName: "s-name",
    }

    if (req.session.theme) {
        res.render("settings", {
            style: "settings.css",
            theme: req.session.theme,
            user: tempUser
            // user: req.session.user
        });
    } else {
        res.render("settings", {
            style: "settings.css",
            user: tempUser
            // user: req.session.user
        });
    }
}

module.exports = {
    renderAboutUs,
    renderAboutDiabetes,
    renderLoginPatient,
    renderLoginClinician,
    renderForgotPassword,
    renderResetPassword,
    renderSettings,
    newFunction1
};
