// 多路由合并

const TopicRouter = require('./TopicRouter')
const UserRouter = require('./UserRouter')
const CommentRouter = require('./CommentRouter')
const AttentionRouter = require('./AttentionRouter')
module.exports = {
    TopicRouter: TopicRouter,
    UserRouter: UserRouter,
    CommentRouter: CommentRouter,
    AttentionRouter: AttentionRouter
}
