const express = require('express');
const app = express();
const flash = require('express-flash' ) // Used for showing login error messages
const session = require('express-session') // Used for managing user sessions
const port = 3000;
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const clinicianRoutes = require('./routers/clinician');
const patientRoutes = require('./routers/patient');
const generalRoutes = require('./routers/general');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

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
        helpers: require(__dirname + '/public/scripts/hbs-helpers').helpers,
    })
);
app.set('view engine', 'hbs');

// Login Sessions setup - see week 10 tute for explanation of code
app.use(
    session({
    // The decret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'demo', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        proxy: process.env.NODE_ENV === 'production', // to work on Heroku
        cookie: {
            sameSite: 'strict',
            httponly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 300000 // sessions expire after 5 minutes
        },
    })
)

// use PASSPORT
const passport = require('./passport.js');
const { setTheme } = require('./public/scripts/js-helpers');
app.use(passport.authenticate('session'))

// link views to views directory
app.set('views', path.join(__dirname, '/views'));
// link static files to public directory
app.use(express.static(path.join(__dirname, '/public')));
// process incoming request
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    if (!req.session.theme) {
        req.session.theme = "default";
    }
    next();
})

// routes
app.use('/clinician', clinicianRoutes);
app.use('/patient', patientRoutes);
app.use('/', generalRoutes);

// hero page
app.get('/', async (req, res) => {
    res.render('landing', {
        style: 'landing.css',
    });
});

app.listen(process.env.PORT || port, () => {
    console.log(`Listen on http://localhost:${port}`);
});
