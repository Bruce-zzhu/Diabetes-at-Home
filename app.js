const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Patient, TimeSeries } = require("./models/patient");
const { isSameDay } = require("./public/scripts/js-helpers");
const { consolelogs } = require("./public/scripts/js-helpers");
const clinicianRoutes = require("./routers/clinician");
const patientRoutes = require("./routers/patient");

require("dotenv").config();

const connectionURL =
    process.env.MONGO_URL || "mongodb://localhost:27017/diabetes-at-home";
mongoose.connect(connectionURL);

const db = mongoose.connection;
// event handlers
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("connected to Mongo");
});

// set up express-handlebars
app.engine(
    "hbs",
    exphbs.engine({
        extname: "hbs",
        defaultLayout: "main",
        helpers: require(__dirname + "/public/scripts/hbs-helpers").helpers,
    })
);
app.set("view engine", "hbs");
// link views to views directory
app.set("views", path.join(__dirname, "/views"));
// link static files to public directory
app.use(express.static(path.join(__dirname, "/public")));
// process incoming request
app.use(bodyParser.urlencoded({ extended: true }));


// routes
app.use("/clinician", clinicianRoutes);
app.use("/patient", patientRoutes);

// hero page
app.get("/", async (req, res) => {
    res.render("landing", {
        style: "landing.css",
    });
});

// aboutUs page
app.get("/about-us", (req, res) => {
    res.render("about/aboutUs", {
        style: "about.css",
    });
});

// aboutDiabetes page
app.get("/about-diabetes", (req, res) => {
    res.render("about/aboutDiabetes", {
        style: "about.css",
    });
});

// Clinician Login page
app.get("/login-c", (req, res) => {
    res.render("clinician/login", {
        style: "login.css",
    });
});

// Patient Login page
app.get("/login-p", (req, res) => {
    res.render("patient/login", {
        style: "login.css",
    });
});

// forgot password page
app.get('/forgot-password', (req, res) => {
    res.render('forgotPassword', {
        style: 'forgotPassword.css'
    });
})

// reset password page
app.get('/reset-password', (req, res) => {
    res.render('resetPassword', {
        style: 'forgotPassword.css'
    });
});

// leaderboard page
app.get("/patient/leaderboard", (req, res) => {
    res.render("patient/leaderboard", {
        style: "leaderboard.css",
    });
});




// Add New Entry page and process new entry forms
// app.get("/patient/new-entry", (req, res) => {
//     res.render("partials/new-entry");
// });

// Message Box
// app.get("/message-box", async (req, res) => {
//     res.render("partials/message-box");
// });

app.listen(process.env.PORT || port, () => {
    console.log(`Listen on http://localhost:${port}`);
});
