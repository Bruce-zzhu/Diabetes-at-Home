// set up Passport
const passport = require('passport');
const mongoose = require("mongoose");
const LocalStrategy = require('passport-local').Strategy;
const {Patient} = require('./models/patient');
const {Clinician} = require('./models/clinician');
const bcrypt = require('bcrypt');

// TUTE DEMO CODE

// Hardcoded User
//const USER = { id: 123, email: 'user', password: 'password', secret: 'info30005' }

// Serialize information to be stored in session/cookie
passport.serializeUser((patient, done) => {
    // Use id to serialize user
    // console.log(patient)
    done(undefined, patient._id)
})

// When a request comes in, deserialize/expand the serialized information
// back to what it was (expand from id to full user)
passport.deserializeUser((patientId, done) => {
    // Run database query here to retrieve user information
    // For now, just return the hardcoded user
    // if (userId === USER.id) {
    //     done(undefined, USER)
    // } else {
    //     done(new Error('Bad User'), undefined)
    // }
    Patient.findById(patientId, {password: 0}, (err, user) => {
        if (err) {
            return done(err, undefined)
        }
        return done(undefined, user)
    })
})

// Patient local authentication strategy 
passport.use('patient-local',
    new LocalStrategy((email, password, done) => {
        Patient.findOne({ email }, {}, {}, (err, patient) => {
            if (err) {
                return done(undefined, false, {
                    message: 'Unknown error has occurred1'
                })
            }
            if (!patient) {
                return done(undefined, false, {
                    message: 'Incorrect email', // Descriptive error for debugging purposes. DELETE LATER.
                })
            }
            // Check password
            patient.verifyPassword(password, (err, valid) => {
                if (err) {
                    
                    return done(undefined, false, {
                        message: 'Unknown error has occurred2'
                    })
                }
                if (!valid) {
                    return done(undefined, false, {
                        message: 'Incorrect password', // Descriptive error for debugging purposes. DELETE LATER.
                    })
                }

                // If user exists and password matches the hash in the database
                return done(undefined, patient)
                })
            })
        })
)

// Patient local authentication strategy 
passport.use('clinician-local',
    new LocalStrategy((email, password, done) => {
        Clinician.findOne({ email }, {}, {}, (err, clinician) => {
            if (err) {
                return done(undefined, false, {
                    message: 'Unknown error has occurred'
                })
            }
            if (!clinician) {
                return done(undefined, false, {
                    message: 'Incorrect email', // Descriptive error for debugging purposes. DELETE LATER.
                })
            }
            // Check password
            clinician.verifyPassword(password, (err, valid) => {
                if (err) {
                    // console.log(password)
                    return done(undefined, false, {
                        message: 'Unknown error has occurred'
                    })
                }
                if (!valid) {
                    return done(undefined, false, {
                        message: 'Incorrect password', // Descriptive error for debugging purposes. DELETE LATER.
                    })
                }

                // If user exists and password matches the hash in the database
                return done(undefined, clinician)
                })
            })
        })
)

//New user for testing if password is being hashed
// Clinician.find({}, (err, clinicians) => {
//     Clinician.create({ email: 'clinician@email', password: 'password', firstName: 'DR', 
//     lastName: 'CLINICIAN', patients: [null]}, (err) => {
//         if (err) { console.log(err); return; }
//         console.log('Dummy user inserted')
//     })
// })

module.exports = passport
