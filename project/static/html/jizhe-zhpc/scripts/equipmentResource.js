/**
 * @Author:      baizn、zhanghq
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 设备资源
 * @Last Modified By:   zhanghq
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

    // 引信依赖组件
    var _common = require('commons')
    var _request = require('request')
    var duibu = require('duibu')  //对部
    var map = require('./equipmentResource/map.js')
    var caseNumber = require('./equipmentResource/caseNumber.js')
    var category = require('./equipmentResource/category.js')
    var mapType = 0
    var troopsId = 0
    var thisIndex = '../equipmentResource'
	  window.troopsId2 = 0

    //后端地址
 
    var SBDEVICETYPEURL = window.BASEURL + 'equipmentResource/deviceType'   //设备类型
    var SBDEVICESTATEURL = window.BASEURL + 'equipmentResource/deviceState' //设备状态
    var SBMAPURL = window.BASEURL + 'equipmentResource/map'  //地图
    var SBCASENUMBERURL = window.BASEURL + 'equipmentResource/deviceNumber'   //设备数量
    //var SBRELEASEURL = window.BASEURL + window.global.SBRELEASE  //警令发布
    var VICTORYURL =  window.WSBASEURL + window.global.VICTORY //快报战果
    var SBDUIBUURL = window.WSBASEURL + 'equipmentResource/duibu' //队部 
    // var troopsIdURL = window.BASEURL + 'investigation/troopsId'
    var troopsIdURL = '../data/troopsId.json'
	window.saverroopsId = 0

     var dataUrls = [
      {
        url: '../data/deviceType.json'
      },{
        url: '../data/deviceState.json'
      },{
        url: '../data/mergeMap.json'
      },{
        url: '../data/equipment-caseNumber.json'
      },{
        url: '../data/release.json'
      },{
        url: '../data/victory.json'
      }
    ]

    var index = {

      getTroopsId: function(dataUrl){
        var _self = this
        _request.sendAjax(dataUrl, function(res){
          troopsId = res.result
		      window.troopsId2 = troopsId
			  window.saverroopsId = troopsId
           if(troopsId=='all'){  //所有的为0
              window.troopsId2 = 0
			  window.saverroopsId = 0
              troopsId = 0
           }
          //后台数据
          // var commonUrl =  '/type/0/deviceState/0/troopsId/'+troopsId
          // var dataUrls = [
          //   {
          //     url: SBDEVICETYPEURL + '/troopsId/'+troopsId
          //   },{
          //     url: SBDEVICESTATEURL + '/type/0/troopsId/'+troopsId
          //   },{
          //     url: SBMAPURL + commonUrl
          //   },{
          //     url: SBCASENUMBERURL + commonUrl
          //   },{
          //     url: 'SBRELEASEURL'
          //   }
          // ]
          SBDUIBUURL = '/troopsId/'+troopsId  //队部 把troopsId带过去
           _self.getDeviceType(dataUrls[0].url)
          _self.getDeviceState(dataUrls[1].url)
          _self.getMap(dataUrls[2].url) 
          _self.getCaseNumber(dataUrls[3].url)
          _common.getVictory(VICTORYURL)
        })
      },

      /**
       *  @describe [设备类型]
       *  @param    {[type]}   dataUrl [地图url]
       */ 
      getDeviceType: function(dataUrl){
        var _self = this
        _request.sendAjax(dataUrl, function(res){
          var data = res.result
          category.renderDeviceType(data, troopsId)
        })
      },

      /**
       *  @describe [设备状态]
       *  @param    {[type]}   dataUrl [设备状态url]
       */
      getDeviceState: function(dataUrl){
        var _self = this
        _request.sendAjax(dataUrl, function(res){
          var data = res.result
          category.renderDeviceState(data, troopsId)
        })
      },

       /**
       *  @describe [地图]
       *  @param    {[string]}   dataUrl [地图url]
       */
      getMap: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var mapData = res.result
          map.init(thisIndex, mapData, mapType, SBMAPURL, SBDEVICETYPEURL)  //地图
          duibu.init(mapData, SBDUIBUURL, '设备数量', 'pie') 
        })
        category.bindEvent(thisIndex, SBMAPURL, SBDEVICETYPEURL)
      },

      /**
       *  @describe [底部案件类型图表]
       *  @param    {[type]}   dataUrl [设备数量url]
       */
      getCaseNumber: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var data = res.result
          caseNumber.init(data, SBMAPURL, SBCASENUMBERURL)
        })
      },


      init: function() {
        var _self = this
        
        var centerTpl = require('../components/equipment-resource.tpl')        
        var myTemplate = Handlebars.compile(centerTpl)
        $('.content').html(myTemplate()); 
        
        _self.getTroopsId(troopsIdURL)
      }
    }
  //exports.sis = index
  return index
})