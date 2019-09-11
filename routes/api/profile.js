const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const profileModel = require('../../models/Profile');
const userModel = require('../../models/User');
const checkAuth = passport.authenticate('jwt', {session: false});
const validateProfileInput = require('../../validation/profile');
const validateEducationInput = require('../../validation/education');
const validateExperienceInput = require('../../validation/experience');

/**
 * @route GET /all
 * @desc Get All User
 * @access Public
 */
router.get('/all', (req, res) => {

    profileModel
        .find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                return res.status(400).json({
                    msg: 'There is No Profile Info'
                });
            } else {
                res.status(200).json(profiles);
            }
        })
        .catch(err => res.json(err));

});

/**
 * @route   GET /profile
 * @desc    Get current users profile
 * @access  Private
 */
router.get('/', checkAuth, (req, res) => {
    
    const errors = {};
    
    profileModel
        .findOne({user: req.user.id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user Id';
                return res.status(401).json(errors);
            }
            res.json({
                msg: 'successful register profile',
                profileInfo: profile,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/profile/all'
                }
            });
        })
        .catch(err => res.json(err));
});

/**
 * @route   GET /user/:user_id
 * @desc    Get Profile by userId
 * @access  Private
 */
router.get('/user/:user_id', checkAuth, (req, res) => {

    const errors = {};

    profileModel
        .findOne({user: req.params.user_id})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                return res.status(404).json({
                    msg: 'Not Found User'
                });
            } else {
                res.status(200).json(profile);
            }
        })
        .catch(err => res.json(err));
});


/**
 * @route   POST /
 * @desc    create profile
 * @access  Private
 */
router.post('/register', checkAuth, (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

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
            if (!profile) {
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
            } else {
                errors.noprofile = 'No user Info';
                return res.status(404).json(errors);
            }
        })
        .catch(err => res.json(err));
});


/**
 * @route   PATCH /modify
 * @desc    modify profile
 * @access  Private
 */
router.patch('/modify', checkAuth, (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

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
            if (profile) {
                // update
                profileModel

                    .findOneAndUpdate(
                        { user: req.user.id },
                        { $set: profileFields },
                        { new: true }
                    )
                    .then(profile => {
                        res.json(profile);
                    })
                    .catch(err => res.json(err));
            } else {   
                errors.noprofile = 'No user Info';
                return res.status(404).json(errors);
            }
        })
        .catch(err => res.json(err));

});


/**
 * @route   DELETE /profile/:profile_id
 * @desc    delete profile
 * @access  Private
 */
router.delete('/:profile_id', checkAuth, (req, res) => {
    
    profileModel
        .remove({_id: req.params.profile_id})
        .exec()
        .then(result => {
            res.status(200).json({
                msg: 'deleted user profile',
                request: {
                    type: 'GET',
                    request: 'http://localhost:3000/profile/all'
                }
            });
        })
        .catch(err => res.json(err));

});


/**
 * @route   POST /profile/education
 * @desc    add education to profile
 * @access  Private
 */
// post data를 server로 전송 하여 결과 값을 가지고 처리가 되는것
// get data를 server에서 요청한다.
router.post('/education', checkAuth, (req, res) => {

    const {errors, isValid} = validateEducationInput(req.body);

    // Check Validation 빈칸 체크를 먼저 한다.
    if (!isValid) {
        return res.status(404).json(errors);
    }

    profileModel
        // checkAuth의 return 값
        .findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            // Add to exp array
            profile.education.unshift(newEdu);
            console.log(newEdu);
            profile
                .save()
                .then(profile => res.status(200).json({
                    msg: 'successful profile education',
                    educationInfo: profile.education
                }))
                .catch(err => res.json(err));

        })
        .catch(err => res.json(err));
}); 

/**
 * @route   POST /profile/experience
 * @desc    add experience to profile
 * @access  Private
*/
router.post('/experience', checkAuth, (req, res) => {

    const {errors, isValid} = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(404).json(errors);
    }

    profileModel
        .findOne({user: req.user.id})
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to : req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            profile.experience.unshift(newExp);

            profile
                .save()
                .then(profile => res.json(profile))
                .catch(err => res.json(err));

        })
        .catch(err => res.json(err));
});


module.exports = router;