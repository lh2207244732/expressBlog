//routers/index.js 处理首页路由
const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Article = require('../models/article')

//获取共通数据
const getCommonData = async () => {
    const categorayParsmse = Category.find({}, 'name')
    const articleParamse = Article.find({}, 'title click').sort({ click: -1 }).limit(10)
    const categories = await categorayParsmse
    const topArticles = await articleParamse
    return {
        categories,
        topArticles
    }
}

//显示首页
router.get('/', async (req, res) => {
    // 获取分类
    const { categories, topArticles } = await getCommonData()
    const result = await Article.findPaginationArticles(req)
    //第一个参数是相对于模板目录的文件
    //第二个参数是传递给模板的数据
    res.render('main/index', {
        userInfo: req.userInfo,
        categories,
        topArticles,
        articles: result.docs,
        list: result.list,
        page: result.page,
        pages: result.totalpages,
    })
})
//显示分类列表页
router.get('/list/:id', async (req, res) => {
    // 获取当前点击分类的ID
    const { id } = req.params
    const commonDataParamise = getCommonData()
    const articlesPromise = Article.findPaginationArticles(req, { category: id })
    const { categories, topArticles } = await commonDataParamise
    const result = await articlesPromise
    res.render('main/list', {
        userInfo: req.userInfo,
        categories,
        currentCategory: id,
        topArticles,
        articles: result.docs,
        list: result.list,
        page: result.page,
        pages: result.totalpages,
    })
})

//显示首页文章列表
router.get('/articlesList', async (req, res) => {
    let query = {}
    let id = req.query.id
    if (id) {
        query.category = id
    }
    const result = await Article.findPaginationArticles(req, query)
    res.json({
        code: 0,
        message: '获取文章列表数据成功',
        data: {
            articles: result.docs,
            list: result.list,
            page: result.page,
            pages: result.totalpages,
        }
    })
})
//显示详情页
router.get('/detail/:id', async (req, res) => {
    const { id } = req.params
    const commonDataParamise = getCommonData()
    const articlesPromise = Article.findOneAndUpdate({ _id: id }, { $inc: { click: 1 } })
        .populate({ path: 'author', select: 'userName' })
        .populate({ path: 'category', select: 'name' })
    const { categories, topArticles } = await commonDataParamise
    const article = await articlesPromise
    console.log(article)
    res.render('main/detail', {
        userInfo: req.userInfo,
        categories,
        currentCategory: article.category._id,
        topArticles,
        article: article

    })
})
module.exports = router