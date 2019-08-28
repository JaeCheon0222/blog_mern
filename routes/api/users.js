const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const userModel = require('../../models/User');

// @route: 경로, @desc: 설명, @access: 권한
// @route   GET users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => {
    res.status(200).json({
        msg: "users works"
    });
});

/**
  @route
**/

// @route   Post users/register
// @desc    register user
// @access  Private
router.post('/register', (req, res) => {

    userModel
        // email 유무 체크. findOne은 테이블 항목에서 하나만 찾음.
        .findOne({email: req.body.email})
        .then(user => {
            if (user) {
                // email 있을 경우. 기존 회원 가입이 되있을 경우.
                return res.status(400).json({
                    email: "Email already exists"
                });
            } else {

                // 이미지 자동 생성 (avatar 자동 생성)
                const avatar = gravatar.url(req.body.email, {
                    // avatar 이미지 옵션
                    s: '200', // size
                    r: 'pg', // Rating
                    d: 'mm' // Default
                });
                
                // create user 
                const newUser = new userModel({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password 
                });

                // password 암호화
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                res.json(user);
                            })
                            .catch(err => {
                                res.json(err);
                            });
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

});

module.exports = router;