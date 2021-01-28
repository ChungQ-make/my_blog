// 这里借助 bootstrapValidator 进行表单验证 ,注意引入依赖项项时 Jquery 必须是在这些文件之前引入 ,表单验证必须在发送Ajax请求之前进行
// 关于 bootstrapValidator 的使用，参考 https://www.cnblogs.com/huangcong/p/5335376.html，
// 密码二次验证 http://www.79tui.com/happy/4969.html
$(function () {
    $('#topicForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            titel: {
                validators: {
                    notEmpty: {
                        message: '标题不能为空！'
                    },
                    stringLength: {
                        max: 26,
                        message: '标题长度不能大于26个字符'
                    }

                }
            }
        }
    })
})
