/*
 * @Author: zhanghongqiao,tangquankun, zhouyu
 * @Date:   2016-12-20
 * @description：警情雷达图总览
 * @File Name: index.js
 */

define(function (require) {
  var drawRader = require('./indexRadarChart')
  require('./lib/d3.v3.min')
  var getYear = 2016
  var click = true
  var names = ['最低', '中心城区平均', '近三年分局平均', '去年', '当前', '最高']
  var radar = {
    sentAjax: function (Year, data) {
      
      var _self = this
      year = Year
      var mycfg = {
        w: 990,
        h: 890,
        maxValue: 10,
        levels: 5,
        ExtraWidthX: 200
      }
      var radarData = data.data.radarMap

      drawRader.draw('#radarChart', radarData, mycfg)
      _self.legend()
      _self.renderType(data.data)
    },


    renderType: function (data) {

      //警情
      var jqData = data.typeValue[0]
      var typeData = data.typeValue

      var typeScale = []
      var len = typeData.length
      for (var i = 0; i < len; i++) {
        var mark = typeData[i].mark
        if (mark == true) {
          var icon = 'up'
        } else if (mark == false) {
          var icon = 'down'
        } else {
          var icon = ''
        }

        var scale = '<div class="title">' + typeData[i].name + '</div>'
            + '<div class="ratio">'
            + '<span>同比</span><b>' + typeData[i].scale + '%</b>'
            + '<i class=' + icon + '></i>'
            + '</div>'
        typeScale.push(scale)
      }

      //对数组进行从小到大排序
      var riseData = function(data){
          return data.sort(function(a,b){
              return a-b
          })
      }
      //对将要排序的数组进行变量存储，防止对数组排序后，影响其原来数组的顺序，（变量类型和引用类型）
      var lastData = function(data){
          var Arr = new Array()
          data.forEach(function(item){
            Arr.push(item)
          }) 
          return Arr
      }
      /**
       * 获取元素在数组中的位置
       * @param  {[number]} item [传入的元素，并获取该元素的位置]
       * @param  {[number]} init [数组从哪个点开始循环]
       * @param  {[array]} data [数组数据]
       * @return {[number]}      [item在data中位置]
       */
      var getPosition = function(init,item,data){
          var len = data.length
          for (var i = init; i < len; i++) {
            if (item == data[i]) {
              return i
            }
          }
      }


      var typeStr = []
      for (var i = 0 ;i < len; i++) {
        var m = -1 
        var savePosition = []   //存放位置的数组
        var typeVal = typeData[i].values
        var arr = lastData(typeVal)     //原来的数据
        var sortData = riseData(typeVal)//从小到大的排序后的顺序
        var str = ''
        for (var j = 0, len2 = sortData.length; j < len2; j++) {
          /*
          *如果两次获取的位置一样，就从此位置的下一个位置开始，再次循环一次获取位置
          *example 
          *第一次getPosition(0,5,[1,5,6,3,5]) ==>>1        k=1,m=1
          *第二次getPosition(0,5,[1,5,6,3,5]) ==>>1  因为第一次的k与第二次的值一样，所以在执行一次获取位置的getPosition(2,5,[1,5,6,3,5]) ==>>4
          */
          var k = getPosition(0,sortData[j],arr)
          if ($.inArray(k,savePosition)>-1) {
             var start = m+1
             k = getPosition(start,sortData[j],arr)
          }
          m = k
          savePosition.push(k)
          //当前年底部小图标
          var botIcon = ''
          if (k == 4) {
            botIcon = '<div class="botIcon"></div>'
          }
          str += '<div class="valueCont color' + (k + 1) + '">'
              + '<div class="line"></div>'
              + '<div class="rect"></div>'
              + '<div class="value">'
              + '<p>' + names[k] + '</p>'
              + '<p>' + sortData[j] + '</p>'
              + '</div>'
              + '' + botIcon + ''
              + '</div>'
        }
        typeStr.push(str)
      }
      var jqDom = typeScale[0] + '<div class="valueBox">' + typeStr[0] + '</div>'
      var adminDom = typeScale[1] + '<div class="valueBox">' + typeStr[1] + '</div>'

      $('.jingq').html(jqDom)
      $('.admin').html(adminDom)

      var divLen = $('.wrap').find('.typeValue').length

      for (var i = 0; i < len; i++) {
        var html = typeScale[i] + '<div class="valueBox">' + typeStr[i] + '</div>'
        $('.wrap').find('.typeValue').eq(i).html(html)
      }

    },

    legend: function () {
      $('#yearS span').text(year + '年')
      $('#yearE span').text('预测')
      var legendW = $('#legend').width()
      $('.legend').css('left', (1440 - legendW) / 2)
    },

    //电流根据各分辨率重新定位
    lines: function () {
      //var w = window.screen.width
      var w = window.innerWidth
      var h = window.innerHeight
      var line1 = $('#line1').find('path')
      var line2 = $('#line2').find('path')
      var line3 = $('#line3').find('path')
      var line4 = $('#line4').find('path')
      var line5 = $('#line5').find('path')
      console.log(w)

      function _linesSetAttr1366() {
        //第一版链接图片背景
        // line1.attr('d', 'M305,258 L200,258 L110,186')
        // line2.attr('d', 'M450,220 L200,220 L110,186')
        // line3.attr('d', 'M0,127 L520,127 L635,164')
        // line4.attr('d', 'M10,20 L120,20 L255,127')
        // line5.attr('d', 'M4,70 L250,70 L400,127')
        //去掉链接图片背景
        line1.attr('d', 'M305,258 L160,258 L0,186')
        line2.attr('d', 'M450,220 L160,220 L0,186')
        line3.attr('d', 'M5,127 L600,127 L730,200')
        line4.attr('d', 'M0,20 L200,20 L360,180')
        line5.attr('d', 'M0,70 L330,70 L500,180')
      }
      function _linesSetAttr1440() {
        //第一版链接图片背景
        // line1.attr('d', 'M305,258 L200,258 L110,186')
        // line2.attr('d', 'M450,220 L200,220 L110,186')
        // line3.attr('d', 'M0,127 L520,127 L635,164')
        // line4.attr('d', 'M10,20 L120,20 L255,127')
        // line5.attr('d', 'M4,70 L250,70 L400,127')
        //去掉链接图片背景
        line1.attr('d', 'M305,258 L160,258 L0,186')
        line2.attr('d', 'M450,220 L160,220 L0,186')
        line3.attr('d', 'M15,127 600,127 L730,200')
        line4.attr('d', 'M50,20 200,20 L360,180')
        line5.attr('d', 'M35,70 L330,70 L500,180')
      }

     
      function _linesSetAttr1920() {
        //第一版链接图片背景
        // line1.attr('d', 'M305,258 L200,258 L110,186')
        // line2.attr('d', 'M450,220 L200,220 L110,186')
        // line3.attr('d', 'M0,127 L520,127 L635,164')
        // line4.attr('d', 'M10,20 L120,20 L255,127')
        // line5.attr('d', 'M4,70 L250,70 L400,127')
        //去掉链接图片背景
        line1.attr('d', 'M305,258 L160,258 L0,186')
        line2.attr('d', 'M450,220 L160,220 L0,186')
        line3.attr('d', 'M5,127 L600,127 L730,200')
        line4.attr('d', 'M0,20 L200,20 L360,180')
        line5.attr('d', 'M15,70 L330,70 L500,180')
      }

      if (w <= 1366) {
        console.log('w<=1366')
        $('.rotateBg').css('left', '210px')
        _linesSetAttr1366()
      } else if (w <= 1440) {
        console.log('1440')
        _linesSetAttr1440()
        $('.rotateBg').css('left', '230px')
      } else if (w <= 1920) {
        _linesSetAttr1920()
      }

    },

    bindEvent: function () {
      $('#secondMenu').unbind("click")
      $('.firstNav').on('click', 'a', function (e) {
        $(this).addClass('cur').siblings().removeClass('cur')
        var i = $(this).index()
        if (i != 1) {
          $('.secondNav').hide()
        }
      })

      $('.secondNav').on('click', 'a', function (e) {
        $('.secondNav').hide()
      })

      $('#secondMenu').on('click', function (e) {
        var isShow = $('.secondNav').css('display')
        console.log(isShow)
        if (isShow == 'block') {
          console.log(isShow)
          $('.secondNav').hide()
        } else {
          $('.secondNav').show()
        }
      })

      $('.secondNav').on('mouseleave', function (e) {
        $('.secondNav').hide()
        $('.firstNav a').eq(0).addClass('cur').siblings().removeClass('cur')
      })
    },

    init: function (Year, data) {

      this.lines()
      radar.sentAjax(Year, data)
      this.bindEvent()

    }
  }

  //雷达图旋转 兼容ie9
  var angle = 0;
  setInterval(function () {
    angle += 1;
    $('#rotate').rotate(angle);
  }, 180);
  window.addEventListener("resize", function () {
    radar.lines()
  });
  return radar

})

