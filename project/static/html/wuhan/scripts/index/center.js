/**
 * @Author:      总览中间部分业务代码
 * @DateTime:    2017-08-21 10:14:36
 * @Description: Description
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-21 10:14:36
 */

define(function(require) {
 

  function init(data) {
    renderDrillCount(data)
  
    // 调用事件绑定
    bindEvent()
  }

   function loadTemplate() {
    var template = require('../../templates/index/center.tpl')
    $('.page-center').html(template)
  }

  /**
   *  渲染训练总量
   *  @example: { 
   *     "total|1000-5000": 1,
   *     "police1Count|4": [
   *       {
   *         "name|+1": ["入警训练", "晋升训练", "专业训练", "发展训练"],
   *           "value|1000-2000": 1
   *        }
   *      ],
   *      "auxiliaryPoliceCount|2": [
   *        {
   *          "name|+1": ["岗前培训", "年度培训"],
   *           "value|1000-2000": 1
   *        }
   *      ]
   *  }
   *  @param    {[type]}  data  教官教材数据
   */
  function renderDrillCount(data) {
    // 渲染总量
    $('.drill-total span').text(data.total) 

    // 渲染民警训练总量图例
    var legendtpl = require('../../templates/index/chartslegend.tpl')
    var template = Handlebars.compile(legendtpl)
    $('.drill-count-chart1 .legend').html(template({
      data: data.police1Count
    }))
    // 渲染民警训练总量图
    var pieCharts = require('pieCharts')
    pieCharts.drawCharts('.police1-charts', data.police1Count, '')

    // 辅警训练总量配置项
    var config = {
      itemStyle: {
        colors: [
        {
          id: 'drill01',
          color: ['#e57f57', '#e53241']
        }, {
          id: 'drill02',
          color: ['#7918e9', '#373be9']
        }
      ]
      }
    }
    // 渲染辅警训练总量图例
    $('.drill-count-chart2 .legend').html(template({
      data: data.auxiliaryPoliceCount
    }))
    // 渲染辅警训练总量图
    pieCharts.drawCharts('.auxiliary-police-charts', data.auxiliaryPoliceCount, config)
  }

  /*
    渲染星球图
   */
  function renderPlanet(data) {
    var planetCharts = require('planetCharts')
    planetCharts.drawCharts('.planet', data, '')
  }

  /**
   *  事件绑定
   */
  function bindEvent() {
    // 点击培训总量下的三角形
    $('.total-btn').on('click', function(event) {
      event.stopPropagation()
      var style = $('.drill-count-charts').css('display')

      $('.drill-count-charts').slideToggle()
    
      // 改变箭头样式
      if(style=='block') {
        $(this).removeClass('active')
      }else {
        $(this).addClass('active')
      }
      
      
    })
  }



  /**
   *  返回一个方法页面调用
   */
  var result = {
    loadTemplate: loadTemplate,
    init: init,
    renderPlanet: renderPlanet
  }

  return result
})