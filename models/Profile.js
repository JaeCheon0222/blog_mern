const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users' // users 컬랙션 참조
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String
    },
    githubusername: {
        type: String
    },
    experience: [

    ],
    education: [

    ],
    social: {

    },
    date: {
        type: Date,
        default: Date.now
    }

});


//몽고 디비에서 컬랙션은 네임은 복수로
module.exports = Profile = mongoose.model('profiles', profileSchema);