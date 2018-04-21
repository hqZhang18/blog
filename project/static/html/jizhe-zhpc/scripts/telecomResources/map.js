/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-10 16:04:27
 * @Description: 在侦案件地图
 * @Last Modified By:   zhanghongq
 * @Last Modified Time:    2017-03-10 16:04:27
 */

define(function(require) {


  var _common = require('../common/common.js')
  

  var width = 1400
  var height = 1300

  //地图配置项
  var config = {
    width: width,
    height: height,
    id: 'telecomResourcesMap',
    area: 'chongqing',
    itemStyle: {
      fill: ['#47b7fb', '#3298f9'],
      stroke: '#a1e1ff',
      strokeWidth: 1,
      emphasis: {
        fill: '#0c3793',
        stroke: '#76c7ff',
        strokeWidth: 1
      },
      filters: {
        opacity: 0.8,
        fill: ['#023ac0', '#0232af'],
        stroke: '#011a53',
        strokeWidth: 2
      }
    },
    markPoint:{
      symbol: 'pie', //bar, pie
      width: 20,
      height: 77,
      bgimgUrl: '../images/mapBarbg.png',
      dataimgUrl: '../images/poan.png',
      imgUrlPa: '../images/poan.png',
      lineStyle: {
        url: '../images/mapbarline.png',
        width: 100,
        height: 1
      },
      hexagon:{
        circle: {
          fill: '#1981d3',
          stroke: '#2b97ed',
          strokeWidth: 6
        },
        polygon: {
          fill: '#3fb0dc',
          stroke: '#fff3b9',
          strokeWidth: 3,
          sideLength: 30
        },
        path: {
          fill: '#ffe542'
        }
      }
      
    },
    carouselPoint: {   
      symbol: 'image', //circle, image
      imgUrl: '../images/icon2.png',
      imgUrl2: '../images/icon1.png',
      width: 55,
      height: 55,
      id: 'svgIndex',
      left: 10,
      top: -20,
      tooltip: {
        left: 850,
        top: -200,
        className: 'vicoryTooltip commonVicoryT'
      },
      series: [
        {
          fill: '#194cb4',
          stroke: '#173ec7',
          radius: 55,
          opacity: 1,
          strokeWidth: 3
        },{
          fill: 'none',
          stroke: '#265fd2',
          radius: 100,
          opacity: 0.9,
          strokeWidth: 2
        },{
          fill: '#1b0f74',
          stroke: '#265fd2',
          radius: 200,
          opacity: 0.2,
          strokeWidth: 2
        },{
          fill: 'none',
          stroke: '#162ab5',
          strokeWidth: 3,
          radiu: 35,
          opacity: 0.4,
          lineLenght: 8,
        },{
          fill: 'image',
          width: 155,
          height: 157,
          left: 40,
          top:  67,
          url: '../images/rotatebg2.png',

        }
      ]
    },
    line: {
      stroke: '#fcb800',
      strokeWidth: 3
    },
    popup: {
      left: 280,
      top: 160
    },
    tooltip: {
      className: 'tooltip',
      typeName: ['发案', '破案']
    }
  }
  //window.path = 'http://12.68.0.170:8083/jizhenpc/data'
  var path = window.global.mapPath
  window.mapUrl = path +'/map/'+config.area+'.json' 

  var map = {

    /**
     *  @describe [地图初始化调用]
     *  @param    {[object]}   masterFile [主文件(哪个模块调用的)]
     *  @param    {[object]}   data       [地图数据]
     *  @param    {[number]}   type       [地图类型（支队还是行政区）]
     */
    init: function(masterFile, data, type, mapurl, caseNumberUrl){
      var _self = this
      _self.renderTotal(data)
      _common.mapInit(masterFile, data, config, type, '#telecomResourcesMap', mapurl, caseNumberUrl, '在控标识码')    
    },


    /**
     *  @describe [渲染左边的总数]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    renderTotal: function(data){

      var total = data.total
      var perCapita = data.perCapita
      $('.count1').find('.count-num').html(perCapita)
      $('.count2').find('.count-num').html(total)

    },

    /**
     *  @describe [推送快报战果]
     *  @param    {[object]}   data [description]
     *  @return   {[type]}   [description]
     */
    victory: function(data){
      _common.victory(data, config, '#telecomResourcesMap', '#telecomResourcesVictory', 0)         
    }

  }

  return map
})