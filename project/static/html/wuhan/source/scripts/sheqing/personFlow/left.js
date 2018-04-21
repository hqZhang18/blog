/**
 * @Author:      zhanghq
 * @DateTime:    2017-08-31 14:06:30
 * @Description: 人员流动左边部分
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-31 14:06:30
 */
define(function(require) {

  // 人员类型
  var personTypePie = require('personTypePie')
  // 进出方式
  var enterOutWayPie = require('enterOutWayPie')

  /**
   *  总数统计
   *  @example: [example]
   *  @param    {array}  data 数据
   */
  function totalStatistics(data) {
   
    var tpl = require('../../../templates/sheqing/personFlow/total.tpl')
    var myTemplate = Handlebars.compile(tpl)
    $('.total-statistics').html(myTemplate({
      enterTotal: data.enterTotal,
      outTotal: data.outTotal,
      totalPopu: data.totalPopu.toLocaleString(),
      residentPopu: data.residentPopu.toLocaleString(),
      temporaryPopu: data.temporaryPopu.toLocaleString()
    }))
  }

  /*
    入渝出渝定时切换
   */
  function timer() {
    var t = 0
    setInterval(function() {
      t++
      if(t%2===0) {
        $('.enter-out-way .common-title').text('入渝进出方式')
        $('.out-charts').fadeOut()
        $('.enter-charts').fadeIn()
        
      }else {
        $('.enter-out-way .common-title').text('出渝进出方式')
        $('.enter-charts').fadeOut()
        $('.out-charts').fadeIn()
      }
    }, 15000)
  }


  /**
   *  渲染两个饼图(进出方式 / 人员类型)
   *  @example: [example]
   *  @param    {[type]}  data [description]
   *  @return   {[type]}  [description]
   */
  function renderPie(data) {
    // 入渝
    enterOutWayPie.drawCharts('.enter-charts', data.enterOutWay.ruyu, '')
    // 出渝
    enterOutWayPie.drawCharts('.out-charts', data.enterOutWay.chuyu, '')
    personTypePie.drawCharts('.person-type-charts', data.personType, '')
    // 调用定时
    timer()
  }


  var result = {
    totalStatistics: totalStatistics,
    renderPie: renderPie
  }
  return result
    
})