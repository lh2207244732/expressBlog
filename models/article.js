//models/category.js mongodb的schema模型文件
const moment = require('moment')
const mongoose = require('mongoose')
const pagination = require('../utils/pagination')
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        requires: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        //会自动关联到categories
        ref: 'category',
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
        ref: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    click: {
        type: Number,
        default: 0
    }
})

//静态方法,关联查询
articleSchema.statics.findPaginationArticles = async function (req, query) {
    const options = {
        page: req.query.page,
        projection: '-__v',
        model: this,
        query: query,
        populates: [{ path: 'author', select: 'userName' }, { path: 'category', select: 'name' }]
    }
    const result = await pagination(options)
    const docs = result.docs.map(item => {
        const obj = JSON.parse(JSON.stringify(item))
        obj.createTime = moment(item.createdAt).format('YYYY-MM-DD hh:mm:ss')
        return obj
    })
    result.docs = docs
    return result
}
//定义虚拟字段
articleSchema.virtual('createTime').get(function () {
    return moment(this.createdAt).format('YYY-MM-DD HH:mm:ss')
})
const Article = mongoose.model('article', articleSchema)
module.exports = Article