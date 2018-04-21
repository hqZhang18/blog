/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-24 10:05:58
 * @Description: 底部案件类型（点击查看全部的操作）
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-03-24 10:05:58
 */

define(function(require){


  
  var _request = require('./request.js')
  var modelTpl = require('../../components/dialog/showCaseAllDialog.tpl')
  var contentTpl = require('../../components/dialog/showCaseAllSub.tpl')
  var allTemplate = Handlebars.compile(modelTpl)
  var ALLDATAS = []
  //分页
  var pageSize = 13
  var curPage = 1
  var totalPage = 0
  var linear 
  var isloadScroll = true// 用于限制滚动加载
 
  function indexOf(arr, str){
    // 如果可以的话，调用原生方法
    if(arr && arr.indexOf){
        return arr.indexOf(str);
    }
     
    var len = arr.length;
    for(var i = 0; i < len; i++){
        // 定位该元素位置
        if(arr[i] == str){
            return i;
        }
    }
    // 数组中不存在该元素
    return -1;
  }

  var caseNumbers = {

    /**
     *  @describe [事件绑定]
     *  @param    {[array]}   element [选择的元素]
     *  @param    {[string]}   url     [接口地址]
     */
    bindEvent: function(element, url){
      var _self = this
      for(var i=0, len = element.length; i<len; i++){
        var $this = element[i].elem
        var type = element[i].type

        var title = element[i].title
        var ratio = element[i].ratio
        _self.showAll(url, $this, type, title, ratio)
      }

      //鼠标放上去显示全部数据
      // $(document).on('mouseover', '#rankingName', function(evt){
      //   var name = $(this).html()
      //   //$(this).attr('title', name)
      //  // console.log(evt)
      //   if(name.length>4){
      //     $(this).css('cursor', 'pointer')
      //     var top = evt.pageY /window.Y - 60 //比例还原要除以缩放比例的值
      //     var left = evt.pageX /window.X 
      //     var elem = '<div class="ranking-tooltip" style="top: '+top+'px; left: '+left+'px">'+name+'</div>'
      //     $('body').append(elem)
      //   }
      // })
      // $(document).on('mouseout', '#rankingName', function(evt){
      //   $('.ranking-tooltip').remove()
      // })

    },

    showAll: function(url, $this, type, title, ratio){
      var _self = this
      //console.log(ratio)
        $this.off().on('click', (function(ratio){
          isloadScroll = true
          return function(evt){
          evt.stopPropagation()
          curPage = 1 
          ALLDATAS = []
          var dataUrl = _self.commonUrl(type, url)

          //var dataUrl = '../../data/caseNumberAll2.json'
          var dataset = []
          _request.sendAjax(dataUrl, function(res){

            var datas = res.result
            var ALLDATA = []
            var totalCount = res.result.pageInfo.totalCount
            totalPage = res.result.pageInfo.totalPage
            
            for(var item in datas){
              ALLDATA.push(datas[item])
            }
            var data = ALLDATA[0]
            for(var i=0, len=data.length; i<len; i++){
              dataset.push(data[i].value)
            }
            var max = d3.max(dataset)
            linear = d3.scale.linear()
                .domain([0, max])
                .range([0, 590])

            var datas = []

            for(var j=0, len2=data.length; j<len2; j++){
              var oValue = data[j].value
              var value = 0
              if(ratio){
                value = Math.floor(oValue*100) + '%'
              }else{
                value = oValue
              }
              var dataW = linear(oValue)
              if(dataW>590){
                dataW = 590
              }
              if(dataW<10 && dataW>0){
                dataW = 10
              }
              
              datas.push({
                value:value,
                name: data[j].name,
                dataW: dataW
              })
            } 

            var html = allTemplate({
              title: title,
              data: datas
            })
            ALLDATAS = datas
            $('.show-modal-dialog').html(html)
            $('#showAll').fadeIn(300)
            
            
            if(data.length==0){
             $('#showAll').find('.no-data').show()
            }else{
             $('#showAll').find('.no-data').hide()
            }
            if(totalCount>10){
              //加载分页滚动
              _self.loadScroll(datas, title, type, url, ratio)
              
            }

          })  
          
        }})(ratio))
    },

    loadScroll: function(data, title, type, url, ratio){
      /**
       * 监听鼠标滚动事件，加载新数据
       */
      var _self = this
      var datas = data
     
      $(document).off('mousewheel').on('mousewheel', '#caseRanking', function(evt) {
        evt.stopPropagation()
        var $this =$(this)
        //可见高度
        var viewH =$(this).height()
        //内容高度
        var contentH =$(this).get(0).scrollHeight
        //滚动高度
        var scrollTop =$(this).scrollTop()
        //console.log(scrollTop, scrollTop/(contentH -viewH))
	
        if(scrollTop/(contentH -viewH) >= 0.1 && isloadScroll){ 
          curPage++
          isloadScroll = false
          if(curPage>totalPage){
            return
          }
          
          var dataUrl = _self.commonUrl(type, url)
          _request.sendAjax(dataUrl, function(res){
            isloadScroll = true  // 前一页面数据返回了才加载后一页
            var datas = res.result
            var data = []
            for(var item in datas){
              data.push(datas[item])
            }

            ALLDATAS = ALLDATAS.concat(data[0])
            var newData = []
            //处理数据
            for(var j=0, len2=ALLDATAS.length; j<len2; j++){
              var oValue = ALLDATAS[j].value
              var value = 0
              //这里有按百分比显示和正常显示，所以要处理下值
              // console.log('oValue', oValue)
              if( typeof oValue == 'string' ){
                oValue = parseInt(oValue.replace('%', ''), 10)/100
              }

              var dataW = linear(oValue)
              //console.log(dataW, value)
              if(dataW>590){
                dataW = 590
              }
 
              if(dataW<10 && dataW>0){
                dataW = 10
              }
              //这里有按百分比显示和正常显示，所以要处理下值
              if(ratio){
                value = Math.floor(oValue*100) + '%'
              }else{
                value = oValue
              }
              //console.log('ratio', ratio, 'value', value)
              newData.push({
                value:value,
                name: ALLDATAS[j].name,
                dataW: dataW
              })
            } 
            // 添加数据
            var contentTpls = Handlebars.compile(contentTpl)
            var html = contentTpls({
              title: title,
              data: newData
            })
            $('.ranking-lists').html(html)
          })
        }
        // $(this).css('overflow-y', 'auto')
          $('.pageNext').hide()
      })
    },

    commonUrl: function(type, url){
      var pageCommonUrl = '/all/'+type+'/pageSize/'+pageSize+'/currentPage/'+curPage
      var commonUrl = '/type/'+window.oneType+'/childType/'+window.childType+'/troopsId/'+window.troopsId+''
      var commonTimeUrl = '/startTime/'+window.startTime+'/endTime/'+window.endTime
      if(!window.isTime){
          var dataUrl = url + commonUrl + pageCommonUrl
      }else{
          var dataUrl = url + commonUrl + commonTimeUrl + pageCommonUrl
      }
      var navs = ['equipmentResource', 'personnelFrequently', 'telecomResources', 'victory']
      var thisNav = window.thisNavs
      var index = indexOf(navs, thisNav)
      //0设备资源, 1人员在勤， 2电信资源
      switch(index){
        case 0:  
          var commonUrl = '/type/'+window.oneType+'/deviceState/'+window.deviceState+'/troopsId/' + window.troopsId2
          var dataUrl = window.BASEURL + 'equipmentResource/deviceNumber' + commonUrl + pageCommonUrl
          break;
        case 1:
          var commonUrl = '/troopsId/' + window.troopsId2
          var dataUrl = window.BASEURL + 'personnelFrequently/attendanceNumber' + commonUrl + pageCommonUrl
          break;
        case 2:
          var commonUrl = '/troopsId/' + window.troopsId
          var dataUrl = window.BASEURL + 'telecomResources/attendanceNumber' + commonUrl + pageCommonUrl
      }

     var dataUrl = '../../data/caseNumberAll2.json'
      return dataUrl
    },

    init: function(element, url){
      var _self = this

      _self.bindEvent(element, url)
      Handlebars.registerHelper("addOne", function(index){      
        return index+1 
      })
    }
  }

  return caseNumbers

})

