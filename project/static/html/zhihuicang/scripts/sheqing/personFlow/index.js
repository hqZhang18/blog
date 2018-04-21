﻿/**
 * @Author:      zhanghq
 * @DateTime:    2017-08-31 14:06:08
 * @Description: 人员流动入口JS
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-31 14:06:08
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
  require('personMockData')
  // 引入业务模块
  var left = require('./left')
  var right = require('./right')
  
  var time = apiURL.TIME  // 时间参数默认当前月
  var setTime = apiURL.setTime
  
  /**
   * 请求后台接口，渲染各个模块
   *
   */
  function fetchApi(time) {
    // 获取总数统计
    request.sendAjax(apiURL.totalStatistics + time, function (data) {
      left.totalStatistics(data.total)
    })
    
    // 定时请求 获取总数统计
    setInterval(function () {
      request.sendAjax(apiURL.totalStatistics + time, function (data) {
        left.totalStatistics(data.total)
      })
    }, setTime)
    
    // 获取两个饼图数据
    request.sendAjax(apiURL.enterOutWay + time, function (data) {
      left.renderPie(data)
    })
    
    /**
     *  获取右边TOP5数据
     */
    request.sendAjax(apiURL.personTop5 + time, function (data) {
      right.init(data)
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
    
    // 调用获取数据
    fetchApi(time)
    $('.header-nav').off('click', 'a').on('click', 'a', function (evet) {
      var index = $(this).index()
      fetchApi(time)
    })
  }
  
  /**
   *  返回一个方法页面调用
   */
  var result = {
    init: init
  }
  return result
})