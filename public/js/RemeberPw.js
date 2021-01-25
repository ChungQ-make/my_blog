//保存到cookie
function save_cookies() {
    // console.log('starting!!!!')
    if ($("#remember").prop("checked")) {
        var email = $("#email").val()
        var password = $("#password").val()

        $.cookie("remember", "true", {expires: 7})
        $.cookie("email", email, {expires: 7})
        // 这里使用base64 进行加密
        $.cookie("password", $.base64.encode(password), {expires: 7})
    } else {
        $.cookie("remember", "false", {expires: -1})
        $.cookie("email", "", {expires: -1})
        $.cookie("password", "", {expires: -1})
    }
}
