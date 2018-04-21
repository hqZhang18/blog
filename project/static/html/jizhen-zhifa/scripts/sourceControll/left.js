/**
 * @Author:      baizn
 * @DateTime:    2017-05-18 20:37:26
 * @Description: 源头控制页面左半部分JS
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-05-14 20:37:26
 */

define(function(require){

  /**
   * 引入公用的文件
   */
  require('jquery')
  require('handlebars')

  /*
  * 引入依赖组件
  */
  var splitPie = require('../components/splitPie.js')
  var radarChart = require('../components/radarChart.js')
  var newData = {}
  var SourceLeft = {

    /**
     * 渲染案件处理
     * @param {object} caseData
     * 
     * example：
     * 
     * {
     * "total": 189290
     * "group": [
     *  {
     *    "name": "刑事",
     *     "local": 0.29,
     *     "nonlocal": 0.72,
     *     "total": 234
     *   }
     *]
     *}
     */
    renderCaseHanding: function(caseData) {
      var caseTotal = caseData.total
      var group = caseData.group
      //接口定义不慎重，把数据重新组装了一遍
      var names = ['刑事', '情报']
      var xingshi = {}
      var qingbao = {}
      group.forEach(function(item){
        var index = names.indexOf(item.name)
        switch(index) {
          case 0:
            xingshi = {
              name: item.name,
              local: item.local,
              nonlocal: item.nonlocal,
              total: item.total
            }
          break;
          case 1:
            qingbao = {
              name: item.name,
              local: item.local,
              nonlocal: item.nonlocal,
              total: item.total
            }
          break;
        }
      })
      newData = {
        xingshi: xingshi,
        qingbao: qingbao
      }
     
      var criminal = newData.xingshi
      var intelligence = newData.qingbao
     
      var data = {
        total: caseTotal,
        criminal: {
          local: criminal.local,
          nonlocal: criminal.nonlocal
        },
        intelligence: {
          local: intelligence.local,
          nonlocal: intelligence.nonlocal
        }
      }

      //加载并渲染案件处理的模板
      var caseTpl = require('../../components/sourceControll/caseHanding.tpl')
      var caseHtml = Handlebars.compile(caseTpl)
      $('.case-handing').html(caseHtml(data))

      var config = {
          width: $('.case-criminal-svg').width(),
          height: $('.case-criminal-svg').height()
      }

      var criminalData = [criminal.local * criminal.total, criminal.nonlocal * criminal.total]
      var intelligenceData = [intelligence.local * intelligence.total, intelligence.nonlocal * intelligence.total]

      splitPie.drawSplitPie('.case-criminal-svg', criminalData, config)
      splitPie.drawSplitPie('.case-intelligence-svg', intelligenceData, config)

    },

    /**
     * 渲染对象与目标
     * @params {object} data
     * 
     * example：
     * 
     * [
     *{
     *   "name": "类型1",
     *    "xingshi": 10,
     *    "qingbao": 15
     *  }
     *]
     */
    renderObjectTarget: function(data) {
		
      /**
         * r: 雷达图半径
         * level：网格分成几级
         * min和max 网轴的范围，类似坐标轴
         * arc 总的角度
      */
      var config = {
          width: 545,
          height: 425,
          r: 150,
          level: 5,
          min: 0,
          max: 100,
          arc: 2*Math.PI
      }

      var qingbaos = []
      var xingshis = []
      data.forEach(function(item) {
          qingbaos.push(parseInt(item.qingbao, 10))
          xingshis.push(parseInt(item.xingshi, 10))
       })

       var maxQingbao = Math.max.apply(null, qingbaos)
       var maxXingshi = Math.max.apply(null, xingshis)
       var max = Math.max(maxQingbao, maxXingshi)

       var newData = []
       data.forEach(function(item, index) {
          newData.push({
            name: item.name,
            qingbao: parseInt(item.qingbao, 10)/max * 100,
            xingshi: parseInt(item.xingshi, 10)/max * 100
          })
       })
       //console.log(newData)
      
      radarChart.drawRadarChart('.object-handing-chart', newData, data, config)
    },

    /**
     *  @describe [事件绑定]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    bindEvent: function(data) {
      var allTotal = parseInt(newData.xingshi.total, 10) + parseInt(newData.qingbao.total, 10)
      $('.case-handing').on('mouseover', '.text', function(evt) {
        var name = $(this).text()
        var total = 0
        var rate = 0
        if(name=='刑事') {
          total = parseInt(newData.xingshi.total, 10)
          rate = parseFloat((total/allTotal)*100).toFixed(2)  + '%'
        }else{
          total = parseInt(newData.qingbao.total, 10)
          rate = parseFloat((total/allTotal)*100).toFixed(2)  + '%'
        }
        var left = evt.pageX / window.X
        //var html = '总数:' + total + '<br/>占比:'  + rate
        var html = '<p>总数:' + total + '</p><p>占比:'  + rate + '</p>'
        $('.show-total').css('left', left + 'px').html(html).show()
      })
      $('.case-handing').on('mouseout', '.text', function(evt) {
        $('.show-total').hide()
      })
    },

    /**
     * 渲染页面左半部分
     * 
     * @params {object} data
     * 
     * example：
     * 
     * {
     *  caseAcceptance: {},
     *  objTar: []
     * }
     */
    render: function(data){
      //案件受理
      this.renderCaseHanding(data.caseAcceptance)

      //对象与目标
      this.renderObjectTarget(data.objTar)

      //事件绑定
      this.bindEvent(data.caseAcceptance.group)
    }
  }

  return SourceLeft
})