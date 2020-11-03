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
router.get('/', async(req, res) => {
    // 获取用户数目
    const userCount = await User.estimatedDocumentCount()
    res.render('admin/index', {
        userInfo: req.userInfo,
        userCount: userCount
    })
})
module.exports = router