//routers/index.js 处理管理员路由
const express = require('express')
const router = express.Router()
const User = require('../models/user')
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
module.exports = router