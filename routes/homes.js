const bodyParser = require('body-parser')
const express = require('express')
const { render } = require('swig')
const { route } = require('.')
const router = express.Router()
const Category = require('../models/category')
const pagination = require('../utils/pagination')
const Comment = require('../models/comment')

//设置中间件管理访问权限
router.use((req, res, next) => {
    if (req.userInfo._id) {
        next()
    } else {
        res.send('<h1>请先登录账号</h1>')
    }
})

//渲染个人中心页面
router.get('/', async(req, res) => {
    res.render('home/index', {
        userInfo: req.userInfo,
    })
})

//渲染个人评论管理页面
router.get('/comments', async(req, res) => {
    const result = await Comment.findPaginationComment(req, { author: req.userInfo._id })
    res.render('home/comment_list', {
        userInfo: req.userInfo,
        comments: result.docs,
        list: result.list,
        page: result.page,
        pages: result.totalpages,
        url: '/homes/comments'
    })
})

//处理删除评论请求
router.get('/comment/delete/:id', async(req, res) => {
    let { id } = req.params
    try {
        const result = await Comment.deleteOne({ _id: id, author: req.userInfo._id })
        if (result.deletedCount == 0) {
            res.render('home/error', {
                userInfo: req.userInfo,
                message: '删除评论失败，服务器原因',
                nextUrl: '/homes/comments'
            })
        } else {
            res.render('home/success', {
                userInfo: req.userInfo,
                message: '删除评论成功',
                nextUrl: '/homes/comments'
            })
        }
    } catch (e) {
        res.render('home/error', {
            userInfo: req.userInfo,
            message: '删除评论失败，服务器原因',
            nextUrl: '/homes/comments'
        })
    }
})
module.exports = router