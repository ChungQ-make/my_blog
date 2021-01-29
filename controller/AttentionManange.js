// 负责处理 关注收藏 的业务模块

const Attention = require('../models/attention')
const Topic = require('../models/topic')

async function checkAttention(req, res, next) {
    if (!req.session.user)
        return res.status(403).redirect('/403')
    // 这里进行对数据进行解构赋值，去除无关数据
    let {topicName, topicId, userId, auther, Topic_type} = req.query
    let attentionData = {
        userId: userId,
        topicId: topicId,
        topicName: topicName,
        userName: req.session.user.nickname,
        Topic_type: Topic_type,
        auther: auther
    }
    try {
        if (req.query.falg === 'true') {
            if (!await new Attention(attentionData).save())
                return next(err)
            // 更新关注数
            const attention = await Attention.find({topicId: topicId})
            const concerns = attention.length
            await Topic.findByIdAndUpdate(topicId, {concerns: concerns})

            return res.status(200).json({
                err_code: 0,
                message: '关注成功！'
            })
        } else {
            if (await Attention.deleteOne({userId: userId, topicId: topicId})) {
                // console.log('delete success')
                const attention = await Attention.find({topicId: topicId})
                const concerns = attention.length
                await Topic.findByIdAndUpdate(topicId, {concerns: concerns})
                return res.status(200).json({
                    err_code: 1,
                    message: '已取消关注！'
                })
            }
        }
    } catch (err) {
        next(err)
    }
}


module.exports = {
    checkAttention: checkAttention
}
