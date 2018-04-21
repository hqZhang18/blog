/**
 * @Author:      baizn、zhanghq
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 技侦在侦案件
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
   // require('timeSlider')


    //引入依赖组件模块
    var _header = require('header')
    var gauge = require('gauge')  //案件数
    var duibu = require('duibu')  //对部
    
    var casing = require('casing')
    var _common = require('commons')
    var _request = require('request')
    
    var category = require('category')
    var map = require('./investigationCase/map.js')
    var caseNumber = require('./investigationCase/caseNumber.js')

    //定义变量
    var mapType = 0
    window.SYSTEMTOOLTIP  = ['暂无数据'] 
    window.isInit = true
    window.isMapInit = true //用于判断地图是不是第一次加载
    window.clickNav = false
    window.isTime = 0 //是否有时间轴
    window.thisNavs = 'index' //当前导航类型
    window.areaIds = 'troopsId' //用于地图的参数传值，后面统一用troopsId 
    window.victoryId = 'indexVictory' //快报战果的id
    var thisIndex = '../index'
    window.isCategory = false
    window.dataIndex = 1 // 不是首页的标识

    //后端地址
    window.BASEURL = window.global.BaseUrl
    window.WSBASEURL = window.global.WsBaseUrl
    var ZZCASETYPEURL = window.BASEURL + 'investigation/caseType'   //案件类型
    var ZZMAPURL = window.BASEURL + 'investigation/map'  //地图
    var ZZCASENUMBERURL = window.BASEURL + 'investigation/caseNumber'   //案件类型
    var ZZRELEASEURL = window.BASEURL + 'investigation/release'  //警令发布
    var ZZDUIBUURL = window.BASEURL + 'investigation/duibu'  //对部
    var VICTORYURL =  window.WSBASEURL + window.global.VICTORY //快报战果
    var CURTIMEURL = window.WSBASEURL + window.global.CUETIME
    var NAMEURL = window.BASEURL + 'investigation/name'
   
    //本地数据
    var dataUrls = [
      {
        url: '../data/caseType.json'
      },{
        url: '../data/mergeMap.json'
      },{
        url: '../data/caseNumber.json'
      },{
        url: '../data/release.json'
      },{
        url: '../data/victory.json'
      },{
        url: '../data/name.json'
      }
    ]
   
    // //后台数据
    // var dataUrls = [
    //   {
    //     url: ZZCASETYPEURL 
    //   },{
    //     url: ZZMAPURL + '/type/0/childType/0/troopsId/0'
    //   },{
    //     url: ZZCASENUMBERURL + '/type/0/childType/0/troopsId/0'
    //   },{
    //     url: ZZRELEASEURL
    //   },{
    //     url: VICTORYURL
    //   },{
    //     url: NAMEURL
    //   }
    // ]

   

    window.flagInit = true  //初始化标记
    window.typeInit = true
    
    var index = {

      getName: function(dataUrl){
		 
        _request.sendAjax(dataUrl, function(res){
          var name = res.result.userName
          $('.addressBook').html(name)
        })
      },

      /**
       *  @describe [地图]
       *  @param    {[string]}   dataUrl [地图url]
       */
      getMap: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var mapData = res.result
          map.init(thisIndex, mapData, mapType, ZZMAPURL, ZZCASENUMBERURL)  //地图
          duibu.init(mapData, ZZDUIBUURL, '在侦案件数', 'bar')       //调用队部初始化方法
        })
        
        /**添加案件类型的事件绑定 传入当前模块主文件，地图的URL ,案件数量的URL
        *  如果该方法不在这里调用，地图钻取后案件类型就无法点击 */
        category.bindEvent(thisIndex, ZZMAPURL, ZZCASENUMBERURL)  
      },

      /**
       *  @describe [底部各支队，各类图表]
       *  @param    {[type]}   dataUrl [案件数量url]
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

        var centerTpl = require('../components/investigation-case.tpl')      
        
        casing.init(centerTpl, isInit)  //加载模块的初始化方法
        _header.init()  
        _common.getCaseType(thisIndex, dataUrls[0].url, ZZMAPURL, ZZCASENUMBERURL) 
        _self.getName(dataUrls[5].url)
        _self.getMap(dataUrls[1].url) 
        _self.getCaseNumber(dataUrls[2].url)
        _common.getRight(dataUrls[3].url)
        _common.getVictory(dataUrls[4].url, map)    
         
      }
    
    }

  return index
})