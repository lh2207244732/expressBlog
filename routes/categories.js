const bodyParser = require('body-parser')
const express = require('express')
const { render } = require('swig')
const { route } = require('.')
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
        limit: 3,
        sort: { order: 1 },
        model: Category
    }
    const result = await pagination(options)
    res.render('admin/category_list', {
        userInfo: req.userInfo,
        categories: result.docs,
        list: result.list,
        page: result.page,
        pages: result.pages,
        url: '/categories'
    })
})

//渲染新增分类
router.get('/add', async (req, res) => {
    // res.render('admin/category_add.html', {
    //     userInfo: req.userInfo,
    // })
    res.render('admin/category_add_edit.html', {
        userInfo: req.userInfo,
    })
})

//处理新增分类请求
router.post('/add', async (req, res) => {
    //获取参数
    let { name, order } = req.body
    if (!order) {
        order = 0
    }
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

//渲染编辑分类
router.get('/edit/:id', async (req, res) => {
    // 获取id
    const { id } = req.params
    //根据Id查数据
    const category = await Category.findById(id)
    // res.render('admin/category_edit', {
    //     userInfo: req.userInfo,
    //     category: category
    // })
    res.render('admin/category_add_edit', {
        userInfo: req.userInfo,
        category: category
    })
})

//处理编辑分类请求
router.post('/edit', async (req, res) => {
    let { name, order, id } = req.body
    try {
        const category1 = await Category.findById(id)
        //判断是否有更新
        if (category1.name == name && category1.order == order) {
            return res.render('admin/error', {
                userInfo: req.userInfo,
                message: '编辑失败，请编辑后再提交',
                nextUrl: '/categories'
            })
        }
        //判断修改后的名称是否已经存在(除去修改之前自身的)
        const category2 = await Category.findOne({ name: name, _id: { $ne: id } })
        if (category2) {
            return res.render('admin/error', {
                userInfo: req.userInfo,
                message: '编辑失败，该名称已经被占用',
                nextUrl: '/categories'
            })
        }
        //判断通过后，更新数据
        await Category.updateOne({ _id: id }, { name, order })
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '编辑成功',
            nextUrl: '/categories'
        })
    } catch (e) {
        return res.render('admin/error', {
            userInfo: req.userInfo,
            message: '编辑失败，服务器端错误',
            nextUrl: '/categories'
        })
    }
})

//处理删除分类请求
router.get('/delete/:id', async (req, res) => {
    let { id } = req.params
    try {
        await Category.deleteOne({ _id: id })
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            nextUrl: '/categories'
        })
    } catch (e) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '删除失败，服务器原因',
            nextUrl: '/categories'
        })
    }
})
module.exports = router