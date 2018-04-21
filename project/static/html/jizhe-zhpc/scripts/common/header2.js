/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-13 11:33:27
 * @Description: 右边模块JS文件
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-03-13 11:33:27
 */

define(function(require){

  var _request = require('./request.js')

  var header = {
    
    /**
     *  @describe [事件绑定]
     */
    bindEvent: function(){

      var _self = this
      // 点击人名
  		$('.addressBook').on('click', function(){
  			$('.log-out').show()
  		})
    		
  		$('.log-out').on('click', function(){
  			var dataUrl = window.global.BaseUrl + 'logOut'
  			_request.sendAjax(dataUrl, function(res){
  				var href = res.result
  				window.location.href=href
  			})
      })

      //点击空白处关闭
        $('.log-out').hover(function () {
           $(this).show()
        }, function () {
          $('.log-out').hide()
        })

      var isClickNav = 0   
      // 一级导航事件（显示隐藏二级）
      $(document).on('mouseover', '.nav a', function(evt) {
        var index = $(this).index()
        if (index===2) {
          return 
        }
        $(this).addClass('cur').siblings().removeClass('cur')
        showNav(index)
      })

      $(document).on('click', '.ywxt-nav a', function(evt) {
        // isClickNav = 1
        console.log(window.status)
        if(window.status=='timeout'){  
          //如果超时就处理 ，指定要跳转的页面  
          window.location = 'index2.html';  
        } 
        // $(this).addClass('cur').siblings().removeClass('cur')
        // var index = $(this).index()
        // showNav(index)
      })

      // 显示二级导航
      function showNav(index) {
        if(index===0) {
          $('.ywxt-nav').show()
          $('.xtgj-nav').hide()
        } 
        if(index===1){
          $('.xtgj-nav').show()
          $('.ywxt-nav').hide()
        }
      }
		
      },

    /**
     *  @describe [本地当前时间]
     */
    currentDate: function(){
      var date = new Date();
      var split1 = ".";
      var split2 = ":";
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
     */
    getTime: function(url){
      var split1 = ".";
      var split2 = ":";
      var timeUrl = window.WSBASEURL + 'server/timeNictory'  

      _request.sendWebSocket(timeUrl, function(res){
          var currentdate = res
          //console.log(currentdate)
          var year = currentdate.substr(0, 4)
          var month = currentdate.substr(4, 2)
          var day = currentdate.substr(6, 2)
          var hours  = currentdate.substr(8, 2)
          var minute  = currentdate.substr(10, 2)
          var strDate = year + split1 + month + split1 + day
          var curMinute = hours + split2 + minute 
          $('.current-time').html(strDate+'<span>'+curMinute+'</span>')
      })
    },

    rotatebg: function() {
      var t = 0
      setInterval(function(){
        t++
        $('.rotatebg').css({
            transform: 'rotate('+18*t+'deg)'
        })
        if(t==10){
          t=0
        }
      }, 600)
    },

    /**
     *  @describe [顶部导航初始化]
     */
    init: function(){
      var _self = this
      _self.getTime()
      _self.bindEvent()
      // _self.rotatebg()
    }
  }

  return header
})