/**
 * @Author:      baizn、zhanghq
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 全市发案
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */
define(function(require, exports) {

  /**
   * 引入依赖组件
   */
 
    var _common = require('commons')
    var _request = require('request')
    var map = require('./cityIncidence/map.js')
    var caseNumber = require('./cityIncidence/caseNumber.js')
    var category = require('category')
    var mapType = 1
    var thisIndex = '../cityIncidence'

    //后端地址
    var FACASETYPEURL = window.BASEURL + 'cityIncidence/caseType'   //案件类型
    var FAMAPURL = window.BASEURL + 'cityIncidence/map' //地图
    var FACASENUMBERURL = window.BASEURL + 'cityIncidence/caseNumber'   //案件类型
    //var FARELEASEURL = window.BASEURL + window.global.FARELEASE  //警令发布
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
    //     url: FACASETYPEURL + '/startTime/'+window.startTime+'/endTime/'+window.endTime 
    //   },{
    //     url: FAMAPURL + commonUrl 
    //   },{
    //     url: FACASENUMBERURL + commonUrl
    //   },{
    //     url: 'FARELEASEURL'
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
          map.init(thisIndex, mapData, mapType, FAMAPURL, FACASENUMBERURL)  //地图
        })
        category.bindEvent(thisIndex, FAMAPURL, FACASENUMBERURL)
      },

      /**
       *  @describe [底部案件类型图表]
       *  @param    {[type]}   dataUrl [description]
       */
      getCaseNumber: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var data = res.result
          caseNumber.init(data, FAMAPURL, FACASENUMBERURL)
        })
      },



      init: function() {
        var _self = this

        var centerTpl = require('../components/city-incidence.tpl')        
        var myTemplate = Handlebars.compile(centerTpl)
        $('.content').html(myTemplate()); 

        _common.getCaseType(thisIndex, dataUrls[0].url)
        _self.getMap(dataUrls[1].url) 
        _self.getCaseNumber(dataUrls[2].url)
      
        //加载时间轴
        var urls = [FACASETYPEURL, FAMAPURL, FACASENUMBERURL]
        _common.getTime(thisIndex, urls, index)
        _common.getVictory(dataUrls[4].url, map)
        
      }
    }
  //exports.sis = index
  return index
})