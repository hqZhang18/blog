/**
 * @Author:      zhq
 * @DateTime:    2017-01-17 11:44:27
 * @Description: 热词分析(排行榜)
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-17 11:44:27
 */

define(function(require) {
  var popup = require('./popup.js')
  var phraseBaseUrl = window.global.BaseUrl+window.global.words
  var url2 = phraseBaseUrl+'length/'+''+window.wordLength+'/timeType/'+window.timeType+'/type/'+window.type+'/word/'+window.word+''
  var phraseUrl = './data/phrase.json'

  var rankingList = {
    getData: function(data){

        data.sort(function(a, b) {
          return b.fps - a.fps
        })
        //console.log('排行榜',data)
      $('#TOP15').html('')
       var str = ''
       if(data.length==0){
        return
       }
       var topLen = 0
       if(data.length>15){
          topLen = 15
       }else{
         topLen = data.length
       }
       for(var i=0; i<topLen; i++){
        var word = data[i].name
        var trend = data[i].trend
        var fps = Math.floor(data[i].fps)
        var type = data[i].ssbFlag
        var trendnum = Math.floor(data[i].trendnum)

        var icon = ''
        switch(trend){
          case 1:
            icon = 'icon icon_up'
            break;
          case 0:
             icon = 'icon icon_down'
            break;
          // case 0:
          //     icon = 'icon icon_flat w10'
          //   break;
        } 
         str += '<tr><td class="w5 top'+(i+1)+'">'+(i+1)+'</td><td class="w50 txt" type='+type+'>'+word+'</td>'
         + '<td class="'+icon+'" trendnum = '+trendnum+'></td><td class="num" >'+fps+'<span>次</span></td></tr>'
     
       } 
       $('#TOP15').html(str)

        
    },
    bindEvent: function(data){
      $('#TOP15').off('click', 'tr')
      $('#TOP15').on('click', 'tr', function(e){
        e.preventDefault()
        window.clickHot = true
        window.word = $(this).find('td').eq(1).text()
        window.type = parseInt($(this).find('td').eq(1).attr('type'))
       
        //window.word = '手机被盗' // 测试
        var word  = encodeURI(window.word) 
        var phraseUrl = window.phraseBUrl+'length/'+''+window.wordLength+'/word/'+word+'?tabFlag='+window.type+'&timeType='+window.timeType+''
        console.log(phraseUrl)
       var phraseUrl = './data/phrase2.json'
        //调用弹窗
         popup.init(phraseUrl)
      })

      //鼠标移到排行榜箭头
      $(document).on('mouseover', '.icon', function(e){
        var trendnum = $(this).attr('trendnum')
        var top = e.screenY -230
        $('.trendnum').html(trendnum).css({'top': top+'px'}).show()
      })

      $(document).on('mouseout', '.icon', function(e){
        $('.trendnum').html('').hide()
      })
    },

    init: function(data){
      var self = this
      self.getData(data)
      self.bindEvent(data)
      // popup.init()
      // popup.getPhraseData(phraseUrl)
    }
  }

  return rankingList
})
