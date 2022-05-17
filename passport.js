// set up Passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {Patient} = require('./models/patient');
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

// Define local authentication strategy for Passport
passport.use(
    new LocalStrategy((email, password, done) => {
        Patient.findOne({ email }, {}, {}, (err, patient) => {
            if (err) {
                return done(undefined, false, {
                    message: 'Unknown error has occurred'
                })
            }
            if (!patient) {
                return done(undefined, false, {
                    message: 'Incorrect email',
                })
            }
            // Check password
            patient.verifyPassword(password, (err, valid) => {
                if (err) {
                    return done(undefined, false, {
                        message: 'Unknown error has occurred'
                    })
                }
                if (!valid) {
                    return done(undefined, false, {
                        message: 'Incorrect password',
                    })
                }

                // If user exists and password matches the hash in the database
                return done(undefined, patient)
                })
            })
        })
)

// New user for testing if password is being hashed
// Patient.find({}, (err, patients) => {
//     if (/*patients.length > 0*/2==1) return;
//     Patient.create({ email: 'email', password: 'password', firstName: 'First', 
//     lastName: 'Last', nickName: 'FiLa', age:'99', gender:'male'}, (err) => {
//         if (err) { console.log(err); return; }
//         console.log('Dummy user inserted')
//     })
// })

module.exports = passport
