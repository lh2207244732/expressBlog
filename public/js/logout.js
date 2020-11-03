//退出登录
;
(function($) {
    $('#logout').on('click', function() {
        $.ajax({
            url: '/users/logout',
            type: 'get',
            dataType: 'json',
            success: function(result) {
                console.log(result)
                    //刷新界面，返回首页
                window.location = '/'
            }
        })
    })
})(jQuery)