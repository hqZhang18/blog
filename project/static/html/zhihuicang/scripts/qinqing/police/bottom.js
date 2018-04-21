/**
 * @Author:      zhanghq
 * @DateTime:    2017-09-11 15:58:42
 * @Description: 公安类底部(总数+三角形图)
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-09-11 15:58:42
 */

define(function (require) {
  
  // 引入三角形图表组件
  var triangleCharts = require('triangleCharts2')
  
  /**
   *  加载tpl模板
   */
  function loadTemplate(data) {
    var tpl = require('../../../templates/qinqing/police/bottom.tpl')
    var myTemplate = Handlebars.compile(tpl)
    $('.page-bottom').html(myTemplate(data))
    
    // 调用
    
    renderAreaDistribution(data.areaDistribution)
  }
  
  /**
   *  各区县辖区公安单位数量统计
   */
  function renderAreaDistribution(data) {
    var config = {
      width: 3200,
      height: 554
    }
    triangleCharts.drawCharts('.district-statistics-charts', data, config)
  }
  
  /**
   *  返回方法页面调用
   */
  var result = {
    loadTemplate: loadTemplate
  }
  return result
})