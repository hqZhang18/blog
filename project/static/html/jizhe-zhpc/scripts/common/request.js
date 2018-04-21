/**
 * @Author:      name
 * @DateTime:    2017-03-20 13:36:18
 * @Description: Description
 * @Last Modified By:   name
 * @Last Modified Time:    2017-03-20 13:36:18
 */
define(function(require, exports) {

  var request = {
    /**
       *  @describe [发送ajax请求]
       *  @param    {[type]}   dataUrl  [请求地址]
       *  @param    {Function} callback [回调函数]
       */
      sendAjax: function(dataUrl, callback){

        var data = []
        $.ajax({
          type:"get",
          url: dataUrl,
          success: function(result, textStatus, xMLHttpRequest){
            // var sessionstatus=XMLHttpRequest.getResponseHeader('sessionstatus');   
            // console.log('sessionstatus', sessionstatus)
            // if(sessionstatus=='timeout'){  
            //   // window.status = sessionstatus
            //   //如果超时就处理 ，指定要跳转的页面  
            //   return window.location = 'index2.html'
            // }  
            // 调用后台接口失败
            if(!result.code){
              var errorTpl = require('../../components/dialog/errorDialog.tpl')
              var template = Handlebars.compile(errorTpl)
              var html = template({
                data: '调后台接口失败:' + result.msg
              }) 
              $('.error-dialog').html(html)
              $('#errorDialog').fadeIn(200)
              //关闭错误提示
              $('#errorDialog').off('click', '.close-model').on('click', '.close-model', function(evt){
                $('#errorDialog').fadeOut(200)
                $('.error-dialog').html('')
              })
              return 
            }
            callback && callback(result)
          },
          error: function(error) {
            console.log(error)
          }  
 
          // complete:function(XMLHttpRequest,textStatus){  
          //   //通过XMLHttpRequest取得响应头，sessionstatus，  
          //   var sessionstatus=XMLHttpRequest.getResponseHeader('sessionstatus');   
          //   // console.log('sessionstatus', sessionstatus)
          //   if(sessionstatus=='timeout'){  
          //     // window.status = sessionstatus
          //     //如果超时就处理 ，指定要跳转的页面  
          //     window.location = 'index2.html';  
          //   }  
          // }
        })
      },
       
      
      /**
       *  @describe [WebSocket请求数据]
       *  @param    {[type]}   dataUrl  [请求地址]
       *  @param    {Function} callback [回调函数]
       */
      sendWebSocket: function(dataUrl, callback){
        //var dataUrl = 'ws://192.168.1.109:8080/jizhen-pc/investigation/newNictory'
  
        window.WS = new WebSocket(dataUrl)
        // WS.onopen = function(res){
        //   // Web Socket 已连接上，使用 send() 方法发送数据
        //   WS.send("发送数据")
        //   alert("数据发送中...")
        // }
        WS.onmessage = function (res) { 
          var data = res.data
          // if(!result.code){
          //   alert('调后台接口失败:' + result.msg)
          //   return 
          // }
          callback && callback(data)
        }
        WS.onclose = function(){ 
          // 关闭 websocket
          //alert("websocket 连接已关闭...")
        }
      }          

  }
 
 
  return request
})  