/**
 * @Author:      zhanghq
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 技侦侦破案件
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */
define(function(require, exports) {

  /**
   * 引入公用的文件
   */

    //var right =require('right')
    var duibu = require('duibu')  //对部
    var category = require('category')
    
    var map = require('./detectiveCase/map.js')
    var caseNumber = require('./detectiveCase/caseNumber.js')
    var _common = require('commons')
    var _request = require('request')
    var thisIndex = '../detectiveCase'
    var mapType = 0
    //后端地址
    var ZPCASETYPEURL = window.BASEURL + 'detectiveCase/caseType'   //案件类型
    var ZPMAPURL = window.BASEURL + 'detectiveCase/map'  //地图
    var ZPCASENUMBERURL = window.BASEURL + 'detectiveCase/caseNumber'  //案件类型
    //var ZPRELEASEURL = window.BASEURL + window.global.ZPRELEASE  //警令发布
    var VICTORYURL =  window.WSBASEURL + window.global.VICTORY //快报战果
    var ZPDUIBUURL = window.BASEURL + 'detectiveCase/duibu'  //对部
    //后台数据
    var commonTimeUrl = '/startTime/'+window.startTime+'/endTime/'+window.endTime 
    var commonUrl =  '/type/0/childType/0/troopsId/0' + commonTimeUrl
    var dataUrls = [
      {
        url: ZPCASETYPEURL + commonTimeUrl
      },{
        url: ZPMAPURL + commonUrl
      },{
        url: ZPCASENUMBERURL + commonUrl
      },{
        url: 'ZPRELEASEURL'
      },{
        url: VICTORYURL
      }
    ]
    var dataUrls = [
      {
        url: '../data/caseType.json'
      },{
        url: '../data/mergeMap.json'
      },{
        url: '../data/takeCase-caseNumber.json'
      },{
        url: '../data/release.json'
      },{
        url: '../data/victory.json'
      }
    ]
    
    var index = {

      /**
       *  @describe [地图]
       *  @param    {[string]}   dataUrl [地图url]
       */
      getMap: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var mapData = res.result
          map.init(thisIndex, mapData, mapType, ZPMAPURL, ZPCASENUMBERURL)  //地图
          duibu.init(mapData, ZPDUIBUURL, '破案数', 'bar') 
        })
        category.bindEvent(thisIndex, ZPMAPURL, ZPCASENUMBERURL)
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

        var centerTpl = require('../components/detective-case.tpl')        
        var myTemplate = Handlebars.compile(centerTpl)
        $('.content').html(myTemplate()); 

        var mapType = 0
        _common.getCaseType(thisIndex, dataUrls[0].url)
        _self.getMap(dataUrls[1].url) 
        
        _self.getCaseNumber(dataUrls[2].url)
        //加载时间轴
        var urls = [ZPCASETYPEURL, ZPMAPURL, ZPCASENUMBERURL]
        _common.getTime(thisIndex, urls, index)
        // _common.getVictory(dataUrls[4].url, map)

        
      }
    }
  //exports.sis = index
  return index
})