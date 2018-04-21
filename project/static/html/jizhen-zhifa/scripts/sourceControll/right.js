/**
 * @Author:      baizn、zhanghq
 * @DateTime:    2017-05-18 20:37:26
 * @Description: 源头控制页面右边部分功能JS文件
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-05-14 20:37:26
 */

define(function(require){

 

  /*
  * 引入依赖组件
  */
 
  var behaviorCount = require('../components/behaviorCount.js')
  var rectBar2 = require('../components/rectBar2.js')
  var brushBar = require('../components/brushBar.js')
  var SourceRight = {

    /**
     * 渲染警情协查模块
     * @param {object} data
     * example:
     * {
     *  total: 123,
     *  group: [
     *  {
     *    name: 'name',
     *    value: 'value'
     *  }
     * ]
     * }
     */
    renderPoliceChart: function(data) {
      $('.police-investigation-number').text(data.total)

      var config = {
        width: 587,
        height: 155,
        itemStyle: {
          color: ['#a800ff', '#081b5e'],
          fillId: ['brushBarColor3', 'brushBarColor4'],
        }
      }
 
      brushBar.drawBrushBar('.police-chart', data.group, config)
    },

    /**
     * 渲染对外协查模块
     * 
     * @param {object} data
     * example:
     * {
     *  total: 123,
     *  group: [
     *  {
     *    name: 'name',
     *    value: 'value'
     *  }
     * ]
     * }
     */
   
    renderExternalChart: function(data) {
      $('.external-investigation-number').text(data.total)

      var config = {
        width: 587,
        height: 155,
        itemStyle: {
          color: ['#0093fb', '#043a84'],
          fillId: ['brushBarColor1', 'brushBarColor2'],
          topMark: {
            fill: '#00ffff'
          }
        }
      }

      brushBar.drawBrushBar('.external-chart', data.group, config)
    },

   
    /**
     * 渲染标识码库模块
     * 
     * @param {array} data
     * example:
     * [
     *   {
     *  "name": "2月1日",
     *   "value": 100
     * },{
     *    "name": "2月2日",
     *    "value": 189
     *  }
     *]
     */
    renderNumberLibrary: function(data) {
      var config = {
        width: 611,
        height: 210,
        padding: {
          left: 80
        },
        areaPath: {
          fill: ['#4c1d7c', '#1a1760'],
          stroke: 'none',
          strokeWidth: 1,
          //线条样式 linear/linear-closed/step/... 曲线:basis/cardinal/
          interpolate: 'linear'
        },
        linePath: {
          fill: 'none',
          stroke: '#6b2ba3',
          strokeWidth: 2,
          //线条样式 linear/linear-closed/step/... 曲线:basis/cardinal/
          interpolate: 'linear'
        },
        yAxis: {
          axisLine: {
            show: true
          },
          ticks: 4
        }
      }
			var data = data.group
      
      behaviorCount.drawCharts('.number-library-chart', data, config)
    },

    /**
     * * 渲染办案查询模块
     * 
     * @param {object} data
     * example:
     * {
     *  total: 123,
     *  group: [
     *  {
     *    name: 'name',
     *    value: 'value'
     *  }
     * ]
     * }
     */
    renderCaseChecked: function(data) {

      $('.check-case-number').text(data.total)

      var config = {
        width: 587,
        height: 155
      }
      rectBar2.drawSplitBar(".check-case-chart", data.group, config)   
    },

    /**
     * 渲染页面右半部分
     * 
     * @param {object} data
     * 
     * example:
     * 
     * {
     *    artificialControl: {},
     *    identifierLibrary: [],
     *    caseQuery: {}
     *  }
     */
    render: function(data){
      //警情协查
      this.renderPoliceChart(data.policeInvestigation)
      //对外协查
      this.renderExternalChart(data.foreignInvestigation)
      //标识码库
      this.renderNumberLibrary(data.identifierLibrary)
      //办案查询
      this.renderCaseChecked(data.caseQuery)
    }
  }

  return SourceRight
})