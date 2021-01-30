// 这里借助 bootstrapValidator 进行表单验证 ,注意引入依赖项项时 Jquery 必须是在这些文件之前引入 ,表单验证必须在发送Ajax请求之前进行
// 关于 bootstrapValidator 的使用，参考 https://www.cnblogs.com/huangcong/p/5335376.html， http://www.79tui.com/happy/4969.html

$(function () {
    $('#register_form').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            nickname: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 18,
                        message: '用户名长度必须在6到18位之间'
                    },
                    regexp: {
                        regexp: /^\S+\w{8,32}\S{1,}/,
                        message: '用户名不能包含空格和特殊字符'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: '邮箱不能为空'
                    },
                    emailAddress: {
                        message: '邮箱地址格式有误'
                    }
                }
            },
            password: {
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
                    }
                }
            }
        }
    })
})
