// 负责处理用户登陆、注册、信息密码修改的业务模块
const md5 = require('blueimp-md5')
const User = require('../models/user')
const Topics = require('../models/topic')
const moment = require('moment')
const Attention =  require('../models/attention')


// 创建一个Set 类型，用来保存在线用户记录
let userOnline = new Set([])

async function login(req, res, next) {

    if (!await User.findOne({email: req.body.email}))
        return res.status(200).json({
            err_code: 2,
            message: 'The account number is not registered'
        })

    const body = req.body
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, (err, user) => {
        if (err)
            return next(err)
        if (!user)
            return res.status(200).json({
                err_code: 1,
                message: 'Email or Password is invaild.'
            })

        userOnline.add(user.nickname)

        req.session.user = user
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}

function logout(req, res) {
    //    清除session（登陆状态）
    if (req.session.user.nickname) {
        userOnline.delete(req.session.user.nickname)
    }
    req.session.user = null
    res.redirect('/login')

}

async function register(req, res, next) {
    const body = req.body
    try {
        if (await User.findOne({email: body.email})) {
            return res.status(200).json({
                err_code: 1,
                message: '邮箱已存在!'
            })
        }

        if (await User.findOne({nickname: body.nickname})) {
            return res.status(200).json({
                err_code: 2,
                message: '昵称已存在!'
            })
        }

        // 对密码进行 md5 重复加密
        body.password = md5(md5(body.password))
        // 创建用户，执行注册
        await new User(body).save((err, user) => {
            if (err) return next(err)

            // 注册成功，使用 Session 记录用户的登陆状态
            req.session.user = user

            userOnline.add(user.nickname)

            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })
    } catch (err) {
        next(err)
    }
}

function editUserInfo(req, res, next) {
    if (!req.session.user)
        return res.status(403).redirect('/403')
    const _id = req.params.id
    const editData = req.body

    userOnline.add(req.body.nickname)
    userOnline.delete(req.session.user.nickname)

    User.findByIdAndUpdate(_id, editData, (err) => {
        if (err)
            return next(err)
        res.status(200).json({
            err_code: 0,
            message: '修改成功！'
        })

    })
    // 不使用await 或者进行异步处理 将会是一个promise对象  不需要对session的数据进行再复制 他会自己更新最新数据
    // console.log(await User.findOne({_id: _id}))
    // req.session.user = null
    // req.session.user = await User.findOne({_id: _id})
    // console.log(req.session.user)
}

function getUserInfo(req, res, next) {
    // 路由拦截 并重定向到 登陆页面
    if (!req.session.user)
        return res.status(200).redirect('/login')

    User.findOne({_id: req.session.user._id}, function (err, data) {
        if (err)
            return next(err)

        let userInfo = data
        userInfo._birthday = moment(userInfo.birthday).format("YYYY-MM-DD")

        res.render('./settings/profile.html', {
            url: req.url,
            user: userInfo,
            id: userInfo.id
        })
    })

}

async function editPassword(req, res, next) {
    if (!req.session.user)
        return res.status(403).redirect('/403')
    const oldPassword = md5(md5(req.body.oldPassword))
    try {
        if (!await User.findOne({_id: req.params.id, password: oldPassword}))
            return res.status(200).json({
                err_code: 0,
                message: '当前密码输入错误！'
            })
        // console.log('匹配成功！')

        // 这一步由于前面已经做了做了表单密码二次验证,可以不用写
        // if (req.body.confirmPassword !== req.body.newPassword)
        //     return res.state(200).json({
        //         err_code: 1,
        //         message: '两次密码输入不一致！'
        //     })
        const newPassword = md5(md5(req.body.newPassword))
        User.findByIdAndUpdate(req.params.id, {password: newPassword}, (err) => {
            if (err)
                return next(err)

            userOnline.delete(req.session.user.nickname)
            req.session.user = null

            res.status(200).json({
                err_code: 2,
                message: '密码修改成功！'
            })

        })
    } catch (err) {
        next(err)
    }
}

function CancelUser(req, res, next) {
    if (!req.session.user)
        return res.status(403).redirect('/403')
    // console.log(req.params.id)
    const id = req.params.id
    User.deleteOne({_id: id}, function (err) {
        if (err)
            return next(err)
        // 清除登陆状态，重定向至首页
        req.session.user = null
        res.status(200).json({
            err_code: 200,
            message: '注销账号成功！'
        })
    })
}

function getMyCollections(req, res,next) {
    if (!req.session.user)
        return res.status(200).redirect('/login')
    const userName = req.session.user.nickname
    Attention.find({userName: userName},function (err,data) {
        if (err)
            return next(err)

        res.status(200).render('./settings/myCollections.html', {
            url: req.url,
            collections: data
        })
    })
}

function getAdminPage(req, res) {
    if (!req.session.user)
        return res.status(200).redirect('/login')
    res.render('./settings/admin.html', {
        url: req.url,
        user_id: req.session.user._id
    })
}

function getUserTopics(req, res, next) {
    if (!req.session.user)
        return res.status(200).redirect('/login')
    const id = req.session.user._id
    Topics.find({userId: id}, function (err, data) {
        if (err)
            return next(err)
        // 处理时间格式
        data.forEach((value) => {
            value._created_time = moment(value.created_time).format("YYYY-MM-DD HH:mm")
            value._last_modified_time = moment(value.last_modified_time).format("YYYY-MM-DD HH:mm")
            value._pageviews = parseInt(value.pageviews)
        })
        data.reverse()
        res.status(200).render('./settings/myTopics.html', {
            url: req.url,
            topics: data
        })
    })

}

function deleteTopics(req, res, next) {
    if (!req.session.user)
        return res.status(403).redirect('/403')
    const id = req.params.id
    Topics.deleteOne({_id: id}, function (err) {
        if (err)
            return next(err)
        res.status(200).json({
            err_code: 200,
            message: '话题删除成功！'
        })
    })
}

function editTopicsInfo(req, res, next) {
    if (!req.session.user)
        return res.status(403).redirect('/403')
    const id = req.query.id
    Topics.findOne({_id: id}, function (err, data) {
        if (err)
            next(err)
        res.status(200).render('./topic/edit.html', {
            topic: data
        })
    })
}

function editTopics(req, res, next) {
    if (!req.session.user)
        return res.status(403).redirect('/403')
    const id = req.params.id
    let editData = req.body
    editData.last_modified_time = new Date()
    Topics.findByIdAndUpdate(id, editData, function (err) {
        if (err)
            next(err)
        res.status(200).json({
            err_code: 200,
            message: '话题信息修改成功！'
        })
    })
}

function getOnlineUsers(req, res) {
    let Userlist = Array.from(userOnline)
    res.render('./settings/onlineUsers.html', {
        onlineUsers: Userlist
    })
}

function getUserHomepage(req, res, next) {
    // const id = req.query.id
    let obj = {}
    if (req.query.id) {
        obj._id = req.query.id.replace(/"/g, '')
    } else {
        obj.nickname = req.query.name
    }
    User.findOne(obj, {password: 0}, function (err, data1) {
        if (err)
            return next(err)
        Topics.find({userId: data1.id}, function (err, data2) {
            if (err)
                return next(err)

            data2.forEach((value) => {
                value._created_time = moment(value.created_time).format("YYYY-MM-DD")
                value._pageviews = parseInt(value.pageviews)
            })
            data1._birthday = moment(data1.birthday).format("YYYY-MM-DD")
            data1._last_modified_time = moment(data1.last_modified_time).format("YYYY-MM-DD HH:mm")
            res.status(200).render('HomePage.html', {
                UserInfos: data1,
                Topics: data2
            })
        })
    })
    // res.render('HomePage.html')
}

module.exports = {
    logout: logout,
    register: register,
    login: login,
    editUserInfo: editUserInfo,
    getUserInfo: getUserInfo,
    editPassword: editPassword,
    CancelUser: CancelUser,
    getUserTopics: getUserTopics,
    getAdminPage: getAdminPage,
    getMyCollections: getMyCollections,
    deleteTopics: deleteTopics,
    editTopicsInfo: editTopicsInfo,
    editTopics: editTopics,
    getOnlineUsers: getOnlineUsers,
    getUserHomepage: getUserHomepage,
    userOnline: userOnline
}
