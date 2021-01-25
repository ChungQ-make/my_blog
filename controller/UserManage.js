// 负责处理用户登陆、注册、信息密码修改
const md5 = require('blueimp-md5')
const User = require('../models/user')
const moment = require('moment')

function login(req, res, next) {
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

async function editUserInfo(req, res, next) {
    const _id = req.params.id
    const editData = req.body
    try {
        User.findByIdAndUpdate(_id, editData, (err) => {
            if (err)
                return next(err)
            res.status(200).json({
                err_code: 0,
                message: '修改成功！'
            })

        })
        // 不使用await 或者进行异步处理 将会是一个promise对象
        // console.log(await User.findOne({_id: _id}))
        // req.session.user = null
        // req.session.user = await User.findOne({_id: _id})
        // console.log(req.session.user)
    } catch (err) {
        next(err)
    }
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

module.exports = {
    logout: logout,
    register: register,
    login: login,
    editUserInfo: editUserInfo,
    getUserInfo: getUserInfo
}
