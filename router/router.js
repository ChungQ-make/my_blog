const express = require('express')
const User = require('../models/user')
const md5 = require('blueimp-md5')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('index.html', {
        user: req.session.user
    })
})

router.get('/login', (req, res) => {
    res.render('login.html')
})

router.post('/login', async (req, res) => {
    const body = req.body
    // console.log(req.body)
    await User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, (err, user) => {
        if (err) return res.status(500).json({
            err_code: 500,
            message: err.message
        })
        if (!user) return res.status(200).json({
            err_code: 1,
            message: 'Email or Password is invaild.'
        })

        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})

router.get('/register', (req, res) => {
    res.render('register.html')
})

/*router.post('/register', (req, res) => {
    console.log(req.body)
    // 1. 获取表单提交的数据
    //    req.body
    // 2. 操作数据库
    //    判断改用户是否存在
    //    如果已存在，不允许注册
    //    如果不存在，注册新建用户
    // 3. 发送响应
    const body = req.body
    User.findOne({
        $or: [
            {
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, (err, data) => {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: 'Internet erron'
            })
        }
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: 'email or nickname aleady exists'
                // ,data: body
            })
        }
        // md5 重复加密 增加安全性
        body.password = md5(md5(body.password))
        // console.log(body.password)
        new User(body).save((err, user) => {
            if (err) return res.status(500).json({
                err_code: 500,
                message: 'Internet erron'
            })
            // 这里前端只允许接收JSON格式数据 可以直接使用express的json（）方法
            // json（） 接收一个对象为参数， 它会自动将其转换为JSON字符串后发送给浏览器
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })


    })
})*/

router.post('/register', async function (req, res) {
    const body = req.body
    try {
        if (await User.findOne({email: body.email})) {
            return res.status(200).json({
                err_code: 1,
                message: '邮箱已存在!'
            })
        }

        if (await User.findOne({nickname: body.nickname})) {
            return res.status(200).json({
                err_code: 2,
                message: '昵称已存在!'
            })
        }

        // 对密码进行 md5 重复加密
        body.password = md5(md5(body.password))

        // 创建用户，执行注册
        await new User(body).save((err, user) => {
            if (err) return res.status(500).json({
                err_code: 500,
                message: 'Internet erron.'
            })

            // 注册成功，使用 Session 记录用户的登陆状态
            req.session.user = user

            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })
    } catch (err) {
        await res.status(500).json({
            err_code: 500,
            message: err.message
        })
    }
})

router.get('/logout', (req, res) => {
//    清除session（登陆状态）
    req.session.user = null
    res.redirect('/login')
})
module.exports = router
