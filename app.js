const express = require('express');
const app = express();
const port = process.env.port || 3000;
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const {isSameDay} = require('./public/scripts/js-helpers');
const mongoose = require('mongoose');
const { Patient, TimeSeries } = require('./models/patient');
const clinicianRoutes = require('./routes/clinician');

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
        helpers: require(__dirname + '/public/scripts/hbs-helpers').helpers
    })
);
app.set('view engine', 'hbs');
// link views to views directory
app.set('views', path.join(__dirname, '/views'));
// link static files to public directory
app.use(express.static(path.join(__dirname, '/public')));
// process incoming request
app.use(bodyParser.urlencoded({ extended: true }));


// routes for clinician
app.use('/clinician', clinicianRoutes);


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

// Clinician Login page
app.get('/login_c', (req, res) => {
    res.render('clinician/login', {
        style: 'login.css'
    });
})

// Patient Login page
app.get('/login_p', (req, res) => {
    res.render('patient/login', {
        style: 'login.css'
    });
})

// forgot password page
app.get('/forgot_password', (req, res) => {
    res.render('forgot-password', {
        style: 'login.css'
    });
})

// leaderboard page
app.get('/patient/leaderboard', (req, res) => {
    res.render('patient/leaderboard', {
        style: 'leaderboard.css'
    });
})


// patient homepage based on HARDCODED id
app.get('/patient/dashboard', async (req, res) => {
    const patient = await Patient.findOne({firstName: 'Pat'}).lean();
    const timeSeries = await TimeSeries.findOne({patient: patient._id}).lean();
    const dateArray = [timeSeries.date.getDate(), '0' + timeSeries.date.getMonth()+1, timeSeries.date.getFullYear()]

    res.render('patient/dashboard', {
        style: 'p-dashboard.css',
        patient,
        timeSeries,
        dateArray
    });
});

// Add New Entry page and process new entry forms
app.get('/new-entry', (req, res) => {
    res.render('partials/new-entry', {  style: 'about.css'
    });
});

const { getTodayTimeSeries } = require('./controllers/clinician')
app.post('/new-entry', async (req, res) => {
    const blood = req.body.bloodGlucose;
    const weight = req.body.weight;
    const insulin = req.body.insulin;
    const exercise = req.body.exercise;

    const patient = await Patient.findOne({firstName: 'Pat'});
    

    
    console.log(req.body)
    res.redirect('/patient/dashboard');
})

// Message Box
app.get('/message-box', async(req, res) => {
    res.render('partials/message-box');
})


app.listen(port, () => {
    console.log(`Listen on http://localhost:${port}`);
});
