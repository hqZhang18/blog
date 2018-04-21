/**
 * @Author:      zhanghq
 * @DateTime:    2017-09-11 20:54:44
 * @Description: Description
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-09-11 20:54:44
 */

define(function (require) {
  
  // 引入模版库文件
  require('handlebars')
  
  var lineCharts = require('lineCharts')
  var barCharts2 = require('barCharts2')
  
  /**
   *  加载tpl模板
   */
  function loadTemplate(data) {
    
    data.passCheck.map(function (d, i) {
      var index = i % 2
      d.i = index
      d.fullName = d.name
      d.name = d.name.length > 5 ? d.name.substr(0, 5) + '…' : d.name
    })
    var tpl = require('../../../templates/qinqing/server/list.tpl')
    var myTemplate = Handlebars.compile(tpl)
    $('.page-top-total').html(myTemplate(data))
  }
  
  
  /**
   * 渲染服务数量
   * @param  {array} data 服务数量(同比/环比)数据
   */
  function renderServerNumber(data) {
    var config = {
      width: 962,
      itemStyle: [{
        areaPath: {
          fill: ['#4adbfd', '#d93a7b'],
          stroke: 'none',
          strokeWidth: 1,
        },
        linePath: {
          fill: 'none',
          stroke: '#4adbfd',
          strokeWidth: 3,
        },
      }, {
        areaPath: {
          fill: ['#4adbfd', '#d93a7b'],
          stroke: 'none',
          strokeWidth: 1,
        },
        linePath: {
          fill: 'none',
          stroke: '#d93a7b',
          strokeWidth: 3,
        },
      }
      ],
      lineMark: {
        type: 2, // 1是小菱形， 2是圆点
      },
      xText: {
        fill: ['#4adbfd', '#d93a7b'],
        fontSize: 27,
        textAnchor: 'middle',
        margin: {
          bottom: 10
        }
      }
    }
    lineCharts.drawCharts('.server-number-charts', data, config)
  }
  
  function renderRegionDistribution(data) {
    barCharts2.drawCharts('.region-distribution-charts', data, '')
  }
  
  
  /**
   *  返回方法页面调用
   */
  var result = {
    loadTemplate: loadTemplate,
    renderServerNumber: renderServerNumber,
    renderRegionDistribution: renderRegionDistribution
    
  }
  return result
  
})