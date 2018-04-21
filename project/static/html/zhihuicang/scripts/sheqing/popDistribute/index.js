/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-08-31 10:28:11
 * @Description:  中下页面JS入口
 */

define(function(require) {
  /**
   *  引用功能模块
   */
  require('jquery')
  var util = require('util')
  var request = require('request')
  var apiURL = require('baseConfig')
  
  /**
   *  引入Mock数据
   */
  require('popDistribute')
  /**
   *  引入业务模块
   */
  var topList = require('./topList.js')
  // 引入地图图表组件
  var map = require('cqMap')
  var time = apiURL.TIME  // 时间参数默认当前月
  var timer = null
  var stime = 0 //列表切换的时间， 
  var etime = 1000 // 提前1秒切换
  
  // TOP排行榜的切换时间  定为10s，最小值为cssTime(2000) * 2，即保证列表的CSS进场和退场过渡能进行完整
  var topTime = 10000
  var pageSize = 10

  var Index = {

    /**
     *  获取数据
     *  @param    {string}  time 时间参数
     */
    fetchApi: function(time) {
      var self = this
       //请求数据
      request.sendAjax(apiURL.popDistribute + time, function(data) {
        //默认渲染--全部人口
        var allData = data.all

        stime = (allData.areaCity.length + allData.mainCity.length) / pageSize
        /* TOP排行10秒切换一次，和页10条，总条数/10 = 总页数 
         *  总时间 = 总页数 * 10000 , -1000是因为提前一点点切换到下一页，不然切换的时候第一页排行榜也会出现一次
        */
        stime = Math.ceil(stime) * topTime - etime

        topList.render(allData.areaCity.concat(allData.mainCity))
        map('.all-main-city', '.all-area-city', data.all)
        // 常住人口
        map('.permanent-main-city', '.permanent-area-city', data.permanent)
        // 暂住人口
        map('.temporary-main-city', '.temporary-area-city', data.temporary)
        // 调用事件绑定
        self.bindEvent(data)
        // 调用定时切换
        self.setInterVal(data, 1, stime)
      })
    },

    /**
     *  事件绑定
     *  @example: [example]
     *  @param    {[type]}  data [description]
     *  @return   {[type]}  [description]
     */ 
     
    bindEvent: function(data) {
      var self = this
      // 点击导航
      $('.pop-distribute-nav li').on('click',function() {
        // 清除定时器
        clearTimeout(timer) 
        $(this).addClass('active').siblings().removeClass('active')
        var index = $(this).index()
        var dataType = $(this).attr('data-type')
        // 调用切换地图
        self.switchMap(data, dataType, index)
        // 隔30秒后再调用
        var curData = data[dataType] 
        // 计算时间
        stime = (curData.areaCity.length + curData.mainCity.length) / pageSize
        stime = Math.ceil(stime) * topTime  - etime 

        // 调用定时器
        setTimeout(function() {
          self.setInterVal(data, index, stime)
        }, stime)
      })
    },

    /**
     *  定时切换分局展示
     */
    setInterVal: function(data, num, time) {
      var t = num
      /* switch 里面的time计算
      *  TOP排行10秒切换一次，和页10条，总条数/10 = 总页数 
      *  总时间 = 总页数 * 10000 , -1000是因为提前一点点切换到下一页，不然切换的时候第一页排行榜也会出现一次
      */
      var stime = time
      var self = this
      timer = setTimeout(function () {
          switch(t) {
            case 0:
              type = 'all' // 全部人口 
              var allData = data.all
              stime = (allData.areaCity.length + allData.mainCity.length) / pageSize
              stime = Math.ceil(stime) * topTime - etime
              break;
            case 1:
              type = 'permanent' // 常住人口
              var perData = data.permanent
              stime = (perData.areaCity.length + perData.mainCity.length) / pageSize
              stime = Math.ceil(stime) * topTime - etime
              break;
            case 2:
              type = 'temporary' // 暂住人口
              var temData = data.temporary
              stime = (temData.areaCity.length + temData.mainCity.length) / pageSize
              stime = Math.ceil(stime) * topTime - etime
              break;  
          }
          $('.pop-distribute-nav li').removeClass('active')
          $('.pop-distribute-nav li').eq(t).addClass('active')
          self.switchMap(data, type, t)
          t++
          // 大于2的时候从第一条切换
          if(t>2) {
            t = 0
          }
        // 回调
        timer = setTimeout(arguments.callee, stime)
      },stime)
    },

    /**
     *  切换地图
     *  @param    {[type]}  data  [description]
     *  @param    {[type]}  index [description]
     *  @return   {[type]}  [description]
     */
    switchMap: function(data, dataType, index) {
      // 隐藏其他两块地图
      $('.cqmap-main-city').hide()
      $('.cqmap-area-city').hide()
      $('#popTopList').html('')
      // 显示当前地图
      $('.pop-distribute-wap').find('.cqmap-main-city').eq(index).show()
      $('.pop-distribute-wap').find('.cqmap-area-city').eq(index).show()
      var filterData = data[dataType].areaCity.concat(data[dataType].mainCity)
      topList.render(filterData)
    },

    /*
      初始化
     */
    init: function() {
      /**
       * 当缩放页面后，进行相应的缩放
       */
      window.addEventListener('resize', function() {
        util.zoom()
      })

      util.zoom()
      this.fetchApi(time)
     
    }
  }
  return Index
})