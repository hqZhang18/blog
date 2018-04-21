/**
 * @Author XieYang
 * @DateTime 2017/8/31 13:26
 * @Description 涉疆模块
 */

define(function (require) {
  require('jquery')
  var request = require('request')
  var baseConfig = require('baseConfig')
  var util = require('util')
  
  //图表
  var pcsChart = require('popCatStaChart')
  var ptrChart = require('perTypeRatioChart')
  var jnChart = require('junctionNameChart')
  var drpChart = require('caseNumTendencyChart')
  
  //Mock数据
  require('xinJiangData')
  
  var time = baseConfig.TIME.toString() //时间参数
  var tpl = require('../../../templates/sheqing/xinJiang/index.tpl')
  
  return {
    /**
     * 初始化
     */
    init: function () {
      /**
       * 当缩放页面后，进行相应的缩放
       */
      window.addEventListener('resize', function () {
        util.zoom()
      })
      
      util.zoom()
      
      this.getApi(time)
    },
  
    /**
     * 获取时间
     */
    getDate: function () {
      var date
      if (time) {
        var index = time.indexOf('星')
        $('.date').text(time.slice(0, index))
      
      } else {
        date = new Date()
        $('.date').text(this.formateDate(date.getHours()) + ':' + this.formateDate(date.getMinutes()) + ':' + this.formateDate(date.getSeconds()))
      }
    },
  
    /**
     * 格式化时间
     * @param t 时间字符串
     * @returns {*}
     */
    formateDate: function (t) {
      if (t < 10) {
        return '0' + t
      }
      return t
    },
    
    /**
     * 渲染模版
     */
    render: function () {
      var self = this
      
      $('.xinJiang').html(tpl)
  
      setInterval(function () {
        self.getDate()
      }, 1000)
    },
    
    /**
     * 渲染人群类别统计图
     *
     * @param {array} data 列表数据
     *
     */
    renderPCS: function (data) {
      console.log(data)
      //获取数组最大值
      var max = 0
      for (var j = 0; j < data.length; j++) {
        if (data[j].value > max) {
          max = data[j].value
        }
      }
      
      //按每5条数据分开成单个数组
      // data = _.chunk(data, 5);
      
      //首次加载数据
      pcsChart.init(data, max)
      
      //每隔5秒切换一次数据
      // var i = 1
      // if (data.length > 1) {
      //     setInterval(function () {
      //         if (typeof data[i] !== 'undefined') {
      //             pcsChart.init(data[i], max)
      //             if (data.length - 1 === i) {
      //                 i = 0
      //             } else {
      //                 i++
      //             }
      //
      //         } else {
      //             i = 0
      //         }
      //     }, 5000)
      // }
    },
    
    /**
     * 渲染涉疆人员类型比例图
     *
     * @param {array} data 列表数据
     *
     */
    renderPTR: function (data) {
      var dataset = [], name = []
      $.each(data, function (i, e) {
        dataset.push(e.value)
        name.push(e.name)
      })
      
      ptrChart.drawCharts('.perTypeRatio', [dataset, name], {
        width: 1020,
        height: 700,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        min: 0,
        max: 7, // 限制平分最多个数
        scale: 0.6, // 用于控制平分后圆的大小
        outerRadius: 212,
        innerRadius: 166,
        color: ['#38f3ff', '#ffef3d'],
        stroke: '#202640',
        strokeWidth: 15
      })
    },
    
    /**
     * 渲染交通路口涉疆车辆流量 Top5
     *
     * @param {array} data 列表数据
     *
     */
    renderJN: function (data) {
      jnChart.drawCharts('.junctionName', data, {
        width: 1400,
        height: 700,
        padding: {
          top: 100,
          right: 150,
          bottom: 100,
          left: 150
        },
        xText: {
          fontSize: 40,
          fill: '#a5cfe0',
          textAnchor: 'middle',
          margin: {
            left: 0,
            bottom: 5
          }
        }
      })
    },
    
    /**
     * 渲染涉疆人员数量地区分布情况图
     *
     * @param {array} data 列表数据
     *
     */
    renderDRP: function (data) {
      var config = {
        sharpOrient: 'x',
        width: 3200,
        height: 620,
        animation: {
          ease: 'out-in'
        },
        padding: {
          top: 40,
          right: 70,
          bottom: 80,
          left: 140
        },
        itemStyle: {
          size: 68,
          textStyle: {
            show: true,
            spacing: 10,
            color: '#0194ff',
            fontSize: 30
          },
          gradient: {
            id: 'gra-CNT',
            color: {
              start: '#0194ff',
              end: '#01edff'
            },
            opacity: {
              start: 1,
              end: 1
            }
          }
        },
        xAxis: {
          zero: 0.5,
          end: 0.5,
          innerTickSize: 1,
          outerTickSize: 1,
          axisLine: {
            style: {
              'fill': 'none',
              'stroke': '#57689d',
              'stroke-width': 2
            },
            textStyle: {
              'font-size': 32,
              'fill': '#a1e8ff',
              'font-family': '微软雅黑',
              'stroke': 'none',
              'stroke-width': 0,
              'text-anchor': 'middle'
            }
          },
          gridLine: {
            show: true,
            style: {
              'stroke': '#a1e8ff',
              'stroke-width': 68,
              opacity: 0.05
            }
          },
          tickPadding: 30
        },
        yAxis: {
          zero: 0,
          end: 0,
          innerTickSize: 1,
          outerTickSize: 1,
          axisLine: {
            show: false,
            style: {
              fill: 'none',
              stroke: '#363963',
              'stroke-width': 2
            },
            textStyle: {
              'font-size': 28,
              fill: '#8a9bd4',
              'font-family': '微软雅黑',
              stroke: 'none',
              'stroke-width': 0,
              'text-anchor': 'end'
            }
          },
          gridLine: {
            show: true,
            style: {
              'stroke-dasharray': '4 4',
              'stroke-width': 1,
              'stroke': '#445589'
            }
          },
          tickPadding: 40,
          ticks: 6
        }
      }
      drpChart.render('regPerDistribution', data, config)
    },
    
    /**
     * 渲染时间
     */
    renderTime: function () {
      var self = this
      
      this.getDate()
      
      setInterval(function () {
        self.getDate()
      }, 1000)
    },
    
    /**
     * 获取时间
     */
    getDate: function () {
      var date
      if (time) {
        var index = time.indexOf('星')
        $('.date').text(time.slice(0, index))
      } else {
        date = new Date()
        $('.date').text(this.formateDate(date.getHours()) + ':' + this.formateDate(date.getMinutes()) + ':' + this.formateDate(date.getSeconds()))
      }
    },
    
    /**
     * 格式化时间
     * @param t 时间字符串
     * @returns {*}
     */
    formateDate: function (t) {
      if (t < 10) {
        return '0' + t
      }
      return t
    },
    
    /**
     * 调用接口
     * @param time 时间
     */
    getApi: function (time) {
      var self = this
      
      self.render()
      
      request.sendAjax(baseConfig.popCatStatistics + time, function (data) {
        if (data && data.popCatStatistics) {
          self.renderPCS(data.popCatStatistics)
        }
        
      })
      
      request.sendAjax(baseConfig.regPerDistribution + time, function (data) {
        if (data && data.regPerDistribution) {
          self.renderDRP(data.regPerDistribution)
        }
      })
      
      request.sendAjax(baseConfig.perTypeRatio + time, function (data) {
        if (data && data.perTypeRatio) {
          self.renderPTR(data.perTypeRatio)
        }
      })
      
      request.sendAjax(baseConfig.junctionName + time, function (data) {
        if (data && data.junctionName) {
          var dataset = []
          $.each(data.junctionName, function (i, e) {
            if (i === 5) {
              return false
            }
            dataset.push(e)
          })
          self.renderJN(dataset)
        }
      })
      
      //self.renderTime()
      //调用服务器时间
      // request.sendWebSocket(baseConfig.timewebsocket, function (data) {
      //     if (data) {
      //         self.renderTime(data)
      //     }
      // })
    }
  }
})