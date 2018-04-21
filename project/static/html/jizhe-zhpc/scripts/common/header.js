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

      $('.sub-nav').off().on('click', 'a', function(evt){
	      evt.stopPropagation()
        evt.preventDefault()
       //关闭WebSocket
        if(WS) {
          WS.close()
        }
  			var thisName = $(this).html()
  			$(document).find('title').html(thisName)
        
        window.isMapInit = true //地图初始化
        // 案件类型清空为0
        window.oneType = 0
        window.deviceState = 0  //设备状态
        window.childType = 0
        //地区清空为0
        window.troopsId = 0
        //当前时间，默认不传
        window.startTime = '00000'
        window.endTime = '00000'
        window.isMainCity = false
        window.zdSecondMap = false 
        window.secondMap = false
        window.citySecondMap = false
        window.isInit = false
        window.clickNav = true //是否点击了导航
        window.isCategory = false
  			window.indexs = [0]
  			window.mapUrl = window.global.mapPath+'/map/chongqing.json'
        window.cityMainMap = false
       
        // 判断是否初始化
        window.flagInit = true
        //获取地图类型（行政区，支队）
        window.mapType = parseInt($(this).attr('mapType'), 10)  
        //判断是否有时间轴
        window.isTime = parseInt($(this).attr('time'), 10)  
        
        /* 获取点击导航的className*/
        var thisNav = $(this).attr('id')
        window.victoryId = thisNav+'Victory'
        //快报战果时替换body背景
        if(thisNav=='victory'){
          $('body').addClass('victorybg')
        }else{
          $('body').addClass('all-bodyBg').removeClass('victorybg')
        }
        window.thisNavs = thisNav
        var homeUrl = '../scripts/'+thisNav+'.js'
        // 加载相应的模块主文件
        window.init(homeUrl)
        // 当前导航添加样式其他全部移除
        $(this).addClass('cur').siblings().removeClass('cur')
			 $('.vicoryTooltip').remove()
        $('.carouselPoint').remove()
      })
		
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
      _self.bindEvent(index)
      // _self.rotatebg()
    }
  }

  return header
})