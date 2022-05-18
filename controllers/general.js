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
    if (req.session.resetPwd == undefined) {
        req.session.resetPwd = {};
    }
    res.render('forgotPassword', {
        style: 'forgotPassword.css',
        theme: req.session.user.theme,
        user: req.session.user,
    });
};
const renderResetPassword = (req, res) => {
    if (req.session.resetPwd == undefined) {
        req.session.resetPwd = {};
    }
    if (req.session.resetPwd.email == undefined && req.session.user.id == undefined) {
        res.redirect('forgot-password');
    } else {
        if (req.session.resetPwd.email == undefined) {
            req.session.resetPwd.email = req.session.user.email;
        }
        res.render('resetPassword', {
            style: 'forgotPassword.css',
            theme: req.session.user.theme,
            user: req.session.user,
        });
    }
};

const renderSettings = async (req, res) => {

    var user;

    if (req.session.user.role == "patient") {
        user = await Patient.findOne({_id: req.session.user.id });
    } else if (req.session.user.role == "clinician") {
        user = await Clinician.findOne({_id: req.session.user.id });
    }

    user = {
        role: req.session.user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        nickName: user.nickName
    }

    res.render("settings", {
        style: "settings.css",
        user: user,
        theme: req.session.user.theme,
    });
}

const forgotPassword = (req, res) => {
    req.session.resetPwd.email = req.body.email;
    res.redirect("/reset-password");
}

const resetPassword = (req, res) => {
    // req.session.resetPwd.pwd = req.body.password;

    var hashedPwd;
    // TODO: hash password & store in db
    // hashedPwd = hash(req.body.password);

    var user;
    switch (req.session.user.role) {
        case "patient":
            // console.log("reset pnt", req.session.resetPwd.email, "pwd", req.body.password);
            // Patient.findOneAndUpdate({ _id: req.session.user.id }, { password: hashedPwd });
            break;
        case "clinician":
            // console.log("reset clin" , req.session.resetPwd.email, "pwd", req.body.password);
            // Clinician.findOneAndUpdate({ _id: req.session.user.id }, { password: hashedPwd });
            break;
        default:
            console.log("unknown user", req.body.password);
    }

    req.session.destroy();
    res.redirect("/");
}

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

const setNickname = async (req, res) => {
    try {
        var newNick = req.body.newName;
        await Patient.findOneAndUpdate( {_id: req.session.user.id }, { nickName: newNick }, { new: true } );
    } catch (e) {
        console.log(e);
    }
    res.redirect("/patient/settings");
}

const logOut = (req, res) => {
    req.session.destroy();
    res.redirect("/");
}

module.exports = {
    renderAboutUs,
    renderAboutDiabetes,
    renderLoginPatient,
    renderLoginClinician,
    renderForgotPassword,
    forgotPassword,
    renderResetPassword,
    resetPassword,
    renderSettings,
    setTheme,
    setNickname,
    logOut
};
