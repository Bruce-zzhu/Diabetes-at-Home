const express = require('express');
const app = express();
const port = process.env.port || 3000;
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const helpers = require('../Diabetes-at-Home/public/scripts/js-helpers');
const mongoose = require('mongoose');
const { Patient, TimeSeries } = require('./models/patient');

require('dotenv').config();
const connectionURL = process.env.MONGO_URL || 'mongodb://localhost:27017/diabetes-at-home';
mongoose.connect(connectionURL);

const db = mongoose.connection;
// event handlers
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('connected to Mongo');
});

// set up express-handlebars
app.engine(
    'hbs',
    exphbs.engine({
        extname: 'hbs',
        defaultLayout: 'main',
        helpers: require('./public/scripts/hbs-helpers'),
    })
);
app.set('view engine', 'hbs');

// link views to views directory
app.set('views', path.join(__dirname, '/views'));

// link static files to public directory
app.use(express.static(path.join(__dirname, '/public')));

// process incoming request
app.use(bodyParser.urlencoded({ extended: true }));

// hero page
app.get('/', (req, res) => {
    res.render('landing', {
        style: 'landing.css',
    });
});

// aboutUs page
app.get('/about-us', (req, res) => {
    res.render('about/aboutUs', {
        style: 'about.css',
    });
});

// aboutDiabetes page
app.get('/about-diabetes', (req, res) => {
    res.render('about/aboutDiabetes', {
        style: 'about.css',
    });
});

// clinician dashboard
app.get('/clinician/dashboard', async (req, res) => {
    // .lean() is to solve the handlebars access error
    const patientPat = await Patient.findOne({ firstName: 'Pat' }).lean();
    const timeSeries = await TimeSeries.findOne({
        patient: patientPat._id,
    }).lean();
    res.render('clinician/dashboard', {
        style: 'dashboard.css',
        patientPat,
        timeSeries,
    });
});

// view patient page
app.get('/view-patient/:id/overview', async (req, res) => {
    try {
        const pid = req.params.id;
        const patient = await Patient.findById(pid).lean();

        res.render('clinician/viewPatient', {
            style: 'viewPatient.css',
            patient,
        });
    } catch (e) {
        console.log(e);
    }
});

// patient homepage based on HARDCODED id
app.get('/patient/dashboard', async (req, res) => {
    const patient = await Patient.findOne({ firstName: 'Pat' }).lean();
    const timeSeries = await TimeSeries.findOne({patient: patient._id}).lean();
    const dateArray = timeSeries.date.split(' ');

    res.render('patient/dashboard', {
        style: 'p-dashboard.css',
        patient,
        timeSeries,
        dateArray
    });
});

// Add New Entry page
app.get('/new-entry', (req, res) => {
    res.render('partials/new-entry', {
        // style: 'about.css'
    });
});

app.post('/new-entry', (req, res) => {
    res.redirect('/new-entry');
});

app.listen(port, () => {
    console.log(`Listen on http://localhost:${port}`);
});
