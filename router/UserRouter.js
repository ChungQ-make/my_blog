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
    UserManage.getUserInfo(req, res, next)
})

userRouter.put('/settings/profile/:id', (req, res, next) => {
    UserManage.editUserInfo(req, res, next)
})

userRouter.get('/settings/admin', (req, res) => {

    UserManage.getAdminPage(req, res)
})

userRouter.put('/settings/admin/:id', (req, res, next) => {
    UserManage.editPassword(req, res, next)
})


userRouter.delete('/settings/admin/:id', (req, res, next) => {
    UserManage.CancelUser(req, res, next)
})


userRouter.get('/settings/myTopics', (req, res, next) => {
    UserManage.getUserTopics(req, res, next)
})


userRouter.delete('/settings/myTopics/delete/:id', (req, res, next) => {
    UserManage.deleteTopics(req, res, next)
})

userRouter.get('/settings/myTopics/edit', (req, res, next) => {
    UserManage.editTopicsInfo(req, res, next)
})

userRouter.put('/settings/myTopics/edit?/:id', (req, res, next) => {
    UserManage.editTopics(req, res, next)
})

userRouter.get('/settings/myCollections', (req, res) => {
    UserManage.getMyCollections(req, res)
})


userRouter.get('/onlineUsers', (req, res, next) => {
    UserManage.getOnlineUsers(req, res, next)
})


userRouter.get('/User/index', (req, res, next) => {
    UserManage.getUserHomepage(req, res, next)
})


// 错误处理 500 页面测试路由
userRouter.get('/err', (req, res, next) => {
    // throw new Error('服务器未开启，请通知网站管理员！（管理员邮箱：cn.chung@foxmail.com）')
    next(new Error('系统出错啦！！！！！'))
})

module.exports = userRouter
