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

});

module.exports = router;