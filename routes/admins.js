//routers/index.js 处理管理员路由
const express = require('express')
const router = express.Router()
const User = require('../models/users')
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
module.exports = router