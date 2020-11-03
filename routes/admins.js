//routers/index.js 处理管理员路由
const express = require('express')
const router = express.Router()
const User = require('../models/users')
//设置中间件管理访问权限
router.use((req, res, next) => {
    if (req.userInfo.isAdmin) {
        next()
    } else {
        res.send('<h1>没有权限访问</h1>')
    }
})
//显示管理员首页
router.get('/', async (req, res) => {
    // 获取用户数目
    const userCount = await User.estimatedDocumentCount()
    res.render('admin/index', {
        userInfo: req.userInfo,
        userCount: userCount
    })
})
//渲染用户管理界面
router.get('/users', async (req, res) => {
    // 获取当前页数
    let page = parseInt(req.query.page)
    if (isNaN(page)) {
        page = 1
    } else if (page < 1) {
        page = 1
    }
    //    定义每页显示的数据数
    const limit = 2
    const skip = limit * (page - 1)
    const userCount = await User.estimatedDocumentCount()
    //总页数
    const pages = Math.ceil(userCount / limit)
    let list = []
    for (var i = 1; i <= pages; i++) {
        list.push(i)
    }
    // 获取数据库用户信息
    const users = await User.find({}, "-__v -passWord").limit(limit).skip(skip)
    res.render('admin/users_list', {
        userInfo: req.userInfo,
        users: users,
        pages: list,
        page: page,
        maxpage: pages

    })
})
module.exports = router