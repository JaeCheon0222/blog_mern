const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// table 생성
const userSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    avatar: {
        type: String
    },
    date: {
        type: String,
        default: Date.now
    }
});

// 'users' -> 컬랙션
module.exports = User = mongoose.model('users', userSchema);