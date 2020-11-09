;
(function($) {
    $.fn.extend({
        pagination: function(options) {
            var $this = $(this)
            $this.find('a').on('click', function() {
                //获取当前页码数
                var currentPage = $this.find('.active a').html()
                currentPage = parseInt(currentPage)
                var $elem = $(this)
                var labelText = $elem.attr('aria-label')
                console.log(currentPage)
                console.log(labelText)

                //需要请求的页码数
                var page = $elem.html()
                page = parseInt(page)

                //判断
                //上一页
                if (labelText == 'Previous') {
                    // 如果当前页码是1则直接返回
                    if (currentPage == 1) {
                        return false
                    }
                    page = currentPage - 1
                }
                //下一页
                if (labelText == 'Next') {
                    //获取最大页码数
                    var pages = $this.find('a').eq(-2).html()
                        //如果当前页码为最大页码则直接返回
                    if (currentPage == pages) {
                        return false
                    }
                    page = currentPage + 1
                }
                //点击已选中的页码直接返回
                if (currentPage == page) {
                    return false
                }
                //发送ajax请求
                $.ajax({
                    url: options.url,
                    type: options.method,
                    data: {
                        page: page
                    },
                    dataType: 'json',
                    success: function(result) {
                        console.log(result)
                    }
                })

            })
            return this.each(function() {

            })
        }
    })
})(jQuery)