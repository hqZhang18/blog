/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-20 09:46:48
 * @Description: 底部案件数
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-03-20 09:46:48
 */

define(function(require) {

  var showAll = require('../common/caseNumber.js')
  var barCharts = require('../common/barCharts.js')
  var gauge = require('../common/gauge.js')  //人均办案top5

  var width = 800
  var height = 210
  var config = {
    width: width,
    height: height,
    ratio: true,
    id: '#interventionRate',
    min: 1,
    zoom: 14,
    left: 20,
    coordinate: ['130,20, 20,40, 20,220, 130,200, 220,220, 220,40', '60,20, 20,90, 60,160, 140,160, 180,90, 140,20'] , //正六边形的六个坐标点
    pointStyle: 0,
    itemStyle:{
      strokeWidth: 1,
      stroke: 'none',
      color: ['#846ffb', '#fce76e'],
      margin: {
        left: -90,
        bottom:8,
      },
      emphasis: {  //强调样式
        color: ['#c9ff4c', '#d63200'],
        borderColor: '#c9ff4c'
      }
    },
    xText: {
      size: 36,
      color: '#6792ff',
      textAnchor: 'start',
      left: 0,
      top: -120
    },
    yAxis: {
      show: true
    },
    xAxis: {
      color: '#fff'
    },
    grid: {  //文字离左右两边的距离
      x: 0,
      x2: 0,
      y: 45
    }
  }

  //仪表盘配置
   var gaugeCfg = {
      id: 'averageHandling',
      color: ['rgb(13, 126, 215)', 'rgb(237, 242, 212)'],
      radius: 50,
      barWidth: 20,
      series: {
        center: ["50%", "67%"]
      }
   }

   var gaugeCfg2 = {
      id: 'caseNumber',
      color: ['rgb(214, 104, 255)', 'rgb(14, 125, 209)'],
      radius: 50,
      barWidth: 20,
      series: {
        center: ["50%", "67%"]
      }
   }
  var caseNumber = {

    /**
     *  @describe [事件绑定]
     */
    bindEvent: function(){
      //各支队在侦案件数
      var dataUrl =  window.BASEURL + 'takeCase/caseNumber'
      
      //案件数top5查看全部
      var interventionRate = $('#jieanRate').find('.all')
      var caseNumber = $('#paTotalTop5').find('.all')
      var averageHandling = $('#aHandling').find('.all')

      var showAlls = [
        {
          elem: averageHandling,
          type: 1,
          title: '人均办案数排行榜',
          ratio: false
        },{
          elem: interventionRate,
          type: 2,
          title: '接案介入率排行榜',
          ratio: true
        },{
          elem: caseNumber,
          type: 3,
          title: '各类案件数量排行榜',
          ratio: false
        }
      ]
      
       showAll.init(showAlls, dataUrl)
    },

    /**
     *  @describe [案件数量初始化]
     *  @param    {[type]}   data          [案件数量数据]
     */
    init: function(data){
      var _self = this
      _self.bindEvent()
      
      var averageHandling =  data.averageHandling   //人均办案数
      var interventionRate = data.interventionRate  //接案介入率TOP5
      var casesNumTotal = data.casesNumTotal //各类案件数量TOP5

      gauge.init(averageHandling, gaugeCfg)  
      barCharts.drawPolygonBar('#interventionRate', interventionRate, config) 
      gauge.init(casesNumTotal, gaugeCfg2) 
      
    }
  }

  return caseNumber

})