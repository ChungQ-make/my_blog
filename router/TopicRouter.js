const express = require('express')
const TopicRouter = express.Router()
const TopicManage = require('../controller/TopicManage')

// 主页的路由
TopicRouter.get('/', (req, res) => {
    res.redirect('/index')
})

TopicRouter.get('/index', (req, res, next) => {
    TopicManage.getIndexInfo(req, res, next)
})

TopicRouter.get('/topics/new', (req, res) => {
    // 路由拦截 并重定向到 登陆页面
    if (!req.session.user)
        return res.status(200).redirect('/login')
    res.render('./topic/new.html')
})

TopicRouter.post('/topics/new', (req, res, next) => {
    TopicManage.SaveTopicInfo(req, res, next)
})

TopicRouter.get('/topics/info', (req, res, next) => {
    TopicManage.getTopicInfo(req, res, next)
})



module.exports = TopicRouter
