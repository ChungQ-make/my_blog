const express = require('express')
const AttentionRouter = express.Router()
const AttentionManange = require('../controller/AttentionManange')

AttentionRouter.get('/attention',function (req,res,next) {
    AttentionManange.checkAttention(req,res,next)
})

module.exports = AttentionRouter
