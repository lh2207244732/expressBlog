;
(function ($) {
    //提交评论
    $('#btn-sub-comment').on('click', function () {
        //获取评论框中的内容
        var commentVal = $('#comment-textarea').val()
        commentVal = commentVal.trim()
        //验证是否有输入的评论
        var errMsg = ''
        if (commentVal == '') {
            errMsg = '请输入评论后再提交'
        } else if (commentVal.length > 100) {
            errMsg = '评论文字应当小于100字'
        } else {
            errMsg = ''
        }
        if (errMsg) {
            $('.text-danger').html(errMsg)
            return false
        }
        var id = $(this).data('id')
        $.ajax({
            url: '/comments',
            type: 'POST',
            dataType: 'json',
            data: {
                comment: commentVal,
                article: id
            },
            success: function (result) {
                if (result.code == 0) {
                    // 添加评论成功，将评论框置空
                    $('#comment-textarea').val('')
                    //添加成功后，显示新的评论列表
                    $('#comment-page').trigger('get-data', result.data)
                }
            }
        })

    })
})(jQuery)