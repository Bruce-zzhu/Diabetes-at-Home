const express = require("express");
const app = express();
const port = process.env.port || 3000;
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Patient, TimeSeries } = require("./models/patient");
const { isSameDay } = require('./public/scripts/js-helpers');
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


// ======= will tidy this up later ============

const { createTodayTimeSeries, getTodayTimeSeries } = require('./controllers/clinician')
// patient homepage based on HARDCODED id
app.get("/patient/dashboard", async (req, res) => {
    const patient = await Patient.findOne({ firstName: "Pat" }).lean();

    const todayTimeSeries = await getTodayTimeSeries(patient);
    // create timeSeries for each patient every day
    if (!todayTimeSeries) {
        await createTodayTimeSeries(patient);
    }


    const timeSeriesList = await TimeSeries.find({
        patient: patient._id,
    }).populate('patient').lean();

    var averageTimeseries = {
        bloodGlucose: 0,
        insulin: 0,
        weight: 0,
        exercise: 0,
    };
    var endDateArray = [];
    const dateArray = [
        todayTimeSeries.date.getDate(),
        todayTimeSeries.date.getMonth() + 1,
        todayTimeSeries.date.getFullYear(),
    ];

    getAvergaeValue(timeSeriesList, averageTimeseries, endDateArray);

    timeSeriesList.sort(function (a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);
        return d - c;
    });

    res.render("patient/dashboard", {
        style: "p-dashboard.css",
        patient,
        averageTimeseries,
        dateArray,
        endDateArray,
        timeSeriesList
    });
});

function getAvergaeValue(timeSeriesList, averageTimeseries, endDateArray) {
    if (timeSeriesList.length < 7) {
        endDateArray.push(
            timeSeriesList[timeSeriesList.length - 1].date.getDate(),
            timeSeriesList[timeSeriesList.length - 1].date.getMonth() + 1,
            timeSeriesList[timeSeriesList.length - 1].date.getFullYear()
        );
        for (let i = 0; i < timeSeriesList.length; i++) {
            averageTimeseries.bloodGlucose +=
                timeSeriesList[i].bloodGlucose.value;
            averageTimeseries.insulin += timeSeriesList[i].insulin.value;
            averageTimeseries.weight += timeSeriesList[i].weight.value;
            averageTimeseries.exercise += timeSeriesList[i].exercise.value;
        }
        averageTimeseries.bloodGlucose =
            (averageTimeseries.bloodGlucose / timeSeriesList.length).toFixed(2);
        averageTimeseries.insulin =
            averageTimeseries.insulin / timeSeriesList.length;
        averageTimeseries.weight =
            averageTimeseries.weight / timeSeriesList.length;
        averageTimeseries.exercise =
            averageTimeseries.exercise / timeSeriesList.length;
    } else {
        endDateArray.push(
            timeSeriesList[6].date.getDate(),
            timeSeriesList[6].date.getMonth() + 1,
            timeSeriesList[6].date.getFullYear()
        );
        for (let i = 0; i < 7; i++) {
            averageTimeseries.bloodGlucose +=
                timeSeriesList[i].bloodGlucose.value;
            averageTimeseries.insulin += timeSeriesList[i].insulin.value;
            averageTimeseries.weight += timeSeriesList[i].weight.value;
            averageTimeseries.exercise += timeSeriesList[i].exercise.value;
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
