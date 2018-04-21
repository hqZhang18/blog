/**
 * @Author:      baizn
 * @DateTime:    2017-05-18 20:37:26
 * @Description: 右上角页面JS文件
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-05-14 20:37:26
 */

define(function(require){

  /**
   * 引入公用的文件
   */
  var util = require('util')
  var constants = require('constants')
  
  /*
  * 引入依赖组件
  */
  var request = require('request')
  var apiURL = require('apiURL')

  /**
   * 引入业务组件
   */
  var left = require('./sourceControll/left')
  var center = require('./sourceControll/center')
  var right = require('./sourceControll/right')
  //选择时间
  var selectTime = require('./components/selectTime.js')
  // 时间控件(到日)
  var datePicker = require('datePicker')
  var self = null

  var SourceIndex = {
    /**
     * 加载数据，渲染页面
     * 
     * @param {string} url 请求接口URL
     * 
     */
    loadData: function(urls) {
      request.sendAjax(urls[0], function(data) {
        //整合页面左半部分数据，并渲染图表
        var leftData = {
          caseAcceptance: data.caseAcceptance,
          objTar: data.objTar
        }
        left.render(leftData)
      })
			
      //中间模块
      request.sendAjax(urls[1], function(data) {
        //系统布控，人工布控
        center.render(data)
      })
    },

    /**
     *  @describe [请求websocket数据]
     *  @param    {[type]}   url       [url]
     *  @param    {[type]}   startTime [开始时间]
     *  @param    {[type]}   endTime   [结束时间]
     */
    getWsData: function(url, startTime, endTime) {
      request.sendAjax(url, function(data){
        //渲染中间图表
        center.renderTypeTotal(data.typeTotal)
      })
    },


    bindEvent: function() {
			var self = this
      //显示时间
      util.showTime()
			
			//点击查询按钮
      util.queryBtn(function(res){
        if(WS){
          WS.close()
        }
        // 获取开始时间
				var startTime = res[0]
				//获取结束时间
				var endTime = res[1]
				self.renderData(startTime, endTime)
      })
    },
    /**
     *  @describe 时间控件回调
     *  @param    {string}   startTime 开始时间
     *  @param    {string}   endTime   结束时间
     */
    datePicker: function(startTime, endTime) {
      if(WS){
        WS.close()
      }
      self.renderData(startTime, endTime)
    },
    /**
     *  @describe [describe]
     *  @param    {[type]}   startTime [description]
     *  @param    {[type]}   endTime   [description]
     *  @return   {[type]}   [description]
     */
    renderData: function(startTime, endTime) {
      var leftUrl = apiURL.sourceControl1 
      var centerUrl = apiURL.sourceControl2
      var wsUrl = apiURL.sourceControl1  
      var dataUrl1 = apiURL.sourceControl1  
      var dataUrl2 = apiURL.sourceControl2  
      var dataUrls = [leftUrl, centerUrl]
      //加载源头控制页面数据，并渲染图表
      this.loadData(dataUrls)
      this.getWsData(wsUrl, startTime, endTime)
    },
    /**
     *  @describe [动效]
     *  @return   {[type]}   [description]
     */
    animationi: function() {
      var t2 = 0
      //小圆转动
      setInterval(function(){
        t2++
        $('.rotatebg').css({
          transform: 'rotate('+18*t2+'deg)'
        })
        if(t2==20){
          t2=0
        }
      }, 300)
    },

    init: function() {
      self = this
     /**
      * 当缩放页面后，进行相应的缩放
      */
      window.addEventListener('resize', function(){
          util.zoom(constants.PAGE_WIDTH, constants.PAGE_HEIGHT)
      })

      util.zoom(constants.PAGE_WIDTH, constants.PAGE_HEIGHT)

      // 获取开始时间
      var startTime = selectTime.init()[0]
      //获取结束时间
      var endTime = selectTime.init()[1]
      this.renderData(startTime, endTime)
      

      //右边模块(近一周数据，查询不发请求)
      var rightUrl = apiURL.sourceControl2 
      request.sendAjax(rightUrl, function(data) {
        right.render(data)
      })
      
      // 事件绑定
      // this.bindEvent()
      this.animationi()
      // 加载时间轴内容
      var datePickerTpl = require('../components/dialog/datePicker.tpl')
      $('.datePicker-container').html(datePickerTpl)
      // 调用时间轴并回调
      datePicker.initPicker('date', '.show-time', 'mouseover',  this.datePicker)
    }
  }

  return SourceIndex
})