// 负责处理评论的业务模块
const Feedback = require('../models/feedbacks')
const moment = require('moment')

function getFeedbacks(req, res, next) {
    Feedback.find({}, function (err, data) {
        if (err)
            return next(err)
        data.forEach(value => {
            value._created_time = moment(value.created_time).format('YYYY-MM-DD HH:mm')
        })
        data.reverse()
        res.render('./admin/feedback.html', {
            feedbacks: data
        })
    })
}

function sendFeedbacks(req, res, next) {
    const data = req.query
    new Feedback(data).save(function (err) {
        if (err)
            next(err)
        res.status(200).json({
            err_code: 200,
            message: '反馈提交成功！'
        })
    })
}

function uploadUserImg(req, res) {
    const files = req.files
    if (!files[0])
        return res.json({
            err_code: 1,
            message: '文件上传失败！'
        })
    res.json({
        err_code: 0,
        data: {
            url: files[0].path
        },
        message: '文件上传成功！'
    })
}

module.exports = {
    sendFeedbacks: sendFeedbacks,
    getFeedbacks: getFeedbacks,
    uploadUserImg: uploadUserImg
}
