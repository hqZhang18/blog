/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-20 09:46:48
 * @Description: 全市破案底部案件数
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-03-20 09:46:48
 */

define(function(require) {
  
  var showAll = require('../common/caseNumber.js')
  var barCharts = require('../common/barCharts.js')
  var pieCharts = require('../common/pieCharts.js')

  var width = 1050
  var height = 240
  var config = {
    width: 2300,
    height: height,
    id: '#interventionRate',
    min: 1,
    zoom: 14,
    left: 60,
    coordinate: ['130,20, 20,40, 20,220, 130,200, 220,220, 220,40', '60,20, 20,90, 60,160, 140,160, 180,90, 140,20'] , //正六边形的六个坐标点
    pointStyle: 0,
    itemStyle:{
      strokeWidth: 1,
      stroke: 'none',
      color: ['#846ffb', '#fce76e'],
      margin: {
        left: -100,
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
      left: -50,
      top: -150
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

  //饼图配置项
  var pieCfg = {
    width: width,
    height: height,
    left: 60,
    ratio: true,
    itemStyle: {
      circle: {
          fill: '#0c0e17',
          stroke: '#252a43',
          strokeWidth: 5,
          radiu: 38
        },
        polygon: {
          fill: '#40265e',
          stroke: '#d6a6ff',
          strokeWidth: 3,
          sideLength: 30
        },
        path: {
          fill: '#ab28ff'
        },
        left: 108
    },
    xText: {
      size: 36,
      color: '#6792ff',
      textAnchor: 'start',
      left: 110
    },
    grid: {  //文字离左右两边的距离
      x: 50,
      x2: 0,
      y: 45
    }
  }

  var caseNumber = {

    /**
     *  @describe [事件绑定]
     */
    bindEvent: function(){

      var dataUrl = window.BASEURL + 'cityDetection/caseNumber'
      //发案数排行榜查看全部
      var pasTop5 = $('#pasTop5').find('.all')
      
      //破发比排行榜查看全部
      var pfbTop5 = $('#pfbTop5').find('.all')
     
      var showAlls = [
        {
          elem: pasTop5,
          type: 2,
          title: '破案数排行榜',
          ratio: false
        },{
          elem: pfbTop5,
          type: 1,
          title: '破/发案比排行榜',
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
      
      var _slef = this

      _slef.bindEvent()  
      var incidenceNumber =  data.incidenceNumber   //破案数
      var burstRatio = data.burstRatio  //破/发比
      barCharts.drawPolygonBar('#caseNumber', incidenceNumber, config) 
      // 破发比暂不显示
     // pieCharts.drawPie('#interventionRate', burstRatio, pieCfg) 

    }
  }

  return caseNumber

})