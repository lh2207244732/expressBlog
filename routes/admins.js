//routers/index.js 处理管理员路由
const express = require('express')
const { get } = require('.')
const router = express.Router()
const User = require('../models/user')
const Comment = require('../models/comment')
const hmac = require('../utils/hmac')
const pagination = require('../utils/pagination')
    //设置中间件管理访问权限
router.use((req, res, next) => {
        if (req.userInfo.isAdmin) {
            next()
        } else {
            res.send('<h1>没有权限访问</h1>')
        }
    })
    //显示管理员首页
router.get('/', async(req, res) => {
        // 获取用户数目
        const userCount = await User.estimatedDocumentCount()
        res.render('admin/index', {
            userInfo: req.userInfo,
            userCount: userCount
        })
    })
    //渲染用户管理界面
router.get('/users', async(req, res) => {
        const options = {
            page: req.query.page,
            limit: 3,
            projection: '-passWord -__v',
            model: User
        }
        const result = await pagination(options)
        res.render('admin/users_list', {
            userInfo: req.userInfo,
            users: result.docs,
            list: result.list,
            page: result.page,
            pages: result.totalpages,
            url: '/admins/users'
        })
    })
    //删除用户
router.get('/delete/:id', async(req, res) => {
        let { id } = req.params
            //判断删除是否为管理员账户
        const admin = await User.findById(id)
        if (admin.isAdmin) {
            return res.render('admin/error', {
                userInfo: req.userInfo,
                message: '删除失败，不可以删除管理员账号',
                nextUrl: '/admins/users'
            })
        }
        try {
            await User.deleteOne({ _id: id })
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '删除成功',
                nextUrl: '/admins/users'
            })
        } catch (e) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '删除失败，服务器原因',
                nextUrl: '/admins/users'
            })
        }
    })
    //渲染修改密码页面
router.get('/password', async(req, res) => {
        res.render('admin/password', {
            userInfo: req.userInfo
        })
    })
    //处理修改密码请求
router.post('/password', async(req, res) => {
        const { password } = req.body
        const userId = req.userInfo._id
        try {
            //修改密码
            await User.updateOne({ _id: userId }, { passWord: hmac(password) })
                //销毁session 退出登录
            req.session.destroy()
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '修改密码成功,请重新登录',
                nextUrl: '/'
            })
        } catch (e) {
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '修改密码失败，服务器原因',
                nextUrl: '/admins/password'
            })
        }
    })
    //渲染评论管理界面
router.get('/comments', async(req, res) => {
        const result = await Comment.findPaginationComment(req)
        res.render('admin/comment_list', {
            userInfo: req.userInfo,
            comments: result.docs,
            list: result.list,
            page: result.page,
            pages: result.totalpages,
            url: '/admins/comments'
        })
    })
    //处理删除评论请求
router.get('/comment/delete/:id', async(req, res) => {
    // 获取评论请求
    let { id } = req.params
    try {
        await Comment.deleteOne({ _id: id })
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除评论成功',
            nextUrl: '/admins/comments'
        })
    } catch (e) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '删除评论失败，服务器原因',
            nextUrl: '/admins/comments'
        })
    }
})
module.exports = router