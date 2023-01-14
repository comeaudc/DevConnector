const mongoose = require('mongoose');
// Variable called schema so later on we can use Schema instead of mongoose.schema (cleaner look)
const Schema = mongoose.Schema

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    avatar: {
        type: String
    },
    // An array of likes that only allows each user to like once
    likes: [
        {
            user: [
                type: Schema.Types.ObjectId,
                ref: 'users'
            ]
        }
        ]
    ,
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                require: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Post = mongoose.model('post', PostSchema)