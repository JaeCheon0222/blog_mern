const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const postModel = require('../../models/post');
const profileModel = require('../../models/Profile');

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
        .sort({date: -1}) // 최신 날짜 순 1은 오래된 순
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

/**
 * @route   DELETE posts/delete/:postId
 * @desc    Delete post item
 * @access  Private
 */
router.delete('/delete/:postId', authCheck, (req, res) => {

    // 작성자가 맞는 지 확인
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            console.log(profile);
            postModel
                .findById({_id: req.params.postId})
                .then(post => {
                    // check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(404).json({
                            noauthorized: 'User not authorized'
                        });
                    }
                    post
                        .remove()
                        .then(()=> {
                            res.json({
                                msg: 'Success remove post',
                                success: true
                            });
                        })
                })
                .catch(err => res.json(err))
        })
        .catch(err => res.json(err));
});

/**
 * @route   POST posts/like/:postId 
 * @desc    Like post
 * @access  Private
 */
router.post('/like/:postId', authCheck, (req, res) => {

    // 어떤 유저가 눌렀는지
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            postModel
                .findById(req.params.postId)
                .then(post => {
                    // 한사람당 한번만 누름
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({
                            msg: 'user already liked this post'
                        });
                    }
                    // Add user id to likes array
                    post.likes.unshift({user: req.user.id});
                    post
                        .save()
                        .then(post => {
                            res.json(post);
                        });
                })
                .catch(err => res.json(err));
        });

});

/**
 * @route   POST posts/unlike/:postId 
 * @desc    unlike post
 * @access  Private
 */
router.post('/unlike/:postId', authCheck, (req, res) => {

    // 좋아요를 눌렀었는지 확인
    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            postModel
                .findById(req.params.postId)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({
                            notliked: 'You have not liked this post'
                        });
                    }

                    // get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);
                    
                    // splice out of array
                    post.likes.splice(removeIndex, 1);
                    
                    // save
                    post
                        .save()
                        .then(post => {
                            res.json(post)
                        });

                })

        })
        .catch(err => res.json(err));

});

/**
 * @route   POST posts/comment/:postId 
 * @desc    Add comment tp post
 * @access  Private
 */
router.post('/comment/:postId', authCheck, (req, res) => {

    const {errors, isValid} = validatePostInput(req.body);

    // check validation
    if (!isValid) {
        // if any errors, send 400 with errors object
        return res.status(400).json(errors);
    }

    postModel.findById(req.params.postId)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            };
            // add to comments array
            post.comments.unshift(newComment);
            // save
            post.save().then(post => res.json(post));
        })
        .catch(err => res.json(err));

});

module.exports = router;