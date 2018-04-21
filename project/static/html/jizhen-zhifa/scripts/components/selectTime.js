/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-22 18:49:53
 * @Description: 选择时间
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-22 18:49:53
 */

define(function(require) {

	//发送请求
  //var request = require('../util/request')
	var apiURL = require('../api.config')
	var timeUrl = apiURL.getTime
	
  var selectTime = {

    /**
     *  @describe [初始化时间]
     *  @param    {[type]}   config [时间配置项]
     *  @return   {[type]}   [description]
     */
    init: function() {
			//获取服务器时间
			// this.getServerTime(timeUrl, 3, function(res){
			// 	console.log(res)
			// })
			
      var curTime = this.currentDate()
		 
      var curMonth = curTime[1]
      var startMont = parseInt(curTime[1], 10) + 1
      if(startMont<10){
        startMont = '0'   + startMont
      }
      // var curStart = curTime[0]-1 + '年' + startMont + '月'
      // var curEnd = curTime[0] + '年' + curMonth + '月'
      // 时间到日
      var curStart = curTime[0]-1  + startMont + curTime[2]
      var curEnd = curTime[0] + curMonth + curTime[2]
      return [curStart, curEnd]
      // $('.default-start-time').html(curStart)
      // $('.default-end-time').html(curEnd)
     
    },

    /**
     *  @describe [本地当前时间]
     */
    currentDate: function(){
      var date = new Date();
      var split1 = '.';
      var split2 = ':';
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var minute = date.getMinutes()
      var seconds = date.getSeconds()
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
      }
      if (minute >= 1 && minute <= 9) {
        minute = '0' + minute
      }
      // if (seconds >= 0 && seconds <= 9) {
      //     seconds = '0' + seconds;
      // }
      var currentdate = year + split1 + month + split1 + strDate   
      var curMinute =    date.getHours() + split2 + minute  
      $('.current-time').html(currentdate+'<span>'+curMinute+'</span>')
      var selectTime = [year, month, strDate]
      return selectTime
    }, 

    /**
     *  @describe [获取服务器时间]
     *  @param    {[type]}   url      [地址]
     *  @param    {[type]}   type     [时间参数]
     *  @param    {Function} callback [回调]
     *  @return   {[type]}   [时间]
     */
		getServerTime: function(url, type, callback) {
			var timeWs = new WebSocket(url)
			 // Web Socket 已连接上，使用 send() 方法发送数据
			timeWs.onopen = function(res){
				timeWs.send(type)
			}
			timeWs.onmessage = function (res) { 
				var data = res.data
				callback && callback(data)
			}
			timeWs.onclose = function(){ 
				// 关闭 websocket
				//alert("websocket 连接已关闭...")
			}
		},
	 
    /**
     *  @describe [时间验证]
     *  @param    {[type]}   startTime [开始时间]
     *  @param    {[type]}   endTime   [结束时间]
     *  @return   {[type]}   [开始是否大于结束]
     */
    checkTime: function(startTime, endTime){  
      //验证日期（判断结束日期是否大于开始日期）日期格式为YY—MM—DD  
      if( startTime.length>0 && endTime.length>0 ){     
        var startTmp=startTime.split('-');  
        var endTmp=endTime.split('-');  
        var sd = new Date(startTmp[0],startTmp[1],startTmp[2]);  
        var ed = new Date(endTmp[0],endTmp[1],endTmp[2]);  
        if(sd.getTime()>ed.getTime()){   
            return false     
        }     
      }     
      return true     
    },

    /**
     *  @describe [加载时间控件模板]
     *  @return   {[type]}   [description]
     */
    loadTemplate: function() {
      var tpl = require('../../components/dialog/select-time.tpl')
      var template = Handlebars.compile(tpl)
      var html = template({}) 
      $('.header').html(html)
      // 时间年份配置，开始时间结束时间
      var config = {
        start: 2014,
        end: 2017
      }
     // this.timeControl(config)
    }

    
  }

  return selectTime
})