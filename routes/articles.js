const bodyParser = require('body-parser')
const express = require('express')
const { render } = require('swig')
const { route } = require('.')
const router = express.Router()
const Article = require('../models/article')
const pagination = require('../utils/pagination')

//设置中间件管理访问权限
router.use((req, res, next) => {
    if (req.userInfo.isAdmin) {
        next()
    } else {
        res.send('<h1>没有权限访问</h1>')
    }
})

//显示文章管理首页
router.get('/', async (req, res) => {
    const options = {
        page: req.query.page,
        limit: 3,
        sort: { order: 1 },
        model: Article
    }
    const result = await pagination(options)
    res.render('admin/article_list', {
        userInfo: req.userInfo,
        categories: result.docs,
        list: result.list,
        page: result.page,
        pages: result.totalpages,
        url: '/articles'

    })
})
module.exports = router