/**
 * @Author XieYang
 * @DateTime 2017/8/31 13:26
 * @Description 案件模块
 * @LastModifiedBy
 * @LastModifiedTime
 */

define(function (require) {
  require('jquery')
  require('handlebars')
  require('lodash')
  require('d3')
  var request = require('request')
  var baseConfig = require('baseConfig')
  var util = require('util')
  
  var time = baseConfig.TIME  // 时间参数默认当前月
  
  //图表
  var fillBar = require('fillBarChart')
  
  //Mock数据
  require('polCloDataCollection')
  require('views')
  
  var tpl = require('../../../templates/qinqing/informationSystem/index.tpl')
  $('.box').prepend(tpl)
  
  return {
    /**
     * 渲染模版
     */
    render: function () {
      $('.informationSystem').html(tpl)
      
      var date
      
      function gDate() {
        date = new Date()
        $('.date').text(formateDate(date.getHours()) + ':' + formateDate(date.getMinutes()) + ':' + formateDate(date.getSeconds()))
      }
      
      gDate()
      
      function formateDate(t) {
        if (t < 10) {
          return '0' + t
        }
        return t
      }
      
      setInterval(function () {
        gDate()
      }, 1000)
    },
    
    calcValue: function (value) {
      if (value < 1000000) {
        return value
      } else {
        var spliteValue;
        if (value > 999999 && value <= 99999999) {
          if (value > 9999999) {
            value = ((value / 10000).toFixed(1)) + '<span class="unit">万</span>'
          } else {
            value = ((value / 10000).toFixed(2)) + '<span class="unit">万</span>'
          }
        } else if (value > 99999999) {
          value = ((value / 100000000).toFixed(2)) + '<span class="unit">亿</span>'
        }
        spliteValue = (value).split('.');
        return spliteValue[0] + '<span class="point">.</span>' + spliteValue[1]
      }
    },
    /**
     * 渲染警务云数据资源采集量、渝警飞度访问量和警综平台访问量共3个模块
     *
     * @param {array} data 列表数据
     *
     */
    renderPolDataCollection: function (data) {
      if (data.polCloDataCollection) {
        $('.polCloDataCollection .tspan').html(this.calcValue(data.polCloDataCollection.total))
      }
      if (data.policeFitVisit) {
        $('.policeFitVisit .tspan').html(this.calcValue(data.policeFitVisit.total))
      }
      if (data.policePlatformAccess) {
        $('.policePlatformAccess .tspan').html(this.calcValue(data.policePlatformAccess.total))
      }
    },
    
    /**
     * 渲染资源采集量模块
     *
     * @param {array} data 列表数据
     *
     */
    renderResourceCollection: function (data) {
      var config = {
        gradient: {
          id: 'linearColor1'
        }
      }
      fillBar.drawCharts('.resourceCollection', data, config)
    },
    
    /**
     * 渲染渝警飞度搜索量模块
     *
     * @param {array} data 列表数据
     *
     */
    renderFitSearchVolume: function (data) {
      var config = {
        gradient: {
          id: 'linearColor2'
        }
      }
      fillBar.drawCharts('.fitSearchVolume', data, config)
    },
    
    /**
     * 渲染警综待办量模块
     *
     * @param {array} data 列表数据
     *
     */
    renderAlertBacklog: function (data) {
      var config = {
        gradient: {
          id: 'linearColor3'
        }
      }
      fillBar.drawCharts('.alertBacklog', data, config)
    },
    
    init: function () {
      /**
       * 当缩放页面后，进行相应的缩放
       */
      window.addEventListener('resize', function () {
        util.zoom()
      })
      
      util.zoom()
      
      this.getApi()
    },
    getApi: function () {
      var self = this
      
      self.render()
      
      request.sendAjax(baseConfig.polCloDataCollection + time, function (data) {
        self.renderPolDataCollection(data)
        self.renderResourceCollection(data.polCloDataCollection.unit)
      })
      
      request.sendAjax(baseConfig.views + time, function (data) {
        self.renderPolDataCollection(data)
        self.renderFitSearchVolume(data.policeFitVisit.unit)
        self.renderAlertBacklog(data.policePlatformAccess.unit)
      })
    }
  }
})