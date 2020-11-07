//routers/index.js 处理首页路由
const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const Article = require('../models/article')

//获取共通数据
const getCommonData = async () => {
    const categorayParsmse = Category.find({}, 'name')
    const categories = await categorayParsmse
    const articleParamse = Article.find({}, 'title click').sort({ click: -1 }).limit(10)
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
//显示列表页
router.get('/list/:id', async (req, res) => {
    // 获取当前点击分类的ID
    const { id } = req.params
    // 获取分类
    const { categories, topArticles } = await getCommonData()
    res.render('main/list', {
        userInfo: req.userInfo,
        categories,
        currentCategory: id,
        topArticles
    })
})
module.exports = router