/**
 * @Author:      zhanghq
 * @DateTime:    2017-08-31 15:43:12
 * @Description: 人员流动右边部分
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-31 15:43:12
 */

define(function (require) {
  
  require('d3')
  // 引入模版库文件
  require('handlebars')
  // 人员类型
  var barCharts1 = require('barCharts1')
  var triangleCharts = require('triangleCharts')
  
  /**
   *  人员迁入原因TOP5
   *  @example: [example]
   *  @param    {array}  data 数据
   */
  function personIngoingReason(data) {
    barCharts1.drawCharts('.ingoing-reason-charts', data, '')
  }
  
  function personIngoingLand(data) {
    var tpl = require('../../../templates/sheqing/personFlow/personList.tpl')
    var myTemplate = Handlebars.compile(tpl)
    var valueArr = []
    data.forEach(function (d) {
      valueArr.push(d.value)
    })
    // 求最大值 
    var max = d3.max(valueArr)
    
    data.forEach(function (d) {
    // 比例尺  
    var linear = d3.scale.pow()
      .domain([0, max])
      .range([0, 100])
      .exponent(0.55) // 设置指数
 
      d.barWidth = linear(d.value)
    })
    
    $('.ingoing-land-charts').html(myTemplate({
      data: data
    }))
  }
  
  /**
   *  人员迁出地TOP5
   *  @example: [example]
   *  @param    {[type]}  data [description]
   *  @return   {[type]}  [description]
   */
  function personOutLand(data) {
    triangleCharts.drawCharts('.out-land-charts', data)
  }
  
  function init(data) {
    // 索引+1
    // 使用{{addOne @index}}
    Handlebars.registerHelper('addOne', function (index) {
      return index + 1
    })
    personIngoingReason(data.personIngoingReason)
    personIngoingLand(data.personIngoingLand)
    personOutLand(data.personOutLand)
  }
  
  
  var result = {
    init: init
  }
  return result
  
})