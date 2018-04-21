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

  var config2 = {
    width: width,
    height: height,
    id: '#caseNumber'
  }
   //仪表盘配置
   var gaugeCfg = {
      id: 'averageHandling',
      color: ['rgb(13, 126, 215)', 'rgb(237, 242, 212)'],
      radius: 50,
      barWidth: 20,
      series: {
        center: ["50%", "67%"]
      },
      rate: true
   }



  var caseNumber = {
    /**
     *  @describe [事件绑定]
     */
    bindEvent: function(){
      //各支队在侦案件数
      var dataUrl =  window.BASEURL + 'personnelFrequently/attendanceNumber'
      
      //在勤top5查看全部
      var attendanceRate = $('#attendanceRate').find('.all') // 在勤率
      var attendancePersonnel = $('#attendancePersonnel').find('.all') //在勤人员
      var vacationPersonnel = $('#vacationPersonnel').find('.all') //休假人数
      var showAlls = [
        {
          elem: attendanceRate,
          type: 1,
          title: '在勤率排行榜',
          ratio: true
        },{
          elem: attendancePersonnel,
          type: 2,
          title: '在勤人数排行榜',
          ratio: false
        },{
          elem: vacationPersonnel,
          type: 3,
          title: '休假人数排行榜',
          ratio: false
        }
      ]
      
       showAll.init(showAlls, dataUrl)
    },

    init: function(data){
      var _self = this
      _self.bindEvent()
      var averageHandling =  data.attendanceRate   //在勤率top5
      var interventionRate = data.attendancePersonnel  //在勤人员top5
      var casesNumTotal = data.participationRate //休假人员top5

      gauge.init(averageHandling, gaugeCfg)  
      barCharts.drawPolygonBar('#interventionRate', interventionRate, config) 
      barCharts.drawPolygonBar('#caseNumber', casesNumTotal, config2) 

    }
  }

  return caseNumber

})