const express = require('express')
const FeedbackRouter = express.Router()
const Feedback = require('../controller/FeedbackManage')

FeedbackRouter.get('/feedback', function (req, res, next) {
    Feedback.getFeedbacks(req,res,next)
})

FeedbackRouter.get('/Feedback/send', function (req, res, next) {
    Feedback.sendFeedbacks(req,res,next)
})


module.exports = FeedbackRouter
