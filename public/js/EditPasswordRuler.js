// 这里借助 bootstrapValidator 进行表单验证 ,注意引入依赖项项时 Jquery 必须是在这些文件之前引入 ,表单验证必须在发送Ajax请求之前进行
// 关于 bootstrapValidator 的使用，参考 https://www.cnblogs.com/huangcong/p/5335376.html， 密码二次验证 http://www.79tui.com/happy/4969.html
$(function () {
    $('#editPwFrom').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            newPassword: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空！'
                    },
                    regexp: {
                        regexp: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,23}$/,
                        message: '密码只允许是字母和数字的组合'
                    },
                    stringLength: {
                        min: 6,
                        max: 15,
                        message: '密码长度必须是6至15位之间'
                    },
                    identical: {
                        field: 'confirmPassword',
                        message: '两次输入的密码不相符'
                    }

                }
            },
            confirmPassword: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空！'
                    },
                    regexp: {
                        regexp: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,23}$/,
                        message: '密码只允许是字母和数字的组合'
                    },
                    stringLength: {
                        min: 6,
                        max: 15,
                        message: '密码长度必须是6至15位之间'
                    },
                    identical: {
                        field: 'newPassword',
                        message: '两次输入的密码不相符'
                    }

                }
            }
        }
    })
})
