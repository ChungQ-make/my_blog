// 负责处理评论的业务模块
const Comment = require('../models/comment')
const Topic = require('../models/topic')


function sendComment(req, res, next) {

    if (!req.session.user)
        return res.status(403).redirect('/403')

    if (!req.query.content) {
        res.status(200).json({
            err_code: 1,
            message: '无法发送空内容'
        })
    }
    let formData = req.query
    formData.sender = req.session.user.nickname
    new Comment(formData).save(function (err) {
        if (err)
            return next(err)
        // 更新话题的评论数
        Comment.find({topicId: req.query.topicId}, function (err, data) {
            if (err)
                return next(err)
            const commentNum = data.length
            Topic.findByIdAndUpdate({_id: req.query.topicId}, {commentNum: commentNum}, function (err) {
                if (err)
                    return next(err)
                res.status(200).json({
                    err_code: 200,
                    message: '发送消息成功！'
                })
            })
        })

    })

}

module.exports = {
    sendComment: sendComment
}
