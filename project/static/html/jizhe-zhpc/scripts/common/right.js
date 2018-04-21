/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-13 11:33:27
 * @Description: 右边模块JS文件
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-03-13 11:33:27
 */


define(function(require){
  /**
   * 引入公用的文件
   */
  var _request = require('./request.js')
  var _curTime = require('./header.js')
  var right = {

    /**
     *  @describe [渲染数据]
     *  @param    {[array]}   data [数据]
     */
    renderData: function(data){

      //警令发布
      var jinglin = $('.bells-release').find('.details')
      var policeData = data.policeOrders
      var total = policeData.zs
      var wqs = policeData.wqs
      var policeData = policeData.list
      var str = ''
      var style = ''
      var signNum = 0
      var dataLen = policeData.length
      for(var i=0; i<dataLen; i++){
        var state = policeData[i].state
        var title = policeData[i].title
        if(title.length>12){
          title = title.substr(0, 12) + '...'
        }
        if(state==0){
          style = 'not-sign'
          signNum += 1
        }else{
          style = 'sign'
        }
        str += '<p class='+style+' titles='+policeData[i].title+'>'+title+'</p>'
      }

      var signTotal = '<div class="signTotal">未签收<span>'+wqs+'</span>/'+total+'</div>'
      jinglin.html(signTotal+str)

      //要情发布
      var yaoqing = $('.important-info').find('.details')
      var importantData = data.importantInfo
      var str2 = ''
      var yqlen = importantData.length

      for(var i=0, len=yqlen; i<len; i++){
        var title2 = importantData[i].title
        if(title2.length>12){
          title2 = title2.substr(0, 12) + '...'
        }
        str2 += '<p titles='+importantData[i].title+'>'+ title2 +'</p>'
      }
      yaoqing.html(str2)
      if(yqlen==0){
        yaoqing.html('<div style="text-align: center">暂无数据</div>')
      }

      //每日值班
      var dailyOnDutyData = data.dailyOnDuty
      //指挥中心人员
      var commandCentre = dailyOnDutyData.bgs
      var NAMES = ['总队领导正班', '总队领导副班', '值班长', '值班员',  '指挥中心', '情报支队', '车班', '执法支队', '技术研究所', '应急支队正班', '应急支队副班']
      var str3 = ''
      
      var n = 0
      for(var item in dailyOnDutyData){
        var values = dailyOnDutyData[item]
        var name = NAMES[n]
        if(values.length==0){
          values = ['无']
        }
        n++
        if(n<10){
          
        if(n==5){
          var value2 = ''
          for(var j=0, len = values.length; j<len; j++){
            value2 += '<span>'+values[j]+'</span>' 
          }
            str3 += '<div class="leader2"><p>'+name+'</p>'+value2+'</div>'
          }else{
            str3 += '<p class="leader">'+name+'<span>'+values[0]+'</span></p>' 
         }
        }else{
          var value = ''
          for(var j=0, len = values.length; j<len; j++){
            value += '<span>'+values[j]+'</span>' 
          }
          str3 += '<div class="leader2"><p>'+name+'</p>'+value+'</div>'
        }
      }
    
       $('.daily-on-duty').find('.details').html(str3)

    },

    bindEvent: function(url){

      //显示警令发布详情
      var jinglin = $('.bells-release').find('.details p')
      var detailsDom = $('.show-details')
      //showDetails(jinglin, 1)      

       //显示要情发布详情
      var yaoqing = $('.important-info').find('.details p')
      showDetails(yaoqing, 2)      

      /**
       *  @describe [显示内容详情]
       *  @param    {[type]}   $this [哪个类型的详情]
       *  @param    {[type]}   type [类型标记，1为警令,2为要情]
       *  @return   {[type]}   [description]
       */
      function showDetails($this, type) {
        $this.off().on('mouseover', function(evt){
        evt.stopPropagation()
        evt.preventDefault()
        var top = evt.clientY + 90 
        if(type==2){
          top = top + 200
        }
        var details = $(this).attr('details')
        // console.log(details)
        if(details != '' ){
          $(this).css('cursor', 'pointer')
          detailsDom.html(details)
          var height = detailsDom.height()
          detailsDom.css('top', top - height + 'px').fadeIn()
        }else{
          detailsDom.hide().html('')
        }
      })

        $this.on('mouseout', function(evt){
          evt.stopPropagation()
          evt.preventDefault()
          detailsDom.hide().html('')
        })
      }

      //警令发布全部
      var jlAll = $('.bells-release').find('.all')
      showall(jlAll, 0)

      //要情发布全部
      var yqAll = $('.important-info').find('.all')
      showall(yqAll, 1)
      /**
       * @describe [点击查看全部]]
       * @param  {[type]} $this [当前点击按钮]
       * @param  {[type]} type   [类型]
       */
      function showall($this, type) {
        $this.on('click', function(evt){
          var pageSize = 10
          var curPage = 1
          var allDialog = require('../../components/dialog/showAllDialog.tpl')
          var allTemplate = Handlebars.compile(allDialog)
          //警令发布
          var ZZRELEASEURL = window.BASEURL + 'investigation/release/type/'+type+'/pageSize/'+pageSize+'/currentPage/'+curPage  
          var ZZRELEASEURL = '../../data/releaseAll2.json'
          _request.sendAjax(ZZRELEASEURL, function(res){
            
          var data = []
          var title = ''
          var jlDetails = []
          if(type==0){
            var datas = res.result.policeOrders
            title =  '警令发布'
            var style = ''
            var signNum = 0 //未签收
            var zwSignNum = 0 //暂未签收
            for(var i=0, len = datas.length; i<len; i++){
              var state = datas[i].state
              var titles = datas[i].title
              // 详情要排版处理
              var details = datas[i].details
              details  = details.replace(/(\r\n)|(\n)/g, '<br/>')
              jlDetails.push(details)
              if(state==0){
                style = 'not-sign'
                signNum += 1
              }else if(state==3){
                style = 'was-sign'
                zwSignNum += 1
              }else{
                style  = ''
              }
              data.push({
                title: titles,
                details: details,
                state: state,
                class: style
              })
            }
            
          }else{
            var datas = res.result.importantInfo
            for(var i=0, len = datas.length; i<len; i++){
              var details = datas[i].details

              jlDetails.push(details)
            } 
            data = res.result.importantInfo,
            title =  '要情发布'
          }
          var html = allTemplate({
              data: data,
              title: title,
              zwSignNum: zwSignNum,
              signNum: signNum
          })
          $('.show-modal-dialog').html(html)
          // 文字要排版，只能对详情单独处理了
          for(var j=0, len = jlDetails.length; j<len; j++) {
            $('.all-details'+(j+1)).html(jlDetails[j])
          }
          if(type==1){
            $('.release-state').hide()
            $('.release-lists').css('top', '280px')
          }
          $('#showAll').fadeIn(300)
            
          })
        })
      }

      // 有详情才高亮
      $(document).off('click').on('mouseover', '.release-lists li', function(event) {
        var details = $(this).attr('details')
        if(details!='') {
          $(this).css({
            background: '#171f2d',
          })
        }else {
          $(this).find('span').css({
            cursor: 'default'
          })
        }
      })

      // 鼠标移离当前行，判断下面的div是否显示，未移出高亮 样式
      $(document).off('click').on('mouseout', '.release-lists li', function(event) {
        $('.release-lists li').css('background', '#1b2a44')
        var isdisshow = $(this).find('div').css('display')
        if(isdisshow=='block'){
          $(this).css('background', '#171f2d')
        }
      })
      
      // 点击查看全部标题里面的第一条
      $(document).off('click').on('click', '.release-lists li span', function(event) {
        // 没有详情return
        var details = $(this).parent().attr('details')
        if(details=='') {
          return
        }
        $(this).parent().css('background', '#171f2d').siblings().css('background', '#1b2a44')
        // 当前下面的div显示
        $(this).parent().find('div').slideToggle() 
        // 其他的div隐藏
        $(this).parent().siblings().find('div').slideUp()
      })

      // 查看全部点击关闭
      $(document).on('click', '.close-model', function(event) {
        $('.show-modal-dialog').html('')
      })


      //点击每日值班
      var zhiban = $('.daily-on-duty').find('.all')
      zhiban.on('click', function(evt){
        evt.stopPropagation()
        var _onDuty = require('./onDuty.js')
        var selectTime =  _curTime.currentDate()
        var time = $.trim(selectTime[0]+selectTime[1])
		    //time = '201701'
        var pageSize = 10
        var curPage = 1
        var dataUrl = window.global.BaseUrl + window.global.ONDUTY + '/time/'+ time +'/pageSize/'+pageSize+'/currentPage/'+curPage
        
        var dataUrl = '../data/onDuty.json'
        _request.sendAjax(dataUrl, function(res){
          var data = res
          _onDuty.init(data) 
        })
      })

      $('#showTitle .details p').on('mouseover', function(evt){
        var title = $(this).attr('titles')
        var top = evt.pageY /window.Y 
        if(title.length>12){
          $(this).css('cursor', 'pointer')
          var elem =  $('.show-all-title')
          elem.html(title)
          top = top - elem.height() - 60
          elem.css('top', top + 'px').show()
        }
      })
      $('.details p').on('mouseout', function(evt){
        $('.show-all-title').html('').hide()
      })


    },

    /**
     *  @describe [初始化]
     *  @param    {[type]}   data [数据]
     */
    init: function(data){
      var _self = this

      _self.renderData(data)
      _self.bindEvent()
    }
  }

  return right
})