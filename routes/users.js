//routers/users.js
const express = require('express')
const User = require('../models/users')
const hmac = require('../utils/hmac')
const router = express.Router()
//注册账号
router.post('/register', async (req, res) => {
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
module.exports = router