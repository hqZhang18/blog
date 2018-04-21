/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-08-31 10:28:11
 * @Description:  中下页面JS入口
 */
define(function(require) {
  /**
   *  引用功能模块
   */
  require('jquery')
  var util = require('util')
  var request = require('request')
  var apiURL = require('baseConfig')
  /**
   *  引入业务模块
   */
  require('popDistribute')
  var topList = require('./topList.js')
  // 引入地图图表组件
  var map = require('cqMap')
  var time = apiURL.TIME  // 时间参数默认当前月

  var Index = {
    init: function() {
      /**
       * 当缩放页面后，进行相应的缩放
       */
      window.addEventListener('resize', function() {
        util.zoom()
      })

      util.zoom()
      //请求数据
      request.sendAjax(apiURL.popDistribute + time, function(data) {
        //默认渲染--全部人口
        topList.render(data.all.areaCity.concat(data.all.mainCity))
        map(data.all)

        $('.pop-distribute-nav li').on('click',function() {
          if($(this).hasClass('active')) {
            return 
          }
          $('#popTopList').html('')
          $(this).addClass('active').siblings().removeClass('active')
          var dataType = $(this).attr('data-type')
          var filterData = data[dataType].areaCity.concat(data[dataType].mainCity)
          topList.render(filterData)
          map(data[dataType])
        })
      })
    }
  }
  return Index
})