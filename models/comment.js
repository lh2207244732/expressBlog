//models/category.js mongodb的schema模型文件
const moment = require('moment')
const mongoose = require('mongoose')
const pagination = require('../utils/pagination')
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article',
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//静态方法,关联查询
commentSchema.statics.findPaginationComment = function (req, query) {
    const options = {
        page: req.query.page,
        projection: '-__v',
        model: this,
        query: query,
        populates: [{ path: 'author', select: 'userName' }, { path: 'article', select: 'title' }]
    }
    return pagination(options)
}
//定义虚拟字段
commentSchema.virtual('createTime').get(function () {
    return moment(this.createdAt).format('YYY-MM-DD HH:mm:ss')
})
const Comment = mongoose.model('comment', commentSchema)
module.exports = Comment