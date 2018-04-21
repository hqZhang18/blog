/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-24 12:44:16
 * @Description: 中间模块
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-24 12:44:16
 */

define(function(require) {

  //顶部总量使用了WebSocket使用全局变量，避免内存泄漏
  var typeTotal = require('../components/pie.js') 
  var config = {}
  var html = ''
  var html2 = ''
  var names = ['待检查', '已检查', '整改中']
  var className = ['ml0', 'ml30', 'ml25', 'ml400', 'ml10']
  var className2 = ['left620', 'left720', 'left820']
  var j = 0
  var j2 = 0
  var typeName
  var typeValue

  var center = {

    /**
     *  @describe [顶部各类型总数]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    typeTotal: function(data) {
      html = ''
      html2 = ''
      j = 0
      j2 = 0
      for(var i=0, len = data.length; i<len; i++){
        typeName = data[i].name
        typeValue = data[i].value
        isName = names.indexOf(typeName)
        
        if(isName==-1) { 
          html += '<div class="type-chart '+className[j++]+'">'
                + '<div class="type-chartbg"></div>'
                + '<div class="number">'+typeValue+'</div>'
                + '<div class="name">'+typeName+'</div>'
                + '</div>'
        }else{
          html2 += '<div class="center-chart '+className2[j2++]+'">'
                + '<div class="number">'+typeValue+'</div>'
                + '<div class="name">'+typeName+'</div>'
                + '</div>'
        }
      }
      $('#chartsBg').html(html + html2)
      typeTotal.drawCharts('#typeTotal', data, config)

    },

    /**
     *  @describe [装订证据材料 /听阅卷/移送]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    materialCount: function(data) {
      //console.log(data)
      var materialCount = require('../components/sharpBar.js')
      var config = {
        width: 1400
      }
       materialCount.drawCharts('#materialCount', data, config)
    },

    /**
     *  @describe [各部分执法扣分统计]
     *  @param    {[type]}   data [扣分统计数据]
     */
    deductCount: function(data) {
 
      $('.legend-type').eq(0).find('.number').html(data.ajTotal)
      $('.legend-type').eq(0).find('.rate').html(data.ajRate)
      $('.legend-type').eq(1).find('.number').html(data.fajTotal)
      $('.legend-type').eq(1).find('.rate').html(data.fajRate)
      var deductCount = require('../components/behaviorCount2.js')
      var data = data.group
      var config = {
        width: 1400
      }
      deductCount.drawCharts('#deductCount', data, config)
    },

    init: function(data) {
      
      this.deductCount(data.deductCount)
      this.materialCount(data.materialCount)
      
    }
  }
  return center

})