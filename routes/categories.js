const bodyParser = require('body-parser')
const express = require('express')
const { render } = require('swig')
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
router.get('/', async (req, res) => {
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
//渲染新增分类页面
router.get('/add', async (req, res) => {
    res.render('admin/category_add.html', {
        userInfo: req.userInfo,
    })
})
//处理新增分类
router.post('/add', async (req, res) => {
    //获取参数
    let { name, order } = req.body

    try {
        // 查看是否存在同名分类
        const categories = await Category.findOne({ name: name })
        if (categories) {
            //存在则返回一个错误页面
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '已经有了同名的分类',
                nextUrl: '/categories'
            })
        } else {
            //不存在则添加分类
            await Category.insertMany({ name, order })
            //返回一个成功页面
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '添加成功',
                nextUrl: '/categories'
            })
        }

    } catch (e) {
        //返回一个错误页面
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '服务端错误',
            nextUrl: '/categories'
        })
    }
})

module.exports = router