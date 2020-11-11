//public/js/common.js
;
(function ($) {
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
            $registerWrap.find('.text-danger').html(errMsg)
            return
        }
        //验证通过
        $registerWrap.find('.text-danger').html('')
        $.ajax({
            url: '/users/register',
            type: 'POST',
            dataType: 'json',
            data: {
                userName: regInputUsername,
                passWord: regInputPassword
            },
            success: function (result) {
                //注册成功
                if (result.code == 0) {
                    //跳转登录面板
                    $('#goto-login').trigger('click')
                } else {
                    //注册失败，显示失败原因
                    $registerWrap.find('.text-danger').html(result.message)
                }
            },
            error: function () {
                console.log('注册失败,客户端问题')
            }
        })
    })
    //登录账号
    $('#sub-login').on('click', function () {
        var loginInputUsername = $('#loginInputUsername').val()
        var loginInputPassword = $('#loginInputPassword').val()
        // 验证账号
        var errMsg = ''
        if (!userName.test(loginInputUsername)) {
            errMsg = '用户名以英文字符开头,总共3-6个字符包括数字英文和下划线'
        } else if (!passWord.test(loginInputPassword)) {
            errMsg = '密码为3-6个任意字符'
        }
        if (errMsg) {
            // 验证不通过
            $loginWrap.find('.text-danger').html(errMsg)
            return
        }
        //验证通过
        $loginWrap.find('.text-danger').html('')
        $.ajax({
            url: '/users/login',
            type: 'POST',
            dataType: 'json',
            data: {
                userName: loginInputUsername,
                passWord: loginInputPassword
            },
            success: function (result) {
                if (result.code == 0) {
                    //刷新当前页面
                    window.location.reload()
                } else {
                    $loginWrap.find('.text-danger').html('登录失败，用户名或密码不正确')
                }
            },
            error: function () {
                console.log('登录失败,客户端问题')
            }
        })
    })

    //文章列表分页处理
    function buildarticlesList(articles) {
        var html = ''
        for (var i = 0, len = articles.length; i < len; i++) {
            html += `
        <div class="panel panel-default custom-panel article-panel">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <a href="/detail/${articles[i]._id}">${articles[i].title}</a>
                </h3>
            </div>
            <div class="panel-body">
                ${articles[i].introduction}
            </div>
            <div class="panel-footer">
                <span class="glyphicon glyphicon-user"></span>
                <span class="text-muted footer-text">${articles[i].author.userName}</span>
                <span class="glyphicon glyphicon-th-list"></span>
                <span class="text-muted footer-text">${articles[i].category.name}</span>
                <span class="glyphicon glyphicon-time"></span>
                <span class="text-muted footer-text">${articles[i].createTime}</span>
                <span class="glyphicon glyphicon-eye-open"></span>
                <span class="text-muted footer-text"><span class="view-num">${articles[i].click}</span>已阅读</span>
            </div>
        </div>`
        }
        return html
    }

    function buildPaginationHtml(list, page, pages) {
        var html = ''
        if (page == 1) {
            html += `<li class="disabled">`
        } else {
            html += `<li>`
        }
        html += `  <a href="javascript:;" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>`
        for (var i = 0, len = list.length; i < len; i++) {
            if (page == list[i]) {
                html += `<li class="active">`
            } else {
                html += `<li>`
            }
            html += `<a href="javascript:;">${list[i]}</a></li>`
        }
        if (page == pages) {
            html += `<li class="disabled">
        <a href="javascript:;" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
        </a>
        </li>`
        } else {
            html += ` <li>
            <a href="javascript:;" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>`
        }
        return html
    }

    var $articlesPage = $('#articles-page')
    $articlesPage.pagination({
        url: '/articlesList'
    })
    $articlesPage.on('get-data', function (ev, data) {
        //创建文章列表及渲染
        var articleHtml = buildarticlesList(data.articles)
        $('#article-wrap').html(articleHtml)
        //创建分页器列表
        if (data.pages <= 1) {
            $articlesPage.html('')
        } else {
            var PaginationHtml = buildPaginationHtml(data.list, data.page, data.pages)
            $articlesPage.find('.pagination').html(PaginationHtml)
        }
    })

    //评论列表分页处理
    function buildcommentsList(articles) {
        var html = ''
        for (var i = 0, len = articles.length; i < len; i++) {
            html += `
            <div class="col-md-12">
        <div class="text-muted comment-item">
            <p>${articles[i].content}</p>
            <p>
                <span>${articles[i].author.userName}</span> 发表于
                <span>${articles[i].createTime}</span>
            </p>
        </div>
    </div>
            `
        }
        return html
    }
    var $commentsPage = $('#comment-page')
    $commentsPage.pagination({
        url: '/commentsList'
    })
    $commentsPage.on('get-data', function (ev, data) {
        //创建评论列表
        var coomentHtml = buildcommentsList(data.docs)
        $('#comment-wrap').html(coomentHtml)
        //创建分页器列表
        if (data.totalpages <= 1) {
            $commentsPage.find('.pagination').html('')
        } else {
            var PaginationHtml = buildPaginationHtml(data.list, data.page, data.totalpages)
            $commentsPage.find('.pagination').html(PaginationHtml)
        }
    })
})(jQuery)