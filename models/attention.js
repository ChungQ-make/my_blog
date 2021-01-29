/* 创建 attention 关注收藏 的数据模型  */

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const attentionSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    topicId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    topicName: {
        type: String,
        required: true
    },
    auther:{
        type: String,
        required: true
    },
    Topic_type: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Attention', attentionSchema)
