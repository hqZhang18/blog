/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-20 14:23:33
 * @Description: Description
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-20 14:23:33
 */

define(function(require) {
 

  //图表配置项(暂时为空)
  var config = {} 

  var mainRight = {

    /**
     *  @describe [法律文书]
     *  @param    {[type]}   data [数据]
     */
    lawDoc: function(data) {
      var self = this
      var id = '#lawDoc'
      self.renderDoc(id, data)
    },

    /**
     *  @describe [内部使用文书]
     *  @param    {[type]}   data [数据]
     */
    insideDoc: function(data) {
      var self = this
      var id = '#insideDoc'
      self.renderDoc(id, data)
    },

    /**
     *  @describe [文书渲染公用方法]
     *  @param    {[type]}   id   [容器id]
     *  @param    {[type]}   data [数据]
     */
    renderDoc: function(id, data) {
      var html = ''
      data.forEach(function(item, index) {
        var name = item.name
        var value = item.value
        html += '<a> '+ name +' <span> '+ value +' </span></a>'
      })
      $(id + ' .details').html(html)
    },

    /**
     *  @describe [结案总量]
     *  @param    {[type]}   data [数据]
     */
    renderClosing: function(data) {
      var id = '#closingTotal'
      //引入图表组件
      var closingTotal = require('../components/closingTotal.js')
      // 引入左边的模块(需要调用里面的总数渲染及事件绑定方法)
      var mainLeft = require('./left.js')
      //渲染刑事/情报总数
      mainLeft.renderTotal(data, id)
      //默认渲染刑事
      closingTotal.drawCharts(id, data.xingshi, config)
      mainLeft.bindEvent(id, data, closingTotal)
      //定时切换
      mainLeft.setInterval(id, data, closingTotal)
    },

    transferCase: function(data) {
      var names = ['移送案件', '听阅案件', '装订证据案件']
     
      data.forEach(function(item) {
        var index = names.indexOf(item.name)

        switch(index) {
          case 0:
            $('.yisong').html(item.value)
          break;
          case 1:
            $('.tingyue').html(item.value)
          break;
          case 2:
            $('.zdzjcl').html(item.value)
          break;
        }
      })
    },

    /**
     *  @describe [初始化]
     *  @param    {[type]}   data [数据]
     */
    init: function(data){
      var self = this

      self.lawDoc(data.lawDoc)
      self.insideDoc(data.insideDoc)
      self.renderClosing(data.closingTotal)
      this.transferCase(data.transferCase)
    }
  }

  return mainRight

})