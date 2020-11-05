const mongoose = require('mongoose')
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        requires: true
    },
    introduction: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    creatAt: {
        type: Date,
        default: Date.now
    },
    click: {
        type: Number
    }
})
const Article = mongoose.model('artical', articleSchema)
module.exports = Article