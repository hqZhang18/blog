/*
 * @Author: lee
 * @Date:   2017-05-22
 * @Email: liwei@hiynn.com
 * @describ: 过程监督页面
 */
define(function(require) {
  require('d3')
  require("jquery")
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
  var left = require('./progressvision/left')
  var right = require('./progressvision/right')
  var center = require('./progressvision/center')
  //选择时间
  var selectTime = require('./components/selectTime.js')
  // 时间控件(到日)
  var datePicker = require('datePicker')
  /**
   * 引入模版
   */
  var centerModuleTpl = require('../components/progressvision/prgvCenterDetail.tpl')
  var centerModuleHmlt = Handlebars.compile(centerModuleTpl);
  var temFlag = ''

 /**
 * 注册页面中间部分模版
 */

  var saveData 
  var isCheck = false
  var saveLeftData
  var self = null

  var progressVision = {
    //初始化渲染页面
    init: function(){
      self = this
      
      this.zoom();
      
      /**
       * 页面中间部分，初始渲染 centerModuleTpl 模版
       * 点击右侧执法分析模型后渲染 centerDetailTpl 模版
       */
      // 获取开始时间
      var startTime = selectTime.init()[0]
      //获取结束时间
      var endTime = selectTime.init()[1]
      $(".center").html(centerModuleHmlt());
      this.renderData(startTime, endTime)

      this.bindEvent()

      // 加载时间轴内容
      var datePickerTpl = require('../components/dialog/datePicker.tpl')
      $('.datePicker-container').html(datePickerTpl)
      // 调用时间轴并回调
      datePicker.initPicker('date', '.show-time', 'mouseover',  this.datePicker)

      util.scrollUp('countgressList', 50, 15, 5000);//速度慢了会抖动
      util.scrollUp('moduleList', 56, 15, 5000);


    },

    getWsData: function(url, startTime, endTime) {
      request.sendAjax(url, function(data){
        left.renderCheckgress(data);
      })
    },

    /**
     *  @describe [获取左右两边的数据]
     *  @param    {[type]}   url [description]
     *  @return   {[type]}   [description]
     */
    getData: function(urls) {
      
      request.sendAjax(urls[0], function(data) {
        saveLeftData = data.enforceLawCount
        //是否点击了执法审核流程
        if(!isCheck){
          left.renderCountgress(data.enforceLawCount);
        }
      })

      temFlag = parseInt($('.center').children().attr('template'), 10)
     //template=0是过程监督，1为模型分析
     //此处判读避免在模型分析点查询的时候调用此数据，如果调用了没有模块会报错哦
      if(temFlag==0){
        centerModuleTpl = require('../components/progressvision/prgvCenterDetail.tpl')
        centerModuleHmlt = Handlebars.compile(centerModuleTpl)
        $(".center").html(centerModuleHmlt())
         //过程监督中间数据
        request.sendAjax(urls[1], function(data) {
          //顶部各类型
          center.renderTotalList(data.typeTotal)
          //各手段提请量统计
          center.renderSkillDetail(data.meansCount)
          //业务维度
          center.renderCircle(data.ywwdCount)
          //操作行为统计
          center.renderCzxwCount(data.czxwCount)
        })
      }else{
        centerModuleTpl = require('../components/progressvision/prgvCenterModule.tpl')
        centerModuleHmlt = Handlebars.compile(centerModuleTpl)
        $(".center").html(centerModuleHmlt())
        // var name = $('#moduleList').find('.cur').attr("data-name")
        var name = $('#moduleList').find('li').eq(0).attr("data-name")
        console.log(name)
        $('#modelName').html('['+name+'] 统计图')
         var url = '../data/progressvision/mxfx.json'
        //模型分析中间数据
        request.sendAjax(urls[2],function(data) {
          center.renderNumberCount(data.moduleCount);
          //从其他接口保存的数据
          center.renderCaseTop(saveData.caseNumTop10);
          center.renderDepartmentTop(saveData.departmentNumTop10);
        })
      }
      
    },


    /**
     *  @describe [获取右边模块数据]
     *  @param    {[type]}   url [description]
     *  @return   {[type]}   [description]
     */
    getRightData: function(url) {
      request.sendAjax(url, function(data) {
        //右边模块
        saveData = data
        right.renderAlzModel(data)
      })
    },

    /**
     *  @describe [渲染所有数据]
     *  @param    {[type]}   startTime [description]
     *  @param    {[type]}   endTime   [description]
     *  @return   {[type]}   [description]
     */
    renderData: function(startTime, endTime) {
      var leftUrl = apiURL.progressvision1 + '/' + startTime + '/' + endTime
      var leftUrl = '../data/progressvision/left.json'
      var leftUrl2 = apiURL.progressvision2  
      var rightUrl = apiURL.modelAnalysis1  
      var rightUrl2 = ''
      //
      temFlag = parseInt($('.center').children().attr('template'), 10)
      if(temFlag==1){
        var name = $('#moduleList').find('.cur').attr("data-name")
        console.log(name)
        //模型分析号码统计
        rightUrl2 = apiURL.modelAnalysis2  
      }
      
      var urls = [leftUrl, leftUrl2, rightUrl2]
      //本地测试
      var leftUrl = apiURL.progressvision1
      var rightUrl = apiURL.modelAnalysis1 
      var wsUrl = apiURL.zhifaWsURL
      this.getData(urls)
      this.getRightData(rightUrl)
      this.getWsData(wsUrl, startTime, endTime)
    },

    bindEvent: function(data) {
      var self = this
   
      //显示时间
      // util.showTime()

      /**
       *  点击审核流程
       */
      $('.lawCheck').on('click', function() {
        isCheck = true
        if(WS){
          WS.close()
        }
        centerModuleTpl = require('../components/progressvision/prgvCenterDetail.tpl')
        centerModuleHmlt = Handlebars.compile(centerModuleTpl)
        $(".center").html(centerModuleHmlt())
        // 获取开始时间
        var startTime = util.getChooseTime()[0]
        //获取结束时间
        var endTime = util.getChooseTime()[1]
        self.renderData(startTime, endTime)
      })

      /**
       *  点击执法分析模型
       */
      $('.lawModel').on('click', function() {
        if(WS){
          WS.close()
        }
          centerModuleTpl = require('../components/progressvision/prgvCenterModule.tpl')
          centerModuleHmlt = Handlebars.compile(centerModuleTpl)
          $(".center").html(centerModuleHmlt())
          var target = $('#moduleList').find('li').eq(0)
          var name = target.attr("data-name")
          target.addClass('cur')
          $('#modelName').html('['+name+'] 统计图')
          var startTime = util.getChooseTime()[0]
          //获取结束时间
          var endTime = util.getChooseTime()[1]
          //号码统计图接口
          var url = apiURL.modelAnalysis2 + '/' + name + '/' + startTime + '/' + endTime
          var url = '../data/progressvision/mxfx.json'
          request.sendAjax(url,function(data) {
            center.renderNumberCount(data.moduleCount);
            //这里是其他接口保存的数据
            center.renderCaseTop(saveData.caseNumTop10);
            center.renderDepartmentTop(saveData.departmentNumTop10);
          })

      })

      /**
       *  点击查询按钮
       */
      //点击查询按钮
      // util.queryBtn(function(res){
      //   if(WS){
      //     WS.close()
      //   }
      //   saveLeftData = [] // 查询后清空左边的数据
      //   // 获取开始时间
      //   var startTime = res[0]
      //   //获取结束时间
      //   var endTime = res[1] 

       
      //  self.renderData(startTime, endTime)
        
      // })

      //按部门排序(使用默认数据)
      var description = $('.countgress-list-til span:nth-child(1)')
      description.off('click').on('click', function(evt) {
        left.renderCountgress(saveLeftData)
      })

      //总数量排序
      var total = $('.countgress-list-til span:nth-child(2)')
      total.off('click').on('click', function(evt) {
        var data = saveLeftData.slice(0)
        data.sort(function(a, b) {
          return parseInt(b.value, 10) - parseInt(a.value, 10)
        })
        left.renderCountgress(data)
      })

      //退回率排序
      var returns = $('.countgress-list-til span:nth-child(3)')
      returns.off('click').on('click', function(evt) {
        var data = saveLeftData.slice(0)
        data.sort(function(a, b) {
          var value1 = a.returnRote.substr(0, a.returnRote.length - 1)
          var value2 = b.returnRote.substr(0, b.returnRote.length - 1)
          return parseFloat(value2, 10) - parseFloat(value1, 10)
        })
        left.renderCountgress(data)
      })

      //终止率排序
      var end = $('.countgress-list-til span:nth-child(4)')
      end.off('click').on('click', function(evt) {
        console.log()
        var data = saveLeftData.slice(0)
        data.sort(function(a, b) {
          var value1 = a.endRate.substr(0, a.endRate.length - 1)
          var value2 = b.endRate.substr(0, b.endRate.length - 1)
          return parseFloat(value2, 10) - parseFloat(value1, 10)
        })
        left.renderCountgress(data)
      })

      // 点击支队审核流程
      $('.all-zhidui b').on('click', function(event) {
        var tpl = require('../components/progressvision/allZhidui.tpl')
        var template = Handlebars.compile(tpl)
      
        var html = template({
          title: '执法支队审核流程统计',
          data: saveLeftData
        })
        $('.all-zhidui-dialog').html(html)
      })

      $(document).on('click', '.close-model', function(event) {
        $('.all-zhidui-dialog').html('')
      })

    },
    renderModel: function() {

    },

    renderDetail: function() {

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
      saveLeftData = [] // 查询后清空左边的数据
       self.renderData(startTime, endTime)
    },
    //页面缩放
    zoom:function() {
      window.addEventListener('resize', function(){
          util.zoom(constants.PAGE_WIDTH, constants.PAGE_HEIGHT);
      })
      util.zoom(constants.PAGE_WIDTH, constants.PAGE_HEIGHT);
    }
    
  }
  return progressVision;
})