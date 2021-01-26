// 负责处理话题的业务模块
const Topic = require('../models/topic')
const moment = require('moment')
const marked = require('marked')

function SaveTopicInfo(req, res, next) {
    let topicData = req.body
    topicData.auther = req.session.user.nickname
    topicData.avatar = req.session.user.avatar
    topicData.userId = req.session.user._id
    // console.log(topicData)
    new Topic(topicData).save((err) => {
        if (err)
            return next(err)
        res.status(200).json({
            err_code: 200,
            message: '话题发布成功！'
        })
    })
}

function getIndexInfo(req, res, next) {
//   主页渲染这里只需要拿到avatar,title, created_date,commentNum，concerns，pageviews 即可
    Topic.find({}, {
        avatar: 1,
        titel: 1,
        created_time: 1,
        commentNum: 1,
        concerns: 1,
        pageviews: 1,
        userId: 1
    }, function (err, data) {
        if (err)
            return next(err)
        data.forEach((value) => {
            // 时间格式转换 这里只能添加新的属性 否则无法得到想要的数据，除了moment.js 还有 dateformat.js 也可以进行时间过滤
            value._created_time = moment(value.created_time).format("YYYY-MM-DD HH:mm:ss")
        })
        // 数组顺序颠倒，新数据在第一行显示
        data.reverse()
        res.status(200).render('index.html', {
            user: req.session.user,
            topicsInfo: data
        })
    })
}

function getTopicInfo(req, res, next) {
    // 这里需要去除多余的冒号
    const id = req.query.id.replace(/"/g, '')
    Topic.findOne({_id: id}, function (err, data) {
        if (err)
            return next(err)
        const html = marked(data.content)
        // res.setHeader('Content-Type', 'text/html;charset=utf-8')
        res.status(200).render('./topic/show.html', {
            topic: data,
            content: html
        })
    })
}

module.exports = {
    SaveTopicInfo: SaveTopicInfo,
    getIndexInfo: getIndexInfo,
    getTopicInfo: getTopicInfo
}
