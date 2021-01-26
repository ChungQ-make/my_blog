/* 创建topic 话题的数据模型  */

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const topicSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    auther: {
        type: String,
        required: true
    },
    titel: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    Topic_type: {
        type: String,
        default: '分享'
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: '/public/img/avatar-default.png'
    },
    // 评论数
    commentNum: {
        type: Number,
        default: 0
    },
    // 关注数
    concerns: {
        type: Number,
        default: 0
    },
    // 浏览量
    pageviews: {
        type: Number,
        default: 0
    }
})


module.exports = mongoose.model('Topic', topicSchema)
