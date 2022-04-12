const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

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
    res.render('about/about-us', {
        style: 'about.css'
    });
})

// aboutDiabetes page
app.get('/about-diabetes', (req, res) => {
    res.render('about/about-diabetes', {
        style: 'about.css'
    });
})


// clinician dashboard
app.get('/dashboard', (req, res) => {
    patients = [1,2,3,4,5];
    res.render('clinician/dashboard', {
        style: 'dashboard.css',
        patients
    });
})

// view patient page
app.get('/view-patient', (req, res) => {
    res.render('clinician/viewPatient')
})


app.listen(port, () => {
    console.log(`Listen on http://localhost:${port}`)
})