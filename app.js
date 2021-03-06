const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const {UserRouter, TopicRouter, CommentRouter, AttentionRouter, FeedbackRouter} = require('./router/index')
// 开启 https 服务 和 Gzip 服务
const fs = require('fs')
const https = require('https')
const compression = require('compression')
const options = {
    cert: fs.readFileSync(path.join(__dirname, './IIS/1_www.yycloud.ltd_bundle.crt')),
    key: fs.readFileSync(path.join(__dirname, './IIS/2_www.yycloud.ltd.key'))
}
// 连接数据库
require('./models/Connect')


const app = express()

// 使用cors插件解决跨域问题也可以使用手动方式
app.use(cors())

// 挂载 gzip 中间件
app.use(compression())

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
// 可以省略，默认就是 ./views 目录，但可以更改其默认目录
app.set('views', path.join(__dirname, './views/'))

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'itcast',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
}))


// 挂载路由
app.use(UserRouter, TopicRouter, CommentRouter, AttentionRouter, FeedbackRouter)

app.use('/403', function (req, res) {
    res.status(403).render('403.html')
})

// err_message 用来保存 500 的错误信息
let err_message = 'No Erron Message.'
app.use('/500', function (req, res) {
    res.status(500).render('500.html', {
        message: err_message
    })
})

app.use((req, res) => {
    res.status(404).render('404.html')
})


app.use((err, req, res) => {
    err_message = err.message
    // res.status(500).json({
    //     err_code: 500,
    //     message: err.message
    // })
    res.status(500).render('500.html', {
        message: err.message
    })
})


// 本测试端口服务
/*
app.listen(5000, () => {
    console.log('app runing at http://localhost:5000')
})
*/

//  线上 https 或者 http 端口服务
//  启动https服务
https.createServer(options, app).listen(443, function () {
    console.log('Https Service has been started, runing at https://localhost/')
})
