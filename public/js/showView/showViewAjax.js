$('#commentForm').on('submit', function (e) {
    e.preventDefault()
    var formData = $(this).serialize()
    var url = '/topics/info?id={{ topic._id }}'
    url.replace(/&#34;/gi, '')
    $.ajax({
        type: 'get',
        url: '/comment/submit',
        dataType: 'json',
        data: formData,
        success: function (res) {
            if (res.err_code === 1) {
                window.alert('请不要回复空内容！')
            } else {
                window.alert('回复成功！')
                window.location.reload()
            }
        }
    })
})

$('#Attention').on('click', function () {
    // console.log($(this).prop('checked'))
    var isAttention = $(this).prop('checked')
    var data = {
        topicId: '{{ topic.id }}',
        topicName: '{{ topic.titel }}',
        userId: '{{ topic.userId }}',
        auther: '{{ topic.auther }}',
        Topic_type: '{{ topic.Topic_type }}',
        falg: isAttention
    }
    $.ajax({
        type: 'get',
        url: '/attention',
        data: data,
        dataType: 'json',
        success: function (res) {
            if (res.err_code === 0) {
                window.alert('关注成功！')
                window.location.reload()
            } else if (res.err_code === 1) {
                window.alert('已取消关注')
                window.location.reload()
            } else if (res.err_code === 2) {
                window.alert('已经关注了')
                window.location.reload()
            }
        }
    })
})

function removeComment(id) {
    // console.log('要删除评论的ID：', id)
    // 前端考虑到兼容问题，尽量不使用像模板字符串，这些Est6新语法
    var url = '/comment/delete/' + id
    if (window.confirm('确认删除这条评论吗？')) {
        $.ajax({
            type: 'delete',
            url: url,
            success: function (res) {
                if (res.err_code !== 200) {
                    window.alert('删除失败！请重试')
                } else {
                    window.location.reload()
                }
            }
        })
    }
}
