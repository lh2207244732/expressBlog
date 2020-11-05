//models/category.js mongodb的schema模型文件
const mongoose = require('mongoose')
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        requires: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
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
        ref: 'users',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    click: {
        type: Number
    }
})
//静态方法
articleSchema.statics.findArticles = function (query) {
    console.log(query)
    return this.find(query).populate('author', 'userName')
}
const Article = mongoose.model('articles', articleSchema)
module.exports = Article