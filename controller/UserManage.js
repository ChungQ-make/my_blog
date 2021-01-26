// 负责处理用户登陆、注册、信息密码修改的业务模块
const md5 = require('blueimp-md5')
const User = require('../models/user')
const moment = require('moment')

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

        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
}

function logout(req, res) {
    //    清除session（登陆状态）
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
    const _id = req.params.id
    const editData = req.body
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

async function getUserInfo(req, res, next) {
    let data = await User.findOne({_id: req.session.user._id}, function (err) {
        if (err)
            return next(err)
    })
    let userInfo = await data
    userInfo._birthday = moment(userInfo.birthday).format("YYYY-MM-DD")
    return userInfo
}

async function editPassword(req, res, next) {
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
    const id = req.params.id
    User.remove({_id: id}, function (err) {
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

module.exports = {
    logout: logout,
    register: register,
    login: login,
    editUserInfo: editUserInfo,
    getUserInfo: getUserInfo,
    editPassword: editPassword,
    CancelUser: CancelUser
}
