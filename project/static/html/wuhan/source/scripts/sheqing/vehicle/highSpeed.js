/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 14:35:48
 * @Description:  高速路口流量
 */
define(function(require) {
  var doubleArea = require('doubleArea')

  var highSpeed = function(data) {
    doubleArea.drawCharts('#highSpeedChart',data.highSpeed,'')
  }
  return highSpeed
})