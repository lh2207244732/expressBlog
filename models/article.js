const mongoose = require('mongoose')
const articleSchema = mongoose.model({
    title: {
        type: String,
        requires: true
    },
    introduction: {
        type: String,
        default: ""
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    classify: {
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
const Article = new mongoose.model('artical', articleSchema)
module.exports = Article