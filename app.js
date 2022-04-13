const express = require('express');
const app = express();
const port = process.env.port || 3000;
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const {Patient, TimeSeries} = require('./models/patient');

require('dotenv').config();
const connectionURL = process.env.MONGO_URL || 'mongodb://localhost:27017/diabetes-at-home';
mongoose.connect(connectionURL);

const db = mongoose.connection;
// event handlers
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('connected to Mongo')
})

// set up express-handlebars
app.engine('hbs', exphbs.engine({ extname: 'hbs', defaultLayout: 'main' }));
app.set('view engine', 'hbs');

// link views to views directory
app.set('views', path.join(__dirname, '/views'));

// link static files to public directory
app.use(express.static(path.join(__dirname, '/public')));

// process incoming request
app.use(bodyParser.urlencoded({ extended: true }))





// hero page
app.get('/', (req, res) => {
    res.render('home', {
        style: 'about.css'
    });
})

// aboutUs page
app.get('/about-us', (req, res) => {
    res.render('about/aboutUs', {
        style: 'about.css'
    });
})

// aboutDiabetes page
app.get('/about-diabetes', (req, res) => {
    res.render('about/aboutDiabetes', {
        style: 'about.css'
    });
})


// clinician dashboard
app.get('/dashboard', async (req, res) => {
    // .lean() is to solve the handlebars access error
    const patients = await Patient.find({}).populate('timeSeries').lean()  
    res.render('clinician/dashboard', {
        style: 'dashboard.css',
        patients
    });
})

// view patient page
app.get('/view-patient/:id', async (req, res) => {
    const pid = req.params.id;
    const patient = await Patient.findById(pid).lean();
    res.render('clinician/viewPatient', {
        style: 'viewPatient.css',
        patient
    })
})



app.listen(port, () => {
    console.log(`Listen on http://localhost:${port}`)
})