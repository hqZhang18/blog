/**
 * @Author:      zhanghq
 * @DateTime:    2017-08-31 14:06:08
 * @Description: 人员迁徙JS入口
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-31 14:06:08
 */
define(function(require) {

    require('jquery')
    // 引入util
    var util = require('util')
    // 引入request
    var request = require('request')
    //URL接口
    var apiURL = require('baseConfig')
    // Mock数据
    require('popuMigrationData')

    var map = require('popuMigration')

    var time = apiURL.TIME  // 时间参数默认当前月
 
    // 获取地图数据
    function fetchApi(time) {
      request.sendAjax(apiURL.popuMigration + time, function(data) {
        map.init('.drawMap', data.map)
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

      // 调用获取地图数据
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