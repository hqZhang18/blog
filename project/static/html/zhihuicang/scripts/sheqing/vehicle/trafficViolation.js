/**
 * @Author:      zhanghq
 * @DateTime:    2017-09-01 17:54:18
 * @Description: Description
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-09-01 17:54:18
 */


define(function(require) {

  var lineCharts = require('lineCharts')


  function trafficViolation(data) {
 
    lineCharts.drawCharts('.country-weigui-charts', data.trafficAttribute, '')
  }


  return trafficViolation
 
})  