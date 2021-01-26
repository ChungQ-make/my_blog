const express = require('express')
const userRouter = express.Router()
const UserManage = require('../controller/UserManage')


userRouter.get('/login', (req, res) => {
    res.render('login.html')
})

userRouter.post('/login', (req, res, next) => {
    UserManage.login(req, res, next)
})

userRouter.get('/register', (req, res) => {
    res.render('register.html')
})

userRouter.post('/register', (req, res, next) => {
    UserManage.register(req, res, next)
})

userRouter.get('/logout', (req, res) => {
    UserManage.logout(req, res)
})

userRouter.get('/settings/profile', async (req, res, next) => {
    // 路由拦截 并重定向到 登陆页面
    if (!req.session.user)
        return res.status(200).redirect('/login')
    // console.log('routerInfo', (await UserManage.getUserInfo(req, res, next))._id)
    // 这里的直接使用 user._id 需要进行处理后使用（&#34; user._id &#34;），直接调用session里的id即可
    res.render('./settings/profile.html', {
        url: req.url,
        user: await UserManage.getUserInfo(req, res, next),
        id: req.session.user._id
    })
})

userRouter.put('/settings/profile/:id', (req, res, next) => {
    if (!req.session.user)
        return res.status(403).redirect('/403')
    UserManage.editUserInfo(req, res, next)
})

userRouter.get('/settings/admin', (req, res) => {
    if (!req.session.user)
        return res.status(403).redirect('/403')
    res.render('./settings/admin.html', {
        url: req.url,
        user_id: req.session.user._id
    })
})

userRouter.put('/settings/admin/:id', (req, res, next) => {
    if (!req.session.user)
        return res.status(403).redirect('/403')
    UserManage.editPassword(req, res, next)
})


userRouter.delete('/settings/admin/:id', (req, res, next) => {
    if (!req.session.user)
        return res.status(403).redirect('/403')
    // console.log(req.params.id)
    UserManage.CancelUser(req, res, next)
})


// 错误处理 500 页面测试路由
userRouter.get('/err', (req, res, next) => {
    // throw new Error('服务器未开启，请通知网站管理员！（管理员邮箱：cn.chung@foxmail.com）')
    next(new Error('系统出错啦！！！！！'))
})

module.exports = userRouter
