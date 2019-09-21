const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const postModel = require('../../models/post');

// validation
const validatePostInput = require('../../validation/posts');

const authCheck = passport.authenticate('jwt', {session: false});

/**
 * @route   POST posts/register
 * @desc    Create post
 * @access  Private
 */
router.post('/register', authCheck, (req, res) => {

    const {errors, isValid} = validatePostInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new postModel({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    // post save
    newPost.save()
        .then(post => {
            res.json(post);
        })
        .catch(err => res.status(404).json(err));

});


module.exports = router;