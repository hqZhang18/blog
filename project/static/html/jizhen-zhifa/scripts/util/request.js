/**
 * @Author:      name
 * @DateTime:    2017-03-20 13:36:18
 * @Description: Description
 * @Last Modified By:   name
 * @Last Modified Time:    2017-03-20 13:36:18
 */
define(function(require, exports) {

  var util = require('./util')

	
  var request = {
    /**
       *  @describe [发送ajax请求]
       *  @param    {[type]}   dataUrl  [请求地址]
       *  @param    {Function} callback [回调函数]
       */
      sendAjax: function(dataUrl, callback){
        $.ajax({
          type:"get",
          url: dataUrl,
          success: function(result){
            if(!result.code){
              return util.errorTooltip( '调后台接口失败:' + result.message )
            }
            callback && callback(result.result)
          },
          error: function(){
            console.log('error')
          }
        })
      },
       
      /**
       *  @describe [WebSocket请求数据]
       *  @param    {[type]}   dataUrl   [地址]
       *  @param    {[type]}   startTime [开始时间]
       *  @param    {[type]}   endTime   [结束时间]
       *  @param    {Function} callback  [回调函数]
       *  @return   {[type]}   [获取到的数据]
       */
      sendWebSocket: function(dataUrl, startTime, endTime, callback){
        window.WS = new WebSocket(dataUrl)
        WS.onopen = function(res){
          // Web Socket 已连接上，使用 send() 方法发送数据
					var param = startTime + '-' + endTime
					WS.send(param)
        }
        WS.onmessage = function (res) { 
         var data = res.data
				 data = JSON.parse(data)
				 callback && callback(data.result)
          // if(!result.code){
          //   alert('调后台接口失败:' + result.msg)
          //   return 
          // }
        }
        WS.onclose = function(){ 
          // 关闭 websocket
          //alert("websocket 连接已关闭...")
        }
      }
  }
 
 
  return request
})  