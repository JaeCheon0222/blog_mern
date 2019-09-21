const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const postModel = require('../../models/post');

const authCheck = passport.authenticate('jwt', {session: false});

/**
 * @route   GET posts/test
 * @desc    tests posts route
 * @access  Public
 */
router.get('/test', (req, res) => {
    res.status(200).json({
        msg: "posts works"
    });
});

module.exports = router;