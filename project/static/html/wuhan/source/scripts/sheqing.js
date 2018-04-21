/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 09:49:09
 * @Description:  合并页面的JS
 */
define(function(require) {
    require('jquery')
    var util = require('./common/util')
     
    var index = {
        init: function() {
            /**
           * 当缩放页面后，进行相应的缩放
           */
            util.zoom()
            window.addEventListener('resize', function(){
                util.zoom()
            })

            var pageIndex = 1
            var renderPage = 0
            var pageLength = $('[data-page]').length
            
            $('.triangle-left').click(function() {
                renderPage = parseInt(renderPage,10) - 1 <= 0 ? pageLength - 1 : parseInt(renderPage,10) - 1
                $('[data-page]').eq(renderPage).show().siblings('[data-page]').hide()
                console.log(renderPage)

            })
            $('.triangle-right').click(function(){
                renderPage = parseInt(renderPage,10) + 1 >= pageLength ? 0 : parseInt(renderPage,10) + 1
                $('[data-page]').eq(renderPage).show().siblings('[data-page]').hide()
                console.log(renderPage)
            })

            window.frames[0].document.onmousemove = function(e) {
                var e = window.frames[0].event || window.frames[0].window.event
                if(e.clientX <document.body.clientWidth*19/20&&e.clientX > document.body.clientWidth*1/20) {
                    $(".nav-hover-box").css("display","none")
                }else{
                    $(".nav-hover-box").css("display","block")
                }
             }
        }
    }
    return index
})