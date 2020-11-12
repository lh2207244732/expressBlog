//引入express框架
const express = require('express')

//引入swig渲染界面
const swig = require('swig')

//引入中间件获取参数
const bodyParser = require('body-parser')

const session = require('express-session')
const MongoStore = require("connect-mongo")(session)

const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false);

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

//设置中间件解析cookie 
/*
app.use((req, res, next) => {
    //将cookie对象保存到req对象上
    req.cookies = new Cookies(req, res)
        //从用户请求中获取cookie
    const userInfo = JSON.parse(req.cookies.get('userInfo') || '{}')
    req.userInfo = userInfo
    next()
})
*/
// 设置session中间件
app.use(session({
    //设置cookie名称
    name: 'bloguser',
    //用它来对session cookie签名，防止篡改
    secret: 'abc123',
    //强制保存session即使它并没有变化
    resave: true,
    //强制将未初始化的session存储
    saveUninitialized: true,
    //如果为true,则每次请求都更新cookie的过期时间
    rolling: true,
    //cookie过期时间 1天
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    //设置session存储在数据库中
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
//使用session中间件
app.use((req, res, next) => {
    req.userInfo = req.session.userInfo || {}
    next()
})
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
app.use('/admins', require('./routes/admins'))
app.use('/homes', require('./routes/homes'))
app.use('/categories', require('./routes/categories'))
app.use('/articles', require('./routes/articles'))
app.use('/comments', require('./routes/comments'))
//监听端口
app.listen(3000, () => {
    console.log('server is running at "http://127.0.0.1:3000"')
})