const bodyParser = require('body-parser')
const express = require('express')
const { render } = require('swig')
const { route } = require('.')
const router = express.Router()
const User = require('../models/user')
const Comment = require('../models/comment')
const hmac = require('../utils/hmac')

//设置中间件管理访问权限
router.use((req, res, next) => {
    if (req.userInfo._id) {
        next()
    } else {
        res.send('<h1>请先登录账号</h1>')
    }
})

//渲染个人中心首页
router.get('/', async (req, res) => {
    res.render('home/index', {
        userInfo: req.userInfo,
    })
})

//渲染个人评论管理页面
router.get('/comments', async (req, res) => {
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
router.get('/comment/delete/:id', async (req, res) => {
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

//渲染更改个人密码页面
router.get('/password', async (req, res) => {

    res.render('home/password', {
        userInfo: req.userInfo,
    })
})

//处理修改密码请求
router.post('/password', async (req, res) => {
    const { password } = req.body
    const userId = req.userInfo._id
    try {
        //修改密码
        await User.updateOne({ _id: userId }, { passWord: hmac(password) })
        //销毁session 退出登录
        req.session.destroy()
        res.render('home/success', {
            userInfo: req.userInfo,
            message: '修改密码成功,请重新登录',
            nextUrl: '/'
        })
    } catch (e) {
        res.render('home/success', {
            userInfo: req.userInfo,
            message: '修改密码失败，服务器原因',
            nextUrl: '/homes/password'
        })
    }
})
module.exports = router