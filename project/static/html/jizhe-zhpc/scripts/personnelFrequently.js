/**
 * @Author:      baizn、zhanghq
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 人员在勤
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
    var map = require('./personnelFrequently/map.js')
    var caseNumber = require('./personnelFrequently/caseNumber.js')
    var casing = require('casing')
    var _common = require('commons')
    var _request = require('request')

    var thisIndex = '../personnelFrequently'
    var mapType = 0
    var troopsId = 0
	window.saverroopsId = 0

    //后端地址
    var ZQMAPURL = window.BASEURL + 'personnelFrequently/map'   // 地图
    var ZQCASENUMBERURL = window.BASEURL + 'personnelFrequently/attendanceNumber'  //案件数
    var ZQDUIBUURL = window.BASEURL + 'personnelFrequently/duibu'
    var VICTORYURL =  window.WSBASEURL + window.global.VICTORY //快报战果
    var troopsIdURL = window.BASEURL + 'investigation/troopsId'
    var troopsIdURL = '../data/troopsId.json'


    var dataUrls = [
      {
        url: '../data/person-mergeMap.json'
      },{
        url: '../data/person-caseNumber.json'
      }
    ]

    var index = {

      /**
       *  @describe [获取troopsId]
       *  @param    {[type]}   dataUrl [description]
       *  @return   {[type]}   [description]
       */
       getTroopsId: function(dataUrl){
         var _self = this
         _request.sendAjax(dataUrl, function(res){
            var troopsId = res.result
			      window.troopsId2 = troopsId
				  window.saverroopsId = troopsId
            if(troopsId=='all'){
                window.troopsId2 = 0
				window.saverroopsId = 0
                troopsId = 0
            }

            // var commonUrl = '/troopsId/'+ troopsId
            // var dataUrls = [
            //   {
            //     url: ZQMAPURL + commonUrl
            //   },{
            //     url: ZQCASENUMBERURL + commonUrl
            //   },{
            //     url: VICTORYURL
            //   } 
            // ]
            
            _self.getMap(dataUrls[0].url) 
            _self.getCaseNumber(dataUrls[1].url)
            ZQDUIBUURL = commonUrl
            _common.getVictory(dataUrls[2].url, map)
         })
       },

       /**
       *  @describe [地图]
       *  @param    {[string]}   dataUrl [地图url]
       */
      getMap: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var mapData = res.result
          map.init(thisIndex, mapData, mapType, ZQMAPURL, ZQCASENUMBERURL)  //地图
          duibu.init(mapData, ZQDUIBUURL, '在勤人数', 'bar') 
        })

      },

      /**
       *  @describe [底部案件类型图表]
       *  @param    {[type]}   dataUrl [人员数量url]
       */
      getCaseNumber: function(dataUrl){
        _request.sendAjax(dataUrl, function(res){
          var data = res.result
          caseNumber.init(data) 
        })
      },
      

      init: function() {
        var _self = this

        var centerTpl = require('../components/personnel-frequently.tpl')        
        var myTemplate = Handlebars.compile(centerTpl)
        $('.content').html(myTemplate())
        _self.getTroopsId(troopsIdURL)  
      }
    }
  //exports.sis = index
  return index
})