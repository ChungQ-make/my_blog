const express = require('express')
const CommentRouter = express.Router()
const CommentManage = require('../controller/CommentManage')

CommentRouter.get('/comment/submit', function (req, res, next) {
    CommentManage.sendComment(req, res, next)
})

CommentRouter.delete('/comment/delete/:id', function (req, res, next) {
    CommentManage.removeComment(req,res,next)
})

module.exports = CommentRouter
