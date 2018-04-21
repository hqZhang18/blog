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
        this.bindEvent()
      },

      /**
       *  事件绑定
       */
      bindEvent: function() {
        var time = 'year'
        var contents = $('#xinjiang').contents().find('.select-time')
        // 点击时间轴
        contents.off('click', 'a').on('click', 'a', function(event) {
          $(this).addClass('current').siblings().removeClass('current')
          var index = $(this).index()
          switch(index) {
            case 0: 
              time = 'year'
              break;
            case 1: 
              time = 'week'
              break;
            case 2:
              time = 'day'
              break;
            default:
              break;   
          }
          // 调用人员流动
        })
      }
    }
    return index
})