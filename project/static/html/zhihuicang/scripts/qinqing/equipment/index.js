/**
 * @Author TanJun
 * @DateTime 2017/9/10 10:50
 * @Description 设备视频信息
 * @LastModifiedBy
 * @LastModifiedTime
 */

define(function (require) {
  require('jquery')
  require('handlebars')
  require('equipMockData')
  require('jquery')
  var util = require('util')
  var apiURL = require('baseConfig')
  var request = require('request')
  
  //引入图表组件
  var gradientAcross = require('gradientAcross')
  var gradientVertical = require('gradientVertical')
  var splitPie = require('splitPie')
  
  var time = apiURL.TIME  // 时间参数默认当前月
  
  return {
    /**
     * 调用数据连接获取数据
     * @param  {[type]} time 时间标识
     * @return {[type]}
     */
    fetchApi: function (time) {
      var self = this
      request.sendAjax(apiURL.bayonet + time, function (data) {
        self.renderBayonet(data.bayonet)
      })
      request.sendAjax(apiURL.tvVisitNum + time, function (data) {
        self.renderVisit(data.tvvisitnum)
      })
      request.sendAjax(apiURL.areaSpread + time, function (data) {
        self.renderSpread(data.areaspread)
      })
      request.sendAjax(apiURL.tvSource + time, function (data) {
        self.renderSource(data.tvsource)
      })
    },
    /**
     * 更新卡口数量
     * @param  {[type]} data
     * @return {[type]}
     */
    renderBayonet: function (data) {
      $('.bayonet-box .text-tap').each(function (d, i) {
        $(this).children('.text-num').html(data[d].value)
        $(this).children('.text-text').html(data[d].name)
      })
    },
    /**
     * 更新视频访问数据
     * @param  {[type]} data
     * @return {[type]}
     */
    renderVisit: function (data) {
      $('.title-sp .title-num').html(data.total)
      var config = {
        width: 700,
        height: 450,
        leftText: {
          fontSize: 26,
          color: '#00fff8',
          textAnchor: 'end'
        },
        // 右边文字配置项
        rightText: {
          fontSize: 32,
          color: '#fff',
          textAnchor: 'start'
        },
        padding: {
          top: 60,
          right: 70,
          bottom: 30,
          left: 75
        },
        itemStyle: {
          height: 22,
          // 背景色填充
          color: '#282f36',
          // 渐变配置项
          gradient: {
            color: ['#5325ed', '#b4ffff'],
            id: 'linearColor2',
            x1: '30%',
            y1: '0%',
            x2: '100%',
            y2: '0%',
            offset1: '0%',
            offset2: '100%',
            opacity1: 1,
            opacity2: 1
          }
        }
      }
      gradientAcross.drawCharts('#visit-char', data.detail, config)
    },
    /**
     * 渲染地区分布
     * @param  {[type]} data
     * @return {[type]}
     */
    renderSpread: function (data) {
      var config = {
        width: 3210,
        height: 785,
        leftText: {
          fontSize: 34,
          color: '#00fff8',
          textAnchor: 'middle'
        },
        // 右边文字配置项
        rightText: {
          fontSize: 32,
          color: '#fff',
          textAnchor: 'middle'
        },
        padding: {
          top: 220,
          right: 50,
          bottom: 130,
          left: 30
        },
        itemStyle: {
          width: 60,
          height: 26,
          // 背景色填充
          color: '#282f36',
          // 渐变配置项
          gradient: {
            color: ['#c84102', '#f9c920'],
            id: 'linearColor',
            x1: '0%',
            y1: '0%',
            x2: '0%',
            y2: '100%',
            offset1: '0%',
            offset2: '100%',
            opacity1: 1,
            opacity2: 1
          }
        }
      }
      gradientVertical.drawCharts('#area-char', data, config)
    },
    /**
     * 渲染视频来源
     * @param  {[type]} data
     * @return {[type]}
     */
    renderSource: function (data) {
      var configSource = {
        width: 829,
        height: 450,
        color: ['#ff6022', '#8122cf'],
      }
      var configBrand = {
        width: 829,
        height: 450,
        color: ['#9b25ef', '#e0be17', '#f45d23', '#0366de', '#00ffda'],
      }
      // 视频设备来源
      splitPie.drawCharts('#equip-source', data.source, configSource)
      // 视频设备品牌类型
      splitPie.drawCharts('#equip-brand', data.brand, configBrand)
    },
    init: function () {
      /**
       * 当缩放页面后，进行相应的缩放
       */
      window.addEventListener('resize', function () {
        util.zoom()
      })
      
      util.zoom()
      
      this.fetchApi(time)
      
    }
  }
})