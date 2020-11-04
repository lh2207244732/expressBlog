const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const pagination = require('../utils/pagination')

//设置中间件管理访问权限
router.use((req, res, next) => {
    if (req.userInfo.isAdmin) {
        next()
    } else {
        res.send('<h1>没有权限访问</h1>')
    }
})

//显示分类管理首页
router.get('/', async(req, res) => {
    const options = {
        page: req.query.page,
        model: Category
    }
    const result = await pagination(options)
    res.render('admin/category_list', {
        userInfo: req.userInfo,
        users: result.docs,
        list: result.list,
        page: result.page,
        pages: result.totalpages,
        url: '/category'

    })
})


module.exports = router