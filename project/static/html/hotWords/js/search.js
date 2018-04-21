/**
 * @Author:      zhq
 * @DateTime:    2017-01-19 16:44:27
 * @Description: 热词分析(搜索)
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-19 16:44:27
 */

define(function(require) {

  var popup = require('./popup.js')
  var PageNum = 4
  var baseUrl = window.global.BaseUrl+window.global.details
  var dataUrl = baseUrl+'length/'+''+window.wordLength+'/timeType/'+window.timeType+'/type/'+window.type+'/phrase/'+phrase+''

  var num = 0
  var search = {
    renderData: function(data){
      var availableTags = []
      var str = ''
      for(var i=0,len=data.length; i<len; i++){
        var name = data[i].name
        var ssbFlag = data[i].ssbFlag
        str +='<a ssbFlag='+ssbFlag+'>'+name+'</a>'
      }
     $('.search-list').html(str).show()

    },
    //搜索后台数据
    sentAjax: function(searchUrl){
      var self = this
      $('.loading').show()
      $.get(searchUrl, function(data){
        $('.loading').hide()
        var state = data.status
        if(!state){
          popup.errorTooltip(data.message)
          return
        }
        var data = data.data
        if(data.length==0 || data==null){
          var str ='<a >无匹配结果</a>'
          $('.search-list').html(str).show()
        }else{
          self.renderData(data)
          self.bindEvent(data)
        }
        
        
      })
    },

    bindEvent: function(data){
      //搜索词点击
      var self = this
      $('.search-list').off('click','a')
      $('.search-list').on('click','a', function(e){
        $('.search-list').off('mouseleave')
        $('.search-list').hide()
        
        window.word = $(this).text()
        
        var type = $(this).attr('ssbFlag')
        window.type = type
        if(window.word=='无匹配结果'){
          return
         }
        var word = encodeURI($(this).text()) 
        var phraseUrl = window.phraseBUrl+'length/'+''+window.wordLength+'/word/'+word+'?tabFlag='+type+'&timeType='+window.timeType+''
        console.log(phraseUrl)
        var phraseUrl = './data/phrase1.json'
         //调用弹窗
         popup.init(phraseUrl)
         $('#tags').val(window.word)
      })

      // $('#tags').off('keydown')
      // $('#tags').on('keydown', function(event){
      //   var keycode = event.keyCode    //keycode==8 退格 13回车
      //   if(keycode==8){
      //     $('.search-list').html('').hide()
      //   }
      // })
      //键盘事件
      $('#tags').off('keypress')
      $('#tags').on('keypress', function(event){
         search()
         $('body').on('click', function(e){
            $('.search-list').hide()
          })
      })
      
      //搜索
      function search(){
         var word2 = encodeURI($.trim($('#tags').val())) 
         console.log(word2)
         if(word2 != null && word2!=undefined && word2!=''){
            var searchUrl = window.global.BaseUrl+window.global.search+'/word?word='+word2+'&timeType='+window.timeType+''
            console.log(searchUrl)
            var searchUrl = './data/search.json'
            self.sentAjax(searchUrl)
        }else{
           $('#tags').attr('placeholder', '请输入搜索关键字')
        }
      }

      //点击搜索
      $('#searchBtn').off('click')
      $('#searchBtn').on('click', function(){
        search()
      })

    },

    init: function(data){
      var self = this
      //self.renderData(data)
      self.bindEvent(data)
    }



  } 

  return search
})
