const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const router = require('./router/router')

const app = express()

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

app.use(router)

app.use((req, res) => {
    res.status(404).render('404.html')
})

app.use((err, req, res, next) => {
    res.status(500).json({
        err_code: 500,
        message: err.message
    })
/*    res.status(500).render('500.html', {
        ErrMessage: err.message
    })*/
})

app.listen(5000, () => {
    console.log('runing at http://localhost:5000')
})
