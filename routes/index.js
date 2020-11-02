//routers/index.js 处理首页路由
const express = require('express')
const router = express.Router()
    //显示首页
router.get('/', (req, res) => {
    //第一个参数是相对于模板目录的文件
    //第二个参数是传递给模板的数据
    res.render('main/index', {
        // title: '我是标题'
    })
})
module.exports = router