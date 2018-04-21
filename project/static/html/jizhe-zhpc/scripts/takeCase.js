/**
 * @Author:      baizn、zhanghq
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 技侦接办案
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */
define(function(require, exports) {

  /**
   * 引入公用的文件
   */

    var gauge = require('gauge')  //案件数

    var duibu = require('duibu')  //对部
    var category = require('category')
    var map = require('./takeCase/map.js')
    var caseNumber = require('./takeCase/caseNumber.js')
    var casing = require('casing')
    var _common = require('commons')
    var _request = require('request')
    var _request = require('request')

    var thisIndex = '../takeCase'
    var mapType = 0

    //后端地址
    var JBCASETYPEURL = window.BASEURL + 'takeCase/caseType'   //案件类型
    var JBMAPURL = window.BASEURL + 'takeCase/map'  //地图
    var JBCASENUMBERURL = window.BASEURL + 'takeCase/caseNumber'   //案件类型
    //var JBRELEASEURL = window.BASEURL + window.global.JBRELEASE  //警令发布
    var VICTORYURL =  window.WSBASEURL + window.global.VICTORY //快报战果
    var JBDUIBUURL = window.BASEURL + 'takeCase/duibu'  //对部

   var dataUrls = [
      {
        url: '../data/tackCase-caseType.json'
      },{
        url: '../data/tackCase-map.json'
      },{
        url: '../data/takeCase-caseNumber.json'
      },{
        url: '../data/release.json'
      },{
        url: '../data/victory.json'
      }
    ]

    //后台数据
    // var commonTimeUrl = '/startTime/'+window.startTime+'/endTime/'+window.endTime 
    // var commonUrl =  '/type/0/childType/0/troopsId/0' + commonTimeUrl
    // var dataUrls = [
    //   {
    //     url: JBCASETYPEURL + commonTimeUrl
    //   },{
    //     url: JBMAPURL + commonUrl
    //   },{
    //     url: JBCASENUMBERURL + commonUrl
    //   },{
    //     url: 'JBRELEASEURL'
    //   },{
    //     url: VICTORYURL
    //   }
    // ]

    
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
          map.init(thisIndex, mapData, mapType, JBMAPURL, JBCASENUMBERURL)  //地图
          duibu.init(mapData, JBDUIBUURL, '接案数', 'bar') 
        })

        category.bindEvent(thisIndex, JBMAPURL, JBCASENUMBERURL)
      },

      /**
       *  @describe [底部案件类型图表]
       *  @param    {[type]}   dataUrl [description]
       */
      getCaseNumber: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var data = res.result
          caseNumber.init(data) 
        })
      },
      

      init: function() {
        var _self = this

        var centerTpl = require('../components/take-case.tpl')        
        var myTemplate = Handlebars.compile(centerTpl)
        $('.content').html(myTemplate())
        
        _common.getCaseType(thisIndex, dataUrls[0].url)
        _self.getMap(dataUrls[1].url) 
        _self.getCaseNumber(dataUrls[2].url)
        _common.getVictory(dataUrls[4].url, map)
        _common.getRight(dataUrls[3].url)

        //加载时间轴
        var urls = [JBCASETYPEURL, JBMAPURL, JBCASENUMBERURL]
        _common.getTime(thisIndex, urls, index)
      }
    }
  //exports.sis = index
  return index
})