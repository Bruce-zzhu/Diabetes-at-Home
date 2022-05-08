const express = require('express');
const app = express();
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
// link views to views directory
app.set('views', path.join(__dirname, '/views'));
// link static files to public directory
app.use(express.static(path.join(__dirname, '/public')));
// process incoming request
app.use(bodyParser.urlencoded({ extended: true }));

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
