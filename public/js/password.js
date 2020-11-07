; (function ($) {
    // 前端验证密码规则
    $('#btn-update-pwd').on('click', function () {
        //获取输入框输入的密码
        var Inputpassword = $('#password').val()
        var InputRepassword = $('#repassword').val()
        //密码为3-6个任意字符
        var passWord = /^\w{3,6}$/

        if (!passWord.test(Inputpassword)) {
            $('.text-danger').eq(0).html('密码为3-6个任意字符')
            return false
        } else {
            $('.text-danger').eq(0).html('')
        }
        if (InputRepassword != Inputpassword) {
            $('.text-danger').eq(1).html('两次输入的密码不一致')
            return false
        } else {
            $('.text-danger').eq(1).html('')
        }
    })
})(jQuery)