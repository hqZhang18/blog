/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-19 22:58:27
 * @Description: 执法办案主页面
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-19 22:58:27
 */


define(function(require) {

	/**
 	* 引入公用的文件
 	*/
	var util = require('util')
	var constants = require('constants')
	//发送请求
  var request = require('request')
  //URL接口
  var apiURL = require('apiURL')

  //选择时间
  var selectTime = require('./components/selectTime.js')
  // 时间控件(到日)
  var datePicker = require('datePicker')

  /**
  * 引入业务组件
  */
  var left = require('./postSupervision/left.js')
  var center = require('./postSupervision/center.js')
  var right = require('./postSupervision/right.js')

	var violation = require('./components/violation.js')
	var behaviorCount = require('./postSupervision/behaviorCount.js')
  var self = null

  var index = {
    
    /**
     *  @describe [获取数据]
     *  @param    {[type]}   dataUrl [description]
     *  @return   {[type]}   [description]
     */
    getData: function(url) {

      var self = this
      //中间顶部/左边
      request.sendAjax(url[0], function(data) {
        //顶部各类型
        center.typeTotal(data.typeTotal)
        //组装左边部分数据
        var leftData = {
          closingCount: data.closingCount,  //已结案件变量统计
          monthCount: data.monthCount, //按月统计
          quarterCount: data.quarterCount //按季度统计
        }
        left.init(leftData)

        center.init(data)
         //执法通报
        right.enforceLaw(data.enforceLawBulletin)
      
      })

      request.sendAjax(url[1], function(data) {
        //各部门扣分统计
        center.deductCount(data.deductCount)
        //非规范操作行为

        right.nonstandard(data.nonstandard)
        
      })

      

    },


    bindEvent: function() {
      var self = this
      //显示时间
      //util.showTime()

      //点击查询按钮
      util.queryBtn(function(res){
        // 获取开始时间
        var startTime = res[0]
        //获取结束时间
        var endTime = res[1]
        var url1 = apiURL.postSupervision1 + '/' + startTime + '/' + endTime
        var url2 = apiURL.postSupervision2 + '/' + startTime + '/' + endTime
        var urls = [url1, url2]
        self.getData(urls)  
      })
    },

    /**
     *  @describe 时间控件回调
     *  @param    {string}   startTime 开始时间
     *  @param    {string}   endTime   结束时间
     */
    datePicker: function(startTime, endTime) {
      var url1 = apiURL.postSupervision1 + '/' + startTime + '/' + endTime
      var url2 = apiURL.postSupervision2 + '/' + startTime + '/' + endTime
      var urls = [url1, url2]
      self.getData(urls) 
    },

    animationi: function() {
      var t = 0
      //圆转动
      setInterval(function(){
        t++
        $('.type-chartbg').css({
          transform: 'rotate('+18*t+'deg)'
        })
        if(t==20){
          t=0
        }
      }, 350)

      //证据装订材料动画
      var t2 = 0
      setInterval(function(){
        t2++
        $('.materialbg').css({
          opacity : 0.2,
          bottom: '-10px'
        })
        if(t2>2){
          $('.materialbg').css({
            opacity : 0.1*t2,
            bottom: 3*t2 + 'px',
            transform: 'scale('+0.1*t2+')'
          })
        }
        if(t2>8){
         
          $('.materialbg').css({
            opacity : 1,
            bottom: '-10px'
          })
        }
        if(t2==10){
          t2 = 0
        }
      }, 500)
    },

    init: function() {
      self = this
      
      /**
      * 当缩放页面后，进行相应的缩放
      */
      var PAGE_WIDTH = constants.PAGE_WIDTH
      var PAGE_HEIGHT = constants.PAGE_HEIGHT
      window.addEventListener('resize', function(){
          util.zoom(PAGE_WIDTH, PAGE_HEIGHT)
      })

      util.zoom(PAGE_WIDTH, PAGE_HEIGHT)
      // 获取开始时间
      var startTime = selectTime.init()[0]
      //获取结束时间
      var endTime = selectTime.init()[1]
      var url1 = apiURL.postSupervision1 + '/' + startTime + '/' + endTime
      var url2 = apiURL.postSupervision2 + '/' + startTime + '/' + endTime

      var url1 = apiURL.postSupervision1 
      var url2 = apiURL.postSupervision2 
    
      var urls = [url1, url2]
      this.getData(urls)
      //this.bindEvent()
      this.animationi()

      // 加载时间轴内容
      var datePickerTpl = require('../components/dialog/datePicker.tpl')
      $('.datePicker-container').html(datePickerTpl)
      // 调用时间轴并回调
      datePicker.initPicker('date', '.show-time', 'mouseover',  this.datePicker)

      util.scrollUp("nonstandard", 50, 15, 2000) //速度慢了会抖动

      
    }

  } 

  return index
})
