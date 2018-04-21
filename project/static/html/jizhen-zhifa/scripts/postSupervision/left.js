/**
 * @Author:      事后监督-左边部分
 * @DateTime:    2017-05-24 10:26:32
 * @Description: zhanghq
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-24 10:26:32
 */

define(function(require) {

 
  var left = {

    /**
     *  @describe [已结案变量统计]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    closingCount: function(data) {
      var closingCount = require('../components/objectTotal.js')
      var config = {
        width: 440,
        height: 280,
        padding: {
          top: 40,
          left: 20,
          bottom: 0 ,
          right: 10
        },
        mark: 2,
        fillImg: true,
        yAxis: {
          axisLine: {
            show: false
          },
          gridLine: {
            show: false
          },
          line: {
            show: false,
            height: 8,
            fill: '#172853',
            stroke: '#5c1e3c',
            strokeWidth: 2,
            radius: 5
          },
          ticks: 5
        },
        xText: {
          rotate: -30,
          fontSize: 20,
          x: -20
        },
        xAxis: {
          show: false
        },
        grid:{
          x: 0,
          x2: 0,
          y: 120,
          y2: 20
        }
      }
      closingCount.drawCharts('#closingCount', data, config)
      $('#closingCount .axis-x').attr('transform', 'translate(0,160)')
      $('#closingCount .group').find('text').eq(0).attr('x', '0')
    },

    /**
     *  @describe [按月统计]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    monthCount: function(data) {
      $('#monthCount').html('')
      var tpl = require('../../components/postSupervision/monthCount.tpl')
      var template = Handlebars.compile(tpl)
      var data = data.slice(0, 6)
      var html = template({
        data: data
      }) 
      $('#monthCount').html(html)
    },

    /**
     *  @describe [按季度统计]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    quarterCount: function(data){
      var tpl = require('../../components/postSupervision/quarterCount.tpl')
      var template = Handlebars.compile(tpl)
      var html = template({
        total: data.total,
        data: data.group
      }) 
      $('#quarterCount').html(html)
    },

    init: function(data) {
     
      this.closingCount(data.closingCount)
      this.monthCount(data.monthCount)
      this.quarterCount(data.quarterCount)
      
    }
  }

  return left
})