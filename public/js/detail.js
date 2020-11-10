;
(function($) {
    //提交评论
    $('#btn-sub-comment').on('click', function() {
        //获取评论框中的内容
        var commentVal = $('#comment-textarea').val()
        commentVal = commentVal.trim()
            //验证是否有输入的评论
        var errMsg = ''
        if (commentVal == '') {
            errMsg = '请输入评论后再提交'
        }
    })
})(jQuery)