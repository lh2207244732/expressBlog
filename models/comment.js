//models/category.js mongodb的schema模型文件
const { json } = require('express')
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
commentSchema.statics.findPaginationComment = async function (req, query) {
    const options = {
        page: req.query.page,
        projection: '-__v',
        model: this,
        query: query,
        populates: [{ path: 'author', select: 'userName' }, { path: 'article', select: 'title' }]
    }
    //格式化时间，用于解决发送ajax无法使用虚拟属性的问题
    const result = await pagination(options)
    const docs = result.docs.map(item => {
        const obj = JSON.parse(JSON.stringify(item))
        obj.createTime = moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        return obj
    })
    result.docs = docs
    return result
}
//定义虚拟字段
commentSchema.virtual('createTime').get(function () {
    return moment(this.createdAt).format('YYY-MM-DD HH:mm:ss')
})
const Comment = mongoose.model('comment', commentSchema)
module.exports = Comment