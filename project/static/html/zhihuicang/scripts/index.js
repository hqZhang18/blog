/**
 * @Author:      zhanghq
 * @DateTime:    2017-09-05 16:35:28
 * @Description: 社情六个页面合成页
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-09-06 16:35:28
 */
define(function(require) {
    require('jquery')

    var PAGE_WIDTH = 10368
    var PAGE_HEIGHT = 3888

    var util = require('./common/util')

    var index = {

      /**
       *  初始化方法
       */
      init: function() {
        /**
         * 当缩放页面后，进行相应的缩放
         */
        window.addEventListener('resize', function(){
            util.zoom(PAGE_WIDTH, PAGE_HEIGHT)
        })
        util.zoom(PAGE_WIDTH, PAGE_HEIGHT)
      }
    }
    return index
})