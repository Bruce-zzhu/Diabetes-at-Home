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

// ======= will tidy this up later ============

const {
    createTodayTimeSeries,
    getTodayTimeSeries,
} = require("./controllers/clinician");
// patient homepage based on HARDCODED id
app.get("/patient/dashboard", async (req, res) => {
    const patient = await Patient.findOne({ firstName: "Pat" }).lean();

    var todayTimeSeries = await getTodayTimeSeries(patient).then(data => data);
    // create timeSeries for each patient every day
    if (!todayTimeSeries) {
        await createTodayTimeSeries(patient);
        todayTimeSeries = await getTodayTimeSeries(patient).then(data => data);
    }

    const todayArray = [
        todayTimeSeries.date.getDate(),
        todayTimeSeries.date.getMonth() + 1,
        todayTimeSeries.date.getFullYear(),
    ];

    const timeSeriesList = await TimeSeries.find({
        patient: patient._id,
    }).populate("patient").lean();

    var averageTimeseries = {
        bloodGlucose: 0,
        insulin: 0,
        weight: 0,
        exercise: 0,
    };
    var endDateArray = [];
    

    timeSeriesList.sort(function (a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);
        return d - c;
    });
    
    // start date for avg
    const startDateArray = [
        timeSeriesList[timeSeriesList.length - 1].date.getDate(),
        timeSeriesList[timeSeriesList.length - 1].date.getMonth() + 1,
        timeSeriesList[timeSeriesList.length - 1].date.getFullYear(),
    ];

    getAvergaeValue(timeSeriesList, averageTimeseries, endDateArray);

    var datesArray = []
    for (ts of timeSeriesList) {
        var date = []
        date.push(ts.date.getDate());
        date.push(ts.date.getMonth()+1);
        date.push(ts.date.getFullYear());
        datesArray.push(date)
    }
    
    histData = []
    if (timeSeriesList.length > 1) {
        for (var i = 1; i < timeSeriesList.length; i++) {
            histData.push({
                date: datesArray[i],
                timeSeries: timeSeriesList[i]
                
            })
            
        }
    }
    
    

    res.render("patient/dashboard", {
        style: "p-dashboard.css",
        patient,
        todayTimeSeries,
        todayArray,
        averageTimeseries,
        startDateArray,
        endDateArray,
        timeSeriesList,
        histData: JSON.stringify(histData)
    });
});

function getAvergaeValue(timeSeriesList, averageTimeseries, endDateArray) {
    if (timeSeriesList.length > 1) {
        endDateArray.push(
            timeSeriesList[1].date.getDate(),
            timeSeriesList[1].date.getMonth() + 1,
            timeSeriesList[1].date.getFullYear()
        );
    } else {
        endDateArray.push(
            timeSeriesList[0].date.getDate(),
            timeSeriesList[0].date.getMonth() + 1,
            timeSeriesList[0].date.getFullYear()
        );
    }

    if (timeSeriesList.length <= 7) {
        
        for (let i = 1; i < timeSeriesList.length; i++) {
            averageTimeseries.bloodGlucose +=
                timeSeriesList[i].bloodGlucose.value;
            averageTimeseries.insulin += timeSeriesList[i].insulin.value;
            averageTimeseries.weight += timeSeriesList[i].weight.value;
            averageTimeseries.exercise += timeSeriesList[i].exercise.value;
        }

        averageTimeseries.bloodGlucose = (
            averageTimeseries.bloodGlucose / (timeSeriesList.length-1)
        ).toFixed(2);

        averageTimeseries.insulin =
            (averageTimeseries.insulin / (timeSeriesList.length-1)).toFixed(2);
        averageTimeseries.weight =
            (averageTimeseries.weight / (timeSeriesList.length-1)).toFixed(2);
        averageTimeseries.exercise =
            (averageTimeseries.exercise / (timeSeriesList.length-1)).toFixed(2);
    } else {
        for (let i = 1; i < 8; i++) {
            averageTimeseries.bloodGlucose +=
                timeSeriesList[i].bloodGlucose.value;
            averageTimeseries.insulin += timeSeriesList[i].insulin.value;
            averageTimeseries.weight += timeSeriesList[i].weight.value;
            averageTimeseries.exercise += timeSeriesList[i].exercise.value;
        }
        averageTimeseries.bloodGlucose = (averageTimeseries.bloodGlucose / 7).toFixed(2);
        averageTimeseries.insulin = (averageTimeseries.insulin / 7).toFixed(2);
        averageTimeseries.weight = (averageTimeseries.weight / 7).toFixed(2);
        averageTimeseries.exercise = (averageTimeseries.exercise / 7).toFixed(2);
    }
}


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
