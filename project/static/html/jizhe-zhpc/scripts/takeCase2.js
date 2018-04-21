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
    require('jquery')
    require('common')
    require('d3')
    require('lodash')

    var gauge = require('gauge')  //案件数
    var duibu = require('duibu')  //对部
    var _common = require('commons')
    var _header = require('./common/header2')
    var category = require('category')
    var map = require('./takeCase/map.js')
    var caseNumber = require('./takeCase/caseNumber.js')
    var casing = require('./case.js')
    
    var _request = require('request')
    var right = require('./common/right2.js')

     //定义变量
    window.xzIndex = 'index2'
    var mapType = 0
    window.isInit = true
    window.isMapInit = true //用于判断地图是不是第一次加载
    window.clickNav = false
    window.isTime = 1 //是否有时间轴
    window.thisNavs = 'index' //当前导航类型
    window.areaIds = 'troopsId' //用于地图的参数传值，后面统一用troopsId 
    window.victoryId = 'indexVictory' //快报战果的id
    var thisIndex = '../takeCase2'
    window.isCategory = false
    

    //后端地址
    window.BASEURL = window.global.BaseUrl
    window.WSBASEURL = window.global.WsBaseUrl
    var JBCASETYPEURL = window.BASEURL + 'takeCase/caseType'   //案件类型
    var JBMAPURL = window.BASEURL + 'takeCase/map'  //地图
    var JBCASENUMBERURL = window.BASEURL + 'takeCase/caseNumber'   //案件类型
    var JBRELEASEURL = window.BASEURL + 'investigation/release'  //警令发布
    var VICTORYURL =  window.WSBASEURL + window.global.VICTORY //快报战果
    var JBDUIBUURL = window.BASEURL + 'takeCase/duibu'  //对部
    var NAMEURL = window.BASEURL + 'investigation/name'

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
      },{
        url: '../data/name.json'
      }
    ]

    //后台数据
    // window.startTime = '00000'
    // window.endTime = '00000'
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
    //     url: JBRELEASEURL
    //   },{
    //     url: VICTORYURL
    //   },{
    //     url: NAMEURL
    //   }
    // ]



    
    var index = {

      /**
       *  获取用户名
       */

      getName: function(dataUrl){
        // 服务台固定url
        var fwtUrl = 'chrome-extension://fnfnbeppfinmnjnjhedifcfllpcfgeea/navigate.html?chromeurl=[escape]http://12.4.0.124/fms/loginAction.do?method=omcLogin&userId='
        _request.sendAjax(dataUrl, function(res){
          var name = res.result.userName
          var userId = res.result.userID
          $('.addressBook').html(name)
          // 服务台地址
          fwtUrl = fwtUrl + userId
          $('.fwt').attr('href', fwtUrl)
        })
      },

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

      /**
       *  @describe [右边模块]
       *  @param    {[string]}   dataUrl [description]
       */
      getRight: function(dataUrl){
        var _self = this
        _request.sendAjax(dataUrl, function(res){
          var policeData = res.result.policeOrders  //警令发布
          var importantData = res.result.importantInfo  //要情发布
          var dailyOnDuty = res.result.dailyOnDuty  //每日值班
          var rightData = {
            policeOrders: policeData,
            importantInfo: importantData,
            dailyOnDuty: dailyOnDuty
          }
          right.init(rightData)

        })
      },
      

      init: function() {
        var _self = this
        
        var centerTpl = require('../components/take-case.tpl')        
        var myTemplate = Handlebars.compile(centerTpl)
        $('.content').html(myTemplate())
        casing.init(centerTpl, isInit)  //加载模块的初始化方法
        _header.init()  // 加载顶部
        _common.getCaseType(thisIndex, dataUrls[0].url)
        _self.getName(dataUrls[5].url)
        _self.getMap(dataUrls[1].url) 
        _self.getCaseNumber(dataUrls[2].url)
        //_common.getVictory(dataUrls[4].url, map)
        _self.getRight(dataUrls[3].url)

        //加载时间轴
        var urls = [JBCASETYPEURL, JBMAPURL, JBCASENUMBERURL]
       _common.getTime(thisIndex, urls, index)

        
      }
    }
  //exports.sis = index
  return index
})