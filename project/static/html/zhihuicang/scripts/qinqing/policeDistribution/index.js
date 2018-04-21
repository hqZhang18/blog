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
   *  引入Mock数据
   */
  require('policeDistribution')
  /**
   *  引入业务模块
   */
  var topList = require('./topList.js')
  // 引入地图图表组件
  var map = require('cqMap')
  var time = apiURL.TIME  // 时间参数默认当前月
  var mapConfig = {
    type: 'bar'
  }

  var Index = {

    /**
     *  请求数据
     *  @param    {string}  time 时间参数
     */
    fetchApi: function(time) {
      //请求数据
      request.sendAjax(apiURL.policeDistribution + time, function(data) {
        // 渲染警力总数
        $('.police-dis-total span').text(data.policeDistribution.total)
        //默认渲染  ---全部人口
        topList.render(data.policeDistribution.areaCity.concat(data.policeDistribution.mainCity))
        // 渲染地图
        map('.all-main-city', '.all-area-city', data.policeDistribution, mapConfig)
      })
    },

    /**
     *  初始化
     */
    init: function() {
      /**
       * 当缩放页面后，进行相应的缩放
       */
      window.addEventListener('resize', function() {
        util.zoom()
      })

      util.zoom()
  
      this.fetchApi(time)
      
    }
  }
  return Index
})