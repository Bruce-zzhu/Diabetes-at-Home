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

const newFunction1 = (req, res) => {
    const patientEmail = req.body;
    // console.log(patientEmail)
    res.send(patientEmail);
    console.log("hi");
};

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
    newFunction1
};
