/* 创建 comment 评论的数据模型  */

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    sender:{
        type: String,
        required: true
    },
    recipient:{
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_time:{
        type: Date,
        default: new Date
    },
    topicId: {
        type: String,
        required: true
    },
    topicName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Comment', commentSchema)
