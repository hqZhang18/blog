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
  //左边模块
  var mainLeft = require('./main/left.js')
  //中间模块
  var mainCenter = require('./main/center.js') 
  //右边模块
  var mainRight = require('./main/right.js') 
  //时间控件
  var selectTime = require('./components/selectTime.js')
  // 时间控件(到日)
  var datePicker = require('datePicker')
  //URL接口
  var apiURL = require('apiURL')
  //WebSocketUrl
  var wsUrl = apiURL.mainWsURL 

  var config = {}
  // 日志数据
  var logData = {}
  //中间 顶部类型数据
  var topData = {}
  // 保存this
  var self = null

  var index = {

    /**
     *  @describe [获取数据]
     *  @param    {[type]}   url [请求地址]
     */
    getData: function(url) {
      // 发送http请求
      request.sendAjax(url, function(data){
        //左边数据组装
        var leftData =  {
          caseAcceptance: data.caseAcceptance,  //案件受理总数
          objectTotal:data.objectTotal, //对象总量
          targetTotal: data.targetTotal,   //目标总量
          markCode: data.markCode //各类标识码
        }
        //调用左边模块
        mainLeft.init(leftData)
        //扣分统计
        var deductData = {
          deductionCount: data.deductionCount
        }
        mainCenter.deductCount(deductData)
        //右边数据组装
        var rightData = {
          lawDoc: data.lawDoc,  //法律文书
          insideDoc: data.insideDoc, //内部使用文书
          closingTotal: data.closingTotal, //结案总量
          transferCase: data.transferCase
        }
        //调用右边模块
        mainRight.init(rightData)
      })
    },
  
    /**
     *  @describe [获取WebSocket数据]
     *  @param    {[type]}   wsUrl     [地址]
     *  @param    {[type]}   startTime [开始时间]
     *  @param    {[type]}   endTime   [结束时间]
     */
    getWsData: function(url, startTime, endTime) {
        var r1 = new DigitRoll({
            container: '#num-roll'
        })

       request.sendAjax(url, function(data){
       // request.sendWebSocket(url, startTime, endTime, function(data){
        logData = {
         logCount: data.logCount,
         total: data.total
       }
        topData = {
          typeTotal: data.typeTotal
        }
         //顶部总量
         mainCenter.topTotal(topData)
         //日志
         //debugger
         mainCenter.logCount(logData, r1)
      })
    },
    

    /**
     *  @describe [事件绑定]
     *  @return   {[type]}   [description]
     */
    bindEvent: function() {
      var self = this
      //显示时间
      //util.showTime()
      //点击查询按钮
      util.queryBtn(function(res){
        //清除定时器

        clearInterval(window.timecaseTotal)
        clearInterval(window.timeobjectTotal)
        clearInterval(window.timetargetTotal)
        clearInterval(window.timeclosingTotal)
        // 获取开始时间
        var startTime = res[0]
        //获取结束时间
        var endTime = res[1]

        var dataUrl = apiURL.mainURL + '/' + startTime + '/' + endTime
        if(WS){
          WS.close()
        }
        self.getData(dataUrl)
        self.getWsData(wsUrl, startTime, endTime)
      })
    },

    /**
     *  @describe 时间控件回调
     *  @param    {string}   startTime 开始时间
     *  @param    {string}   endTime   结束时间
     */
    datePicker: function(startTime, endTime) {
      clearInterval(window.timecaseTotal)
      clearInterval(window.timeobjectTotal)
      clearInterval(window.timetargetTotal)
      clearInterval(window.timeclosingTotal)
      console.log(startTime, endTime)
      var dataUrl = apiURL.mainURL + '/' + startTime + '/' + endTime
      if(WS){
        WS.close()
      }
      console.log(dataUrl)
      self.getData(dataUrl)
      self.getWsData(wsUrl, startTime, endTime)
    },

    /**
     *  @describe [动画]
     *  @return   {[type]}   [description]
     */
    animationi: function() {
      var t = 0
      setInterval(function(){
        t++
        $('.scalebg').css({
          opacity: 0.2*t,
          transform: 'scale('+0.1*t+')'
        })
        
        if(t==10){
          $('.scalebg').css({
            opacity: 0.2,
            transform: 'scale(1.1)'
          })
          t=0
        }
      }, 600)
      var t2 = 0
      //小圆转动
      setInterval(function(){
        t2++
        $('.rotatebg').css({
            transform: 'rotate('+18*t2+'deg)'
        })
        $('.ballBg').css({
            transform: 'rotate('+18*t2+'deg)'
        })
        if(t2==20){
          t2=0
        }
      }, 300)
      //线条
      var t3 = 0
      setInterval(function() {
        t3 ++
        $('.connect-line').css({
          'stroke-dashoffset': -2*t3
        })
        if(t3==20){
          t3 = 0
        }
      },100)
    },

    /**
     *  @describe [初始化]
     */
    init: function() {
      self = this

      /**
      * 当缩放页面后，进行相应的缩放
      */
      var PAGE_WIDTH = constants.MAIN_PAGE_WIDTH
      var PAGE_HEIGHT = constants.MAIN_PAGE_HEIGHT
      window.addEventListener('resize', function(){
          util.zoom(PAGE_WIDTH, PAGE_HEIGHT)
      })
      util.zoom(PAGE_WIDTH, PAGE_HEIGHT)

      // 获取开始时间
      var startTime = selectTime.init()[0]
      //获取结束时间
      var endTime = selectTime.init()[1]
      var dataUrl = apiURL.mainURL + '/' + startTime + '/' + endTime

       var dataUrl = apiURL.mainURL
       var wsUrl = apiURL.mainWsURL
 
      this.getData(dataUrl)
      this.getWsData(wsUrl, startTime, endTime)
      // 时间选择到日，不用原来的时间控件，改用运维的时间控件
      // this.bindEvent()
      this.animationi()

      // 加载时间轴内容
      var datePickerTpl = require('../components/dialog/datePicker.tpl')
      $('.datePicker-container').html(datePickerTpl)
      // 调用时间轴并回调
      datePicker.initPicker('date', '.show-time', 'mouseover',  this.datePicker)
      // 页面容易死掉，6小时刷新一次
      setTimeout(function() {
          window.location.reload()
      },21600000)
      
    }

  } 

  return index
})
