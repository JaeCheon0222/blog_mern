const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const profileModel = require('../../models/Profile');
const userModel = require('../../models/User');
const checkAuth = passport.authenticate('jwt', {session: false});

/**
 * @route   GET /profile
 * @desc    Get current users profile
 * @access  Private
 */
router.get('/', checkAuth, (req, res) => {
    
    const errors = {};
    
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user Id';
                return res.status(401).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.json(err));
});

/**
 * @route   POST /
 * @desc    Basic Test
 * @access  Private
 */
router.post('/', checkAuth, (req, res) => {
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};

    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            profileModel
                .findOne({handle: profileFields.handle})
                .then(profile => {
                    if (profile) {
                        errors.handle = 'That handle already exists';
                        res.status(400).json(errors);
                    }
                    new profileModel(profileFields)
                        .save()
                        .then(profile => {
                            res.json(profile)
                        })
                        .catch(err => res.json(err));

                });
        })
        .catch(err => res.json(err));

});

module.exports = router;