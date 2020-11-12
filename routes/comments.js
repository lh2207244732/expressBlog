const bodyParser = require('body-parser')
const express = require('express')
const { render } = require('swig')
const { route } = require('.')
const router = express.Router()
const Category = require('../models/category')
const pagination = require('../utils/pagination')
const Comment = require('../models/comment')

//设置中间件管理评论权限
router.use((req, res, next) => {
    if (req.userInfo._id) {
        next()
    } else {
        res.send('<h1>请登录后再评论</h1>')
    }
})
//处理新增评论请求
router.post('/', async (req, res) => {
    //获取参数
    let { comment, article } = req.body
    const author = req.userInfo._id
    try {
        //添加评论
        await Comment.insertMany({
            content: comment,
            article,
            author
        })
        //添加成功后，根据文章id获取最新评论数据并返回
        const commentParamise = Comment.findPaginationComment(req, { article: article })
        const result = await commentParamise
        res.json({
            code: 0,
            message: '添加评论成功',
            data: result
        })
    } catch (e) {
        console.log(e)
        res.json({
            code: 1,
            message: '添加评论失败'
        })
    }
})

module.exports = router