//public/js/common.js
; (function ($) {
    //登录面板和注册面板的相互切换
    var $loginWrap = $('.login-wrap')
    var $registerWrap = $('.register-wrap')
    // 切换到注册面板
    $('#goto-register').on('click', function () {
        $loginWrap.hide()
        $registerWrap.show()
    })
    //切换到登录面板
    $('#goto-login').on('click', function () {
        $registerWrap.hide()
        $loginWrap.show()
    })
    // 公用的验证正则
    //用户名以英文字符开头,总共3-6个字符包括数字英文和下划线
    var userName = /^[a-z][a-z0-9_]{2,5}$/
    //密码为3-6个任意字符
    var passWord = /^\w{3,6}$/
    //注册账号
    $('#sub-register').on('click', function () {
        var regInputUsername = $('#regInputUsername').val()
        var regInputPassword = $('#regInputPassword').val()
        var regInputRelPassword = $('#regInputRelPassword').val()
        // 验证账号
        var errMsg = ''
        if (!userName.test(regInputUsername)) {
            errMsg = '用户名以英文字符开头,总共3-6个字符包括数字英文和下划线'
        } else if (!passWord.test(regInputPassword)) {
            errMsg = '密码为3-6个任意字符'
        } else if (regInputPassword != regInputRelPassword) {
            errMsg = '两次输入的密码不一致'
        }
        if (errMsg) {
            // 验证不通过
            $('.text-danger').html(errMsg)
            return
        }
        //验证通过
        $('.text-danger').html('')
        $.ajax({
            url: '/users/register',
            type: 'POST',
            dataType: 'json',
            data: {
                userName: regInputUsername,
                passWord: regInputPassword
            },
            success: function (result) {
                console.log(result)
            },
            error: function () {
                console.log('注册失败,客户端问题')
            }
        })
    })
})(jQuery)