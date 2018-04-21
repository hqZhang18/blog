/**
 * @Author:      zhanghq
 * @DateTime:    2017-09-11 13:57:02
 * @Description: 警力相关
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-09-11 13:57:02
 */

define(function (require) {
  
  require('jquery')
  // 引入util
  var util = require('util')
  // 引入request
  var request = require('request')
  //URL接口
  var apiURL = require('baseConfig')
  // 引入mocke数据
  require('policeMockData')
  // 引入业务模块
  var top = require('./top')
  var bottom = require('./bottom')
  
  
  var time = apiURL.TIME  // 时间参数默认当前月
  
  /**
   * 请求后台接口，渲染各个模块
   *
   */
  function fetchApi(time) {
    // 警力分类
    request.sendAjax(apiURL.policeStrength + time, function (data) {
      top.renderPoliceStrength(data.policeStrength)
    })
    
    // 警车类型
    request.sendAjax(apiURL.policeCar + time, function (data) {
      top.renderPoliceCar(data.policeCar)
    })
    
    // 警员年龄段分布
    request.sendAjax(apiURL.policeAge + time, function (data) {
      top.renderPoliceAge(data.policeAge)
    })
    
    request.sendAjax(apiURL.districtStatistics + time, function (data) {
      // 加载底部tpl模板
      bottom.loadTemplate(data.districtStatistics)
    })
  }
  
  /**
   *  初始化方法
   */
  function init() {
    /**
     * 当缩放页面后，进行相应的缩放
     */
    window.addEventListener('resize', function () {
      util.zoom()
    })
    util.zoom()
    // 加载顶部tpl模板
    top.loadTemplate()
    
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