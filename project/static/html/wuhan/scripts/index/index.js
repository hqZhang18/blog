/**
 * @Author:      baizn
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 测试主JS文件
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */
define(function (require) {
    require('jquery')
    
    // 引入util
    var util = require('util')
    // 引入request
    var request = require('request')
    // 引入mocke数据
    require('mockData')
    //URL接口
    var apiURL = require('baseConfig')
    // 引入业务模块
    var left = require('./left')
    var right = require('./right')
    var center = require('./center')
    
    /**
     * 获取左边的数据
     */
    function getLeftData() {
      //晋升考试合格率相关
      request.sendAjax(apiURL.civilPoliceQualification, function (data) {
          left.initCPQ(data)
      })

      //专业培训考试合格率相关
      request.sendAjax(apiURL.policeProfessionalTraining, function (data) {
          left.initPPT(data)
      })
    }

    /**
     * 获取中间的数据
     */
    function getCenterData() {
       // 获取培训总量数据
      request.sendAjax(apiURL.trainingTotal, function(data) {
        center.init(data)
      })

      // 获取中间星球 分局  
      request.sendAjax(apiURL.allSubBureau, function(data) {
        center.renderPlanet(data)
      })
    }

    /**
     *  获取右边的数据
     */
    function getRightDate() {
      // 获取教官教材数据
      request.sendAjax(apiURL.instructorMaterials, function(data) {
        right.init(data)
      })

      // 获取评估数据
      request.sendAjax(apiURL.assessment + '/0', function(data) {
        right.renderAssessment(data.assessment)
      })
    }

    /**
     *  总览页初始化
     */
    function init() {
        /**
         * 当缩放页面后，进行相应的缩放
         */
        window.addEventListener('resize', function () {
            util.zoom()
        })
        util.zoom()
 
        // 调用获取左边数据
        getLeftData()
        // 调用中间页面布局
        center.loadTemplate()
        // 调用获取中间数据
        getCenterData()
        // 调用右边页面布局
        right.loadTemplate()
        // 调用获取右边数据
        getRightDate()
        
    }

    /**
     *  返回一个方法页面调用
     */
    var result = {
        init: init
    }

    return result
})