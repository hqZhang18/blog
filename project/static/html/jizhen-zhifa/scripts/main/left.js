/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-20 10:23:00
 * @Description: 主页面左边模块
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-20 10:23:00
 */

define(function(require) {

  //图表配置项(暂时为空)
  var config = {} 
  window.setTime
  
  var mainLeft = {

    /**
     *  @describe [案件受理总数]
     *  @param    {[object]}   data [数据]
     */
    renderCase: function(data) {
      var data = data.caseAcceptance
      var id = '#caseTotal'
      //引入图表组件
      var caseTotal = require('../components/caseTotal.js')
      //渲染刑事/情报总数
      this.renderTotal(data, id)
      //默认渲染刑事
      var xsData = data.xingshi
      caseTotal.drawCharts(id, xsData, config)
      //调用事件绑定
      this.bindEvent(id, data, caseTotal, config)

      //定时切换
      this.setInterval(id, data, caseTotal, config)
    },

    /**
     *  @describe [对象总量]
     *  @param    {[object]}   data [数据]
     */
    renderObject: function(data) {
      var data = data.objectTotal
      var id = '#objectTotal'
      //引入图表组件
      var objectTotal = require('../components/objectTotal.js')
      //渲染刑事/情报总数
      this.renderTotal(data, id)
      //默认渲染刑事
      var xsData = data.xingshi
      var config = {
        gradientCfg: {
          id: 'objectC',
        }
      }
      objectTotal.drawCharts(id, xsData, config)
      //调用事件绑定
      this.bindEvent(id, data, objectTotal, config)
      //定时切换
      this.setInterval(id, data, objectTotal, config)
    },

    /**
     *  @describe [目标总量]
     *  @param    {[object]}   data [数据]
     */
    renderTarget: function(data) {
      var data = data.targetTotal
      var id = '#targetTotal'
      //引入图表组件
      var targetTotal = require('../components/objectTotal.js')
      //渲染刑事/情报总数
      this.renderTotal(data, id)
      //默认渲染刑事
      var xsData = data.xingshi
      var config = {
        fill: ['#4c1d7c', '#4c1d7c'],
        fillImg: false,
        gradientCfg: {
          id: 'targetC',
          x1: '0%',
          y1: '30%',
          x2: '0%',
          y2: '100%',
          offset1: '0%',
          offset2: '100%',
          opacity1: 0.3,
          opacity2: 1
        }
      }
      targetTotal.drawCharts(id, xsData, config)
      //调用事件绑定
      this.bindEvent(id, data, targetTotal, config)
      //定时切换
      this.setInterval(id, data, targetTotal, config)
    },

    /**
     *  @describe [各类标识码]
     *  @param    {[object]}  data [数据]
     */
    markCode: function(data){
       var nameHtml = ''
       var valueHtml = ''
       data.forEach(function(item, i){
        //toLocaleString() 超过三位加逗号
        var value = parseInt(item.value).toLocaleString() 
        var name = item.name
        if(name>2 && name<6){
          name = name.slice(0, 1) + '<br>' + name.slice(3)
        }
        nameHtml += '<div class="name no'+ (i+1) +'"> '+ name +' </div>'
        valueHtml += '<div class="value vno'+ (i+1) +'"> '+value+' </div>'
      }) 

      $('#markCode').html(nameHtml+valueHtml)
    },

    /**
     *  @describe [渲染总数]
     *  @param    {[object]}   data [数据]
     *  @param    {[string]}   id   [容器id]
     */
    renderTotal: function(data, id) {
      $(id).find('h5').eq(0).addClass('cur').siblings().removeClass('cur')
      
      //两类之和总数   
      var totla = data.total 
      $(id).find('span').eq(0).html(totla)

      //刑事总数
      var xsTotal = data.xsTotal
      $(id).find('span').eq(1).html(xsTotal)

      //情报总数
      var qbTotal = data.qbTotal
      $(id).find('span').eq(2).html(qbTotal)
    },

    /**
     *  @describe [事件绑定]
     *  @param    {[object]}   data       [数据]
     *  @param    {[string]}   id         [容器id]
     *  @param    {[object]}   components [图表方法]
     *  @param    {[object]}   config     [图表配置项]
     */
    bindEvent: function(id, data, components, config) {
      var self = this
      $(id).on('click', 'h5', function(evt){
         //清除定时器
         var tId = 'time' + id.slice(1)
         console.log(window[tId])
         clearInterval(window[tId])
         
         var index = $(this).index()
         $(this).addClass('cur').siblings().removeClass('cur')
         var newData = []
         if( !index ){
           newData = data.xingshi
         }else{
           newData = data.qingbao
         }
         components.drawCharts(id, newData, config)
         //重新调用定时器
         setTimeout(function(){
            self.setInterval(id, data, components, config)
         }, 5000)
      })
    },

    /**
     *  @describe [自动切换]
     *  @param    {[type]}   id         [description]
     *  @param    {[type]}   data       [description]
     *  @param    {[type]}   components [description]
     *  @param    {[object]}   config     [图表配置项]
     */
    setInterval: function(id, data, components, config) {
      var t = 0
      var tId = 'time' + id.slice(1)
      var target = $(id).find('h5')
      
      clearInterval(window[tId])
      window[tId] = setInterval(function() {

        t++
        if(t==2){
          target.eq(1).removeClass('cur')
          target.eq(0).addClass('cur')
          components.drawCharts(id, data.xingshi, config)
          t = 0
        }else{
          target.eq(0).removeClass('cur')
          target.eq(1).addClass('cur')
          components.drawCharts(id, data.qingbao, config)
        }
      }, 5000)
    },

    init: function(data) {
      //案件受理总数
      this.renderCase(data)
      //对象总量
      this.renderObject(data)
      //对象目标
      this.renderTarget(data)
      //标识码
      this.markCode(data.markCode)
    }
  }
  return mainLeft
})