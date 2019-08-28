//passport-jwt 

const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const mongoose = require('mongoose');
// const userModel = mongoose.model('users');
const userModel = require('../models/User');

const opts = {};

// 헤더에 bearertoken을 넣음.
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.Secret;

module.exports = (passport) => {
    passport.use(
        new jwtStrategy(opts, (jwt_payload, done) => {
            userModel    
                .findById(jwt_payload.id)
                .then(user => {
                    if (!user) {
                        return done(null, false);
                    } else {
                        return done(null, user);
                    }
                })
                .catch(err => console.log(err));
        })
    );
};