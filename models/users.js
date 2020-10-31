//models/users.js mongodb的schema模型文件
const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        requires: true,
        minlength: 3,
        maxlength: 6
    },
    passWord: {
        type: String,
        requires: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})
const User = mongoose.model('users', UserSchema)
module.exports = User