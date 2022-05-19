const { Patient, Theme } = require("../models/patient");
const { Clinician } = require("../models/clinician");

const renderAboutUs = (req, res) => {
    res.render('about/aboutUs', {
        style: 'about.css',
        user: req.session.user,
    });
};
const renderAboutDiabetes = (req, res) => {
    res.render("about/aboutDiabetes", {
        style: "about.css",
        user: req.session.user,
    });
};

const renderLoginPatient = (req, res) => {
    res.render("patient/login", {
        style: "login.css",
    });
};
const renderLoginClinician = (req, res) => {
    res.render("clinician/login", {
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


const renderSettings = async (req, res) => {
    res.render("settings", {
        style: "settings.css",
        user: req.session.user,
    });
}

const renderForgotPassword = (req, res) => {
    res.render('forgotPassword', {
        style: 'forgotPassword.css',
        user: req.session.user,
    });
};
const forgotPassword = (req, res) => {
    req.session.resetEmail = req.body.email;
    res.redirect("/reset-password");
}

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
    });
}
const resetPassword = (req, res) => {

    var hashedPwd;
    // TODO: hash password & store in db
    // hashedPwd = hash(req.body.password);

    switch (req.session.user.role) {
        case "patient":
            console.log("reset pnt", req.session.resetEmail, "pwd", req.body.password);
            // Patient.findOneAndUpdate({ email: req.session.resetEmail }, { password: hashedPwd });
            break;
        case "clinician":
            console.log("reset clin" , req.session.resetEmail, "pwd", req.body.password);
            // Clinician.findOneAndUpdate({ email: req.session.resetEmail }, { password: hashedPwd });
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
    } catch (e) {
        console.log(e);
    }
    req.session.user.theme = JSON.stringify(await Theme.findOne( { themeName: user.theme } ).lean());

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
