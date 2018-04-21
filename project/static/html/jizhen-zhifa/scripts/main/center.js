/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-20 13:07:12
 * @Description: 主页面中间模块
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-20 13:07:12
 */

define(function(require) {

  /**
   *  引入依赖模块
   */
  // 各部门执法扣分统计
  var deductCount = require('../components/gradientBar.js')

  //日志统计
  var systemType = require('../components/systemType.js')
  //顶部总量变量(webSocket要把变量提出来，不然会内存泄漏)
  var names = ['标识码库总量', '模型预警总量', '执法审核总量', '案卷检查总量', '实地监督总量']
  var topTotalData = []
  var value = 0
  var name = ''
  var index = 0
  var html =  ''

  //日志统计变量 
  var logTotal = 0
  var systemTypeData = []
  //.toLocaleString() 
  var total = 0
  //$('#num-roll').html(total)
  var w = 0
  var config2 = {}

  //各部门执法扣分统计图表配置项 
  var config = {
    width: 1415,
    height: 200,
    padding: {
      left: 70
    },
    itemStyle: {
      width: 8,
      color: '#282f36',
      gradientColor: ['#00d2ff', '#0048ff'], 
      radius: 3,   
      topMark: {
        width: 15,
        height: 8,
        fill: '#fff'
      },
      margin: {
        left:10,
        right:40
      }
    },
    yAxis: {
      axisLine: {
        show: true
      },
      gridLine: {
        show: false
      },
      ticks: 4
    }
  } 

  var mainCenter = {

    /**
     *  @describe [顶部总数]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    topTotal: function(data){
      topTotalData = data.typeTotal
      topTotalData.forEach(function(item, index){
        //toLocaleString() 超过三位加逗号
        value = parseInt(item.value).toLocaleString() 
        name = item.name
        index = names.indexOf(name)
        html =  ''+ name +' <span> '+ value +' </span>'
        switch(index){
          case 0:
            $('#topTotal').find('p').eq(0).html(html)
          break;
          case 1:
            $('#topTotal').find('p').eq(1).html(html)
          break;
          case 2:
            $('#topTotal').find('p').eq(2).html(html)
          break;
          case 3:
            $('#topTotal').find('p').eq(3).html(html)
          break;
          case 4:
            $('#topTotal').find('p').eq(4).html(html)
          break;
        }

      }) 
    },

    /**
     *  @describe [日志统计]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    logCount: function(data, r1) {
	     //日志总数
      logTotal = data.total
      systemTypeData = data.logCount 
      //.toLocaleString() 
      logTotal = parseInt(logTotal, 10)
      //$('#num-roll').html(total)
      w = (550 - $('#num-roll').width())/2 - 280
      $('#num-roll').css('margin-left',  '40px')
      //调用动画
      r1.roll(logTotal);
      // setInterval(function () {
      //     total+=parseInt(Math.random()*100)
      //     r1.roll(total)
      // },3000)
      //系统类型 
      systemType.drawCharts('#systemTypes', systemTypeData, config2)

    },

    /**
     *  @describe [扣分统计]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    deductCount: function(data) {
      var data = data.deductionCount
      var id = '#deductCount'
      deductCount.drawCharts(id, data, config)
    }
  }
  return mainCenter
})