const express = require("express");
const app = express();
const port = process.env.port || 3000;
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Patient, TimeSeries } = require("./models/patient");
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
app.get("/", (req, res) => {
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
app.get("/login_c", (req, res) => {
    res.render("clinician/login", {
        style: "login.css",
    });
});

// Patient Login page
app.get("/login_p", (req, res) => {
    res.render("patient/login", {
        style: "login.css",
    });
});

// forgot password page
app.get("/forgot_password", (req, res) => {
    res.render("forgot-password", {
        style: "login.css",
    });
});

// leaderboard page
app.get("/patient/leaderboard", (req, res) => {
    res.render("patient/leaderboard", {
        style: "leaderboard.css",
    });
});

// patient homepage based on HARDCODED id
app.get("/patient/dashboard", async (req, res) => {
    const patient = await Patient.findOne({ firstName: "Pat" }).lean();
    const timeSeries = await TimeSeries.findOne({
        patient: patient._id,
    }).lean();

    const timeSeriesArr = await TimeSeries.find({
        patient: patient._id,
    }).lean();

    timeSeriesArr.sort(function (a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);
        return c - d;
    });
    var averageTimeseries = {
        bloodGlucose: 0,
        insulin: 0,
        weight: 0,
        exercise: 0,
    };
    var endDateArray = [];
    const dateArray = [
        timeSeries.date.getDate(),
        timeSeries.date.getMonth() + 1,
        timeSeries.date.getFullYear(),
    ];

    getAvergaeValue(timeSeriesArr, averageTimeseries, endDateArray);
    res.render("patient/dashboard", {
        style: "p-dashboard.css",
        patient,
        timeSeries,
        averageTimeseries,
        dateArray,
        endDateArray,
    });
});

function getAvergaeValue(timeSeriesArr, averageTimeseries, endDateArray) {
    if (timeSeriesArr.length < 7) {
        endDateArray.push(
            timeSeriesArr[timeSeriesArr.length - 1].date.getDate(),
            timeSeriesArr[timeSeriesArr.length - 1].date.getMonth() + 1,
            timeSeriesArr[timeSeriesArr.length - 1].date.getFullYear()
        );
        for (let i = 0; i < timeSeriesArr.length; i++) {
            averageTimeseries.bloodGlucose +=
                timeSeriesArr[i].bloodGlucose.value;
            averageTimeseries.insulin += timeSeriesArr[i].insulin.value;
            averageTimeseries.weight += timeSeriesArr[i].weight.value;
            averageTimeseries.exercise += timeSeriesArr[i].exercise.value;
        }
        averageTimeseries.bloodGlucose =
            averageTimeseries.bloodGlucose / timeSeriesArr.length;
        averageTimeseries.insulin =
            averageTimeseries.insulin / timeSeriesArr.length;
        averageTimeseries.weight =
            averageTimeseries.weight / timeSeriesArr.length;
        averageTimeseries.exercise =
            averageTimeseries.exercise / timeSeriesArr.length;
    } else {
        endDateArray.push(
            timeSeriesArr[6].date.getDate(),
            timeSeriesArr[6].date.getMonth() + 1,
            timeSeriesArr[6].date.getFullYear()
        );
        for (let i = 0; i < 7; i++) {
            averageTimeseries.bloodGlucose +=
                timeSeriesArr[i].bloodGlucose.value;
            averageTimeseries.insulin += timeSeriesArr[i].insulin.value;
            averageTimeseries.weight += timeSeriesArr[i].weight.value;
            averageTimeseries.exercise += timeSeriesArr[i].exercise.value;
        }
        averageTimeseries.bloodGlucose = averageTimeseries.bloodGlucose / 7;
        averageTimeseries.insulin = averageTimeseries.insulin / 7;
        averageTimeseries.weight = averageTimeseries.weight / 7;
        averageTimeseries.exercise = averageTimeseries.exercise / 7;
    }
}
// Add New Entry page and process new entry forms
// app.get("/patient/new-entry", (req, res) => {
//     res.render("patient/new-entry");
// });

// Message Box
// app.get("/message-box", async (req, res) => {
//     res.render("partials/message-box");
// });

app.listen(port, () => {
    console.log(`Listen on http://localhost:${port}`);
});
