const express = require('express')
const router = express.Router()
const UserManage = require('../controller/UserManage')


router.get('/', (req, res) => {
    res.render('index.html', {
        user: req.session.user
    })
})

router.get('/login', (req, res) => {
    res.render('login.html')
})

router.post('/login', (req, res, next) => {
    UserManage.login(req, res, next)
})

router.get('/register', (req, res) => {
    res.render('register.html')
})

router.post('/register', (req, res, next) => {
    UserManage.register(req, res, next)
})

router.get('/logout', (req, res) => {
    UserManage.logout(req, res)
})

router.get('/settings/profile', async (req, res, next) => {
    // console.log('routerInfo', (await UserManage.getUserInfo(req, res, next))._id)
    // 这里的直接使用 user._id 需要进行处理后使用（&#34; user._id &#34;），直接调用session里的id即可
    res.render('./settings/profile.html', {
        url: req.url,
        user: await UserManage.getUserInfo(req, res, next),
        id: req.session.user._id
    })
})

router.put('/settings/profile/:id', (req, res, next) => {
    UserManage.editUserInfo(req, res, next)
})

router.get('/settings/admin', (req, res) => {
    res.render('./settings/admin.html', {
        url: req.url
    })
})

router.get('/show', (req, res) => {
    res.render('./topic/show.html')
})


// 错误处理 500 页面测试路由
router.get('/err', (req, res, next) => {
    // throw new Error('服务器未开启，请通知网站管理员！（管理员邮箱：cn.chung@foxmail.com）')
    // next('系统出错啦！！！！！')
    next(new Error('系统出错啦！！！！！'))
})

module.exports = router
