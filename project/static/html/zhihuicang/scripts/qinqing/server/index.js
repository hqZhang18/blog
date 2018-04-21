/**
 * @Author:      zhanghq
 * @DateTime:    2017-09-11 13:57:02
 * @Description: 服务类 
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-09-11 13:57:02
 */

define(function(require) {

    require('jquery')
    // 引入util
    var util = require('util')
    // 引入request
    var request = require('request')
    //URL接口
    var apiURL = require('baseConfig')
    // 引入mocke数据
    require('serverMockData')
    // 引入业务模块
    var renderCharts = require('./renderCharts')
 

    var time = apiURL.TIME  // 时间参数默认当前月

     /**
      * 请求后台接口，渲染各个模块
      * 
      */
    function fetchApi(time) {
      
      // 各类办理数及各类通行证办理数
      request.sendAjax(apiURL.statistics + time, function(data) {
        renderCharts.loadTemplate(data)
      })

      // 服务数量（同比/环比）
      request.sendAjax(apiURL.serverNumber + time, function(data) {
        renderCharts.renderServerNumber(data.serverNumber)
      })

      // 服务数量地区分布情况
      request.sendAjax(apiURL.regionDistribution + time, function(data) {
        renderCharts.renderRegionDistribution(data.regionDistribution)
      })
    }

    /**
     *  初始化方法
     */
    function init(){
       /**
       * 当缩放页面后，进行相应的缩放
       */
      window.addEventListener('resize', function(){
          util.zoom()
      })
      util.zoom()
      util.compare()

      // 调用获取数据
      fetchApi(time)
    }

    /**
     *  返回一个方法页面调用
     */
    var result = {
        init: init
    }
    return result
})