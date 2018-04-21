/**
 * @Author:      baizn
 * @DateTime:    2017-05-18 20:37:26
 * @Description: 源头控制页面中间部分JS文件
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
  var gradientAreaChart = require('../components/gradientAreaChart.js')
  var triangleBar = require('../components/triangleBar.js')

  var SourceCenter = {

    /**
     * 渲染类型总数
     * @params {array} data
     * 
     * example:
     * 
     * [
     *  {
     *    name: 'name',
     *    value: 'value'
     *  }
     * ]
     */
    renderTypeTotal: function(data) {
      //加载并渲染类型总数的模板
      var typeTpl = require('../../components/sourceControll/typeTotal.tpl')
      var typeHtml = Handlebars.compile(typeTpl)
      //这里这样做不太友好，以后定义接口要注意下，直接使用对象，不用数组
      var names = ['标识码库', '侦控库', '非侦控库', '红名单', '测试号码']
      data.forEach(function(item) {
        var index = names.indexOf(item.name)
        switch(index) {
          case 0:
             code = item.value
          break;
          case 1:
             zkk = item.value
          break;
          case 2:
            fzkk = item.value
          break;
          case 3:
            hmd = item.value
          break;
          case 4:
             cshm = item.value
          break;
        }
      })
      var newData = {
          code: code,
          zkk: zkk,
          fzkk: fzkk,
          hmd: hmd,
          cshm: cshm
      }
      $('.total-info').html(typeHtml(newData))
    },

    /**
     * 渲染系统布控统计模块
     * @param {object} data
     * 
     * example:
     * 
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
    renderSystemControll: function(data) {
		
      $('.system-controll-number').text(data.total)

      var config = {
          width: $('.controll-chart').width(),
          height: $('.controll-chart').height() - 20
         
      }

      gradientAreaChart.drawCharts('.controll-chart', data.group, config)
    },

     /**
     * * 渲染人工布控统计模块
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
    renderPersonControll: function(data) {
      $('.person-controll-number').text(data.total)

      var config = {
        width: 1190 ,
        height: $('.person-controll-chart').height() + 60,
        padding: {
          left: 50
        },
        yAxis: {
          axisLine: {
            show: true
          },
          ticks: 4
        }
      }

      triangleBar.drawTriangleBar(".person-controll-chart", data.group, config)
    },

    /**
     * 渲染页面中间部分
     * 
     * @param {object} data
     * 
     * example:
     * 
     * {
     *     typeTotal: [],
     *     controlSystem: [],
     *     policeInvestigation: {},
     *     foreignInvestigation: {}
     *  }
     */
    render: function(data){
      //系统布控
      this.renderSystemControll(data.controlSystem)
      //人工布控
      this.renderPersonControll(data.artificialControl)
    }
  }

  return SourceCenter
})