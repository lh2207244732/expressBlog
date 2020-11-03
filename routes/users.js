//routers/users.js
const express = require('express')
const User = require('../models/users')
const hmac = require('../utils/hmac')
const router = express.Router()
    //注册账号
router.post('/register', async(req, res) => {
        const { userName, passWord } = req.body
            // 验证用户名是否已经存在
        const user = await User.findOne({ userName: userName })
        if (user) {
            // 用户名已经存在
            res.json({
                code: 1,
                messgae: '用户名已经存在'
            })
            return
        }
        // 用户名不存在, 则向数据库中添加数据
        try {

            await User.insertMany({
                userName: userName,
                passWord: hmac(passWord)
            })
            res.json({
                code: 0,
                message: '注册成功'
            })
        } catch (e) {
            res.json({
                code: 1,
                message: '注册失败,服务器误'
            })
        }

    })
    //登录账号
router.post('/login', async(req, res) => {
        const { userName, passWord } = req.body
            // 校验用户名和密码
        const user = await User.findOne({ userName: userName, passWord: hmac(passWord) }, '-passWord -__v')
        try {
            if (user) {
                // 验证成功
                //用Cookies的对象来设置cookie,Cookies的对象在app.js中用中间件保存的
                // req.cookies.set('userInfo', JSON.stringify(user))
                req.session.userInfo = user
                return res.json({
                    code: 0,
                    messgae: '登录成功'
                })
            } else {
                // 验证失败
                res.json({
                    code: 1,
                    messgae: '登录失败，用户名或密码错误'
                })
            }
        } catch (e) {
            res.json({
                code: 1,
                message: '注册失败,服务器误'
            })
        }

    })
    //退出账号
router.get('/logout', async(req, res) => {
    //销毁session
    req.session.destroy()
    return res.json({
        code: 0,
        message: '退出成功'
    })
})
module.exports = router