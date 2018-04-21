/**
 * @Author:      zhq
 * @DateTime:    2017-01-17 09:44:27
 * @Description: 热词分析
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-17 09:44:27
 */

define(function(require) {

  require('./canvas.js')
  var search = require('./search.js')
  var rankingList = require('./rankingList')
  var popup = require('./popup.js')
  var tagscloud = require('./tagscloud.js')

  window.wordLength = 70
  window.type = 0
  window.timeType='week'
  window.word = ''
  var setTime =0
  var setPopup = 0
  var ALLDATA =[]
  window.clickHot = false
  //后台地址
  window.phraseBUrl = window.global.BaseUrl+window.global.words
  var baseUrl = window.global.BaseUrl+window.global.Analysis
  var dataUrl = baseUrl+'length/'+''+window.wordLength+'?timeType='+window.timeType+'&tabFlag='+window.type+''
  var phraseUrl = window.phraseBUrl+'length/'+''+window.wordLength+'/word/'+window.word+'?tabFlag='+window.type+'&timeType='+window.timeType+'' 

  //本地测试数据
  var dataUrl = './data/words0.json'
  var phraseUrl = './data/phrase1.json'
  var wordsAnalysis = {

     // 获取所有热词
    getData: function(dataUrl){
      $('.loading').show()
      var self = this
     
      $.get(dataUrl, function(data){
        $('.loading').hide()
        console.log(data)
        var state = data.status
        if(state){
          ALLDATA = data.data
          var len = ALLDATA.length
          if(len==0){
            $('#noData').show()
          }else{
            $('#noData').hide()
          }
          
          var topData  = JSON.parse(JSON.stringify(ALLDATA))
          self.renderData(ALLDATA) //添加热词
          rankingList.init(topData) //排行榜
          //搜索
          search.init(ALLDATA)
        }else{
          popup.errorTooltip(data.message)
        }
        
      })
    },
    
    //渲染所有热词数据
    renderData: function(data){
      var self = this
      $('#tagscloud').html('')
      //打乱顺序，随机显示颜色
      data.sort(function(a, b) {
        return a.name < b.name
      })
     
      var hotWords = ''

        for(var i=0, len = data.length; i<len; i++){
          var words = data[i].name
          // var random = Math.random() + 1
          // var size = Math.floor(random * 30)
          // if(size < 5 ){
          //   console.log(size)
          //   size = size * 2 + 30
          // }
          // if(size<10 && size>5 ){
          //   console.log(size)
          //   size = size * 2 + 20
          // }
         
          //console.log(size)
          var source = parseInt(data[i].ssbFlag)
          var str = ''
          switch(source){
            case 1:
              str = '<a class="tagc1" type='+source+'>'+words+'</a>'
              break;
            case 2:
              str = '<a class="tagc3" type='+source+'>'+words+'</a>'
              break;
            case 3:
              str = '<a class="tagc2" type='+source+'>'+words+'</a>'
              break;
          } 
          hotWords += str
        }
        
        $('#tagscloud').html(hotWords)
        tagscloud.selectDom()
        //动画
        // if(data.length<=40){
        //   //var margin = (window.wordLength - data.length)/8.5
        //   //$('#tagscloud a').css({'margin': margin+'%'})
        //   //判断ie
        //   if (window.navigator.userAgent.indexOf("MSIE")>=1) {
        //     self.setTimes(1000)
        //   }else{
        //     self.setTimes(2000)
        //   } 
        // }else{
        //   //判断ie
        //    console.log(window.navigator.userAgent.indexOf("MSIE"))
        //   if (window.navigator.userAgent.indexOf("MSIE")>=1) {
        //       self.setTimes(100)
        //   }else{
        //     self.setTimes(300)
        //   } 
        // }
        
    },

     setTimes: function(time){
        setTime = setInterval(function(){
        var len = Math.floor(Math.random() * ALLDATA.length)
        var size = Math.floor(Math.random() * 42)
        var top = Math.floor(Math.random() * 900)
        var left = Math.floor(Math.random() * 1100) - 40
        //console.log(top, left)
          if(left>950){
            left = left - 100
          }
          if(top>800){
            top = top - 160
          }
          if(top<100){
            top = top + 50
          }
          if(size<12 && size > 6){
            size = size * 5
          }
          if(size<6){
            size = size * 8
          }
         // console.log('top',top, 'left', left, 'size', size)
          var tags = $(document).find('#tagscloud a')
          var hasClass = tags.hasClass('scale')
          tags.eq(len).addClass('scale2')
          tags.eq(len+1).addClass('scale2')
          if(hasClass){
            tags.eq(len+1).addClass('scale2')
          }else{
            tags.eq(len).addClass('scale')
          }
          var hasClass2 = tags.hasClass('scale2')
          if(hasClass2){
            tags.eq(len).addClass('scale')
          }else{
            tags.eq(len+1).addClass('scale2')
          }

          tags.eq(len).css({'top': top+'px', 'left': left+'px', 'font-size': size+'px'})

        },time)
    },

    // 绑定点击事件
    bindEvent: function(){
      //选择时间
      var self = this
      $('.selectTime').off('click', 'span')
      $('.selectTime').on('click', 'span', function(e){
          clickPopup() //关闭弹窗
          $(this).addClass('cur').siblings().removeClass('cur')
          window.timeType = $(this).attr('name')
          window.type = 0
          var dataUrl = baseUrl+'length/'+''+window.wordLength+'?timeType='+window.timeType+'&tabFlag='+window.type+''
          if(window.timeType=='year'){
            var dataUrl = './data/words2.json'
          }else{
            var dataUrl = './data/words0.json'
          }
          clearInterval(window.setTime)
          self.getData(dataUrl)

      })

      //点击热词
      $('#tagscloud').off('click', 'a')
      $('#tagscloud').on('click', 'a', function(e){
          e.preventDefault()
          var $this = $(this)
          stopAinam($this) //停止动画
          window.word = $(this).text() 
          window.type = parseInt($(this).attr('type'))
          window.clickHot = true

          var word = encodeURI($(this).text())
          var phraseUrl = window.phraseBUrl+'length/'+''+window.wordLength+'/word/'+word+'?tabFlag='+window.type+'&timeType='+window.timeType+''
          console.log(phraseUrl)
          if(window.type==1){
            var phraseUrl = './data/phrase2.json'
          }else{
            var phraseUrl = './data/phrase1.json'
          }
          popup.init(phraseUrl)  
        })
        
      //鼠标放到热词上停止动画
      // $('#tagscloud').off('mouseover')
      // $('#tagscloud').on('mouseenter', 'a', function(e){
      //   var $this = $(this)
      //   stopAinam($this)
        
      // })
      // $('#tagscloud').on('mouseleave', 'a', function(e){
      //   var $this = $(this) 
      //   setInterval(function(){
      //     $this.addClass('scale')
      //   }, 1500)
      // })

      //停止动画
      function stopAinam(cur){
        cur.removeClass('scale')
        cur.removeClass('scale2')
        cur.addClass('stop')
      }

       //关闭弹窗
     function clickPopup(){
        $('.popup').fadeOut("slow")
        $('.line').fadeOut("slow")
        $('.text').fadeOut("slow")
        $('#tags').val('')
        $('.overstep').hide()
     }

    },
     //获取当前时间
    currentDate: function() {
        var date = new Date();
        var seperator1 = ".";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var minute = date.getMinutes()
        var seconds = date.getSeconds()
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (minute >= 1 && minute <= 9) {
            minute = "0" + minute;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + minute
                + seperator2 + seconds;
      $('.currentTime').html(currentdate)
    },

    init: function(){
      var self = this
      self.bindEvent()
      //显示当前时间
       setInterval(function(){
          self.currentDate()
      },1000) 

      
      self.getData(dataUrl)
     
    }
  }

  return wordsAnalysis
})
