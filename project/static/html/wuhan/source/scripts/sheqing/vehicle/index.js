/**
 * @Author:      baizn
 * @DateTime:    2017-08-31 14:06:08
 * @Description: 车辆管理
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-08-31 14:06:08
 */
define(function(require) {

    require('jquery')
 
    var util = require('util')

    var request = require('request')

    var apiURL = require('baseConfig')
    // 引入业务模块
    var renderDriver = require('./driver')
    // Mock数据
    require('vehicleData')
    var countNum = require('./countNum.js')
    var renderCarBrand = require('./carBrand.js')
    var highSpeed = require('./highSpeed.js')
    var trafficViolation = require('./trafficViolation')
    
    var time = apiURL.TIME  // 时间参数默认当前月

    var Index = {

      /**
      * 请求后台接口，渲染各个模块
      * 
      */
      fetchApi: function(time) {
        //请求数据
        request.sendAjax(apiURL.countNum + time, function(data) {
          countNum(data)
        })
        request.sendAjax(apiURL.driverData + time, function(data) {
          renderDriver(data)
        })

        // 请求汽车品牌数据
        request.sendAjax(apiURL.carBrand + time, function(data) {
          renderCarBrand(data)
        })

        request.sendAjax(apiURL.highSpeed + time, function(data) {
          highSpeed(data)
        })

        // 全市交通违规数（同比/环比）
        request.sendAjax(apiURL.trafficViolation + time, function(data) {
          trafficViolation(data)
        })
      },

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