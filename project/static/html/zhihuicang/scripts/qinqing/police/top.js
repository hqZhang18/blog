/**
 * @Author:      zhanghq
 * @DateTime:    2017-09-11 14:13:24
 * @Description: 顶部（警力分类、警车类型、警员年龄段分布）
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-09-11 14:13:24
 */

define(function (require) {
  // 引入模版库文件
  require('handlebars')
  // 图例模板
  var legendTpl = require('../../../templates/qinqing/police/legend.tpl')
  var legend = Handlebars.compile(legendTpl)

  // 饼图图表组件
  var pieCharts = require('personTypePie')
  var config = {
    width: 1064,
    height: 763,
    line: { // 是否显示指示线
      show: false
    },
    itemStyle: {
      innerRadius: 135,
      outerRadius: 180,
      colors: ['#38f3ff', '#fff838', '#da2c59', '#4088ff', '#9f2cda'],
      ratio: false,
      isDy: true // 文字重叠计算
    },
    text: {
      fontSize: 30
    }
  }
  
  /**
   *  加载tpl模板
   */
  function loadTemplate() {
    var tpl = require('../../../templates/qinqing/police/top.tpl')
    var myTemplate = Handlebars.compile(tpl)
    $('.page-top').html(myTemplate)
  }
  
  /**
   *  渲染警力分类
   *  @param    {[type]}  data [description]
   */
  function renderPoliceStrength(data) {
    // 饼图配置项
    var config = {
      width: 1064,
      height: 763,
      line: {
        show: false
      },
      itemStyle: {
        innerRadius: 135,
        outerRadius: 180,
        colors: ['#38f3ff', '#fff838', '#da2c59', '#4088ff', '#9f2cda'],
        ratio: false,
        isDy: true // 文字重叠计算
      },
      text: {
        fontSize: 30
      }
    }
    pieCharts.drawCharts('.police-strength-charts', data, config)
    // 添加图例
    var colors = config.itemStyle.colors
    var nData = formatData(data, colors)
    $('.police-strength-charts').append(legend({
      data: nData
    }))
  }

  /**
   *  给数据添加color
   *  @param    {array}  data   数据
   *  @param    {array}  colors 颜色
   *  @return   {array}  添加颜色后的数据
   */
  function formatData(data, colors) {
    var newData = []
    data.map(function(d, i) {
      newData.push({
        name: d.name,
        value: d.value,
        color: colors[i]
      })
    })
    return newData
  } 
  
  /**
   *  渲染警车类型
   *  @param    {[type]}  data [description]
   *  @return   {[type]}  [description]
   */
  function renderPoliceCar(data) {
    var config = {
      width: 1064,
      height: 763,
      line: {
        show: false
      },
      itemStyle: {
        innerRadius: 135,
        outerRadius: 180,
        colors: ['#38f3ff', '#fff838', '#da2c59', '#4088ff', '#9f2cda'],
        ratio: false,
        lineW: 80,
        isDy: false // 文字重叠计算
      },
      text: {
        fontSize: 30,
        dy: 2.8
      }
    }
    pieCharts.drawCharts('.police-car-charts', data, config)
    // 添加图例
    var colors = config.itemStyle.colors
    var nData = formatData(data, colors)
    $('.police-car-charts').append(legend({
      data: nData
    }))
  }
  
  /**
   *  渲染警员年龄段分布
   *  @param    {[type]}  data [description]
   *  @return   {[type]}  [description]
   */
  function renderPoliceAge(data) {
    pieCharts.drawCharts('.police-age-charts', data, config)
    // 添加图例
    var colors = config.itemStyle.colors
    var nData = formatData(data, colors)
    $('.police-age-charts').append(legend({
      data: nData
    }))
  }
  
  
  /**
   *  返回方法页面调用
   */
  var result = {
    loadTemplate: loadTemplate,
    renderPoliceStrength: renderPoliceStrength,
    renderPoliceCar: renderPoliceCar,
    renderPoliceAge: renderPoliceAge
  }
  return result
  
})