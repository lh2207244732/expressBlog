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
    const filename = "uploads/" + req.file.filename
    res.json({
        uploaded: true,
        url: filename
    })
})
module.exports = router