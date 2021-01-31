const express = require('express')
const FeedbackRouter = express.Router()
const Feedback = require('../controller/FeedbackManage')
const multer = require('multer')

// 设置图片存储路径
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/uploadImg')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
// 添加配置文件到muler对象。
const upload = multer({storage: storage});


FeedbackRouter.get('/feedback', function (req, res, next) {
    Feedback.getFeedbacks(req, res, next)
})

FeedbackRouter.get('/Feedback/send', function (req, res, next) {
    Feedback.sendFeedbacks(req, res, next)
})

FeedbackRouter.get('/uploadImg', function (req, res) {
    res.render('UploadImg.html')
})

// 文件上传请求处理，upload.array 支持多文件上传，第二个参数是上传文件数目
FeedbackRouter.post('/uploadImg', upload.array('img', 2), function (req, res, next) {
    Feedback.uploadUserImg(req, res, next)
})


// 资源栏分享路由
FeedbackRouter.get('/ResourceList', function (req, res) {
    res.render('ResourceList.html')
})

// 资源栏分享路由
FeedbackRouter.get('/updatelog', function (req, res) {
    res.render('Updatelog.html')
})

module.exports = FeedbackRouter
