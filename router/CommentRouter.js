const express = require('express')
const CommentRouter = express.Router()
const CommentManage = require('../controller/CommentManage')

CommentRouter.get('/comment/submit', function (req, res,next) {
    // console.log(req.query)
    CommentManage.sendComment(req,res,next)
})

module.exports = CommentRouter
