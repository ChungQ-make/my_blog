// 负责处理话题的业务模块
const Topic = require('../models/topic')
const moment = require('moment')
const marked = require('marked')
const Attention = require('../models/attention')


// 拿到 UserManage 的 userOnline 在线人数数据
const UserManage = require('../controller/UserManage')
const Comment = require('../models/comment')

function SaveTopicInfo(req, res, next) {
    // 路由拦截 并重定向到 登陆页面
    if (!req.session.user)
        return res.status(200).redirect('/login')
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
    let SearchText = req.query.value
    // 主页默认请求时，处理 SearchText
    if (req.query.value === undefined) {
        SearchText = ''
    }
    // 进行数据处理，去除所有空格
    SearchText = SearchText.replace(/\s/ig, '')

    // 为了提高查询效率，可以同时查询话题标题、内容、类型、作者名，再结合正则表达式
    const reg = new RegExp(SearchText, "gi")
    Topic.find({
        $or: [
            {titel: reg},
            {content: reg},
            {Topic_type: reg},
            {auther: reg}
        ]
    }, function (err, data) {
        if (err)
            return next(err)
        data.forEach((value) => {
            // 时间格式转换 这里只能添加新的属性 否则无法得到想要的数据，除了moment.js 还有 dateformat.js 也可以进行时间过滤
            value._created_time = moment(value.created_time).format("YYYY-MM-DD HH:mm")
            value._pageviews = parseInt(value.pageviews)
        })
        // 数组顺序颠倒，新数据在第一行显示
        data.reverse()
        res.status(200).render('index_search.html', {
            userOnline: UserManage.userOnline.size,
            user: req.session.user,
            topicsInfo: data,
            // 将 SearchText 作为依赖项引入（其他重复数据）的判断，避免重复引入
            SearchText: SearchText
        })
    })
}

function getTopicInfo(req, res, next) {
    // 这里需要去除多余的冒号
    const id = req.query.id.replace(/"/g, '')
    Topic.findOne({_id: id}, function (err, data) {
        if (err)
            return next(err)
        // 借助 marked 插件转换输出成html格式
        const html = marked(data.content)
        // 记录浏览量 每次请求都会增加一次（最然说这有些不合理，可以改成0.5,或许0.3每次，输出时取整）
        const pageviews = data.pageviews + 0.4
        // console.log(pageviews)
        Topic.findByIdAndUpdate({_id: id}, {pageviews: pageviews}, function (err) {
            if (err)
                next(err)
            Comment.find({topicId: id}, function (err, data1) {
                // 有点回调地狱的味道了 哈哈 建议改成 promise 语法或者 async/await 语法
                if (err)
                    next(err)
                data1.reverse()
                data1.forEach(value => {
                    value._created_time = moment(value.created_time).format("YYYY-MM-DD HH:mm")
                    // 设置自己的评论判断值
                    value.sender === value.recipient ? value.flag = true : value.flag = false
                })

                data._created_time = moment(data.created_time).format("YYYY-MM-DD HH:mm")

                if (req.session.user) {
                    Attention.findOne({userName: req.session.user.nickname, topicId: data.id}, function (err, dataAtt) {
                        if (err)
                            return next(err)
                        // console.log(dataAtt)
                        if (dataAtt) {
                            res.status(200).render('./topic/show.html', {
                                topic: data,
                                content: html,
                                user: req.session.user,
                                comments: data1,
                                flag: true
                            })
                        } else {
                            res.status(200).render('./topic/show.html', {
                                topic: data,
                                content: html,
                                user: req.session.user,
                                comments: data1,
                                flag: false
                            })
                        }
                    })
                } else {
                    res.status(200).render('./topic/show.html', {
                        topic: data,
                        content: html,
                        user: req.session.user,
                        comments: data1
                    })
                }
            })

        })
    })
}

// 实现主页数据分页操作
function indexValuePaging(req, res, next) {
    // 设置默认值， 接受pageNum （页码）进行查询,注意mongodb的skip（）参数默认为0
    let pageNum = 0
    let skip = 0
    let pageSize = 8
    if (req.query.pagenum) {
        pageNum = req.query.pagenum
        skip = pageNum * pageSize
    }
    Topic.find({}, function (err, data2) {
        if (err)
            return next(err)
        // 返回数据 总条数 和 分页数
        const total = data2.length
        const pageCounts = Math.ceil(total / pageSize)
        Topic.find({}, function (err, data1) {
            if (err)
                return next(err)
            // console.log(data1.length)

            data1.forEach((value) => {
                value._created_time = moment(value.created_time).format("YYYY-MM-DD HH:mm")
                value._pageviews = parseInt(value.pageviews)
            })
            data1.reverse()
            // console.log(typeof pageNum)
            res.status(200).render('index.html', {
                pageCounts: pageCounts,
                total: total,
                topicsInfo: data1,
                userOnline: UserManage.userOnline.size,
                user: req.session.user,
                pagenum: parseInt(pageNum)
            })
        }).limit(pageSize).skip(skip)

    })
}

module.exports = {
    SaveTopicInfo: SaveTopicInfo,
    getIndexInfo: getIndexInfo,
    getTopicInfo: getTopicInfo,
    indexValuePaging: indexValuePaging
}
