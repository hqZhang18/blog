/**
 * @Author:      baizn
 * @DateTime:    2017-03-20 13:36:18
 * @Description: Description
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-03-20 13:36:18
 */
define(function (require) {

    var util = require('./util')

    var request = {
        /**
         *  @describe [发送get请求]
         *  @param    {string}   url  [请求地址]
         *  @param    {Function} callback [回调函数]
         */
        sendAjax: function (url, callback) {
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: url,
                success: function (response) {
                    if (!response.code) {
                        return util.errorTooltip('调后台接口失败:' + response.msg)
                    }
                    callback && callback(response.result)
                },
                error: function () {
                    return util.errorTooltip('请求失败: 系统错误')
                }
            })
        },

        /**
         *  @describe [发送post请求]
         *  @param    {string}   url  [请求地址]
         *  @param    {object}   data  [参数]
         *  @param    {Function} callback [回调函数]
         */
        sendRequest: function (url, data, callback) {
            $.ajax({
                type: 'post',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(data),
                success: function (response) {
                    if (!response.code) {
                        return util.errorTooltip('调后台接口失败:' + response.msg)
                    }
                    callback && callback(response.result)
                },
                error: function () {
                    return util.errorTooltip('请求失败: 系统错误')
                }
            })
        },

        /**
         *  @describe [WebSocket请求数据]
         *  @param    {[type]}   url  [请求地址]
         *  @param    {Function} callback [回调函数]
         */
        sendWebSocket: function (url, callback) {
          var WS = new WebSocket(url)
          WS.onopen = function(res) {
              WS.send('0')
              console.log('发送数据中')
          }
          WS.onmessage = function (response) {
              var data = response.data
              callback && callback(data)
          }
          WS.onclose = function () {
              WS.close()
          }
          window.onunload = function () {
              WS.close()
          }
        }
    }

    return request
})  