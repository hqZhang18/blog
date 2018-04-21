/**
 * @Author:      baizn、zhanghq
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 全市发案
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */
define(function(require, exports) {

  /**
   * 引入公用的文件
   */
 
    var _common = require('commons')
    var _request = require('request')
    var map = require('./cityDetection/map.js')
    var caseNumber = require('./cityDetection/caseNumber.js')
    var category = require('category')
    var mapType = 1
    var thisIndex = '../cityDetection'

    //后端地址
    var PACASETYPEURL = window.BASEURL + 'cityDetection/caseType'   //案件类型
    var PAMAPURL = window.BASEURL + 'cityDetection/map'  //地图
    var PACASENUMBERURL = window.BASEURL + 'cityDetection/caseNumber'   //案件类型
    //var PARELEASEURL = window.BASEURL + window.global.PARELEASE  //警令发布
    var VICTORYURL =  window.WSBASEURL + window.global.VICTORY //快报战果
    var dataUrls = [
      {
        url: '../data/caseType2.json'
      },{
        url: '../data/map.json'
      },{
        url: '../data/city-caseNumber.json'
      },{
        url: '../data/release.json'
      },{
        url: '../data/city-victory.json'
      }
    ]

    //后台数据
    // var commonTimeUrl = '/startTime/'+window.startTime+'/endTime/'+window.endTime 
    // var commonUrl =   '/type/0/childType/0/'+window.areaIds+'/0' + commonTimeUrl
    // var dataUrls = [
    //   {
    //     url: PACASETYPEURL + '/startTime/'+window.startTime+'/endTime/'+window.endTime 
    //   },{
    //     url: PAMAPURL + commonUrl
    //   },{
    //     url: PACASENUMBERURL + commonUrl
    //   },{
    //     url: 'PARELEASEURL'
    //   },{
    //     url: VICTORYURL
    //   }
    // ]
  


    var index = {

       /**
       *  @describe [地图]
       *  @param    {[string]}   dataUrl [地图url]
       */
      getMap: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var mapData = res.result
          map.init(thisIndex, mapData, mapType, PAMAPURL, PACASENUMBERURL)  //地图
        })
        category.bindEvent(thisIndex, PAMAPURL, PACASENUMBERURL)
      },

      /**
       *  @describe [底部案件类型图表]
       *  @param    {[type]}   dataUrl [description]
       */
      getCaseNumber: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var data = res.result
          
          caseNumber.init(data, PAMAPURL, PACASENUMBERURL)
        })
      },

      /**
       *  @describe [初始化]
       */
      init: function() {
        var _self = this

        var centerTpl = require('../components/city-detection.tpl')        
        var myTemplate = Handlebars.compile(centerTpl)
        $('.content').html(myTemplate()); 

        _common.getCaseType(thisIndex, dataUrls[0].url)
        _self.getMap(dataUrls[1].url) 
        _self.getCaseNumber(dataUrls[2].url)
        //加载时间轴
        var urls = [PACASETYPEURL, PAMAPURL, PACASENUMBERURL]
        _common.getTime(thisIndex, urls, index)
        _common.getVictory(dataUrls[4].url, map)
        
      }
    }
  //exports.sis = index
  return index
})