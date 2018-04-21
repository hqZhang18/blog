/**
 * @Author:      baizn、zhanghq
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 快报战果
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */
define(function(require, exports) {
  
    var map = require('./victory/map.js')
    var duibu = require('duibu')  //对部
  
    var _curTime = require('header')
    var _request = require('request')
    var _common = require('commons')
    var thisIndex = '../victory'
    var startTime = ''
    var endTime = ''
    var pageSize = 8
    var curPage = 1
    var totalPage = 0

    //后端地址
    var VICTORYURL = window.WSBASEURL + 'investigation/newNictory' //实时推送数据
    var BASEURL = 'victory/historyVictory'
    //历史记录
 
    //本地数据
    var HISTORYURL = '../data/history-victory.json'
    var VICTORYURL = '../data/victory.json'
    var DUIBUURL = window.BASEURL + 'victory/duibu'
    window.flagInit = true  //初始化标记
    window.typeInit = true
    var mapType = 0
  
    var detailData = [] //详情数据
    var listData = [] //列表数据
    var currentType = 0 //默认加载列表
    var modelTpl = require('../components/dialog/historyVictory.tpl')
    var contentTpl = require('../components/dialog/historySubContent.tpl')
    var myTemplate = Handlebars.compile(modelTpl)
    var contentTpls = Handlebars.compile(contentTpl)

    var index = {

      /**
       *  @describe [地图]
       *  @param    {[type]}   dataUrl [description]
       */
      getMap: function(dataUrl){
       // _request.sendAjax(dataUrl, function(res){
           var mapData = {}
           mapData.duibuTotal = 0
           mapData.map = []
           map.init(thisIndex, mapData, mapType)  //地图
           duibu.init(mapData, DUIBUURL, '快报战果') 
       // })
      },
      
      /**
       *  @describe [快报战果]
       *  @param    {[type]}   dataUrl [description]
       *  @return   {[type]}   [description]
       */
      getVictory: function(dataUrl){
        var t = 0
       window.setTimer = setInterval(function(){
          _request.sendAjax(dataUrl, function(res){
            // var victoryData = JSON.parse(res)
			
            var victoryData = res.result[t]
            if(!!victoryData){
               map.victory(victoryData)
            }

            测试代码
            t++
            if(t==4){
              t = 0
            }
          })
         }, 10000)
      },

      historyModel: function(data) {
        var _self = this
        curPage = 1
        totalPage = data.pageInfo.totalPage
        
        listData = data.list
        detailData = data.detail
  
        $('.history-modal-dialog').html(myTemplate())
        var totalCount = data.pageInfo.totalCount
        _self.noData(totalCount)
        if(totalCount==0){
          $('no-data').show()
        }else{
          $('no-data').hide()
        }
        //注册一个比较大小的Helper,判断v1是否大于v2
        Handlebars.registerHelper('compare',function(v1,v2,options){
          if(v1 == v2){
            //满足添加继续执行
            return options.fn(this);
          }else{
            //不满足条件执行{{else}}部分
            return options.inverse(this);
         }
       })

        $('.sub-content.list').html(contentTpls({
          currentType: 0,
          list: listData
          
        }))
		
		    $('.sub-content.detail').html(contentTpls({
          currentType: 1,
          detail: detailData
        }))

        $('#historyList').fadeIn(800)

        _self.bindEvent()

      },


      /**
       *  @describe [事件绑定]
       *  @return   {[type]}   [description]
       */
      bindEvent: function(){
          var _self = this
          //点击详情
          $('#historyList').on('click', '.btn-detail', function(evt) {
            currentType = 1
          
            //curPage = 1
            $('.sub-content').scrollTop(0)
            $(this).parent().addClass('btn-cur')
            $('.sub-content.list').hide()
            $('.sub-content.detail').show()
          })
          //点击列表
          $('#historyList').on('click', '.btn-list', function(evt) {
            currentType = 0
          
            //curPage = 1
            $('.sub-content').scrollTop(0)
            
            $(this).parent().removeClass('btn-cur')
            $('.sub-content.list').show()
            $('.sub-content.detail').hide()
          })

           //关闭队部弹窗
          $(document).on('click', '.close-model', function(evt){
            $('#historyList').fadeOut(500)
            $('.show-modal-dialog').html('')
          })

          /**
           * 监听鼠标滚动事件，加载新数据
           */
          $(document).off('mousewheel').on('mousewheel', '.sub-content', function(evt) {
            evt.stopPropagation()
            var $this =$(this)
            //可见高度
            var viewH =$(this).height()
            //内容高度
            var contentH =$(this).get(0).scrollHeight
            //滚动高度
            var scrollTop =$(this).scrollTop()
           
            //console.log(scrollTop, scrollTop/(contentH -viewH))
            //快到达底部时,加载新内容
            if(scrollTop/(contentH -viewH) >= 0.95){ 
              /**
               * 通过ajax调用后台数据
               */
              curPage++

              if(curPage>totalPage){
                return
              }
              var dataUrl = window.BASEURL + BASEURL + '/startTime/'+startTime+'/endTime/'+endTime+'/pageSize/'+pageSize+'/currentPage/'+curPage
              
              //var dataUrl = '../../data/history-victory2.json'
              //分页请求
              _request.sendAjax(dataUrl, function(res){
                var data = res.result
                var newDetail = data.detail
                var newList = data.list

                detailData = detailData.concat(newDetail)
				
                listData = listData.concat(newList)

                var currentObj = {
                  detail: detailData
                }
	
                if(currentType == 0) {
                  //更新列表
                  currentObj.currentType = 0
                  $('.sub-content.list').html(contentTpls({
                    list: listData,
                    currentType: currentType
                  }))
                } else {
                  //更新详情
                  currentObj.currentType = 1
                  $('.sub-content.detail').html(contentTpls({
                    detail: detailData,
                    currentType: currentType
                  }))
                }
                  

                 })
            }
            //end if
          })
          
          //时间控件
          _common.timeControl()


         //时间选项里面添加当前时间
         var selectTime =  _curTime.currentDate()
         //开始时间为公安年
         var sYear = selectTime[0]-1
         $('#select-syear').html(sYear)
         $('#select-smonth').html(12)
         $('#select-sday').html(21)
         $('#select-eyear').html(selectTime[0])
         $('#select-emonth').html(selectTime[1])
         $('#select-eday').html(selectTime[2])

       
        //点击确定按钮
        $('#history-sure').on('click', function(evt){
          //开始时间
          var startYear = $.trim($('#select-syear').html()) 
          var startMonth = $.trim($('#select-smonth').html())
          var startDay = $.trim($('#select-sday').html())
          startTime = startYear + startMonth + startDay 
          //结束时间
          var endYear = $.trim($('#select-eyear').html())
          var endMonth = $.trim($('#select-emonth').html())
          var endDay = $.trim($('#select-eday').html())
          endTime = endYear + endMonth + endDay  
          var startTime1 = startYear + '-' + startMonth + '-' + startDay 
          var endTime2 = endYear + '-' + endMonth + '-' + endDay 
          var isTime = _common.checkTime(startTime1, endTime2)
          if(!isTime){
            _common.errorTooltip('开始时间不能大于结束时间')
            return
          }
          
          //查询url
          curPage = 1
          var HISTORYURL = window.BASEURL + BASEURL + '/startTime/'+startTime+'/endTime/'+endTime+'/pageSize/'+pageSize+'/currentPage/'+curPage
         // console.log(HISTORYURL)
          //var HISTORYURL = '../data/history-victory2.json'
          _request.sendAjax(HISTORYURL, function(res){
            var data = res.result
            
            detailData = data.detail
            listData = data.list
            var totalCount = data.pageInfo.totalCount
            _self.noData(totalCount)
            // 加载详情
            $('.sub-content.detail').html(contentTpls({
              currentType: 1,
              detail: detailData
            }))
            //加载列表
            $('.sub-content.list').html(contentTpls({
              currentType: 0,
              list: listData
            }))

            $('.sub-content').scrollTop(0)

          })
          

        })
      },

      noData: function(num){
        if(num==0){
          $('.no-data').show()
        }else{
          $('.no-data').hide()
        }
      },

      init: function() {
        var _self = this
        
        var centerTpl = require('../components/express-victories.tpl')
        
        var myTemplate = Handlebars.compile(centerTpl)
        $('.content').html(myTemplate())

        /*地图*/
        _self.getMap()  //
         /*快报战果*/
        // _self.getVictory(VICTORYURL)  
        //获取时间
         var selectTime =  _curTime.currentDate()
          //开始时间为公安年
         
          //点击历史记录
        $('.history-record-btn').off().on('click', function(evt) {
          evt.stopPropagation()
          startTime =  selectTime[0]-1 + '1221' 
          endTime = selectTime[0] + selectTime[1] + selectTime[2]
		      curPage = 1
          var HISTORYURL = window.BASEURL + BASEURL + '/startTime/'+startTime+'/endTime/'+endTime+'/pageSize/'+pageSize+'/currentPage/'+curPage
          //var HISTORYURL = '../data/history-victory2.json'
          _request.sendAjax(HISTORYURL, function(res){
            var data = res.result
            _self.historyModel(data)
          })
        })  
        
        
      }
    }
  //exports.sis = index
  return index
})