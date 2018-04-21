/**
 * @Author:      baizn
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 通用工具方法
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */

define(function(require) {
	
	require('jquery')
	require('handlebars')
	require('d3')
	require('lodash')
  

  //时间控件
  var selectTime = require('./../components/selectTime.js')

  var constans = require('./constants')

  var common = {
 
    /**
     *  @describe [按照比例缩放页面]
     *  @param    {[type]}   x [页面实际宽度]
     *  @param    {[type]}   y [页面实际高度]
     *  @return   {[type]}   [description]
     */
    zoom: function(w, h){
      window.X = window.innerWidth/w 
      window.Y = window.innerHeight/h

      var x=window.innerWidth/w
      var y=window.innerHeight/h
     
      $('body').css('webkitTransform','scale(' + x + ',' + y + ')')   /* for Chrome || Safari */
      $('body').css('msTransform','scale(' + x + ',' + y + ')')       /* for Firefox */
      $('body').css('mozTransform','scale(' + x + ',' + y + ')')      /* for IE */
      $('body').css('oTransform','scale(' + x + ',' + y + ')')        /* for Opera */  

    },

    /**
     *  @describe [错误提示]
     *  @param    {[type]}   data [提示内容]
     */
    errorTooltip: function(data){
      var errorTpl = require('../../components/dialog/errorDialog.tpl')
      var template = Handlebars.compile(errorTpl)
      var html = template({
        data: data
      }) 
      $('.error-dialog').html(html)
      $('#errorDialog').fadeIn(50)
      //关闭错误提示
      $('#errorDialog').on('click', '.close-model', function(evt){
         evt.stopPropagation()
         evt.preventDefault()
        $('#errorDialog').fadeOut(50)
        $('.error-dialog').html('')
      })
      return
    },
		

    /**
     *  @describe [时间查询按钮]
     *  @return   {[type]}   [开始时间和结束时间]
     */
    queryBtn: function(callback) {
      var self= this
      $(document).on('click', '#queryBtn', function(evt) {
      
        // 获取开始时间
        var startTime = self.getChooseTime()[0]
        //获取结束时间
        var endTime = self.getChooseTime()[1]
        //开始/结束时间处理用于判断
        var startTime1 = startTime.slice(0, 4) + '-' +  startTime.slice(4) + '-00'
        var endTime1 = endTime.slice(0, 4) + '-' +  endTime.slice(4) + '-00'       
        var checkTime = selectTime.checkTime(startTime1, endTime1)
        if(!checkTime) {
          return self.errorTooltip('开始时间不能大于结束时间')
        }
        callback && callback([startTime, endTime])
      })
    },

    /**
     *  @describe [显示时间]
     *  @return   {[type]}   [description]
     */
    showTime: function() {
      $('.show-time').on('mouseover', function(evt) {
        //显示时间控件
        $('.select-time').show()
         //点击空白处关闭
        $(document).mouseup(function(e){
          var _con = $('.select-time')   // 设置目标区域
          if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
            $('.select-time').hide()
          }
        })
      })

      // $('.select-time').hover(function () {
      //   $(this).show()
      // }, function () {
      //   $('.select-time').hide()
      // })
    },

    /**
     *  @describe [获取时间]
     *  @return   {[type]}   [description]
     */
    getChooseTime: function(){
      // 获取开始时间
      var startTime = $.trim( $('.default-start-time').html() )
      startTime = startTime.replace(/[^0-9]/ig, '') 
      //获取结束时间
      var endTime = $.trim( $('.default-end-time').html() )
      endTime = endTime.replace(/[^0-9]/ig, '') 
      return [startTime, endTime]
    },
     /**
   * 数据容器向上滚动通用方法 -- 间歇性滚动
   * 前提是容器高度限制，设置了overflow:hidden，内容高度超过了高度限制
   * id：限制高度的容器
   * iListHeight：单行滚动高度
   * speed：滚动速度
   * delay：间歇时间
   */
    scrollUp:function(id,iListHeight,speed,delay) {
      var target = document.getElementById(id);
      var timer = null;
      target.scrollTop = 0;
      //target.innerHTML += target.innerHTML;//克隆一份一样的内容
      function startScrollList(){
          timer = setInterval(function(){
            scrollUpList()
          }, speed);
          target.scrollTop++;
      }
      function scrollUpList(){
          if(target.scrollTop % iListHeight == 0){
              clearInterval(timer);
              setTimeout(startScrollList, delay);
          }else{
              target.scrollTop++;
              if(target.scrollTop >= target.scrollHeight / 2){
                //延迟归0，不然最后一条无法显示
                //setTimeout(function() {
                  target.scrollTop =0;
               // }, 4000)
              }
          }
      }
      setTimeout(startScrollList, delay)
    },
    registerHelper: function() {
       Handlebars.registerHelper('addOne', function(index) {
          return index +1
        })
    }
  }
  common.registerHelper()
  return common
})
