const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true //Makes sure user email cant make multiple profiles
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// Sets variable named Used to mongoose.model, which models model name 'user' and schema
module.exports = User = mongoose.model('user', UserSchema)