const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text:{
        type: String,
        require: true
    },
    name:{
        type: String
    },
    avatar:{
        type: String
    },
    likes:[
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users' // users를 참조한다.
            }
        }
    ],
    comments: [

    ],
    date:{
        type: Date,
        default: Date.now
    }

});

module.exports = Post = mongoose.model('post', PostSchema);