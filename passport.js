// Passport Initialisations
const passport = require('passport');
const mongoose = require("mongoose");
const LocalStrategy = require('passport-local').Strategy;
const {Patient} = require('./models/patient');
const {Clinician} = require('./models/clinician');
const bcrypt = require('bcrypt');

// Based on code form 'Week 9: Passport Demo from lecture' and 'tute09-passport'
// Serialize information to be stored in session/cookie
passport.serializeUser((user, done) => {
    done(undefined, user)
})

// When a request comes in, deserialize/expand the serialized information
// back to what it was (expand from id to full user)
passport.deserializeUser((userId, done) => {
    
    // Checks If userId can be found in Clinician or Patient mongoDB
    var user = Clinician.findById(userId); // Initialised to Clinician instance 
    if (user == undefined) {
        user = Patient.findById(userId); // Becomes Patient instance if undefined 
        return done(undefined, user)
    } else {
        return done(undefined, user)
    }
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
                    message: 'Incorrect credentials', // Non-specific error message given
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
                        message: 'Incorrect credentials', // Non-specific error message given
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
                    message: 'Incorrect credentials', // Descriptive error for debugging purposes. DELETE LATER.
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
                        message: 'Incorrect credentials', // Descriptive error for debugging purposes. DELETE LATER.
                    })
                }

                // If user exists and password matches the hash in the database
                return done(undefined, clinician)
                })
            })
        })
)

//New user for testing if password is being hashed
// Patient.find({}, (err, patients) => {
//     Patient.create({ email: 'harry@potter.email', age: 12, gender: 'male',  password: 'hashed', firstName: 'Harry', 
//     lastName: 'Potter', nickName: 'HP'}, (err) => {
//         if (err) { console.log(err); return; }
//         console.log('Dummy user inserted')
//     })
// })
// Clinician.find({}, (err, clinicians) => {
//     Clinician.create({ email: 'chris@dah.com', firstName: 'Chris', lastName: 'Lee', password: '123456', patients: []}, (err) => {
//         if (err) { console.log(err); return; }
//         console.log('Dummy user inserted')
//     })
// })

module.exports = passport
