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
  var gauge = require('../common/gauge.js')   

  var width = 800
  var height = 210
  var config = {
    width: width,
    height: height,
    id: '#interventionRate',
    min: 1,
    zoom: 14,
    left: 20,
    ratio: true,
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
      var dataUrl =  window.BASEURL + 'detectiveCase/caseNumber'
      
      //案件数top5查看全部
      var paTotalTop5 = $('#paTotalTop5').find('.all') //破案总数
      var rjpaTop5 = $('#rjpaTop5').find('.all') //人均破案
      var pacylTop5 = $('#pacylTop5').find('.all')

      var showAlls = [
        {
          elem: paTotalTop5,
          type: 1,
          title: '破案总数排行榜',
          ratio: false
        },{
          elem: rjpaTop5,
          type: 2,
          title: '人均破案数排行榜',
          ratio: false
        },{
          elem: pacylTop5,
          type: 3,
          title: '破案参与率排行榜',
          ratio: true
        }
      ]
      
       showAll.init(showAlls, dataUrl)
    },

    /**
     *  @describe [初始化]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
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


      // barCharts.drawPolygonBar('#averageHandling', data, config)  
      // barCharts.drawPolygonBar('#caseNumber', data, config) 
      // pieCharts.drawPie('#interventionRate', data, pieCfg) 

    }
  }

  return caseNumber

})