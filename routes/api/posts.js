const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const postModel = require('../../models/post');

// validation
const validatePostInput = require('../../validation/posts');

const authCheck = passport.authenticate('jwt', {session: false});

/**
 * @route   GET posts/all
 * @desc    Get post list
 * @access  Public
 */
router.get('/all', (req, res) => {
    
    postModel
        .find()
        .populate('user', ['name', 'avatar'])
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    msg: 'Not Found post list'
                });
            } else {
                // res.status(200).json({

                //     count: result.length,
                //     postList: result.map(post => {
                //         return (
                //             user = post.user,
                //             text = post.text
                //         );
                    
                //     })

                // });
                res.status(200).json({
                    msg: 'Success get post list',
                    count: result.length,
                    postList: result
                });
            }
        })
        .catch(err => res.json(err));

});

/**
 * @route   GET posts/:postsId
 * @desc    Get post item
 * @access  Public
 */
router.get('/:postsId', (req, res) => {

    const id = req.params.postsId;

    postModel
        .findById(id)
        .exec()
        .then(post => {
            if (!post) {
                return res.status(404).json({
                    msg: 'Not Founded post'
                });
            } else {
                res.status(200).json(post);
            }
        })
        .catch(err => res.json(err));

    // const errors = {};

    // profileModel
    //     .findOne({user: req.params.user_id})
    //     .populate('user', ['name', 'avatar'])
    //     .then(profile => {
    //         if (!profile) {
    //             return res.status(404).json({
    //                 msg: 'Not Found User'
    //             });
    //         } else {
    //             res.status(200).json(profile);
    //         }
    //     })
    //     .catch(err => res.json(err));

});


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