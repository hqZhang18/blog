/**
 * @Author:      zhanghq
 * @DateTime:    2017-04-12 10:13:43
 * @Description: 每日值班
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-04-12 10:13:43
 */

define(function(require) {

  var _curTime = require('./header.js')
  var _request = require('./request.js')
  var s = 0
  var _common = require('./common.js')
  var mainTpl = require('../../components/dialog/onDuty.tpl')
  var template = Handlebars.compile(mainTpl)
  var curPage = 1
  var totalPage = 0
  var pageSize = 10
  //默认时间
  var selectTime =  _curTime.currentDate()
  var time = selectTime[0]+selectTime[1]
  var ONDUTYURL = window.global.BaseUrl + 'jizhen-pc/onDuty/time/201703'
  var subTpl = require('../../components/dialog/onDutySubContent.tpl')
  
  var subTemplate = Handlebars.compile(subTpl)
  var OLDDATA = []
  var NEWDATA = []
 
  var totalCount = 0
  var scrollDirection = 0
  var TOPS = []
  var contentTop = 105
  var contentTops = []
  //有正副班的支队
  var zfNames = ['总队领导', '应急备勤', '一支队', '八支队']
  var isloadScroll = true
  var onDuty = {

     renderData:function(datas){
      var _self = this
      var result = datas.result
      var data = result.result
      //加载模板
      
      

      totalCount = result.pageInfo.totalCount
      totalPage = result.pageInfo.totalPage
      
     
      if(data.length==0){
         $('.onDuty-modal-dialog').html(template())
         $('#onDutyDialog').fadeIn(300)
         $('#onDutyDialog').find('.no-data').show()
      }else{
        $('#onDutyDialog').find('.no-data').hide()
         var zhiduiData = []
      for(var j=0, len2 = data[0].team.length; j<len2; j++){
        zhiduiData.push({
          name: data[0].team[j].name
        })
      }
      var datas = []
      var isNull = 0
	    var cells = 0
      var iszfb = 0
      for(var i=0, len = data.length; i<len; i++){
          //后端没有返回想要的数据，重新处理数据
          var newTeam = []
          var currentData = data[i]
          var arr = []
          for(var j=0, len2 = currentData.team.length; j<len2; j++){
            var other = currentData.team[j].other
      			var zbLeng  = data[i].team[j].zb.length
      			var fbLeng  = data[i].team[j].fb.length
            var name = data[i].team[j].name
            //用于判断是否有正副班
            if(zfNames.indexOf(name)==-1){
              other = currentData.team[j].other.split(',')
              iszfb = 0
            }else{
              other = currentData.team[j].other
              iszfb = 1
            }
            //用于判断是否需要展开
            if( other.length > 1 || zbLeng > 5 || fbLeng > 5){
              isNull = 1
            } else {
              isNull = 0
            }
            arr.push(isNull)
            //重组数据

            var teams = {
              zb: data[i].team[j].zb,
              fb: data[i].team[j].fb,
              other: other,
              name: name,
              iszfb: iszfb 
            }
           
             newTeam.push(teams)
          }
         
          if(arr.indexOf(1) > -1) {
            data[i].isNull = 1
          } else {
            data[i].isNull = 0
          }
          //最新数据，渲染到模板
          datas.push({
            time: data[i].time,
            team: newTeam,
            isNull: data[i].isNull
          })
        }
        var html = template({
           data: datas,
           zhidui: zhiduiData
        })

          $('.onDuty-modal-dialog').html(html)
           $('#onDutyDialog').fadeIn(300)
           // debugger
          
         if(datas.length==1){
             cells = 0
          }else{
            cells = 1
          }
          //加载固定导航效果
           var Options = {
                table  : "tb",
                width  : 2986,
                height : 1600,
                rows   : 1,
                cells  : cells
              }
            new Fixed(Options)
          
            if(datas.length==1){

             $('.cdata').find('td').eq(0).remove()
			
            }
            
          }

          //调用事件绑定方法
           _common.timeControl()

           _self.bindEvent()
         //时间选项里面添加当前时间
         var selectTime =  _curTime.currentDate()

         $('#select-syear').html(selectTime[0])
         $('#select-smonth').html(selectTime[1])
          //滚动分布
          if(totalCount>6){
            _self.loadScroll(data)
          }
      
     
    },

    bindEvent: function(){
      var _self = this
      $(document).on('click', '.slide-hide', function(evt){
        //其他全部收起
        $('.onDuty-content').find('.slide-btn')
                      .html('展开')
                      .addClass('slide-hide')
                      .removeClass('slide-show')
                      .css({'margin-top': '100px'})
					  

        $(this).html('收起').addClass('slide-show').removeClass('slide-hide')
		    $('.onDuty-content').find('.cdata p').css({'white-space': 'nowrap'})

          var parents = $(this).parents().parents().parents()
          var index = parents.index()
          parents.find('.hide').show()
          parents.find('.num-n').hide()
        
          
          var content = $('.onDuty-content').find('.cdata').eq(index) 
          content.css({'height': 'auto'})
         content.find('td').css({'height': 'auto'})
		      content.find('p').css({'white-space': 'normal'})
         $('#tb .cdata td').css({'float': 'left'})
         $('.onDuty-content').find('.item-left').eq(index).css({'height': 'auto'}) //右边日期的高度
         content.find('.hide').hide()
        content.find('.num-n').show()
        var rHeight = content.height()
        $(this).css({'margin-top': rHeight-120+'px'})

       })

       //收起
      $(document).on('click', '.slide-show', function(evt){
         $(this).html('展开').removeClass('slide-show').addClass('slide-hide').css({'margin-top': '100px'})
        var isNull = parseInt($(this).attr('isnull'), 10)
        var parents = $(this).parents().parents().parents()
        var index = parents.index()
        if(isNull==1){
          parents.find('.hide').show()
        }else{
          parents.find('.hide').hide()
        }
        
        parents.find('.num-n').hide()
        var content = $('.onDuty-content').find('.cdata').eq(index) 
         content.find('td').css({'height': '235px'})
		 content.find('p').css({'white-space': 'nowrap'})
       
         
      })

      //选择时间后查询
      $('#zhiban-sure').on('click', function(evt){
        var year = $.trim($('#select-syear').html())
        var month = $.trim($('#select-smonth').html())

        time = year + month 
        curPage = 1
        var dataUrl = window.global.BaseUrl + window.global.ONDUTY + '/time/'+ time + '/pageSize/'+pageSize+'/currentPage/'+curPage

        var dataUrl = '../data/onDuty.json'
         _request.sendAjax(dataUrl, function(res){

          var data = res.result.result
          NEWDATA = []
          OLDDATA = []
          if(data.length!=0){
            $('.onDuty-content').scrollTop(0)

            //隐藏
            $('#onDutyDialog').find('.no-data').hide()
          }
          totalCount = res.result.pageInfo.totalCount
          totalPage = res.result.pageInfo.totalPage
          _self.loadData(data)
        })
         
      })

      //关闭
      $('.close').on('click', function(evt){
        $('#onDutyDialog').fadeOut(600)
        $('.onDuty-modal-dialog').html('')
      })

      //点击导出
    $('.export').on('click', function(evt){
		console.log('export')
        var tpl = require('../../components/dialog/selectTime.tpl')
        var template = Handlebars.compile(tpl)
        var html = template({})
        $('.onDuty-selectTime-dialog').html(html)
        $('#exportSelect').fadeIn(200)
       _common.timeControl()
	   
        //时间选项里面添加当前时间
       var selectTime =  _curTime.currentDate()
       //导出的时间为1个月
       var sMonth = selectTime[1]-1
       if(sMonth < 10){
         sMonth = '0' + sMonth 
       }
       $('#select-syear2').html(selectTime[0])
       $('#select-smonth2').html(sMonth)
       $('#select-sday2').html(selectTime[2])
       $('#select-eyear2').html(selectTime[0])
       $('#select-emonth2').html(selectTime[1])
       $('#select-eday2').html(selectTime[2])
       
      })
      var isDay = false
      //导出时间确定
      $(document).off('click', '#onDutyTimeSure').on('click', '#onDutyTimeSure', function(evt){
        //开始时间
        var startYear = $.trim($('#select-syear2').html()) 
        var startMonth = $.trim($('#select-smonth2').html())
        var startDay = $.trim($('#select-sday2').html())
        var startTime = startYear + startMonth + startDay 
        //结束时间
        var endYear = $.trim($('#select-eyear2').html())
        var endMonth = $.trim($('#select-emonth2').html())
        var endDay = $.trim($('#select-eday2').html())
        var endTime = endYear + endMonth + endDay  
        var time =   endTime - startTime

        var startTime1 = startYear + '-' + startMonth + '-' + startDay 
        var endTime2 = endYear + '-' + endMonth + '-' + endDay 
        var time = _common.dateDiff(startTime1, endTime2)
		    var time2 = _common.checkTime(startTime1, endTime2)
		
        if(!time2){
           _common.errorTooltip('开始时间不能大于结束时间')
          return
        }
        if(time>30 || startYear == endYear && endMonth == startMonth && endDay < startDay){
          _common.errorTooltip('最多只能导出30天以内的数据')
		      return
        }
		

        var dataUrl = window.BASEURL + 'investigation/zhiban/export/startTime/'+startTime+'/endTime/'+endTime

        window.open(dataUrl)
      
	   
      })

      $(document).on('click', '#closeOndutyTime', function(evt){
        $('#exportSelect').fadeOut(200)
      })

      //横向滚动
      $(document).on('mousedown', '.onDuty-content', function(evt) {
         $('.zhidui-fixed').hide()
         $('.zhidui-relative').hide()
         $('.onDuty-content').css({'margin-top': '0', 'height': '1600px'})
      })

    },

  
    loadScroll: function(data){
        var _self = this
        OLDDATA = data
        NEWDATA = []
        /**
         * 监听鼠标滚动事件，加载新数据
         */   
        $(document).off('mousewheel').on('mousewheel', '.fixedTableDiv', function(evt) {
          var $this =$(this)
          //可见高度
          var viewH =$(this).height()
          //内容高度
          var contentH =$(this).get(0).scrollHeight
          //滚动高度
          var scrollTop =$(this).scrollTop()
           
          //console.log('viewH', viewH, 'contentH', contentH,  'scrollTop', scrollTop, scrollTop/(contentH -viewH))
          //console.log(scrollTop, scrollTop/(contentH -viewH))
            
          if(scrollTop/(contentH -viewH) >= 0 && isloadScroll){ 

               curPage ++
               
              if(curPage > totalPage){
                return
              }
          
               var dataUrl = window.global.BaseUrl + window.global.ONDUTY + '/time/'+ time + '/pageSize/'+pageSize+'/currentPage/'+curPage
        
              var dataUrl = '../data/onDuty2.json'
              isloadScroll = false
            _request.sendAjax(dataUrl, function(res){
                isloadScroll = true  // 前一页面数据返回了才加载后一页
                var newData = res.result.result
                 if(newData.length==0){
                   return
                }
                _self.loadData(OLDDATA.concat(newData))
            })
          }
        })

      },

      loadData: function(data){

        var _self = this
        NEWDATA = NEWDATA.concat(data)

        if(NEWDATA.length==0){
			 $('.onDuty-content').html('')
			 $('#onDutyDialog').find('.no-data').show()
			 
		 }else{
			 $('#onDutyDialog').find('.no-data').hide()
			 var zhiduiData = []
			for(var j=0, len2 = data[0].team.length; j<len2; j++){
			  zhiduiData.push({
				name: data[0].team[j].name
			  })
			}
			var datas = []
			var isNull 
      var iszfb = 0
			var cells  = 0
			for(var i=0, len = NEWDATA.length; i<len; i++){
			  var newTeam = []
			  var arr = []
			  for(var j=0, len2 = NEWDATA[i].team.length; j<len2; j++){
				var other = NEWDATA[i].team[j].other
				var zbLeng  = data[i].team[j].zb.length
				var fbLeng  = data[i].team[j].fb.length
        var name = NEWDATA[i].team[j].name
        //用于判断是否有正副班
        if(zfNames.indexOf(name)==-1){
          other = NEWDATA[i].team[j].other.split(',')
          iszfb = 0
        }else{
          other = NEWDATA[i].team[j].other
          iszfb = 1
        }
        //用于判断是否需要展开
				if( other.length > 1 || zbLeng > 5 || fbLeng > 5){
				  isNull = 1
				} else {
				  isNull = 0
				}
				arr.push(isNull)
				
				var teams = {
				  zb: NEWDATA[i].team[j].zb,
				  fb: NEWDATA[i].team[j].fb,
				  other: other,
				  name: name,
          iszfb: iszfb
				}

				newTeam.push(teams)
			  }
			  if(arr.indexOf(1) > -1) {
				  data[i].isNull = 1
			  } else {
				  data[i].isNull = 0
			  }
			  datas.push({
  				time: NEWDATA[i].time,
  				team: newTeam,
  				isNull: data[i].isNull
			  })
			}
	 
			var html = subTemplate({
			  data: datas,
			  zhidui: zhiduiData
			})

			$('.onDuty-content').html(html)

			if(datas.length==1){
             cells = 0
			}else{
				cells = 1
			}
          //加载固定导航效果
           var Options = {
                table  : "tb",
                width  : 2986,
                height : 1600,
                rows   : 1,
                cells  : cells
              }
			  new Fixed(Options)
			if(datas.length==1){
				$('.cdata').find('td').eq(0).remove()
            }
			  if(totalCount>6){
				  _self.loadScroll(data)
			   }
			 }
         
      },

    init: function(data){
      time = selectTime[0]+selectTime[1]
      curPage = 1
      isloadScroll = true

      var _self = this
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
      _self.renderData(data) 
    }


  }

  return onDuty
})