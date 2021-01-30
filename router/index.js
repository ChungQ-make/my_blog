// 多路由合并

const TopicRouter = require('./TopicRouter')
const UserRouter = require('./UserRouter')
const CommentRouter = require('./CommentRouter')
const AttentionRouter = require('./AttentionRouter')
const FeedbackRouter = require('./FeedbackRouter')


module.exports = {
    TopicRouter: TopicRouter,
    UserRouter: UserRouter,
    CommentRouter: CommentRouter,
    AttentionRouter: AttentionRouter,
    FeedbackRouter: FeedbackRouter
}
