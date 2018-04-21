/**
 * @Author:      baizn、zhanghq
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 电信资源
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */
define(function(require, exports) {

  /**
   * 引入公用的文件
   */

    //引入依赖组件模块

    var gauge = require('gauge')  //案件数
    var duibu = require('duibu')  //对部
    
    var casing = require('casing')
    var _common = require('commons')
    var _request = require('request')
    var category = require('category')
    var map = require('./telecomResources/map.js')
    var caseNumber = require('./telecomResources/caseNumber.js')

    //定义变量
    var mapType = 0
    window.victoryId = 'indexVictory' //快报战果的id
    var thisIndex = '../telecomResources'

    //后端地址
    var DXMAPURL = window.BASEURL + 'telecomResources/map'   // 地图
    var DXCASENUMBERURL = window.BASEURL + 'telecomResources/controlNumber'  //案件数
    var DXDUIBUURL = window.BASEURL + 'telecomResources/duibu'
    var VICTORYURL =  window.WSBASEURL + window.global.VICTORY //快报战果

    //后台数据
    var commonUrl = '/troopsId/0'
    var dataUrls = [
      {
        url: DXMAPURL + commonUrl
      },{
        url: DXCASENUMBERURL + commonUrl
      },{
        url: VICTORYURL
      }
    ]

    //本地数据
     var dataUrls = [
      {
        url: '../data/mergeMap.json'
      },{
        url: '../data/dx-caseNumber.json'
      }
    ]

    
    var index = {

      /**
       *  @describe [地图]
       *  @param    {[string]}   dataUrl [description]
       *  @param    {[type]}   thisIndex [哪个模块调用的该方法]
       *  @param    {[object]}   map [地图配置]      
       *  @param    {[object]}   map [地图类型,支队还是行政区]
       */
      getMap: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var mapData = res.result
          map.init(thisIndex, mapData, mapType, DXMAPURL, DXCASENUMBERURL)  //地图
          duibu.init(mapData, DXDUIBUURL, '在控标识码')       //调用队部初始化方法
        })
      },
 
      /**
       *  @describe [底部各支队，各类图表]
       *  @param    {[type]}   dataUrl [description]
       */
      getCaseNumber: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var data = res.result
          caseNumber.init(data)
        })
      },

      /**
       *  @describe [技侦在侦初始化]
       */
      init: function() {
        var _self = this
        var centerTpl = require('../components/telecom-resources.tpl')        
        var myTemplate = Handlebars.compile(centerTpl)
        $('.content').html(myTemplate())

          _self.getMap(dataUrls[0].url) 
          _self.getCaseNumber(dataUrls[1].url)
          // _common.getVictory(dataUrls[2].url, map)     
         
      }
    
    }
  //exports.sis = index
  return index
})