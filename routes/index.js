//routers/index.js 处理首页路由
const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Article = require('../models/article')
const Comment = require('../models/comment')

//构造方法获取共通数据
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
    // 获取分类数据和点击排行榜数据
    const { categories, topArticles } = await getCommonData()
    //获取首页文章的分页列表数据
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
        pages: result.pages,
    })
})
//显示分类列表页
router.get('/list/:id', async (req, res) => {
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
        pages: result.pages,
    })
})

//处理ajax请求返回首页文章列表数据
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
            pages: result.pages,
        }
    })
})

//处理ajax请求返回详情页中评论列表数据
router.get('/commentsList', async (req, res) => {
    let query = {}
    let id = req.query.id
    if (id) {
        query.article = id
    }
    const result = await Comment.findPaginationComment(req, query)
    res.json({
        code: 0,
        message: '获取评论列表数据成功',
        data: result
    })
})
//显示文章详情页
router.get('/detail/:id', async (req, res) => {
    const { id } = req.params
    const commonDataParamise = getCommonData()
    const articlesPromise = Article.findOneAndUpdate({ _id: id }, { $inc: { click: 1 } }, { new: false })
        .populate({ path: 'author', select: 'userName' })
        .populate({ path: 'category', select: 'name' })
    //根据文章id获取评论列表分页数据
    const commentsParamise = Comment.findPaginationComment(req, { article: id })

    const { categories, topArticles } = await commonDataParamise
    const article = await articlesPromise
    const commentsData = await commentsParamise
    // 渲染文章详情页
    res.render('main/detail', {
        userInfo: req.userInfo,
        categories,
        currentCategory: article.category._id,
        topArticles,
        article: article,
        comments: commentsData.docs,
        list: commentsData.list,
        page: commentsData.page,
        pages: commentsData.pages,
    })
})

module.exports = router