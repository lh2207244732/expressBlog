//引入express框架
const express = require('express')

//引入swig
const swig = require('swig')

//引入中间件body-parser 解析请求参数
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//实例化一个express对象
const app = express()

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
    throw new Error('connect err')
})
db.once('open', () => {
    console.log('connect ok')
})

//处理静态资源
app.use(express.static('public'))

//解析json
app.use(bodyParser.json())
//解析urlencoded内容
app.use(bodyParser.urlencoded({ extended: false }));

//设置缓存
//开发阶段设置不走缓存
swig.setDefaults({
    // cache: 'memory'
    cache: false
})
// 配置应用模板
//第一个参数是模板名称,同时也是模板文件的扩展名
//第二个参数是解析模板的方法
app.engine('html', swig.renderFile);
//配置模板的存放目录
//第一参数必须是views
//第二个参数是模板存放的目录
app.set('views', './views')
// 注册模板引擎
//第一个参数必须是view engine
//第二个参数是模板名称,也就是app.engine的第一个参数
app.set('view engine', 'html')
//路由入口 采用模块化处理（router）
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
//监听端口
app.listen(3000, () => {
    console.log('server is running at "http://127.0.0.1:3000"')
})