;
(function($) {
    $('.del').on('click', function() {
        if (!window.confirm('您确定要删除吗？')) {
            return false
        }
    })
})(jQuery)