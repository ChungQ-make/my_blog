
// 这里是 论坛反馈的数据模型

/* 创建 attention 关注收藏 的数据模型  */

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const feedbackSchema = new Schema({
    content:{
        type: String,
        required: true
    },
    created_time:{
        type: Date,
        default: new Date
    }
})

module.exports = mongoose.model('Feedback', feedbackSchema)
