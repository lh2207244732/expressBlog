const bodyParser = require('body-parser')
const express = require('express')
const { render } = require('swig')
const { route } = require('.')

//处理图片上传
const multer = require('multer')

//设置图片保存的静态资源路径
const upload = multer({ dest: 'public/uploads' })

const router = express.Router()
const Article = require('../models/article')
const Category = require('../models/category')
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

//显示文章管理首页
router.get('/', async(req, res) => {
    // const options = {
    //     page: req.query.page,
    //     limit: 3,
    //     sort: { order: 1 },
    //     model: Article
    // }
    // const result = await pagination(options)

    const result = await Article.findPaginationArticles(req)

    res.render('admin/article_list', {
        userInfo: req.userInfo,
        articles: result.docs,
        list: result.list,
        page: result.page,
        pages: result.totalpages,
        url: '/articles'
    })
})

//渲染新增文章页面
router.get('/add', async(req, res) => {
    const categories = await Category.find({}, '-__v').sort({ order: 1 })
    res.render('admin/article_add.html', {
        userInfo: req.userInfo,
        categories
    })
})

//处理上传图片请求
router.post('/uploadImage', upload.single('upload'), async(req, res) => {
    //将保存的图片名称返回
    const filename = "/uploads/" + req.file.filename
    res.json({
        uploaded: true,
        url: filename
    })
})

//处理新增文章请求
router.post('/add', async(req, res) => {
    const { title, category, introduction, content } = req.body
    const author = req.userInfo._id
    try {
        await Article.insertMany({
            title,
            introduction,
            content,
            author,
            category,
        })
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '上传成功',
            nextUrl: '/articles'
        })
    } catch (e) {
        console.log(e)
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '上传失败，服务器原因',
            nextUrl: '/articles'
        })
    }

})

//渲染编辑文章
router.get('/edit/:id', async(req, res) => {
    // 获取文章id
    const { id } = req.params
        //根据Id查文章
        // const article = await Article.findOne({ _id: id })
        // const categories = await Category.find({})
    const categoriesParmise = Category.find({}, '-__v -order').sort({ order: 1 })
    const articleParmise = Article.findOne({ _id: id }, 'title category introduction content')
    const categories = await categoriesParmise
    const article = await articleParmise
    res.render('admin/article_edit', {
        userInfo: req.userInfo,
        article: article,
        categories: categories
    })
})

//处理编辑文章请求
router.post('/edit', async(req, res) => {
    //获取更新后的数据
    let { title, category, introduction, content, id } = req.body
    try {
        //更新数据
        await Article.updateOne({ _id: id }, { title, category, introduction, content })
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '编辑文章成功',
            nextUrl: '/articles'
        })
    } catch (e) {
        return res.render('admin/error', {
            userInfo: req.userInfo,
            message: '编辑失败，服务器端错误',
            nextUrl: '/articles'
        })
    }
})

//处理删除文章请求
router.get('/delete/:id', async(req, res) => {
    let { id } = req.params
    try {
        await Article.deleteOne({ _id: id })
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除文章成功',
            nextUrl: '/articles'
        })
    } catch (e) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '删除文章失败，服务器原因',
            nextUrl: '/articles'
        })
    }

})
module.exports = router