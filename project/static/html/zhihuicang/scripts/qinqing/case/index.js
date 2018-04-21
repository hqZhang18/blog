/**
 * @Author XieYang
 * @DateTime 2017/8/31 13:26
 * @Description 案件模块
 */

define(function (require) {
  require('jquery')
  require('handlebars')
  
  var request = require('request')
  var baseConfig = require('baseConfig')
  var util = require('util')
  
  //图表
  require('prisonPersonnelChart')
  // var areaDistribution = require('areaDistributionChart')
  // 同比环比折线图
  var lineCharts = require('lineCharts')
  var caseNumTendency = require('caseNumTendencyChart')
  
  //Mock数据
  require('caseData')
  
  var time = baseConfig.TIME.toString() //时间参数
  
  var tpl = require('../../../templates/qinqing/case/index.tpl')
  var offendersNumberTpl = require('../../../templates/qinqing/case/offendersNumber.tpl')
  
  return {
    /**
     * 渲染模版
     */
    render: function () {
      var self = this
      
      $('.case').html(tpl)
      
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
     * 渲染人数总览模块
     *
     * @param {array} data 列表数据
     *
     */
    renderOffendersNumber: function (data) {
      var template = Handlebars.compile(offendersNumberTpl)
      $('.offendersNumber').html(template(data))
    },
    
    /**
     * 渲染监所投放人员比例模块
     *
     * @param {array} data 列表数据
     *
     */
    renderPrisonPersonnel: function (data) {
      //雷达图参数设置
      var radarChartOptions = {
        w: 953,
        h: 472,
        maxValue: 1,
        levels: 10,
        color: d3.scale.ordinal().range(["#EDC951"])
      }
      
      //启动雷达图组件
      RadarChart(".prisonPersonnel", data, radarChartOptions);
    },
    
    /**
     * 渲染在押人员户籍分布情况模块
     *
     * @param {array} data 列表数据
     *
     */
    renderAreaDistribution: function (data) {
      var config = {
        sharpOrient: 'y',
        width: 1100,
        height: 570,
        padding: {
          top: 30,
          right: 100,
          bottom: 80,
          left: 260
        },
        itemStyle: {
          size: 12,
          components: {
            image: {
              attr: {
                href: '../../images/qinqing/case/area-dis-shape.png',
                width: 80,
                height: 37,
                x: -80 - 13, // 80为自身宽度， 13为图片与y轴之间的间距
                y: -37 / 2 + 6   // -37/2 为自身高度的一半，6为柱状条size的一半
              },
              sort: 1
            }
          },
          gradient: {
            id: 'gra-ADB',
            color: {
              start: '#a60a54',
              end: '#3c31ed'
            },
            opacity: {
              start: 1,
              end: 1
            }
          },
          textStyle: {
            show: true,
            spacing: 10,
            color: '#a60a54',
            fontSize: 30
          }
        },
        xAxis: {
          zero: 0.5,
          end: 0.5,
          innerTickSize: 1,
          outerTickSize: 1,
          scale: 'linear',
          axisLine: {
            style: {
              'fill': 'none',
              'stroke': '#06fffc',
              'stroke-width': 2
            },
            textStyle: {
              'font-size': 24,
              'text-anchor': 'middle',
              'fill': '#5391ff',
              'stroke': 'none',
              'font-family': 'digifacewide'
            }
          },
          gridLine: {
            style: {
              fill: 'none',
              stroke: '#898e9b',
              'stroke-width': 1,
              'stroke-dasharray': '10 6'
            }
          },
          ticks: 4,
          tickPadding: 30
        },
        yAxis: {
          zero: 0.5,
          end: 0.5,
          innerTickSize: 1,
          outerTickSize: 1,
          axisLine: {
            show: true,
            style: {
              fill: 'none',
              stroke: '#898e9b',
              'stroke-width': 1,
              'stroke-dasharray': '10 6'
            },
            textStyle: {
              'font-size': 24,
              fill: '#e3e8ec',
              stroke: 'none',
              'stroke-width': 0,
              'text-anchor': 'end'
            }
          },
          gridLine: {
            show: false
          },
          tickPadding: 100
        }
      }
      
      caseNumTendency.render('areaDistribution', data, config)
    },
    
    /**
     * 渲染在押人员数量（同比/环比）模块
     *
     * @param {array} data 列表数据
     *
     */
    renderDetaineesNumber: function (data) {
      var config = {
        width: 1660,
        height: 620,
        padding: {
          top: 30,
          left: 140,
          bottom: 0,
          right: 100
        },
        itemStyle: [{
          areaPath: {
            fill: ['#3fdbff', '#6c65fe'],
            stroke: 'none',
            strokeWidth: 1
          },
          linePath: {
            fill: 'none',
            stroke: '#3fdbff',
            strokeWidth: 3
          }
        }, {
          areaPath: {
            fill: ['#3fdbff', '#6c65fe'],
            stroke: 'none',
            strokeWidth: 1
          },
          linePath: {
            fill: 'none',
            stroke: '#6c65fe',
            strokeWidth: 3
          }
        }
        ],
        xText: {
          fill: ['#3fdbff', '#6c65fe'],
          fontSize: 27,
          textAnchor: 'middle',
          margin: {
            bottom: 10
          }
        },
        lineMark: {
          radius: 8,
          type: 2, // 1是小菱形， 2是圆点,
          fill: '#172349',
          stroke: '#fff'
        },
        yAxis: {
          axisLine: {
            show: true
          },
          gridLine: {
            show: true
          },
          ticks: 10,
          isLoss: true, // 负数,
          ratio: true //按百分比显示
        }
      }
      lineCharts.drawCharts('.detaineesNumber', data, config)
    },
    
    /**
     * 渲染看守所在押人员排名模块
     *
     * @param {array} data 列表数据
     *
     */
    renderCaseNumTendency: function (data) {
      var config = {
        sharpOrient: 'x',
        width: 1614,
        height: 570,
        animation: {
          ease: 'out-in'
        },
        padding: {
          top: 50,
          right: 70,
          bottom: 100,
          left: 140
        },
        itemStyle: {
          size: 68,
          textStyle: {
            show: true,
            spacing: 10,
            color: '#a60a54',
            fontSize: 30
          },
          gradient: {
            id: 'gra-CNT',
            color: {
              start: '#a60a54',
              end: '#3c31ed'
            },
            opacity: {
              start: 0,
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
              'stroke': '#4b4f89',
              'stroke-width': 2
            },
            textStyle: {
              'font-size': 24,
              'fill': '#7d96de',
              'font-family': '微软雅黑',
              'stroke': 'none',
              'stroke-width': 0,
              'text-anchor': 'middle'
            }
          },
          gridLine: {
            style: {
              'stroke': '#181c3a',
              'stroke-width': 1
            }
          },
          tickPadding: 30
        },
        yAxis: {
          zero: 0.5,
          end: 0.5,
          innerTickSize: 1,
          outerTickSize: 1,
          axisLine: {
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
            style: {
              'stroke-dasharray': '2 10',
              'stroke-width': 1,
              'stroke': '#3a4674'
            }
          },
          tickPadding: 40,
          ticks: 6
        }
      }
      caseNumTendency.render('caseNumTendency', data, config)
    },
    
    init: function () {
      /**
       * 当缩放页面后，进行相应的缩放
       */
      window.addEventListener('resize', function () {
        util.zoom()
      })
      
      util.zoom()
      
      this.getApi()
    },
    /**
     * 调取接口数据
     */
    getApi: function () {
      var self = this
      
      self.render()
      
      request.sendAjax(baseConfig.offendersNumber + time, function (data) {
        if (data) {
          data.offendersNumber.imprisonedNumber = data.offendersNumber.imprisonedNumber.toLocaleString()
          data.offendersNumber.releaseNumber = data.offendersNumber.releaseNumber.toLocaleString()
          data.offendersNumber.supervisorsNumber = data.offendersNumber.supervisorsNumber.toLocaleString()
          
          var totalValue = data.sex.female + data.sex.male
          
          var percentMale = data.sex.male / totalValue
          data.sex.perMale = Math.round(percentMale * 100)
          data.sex.perMaleValue = percentMale * 200 + parseInt(percentMale * 200 / 20) * 32
          
          var percentFemale = data.sex.female / totalValue
          data.sex.perFemale = Math.round(percentFemale * 100)
          data.sex.perFemaleValue = percentFemale * 200 + parseInt(percentFemale * 200 / 20) * 32
          
          self.renderOffendersNumber(data)
        }
      })
      
      request.sendAjax(baseConfig.prisonPersonnel + time, function (data) {
        if (data && data.prisonPersonnel) {
          self.renderPrisonPersonnel(data.prisonPersonnel)
        }
      })
      
      request.sendAjax(baseConfig.areaDistribution + time, function (data) {
        if (data && data.areaDistribution) {
          self.renderAreaDistribution(data.areaDistribution)
        }
      })
      
      request.sendAjax(baseConfig.detaineesNumber + time, function (data) {
        if (data && data.detaineesNumber) {
          self.renderDetaineesNumber(data.detaineesNumber)
        }
      })
      
      request.sendAjax(baseConfig.caseNumTendency + time, function (data) {
        if (data && data.caseNumTendency) {
          self.renderCaseNumTendency(data.caseNumTendency)
        }
      })
    }
  }
})