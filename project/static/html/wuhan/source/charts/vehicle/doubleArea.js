/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-04 14:09:00
 * @Description:  双面积图
 */
define(function(require) {
  /**
   * 引入公用的文件
   */
  require('d3')
  require('lodash')

  // 公用配置项
  var config = {}
  var xScale
  var yScale
  var areaPath
  var linePath
  var leaveData = []
  var accessData = []
  var xData = []

  var commonUnit = require('./../commonUnit.js')

  var doubleArea = {
    defaultSetting: function() {
      return {
        width: 1300,
        height: 560,
        padding: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },
        maskLine: 'line-mask', //线条蒙版的id，用于创建和使用指定
        baseColor: { //两组数据的基色
          leave: '#3579f8',
          access: '#3fdbff'
        }
      }
    },
    drawCharts: function(id, dataset, opt) {
      //处理数据
      leaveData = []
      accessData = []
      xData = []
      dataset.map(function(item) {
        leaveData.push(item.leave)
        accessData.push(item.access)
        xData.push(item.name)
      })
      // 合并配置项
      config = _.merge({}, this.defaultSetting(), opt)
      var width = config.width
      var height = config.height

      //获取数据最大值，创建XY比例尺
      var maxValue = Math.max(d3.max(accessData), d3.max(leaveData))
      xScale = d3.scale.linear()
        .domain([0, xData.length - 1])
        .range([100, width - 100])

      yScale = d3.scale.linear()
        .domain([0, maxValue * 1.1])
        .range([height - 100, 100])

      //用于绘制面积图的区域生成器
      areaPath = d3.svg.area()
        .x((d, i) => {
          return xScale(i)
        })
        .y1((d, i) => {
          return yScale(d)
        })
        .y0(yScale(0))
        .interpolate('cardinal')

      //用于绘制顶部折线的线段生成器
      linePath = d3.svg.line()
        .x((d, i) => {
          return xScale(i)
        })
        .y(d => {
          return yScale(d)
        })
        .interpolate('cardinal')

      // 创建svg
      var svg = commonUnit.addSvg(id, config)

      //创建两个图表容器，包裹进入和离开,方便图例的点击事件
      var access = this.creatGWrap(svg, 'access')
      var leave = this.creatGWrap(svg, 'leave')

      //绘制背景网格线条
      var grid = this.creatGWrap(svg, 'grid')
      this.crearGrid(grid, config)

      //添加线条蒙版
      this.creatMaskLine(svg, config)

      //添加面积图
      this.creatArea(leave, 'leave', leaveData)
      this.creatArea(access, 'access', accessData)

      //添加顶部的折线
      this.creatTopLine(leave, 'leave', leaveData)
      this.creatTopLine(access, 'access', accessData)

      //绘制折线顶部的圆圈
      this.creatLineCir(leave, 'leave', leaveData)
      this.creatLineCir(access, 'access', accessData)

      //添加图例
      this.creatLegend(svg)

      //添加提示框 
      var isTooltip = svg.select('.tooltip').empty()
      var tooltip
      if (isTooltip) {
        tooltip = svg.append('g').attr({
            'class': 'tooltip'
              // 'transform':'translate(0,0)'//在X轴上移动由此属性改变
          })
          .style({
            'visibility': 'hidden' //默认隐藏
          })
          //竖线
        tooltip.append('line').attr({
            'class': 'tooltip-line',
            'x1': 100,
            'y1': 50,
            'x2': 100,
            'y2': height - 100,
            'fill': 'none',
            'stroke': 'rgba(255,255,255,.5)'
          })
          //进入
        var tooltipAccess = tooltip.append('g').attr('class', 'tooltip-access')
        tooltipAccess.append('circle').attr({
          'r': 10,
          'cx': 100,
          // 'cy':100,//Y轴距离 - 动态改变
          'fill': '#3fdbff',
          'stroke-width': 2,
          'stroke': '#17234a'
        })
        tooltipAccess.append('path').attr({
            'd': 'M14.212,0.748 L7.224,8.945 L0.063,0.748 L14.212,0.748 Z',
            'fill': '#3fdbff',
            'stroke': 'none',
            // 'transform':'translate(90,74) scale(1.4,2)' //Y轴距离 -- translateY --动态改变
          })
          //离开
        var tooltipLeave = tooltip.append('g').attr('class', 'tooltip-leave')
        tooltipLeave.append('circle').attr({
          'r': 10,
          'cx': 100,
          // 'cy':200,//Y轴距离 - 动态改变
          'fill': '#3579f8',
          'stroke-width': 2,
          'stroke': '#17234a'
        })
        tooltipLeave.append('path').attr({
          'd': 'M14.212,0.748 L7.224,8.945 L0.063,0.748 L14.212,0.748 Z',
          'fill': '#3579f8',
          'stroke': 'none',
          // 'transform':'translate(90,174) scale(1.4,2)' //Y轴距离 -- translateY --动态改变
        })
      }

      var isOverlay = svg.select('.overlay').empty()
      var overlay
      if (isOverlay) {
        overlay = svg.append('rect').attr({
            'class': 'overlay',
            'x': 100,
            'y': 100,
            'width': width - 200,
            'height': height - 200,
            'fill': 'none'
          })
          .style({
            'pointer-events': 'all'
          })
      }
      overlay.on('mouseover', function() {
          tooltip.style({
            'visibility': 'visible'
          })
        })
        .on('mouseout', function() {
          tooltip.style({
            'visibility': 'hidden'
          })
        })
        .on('mousemove', function() {
          var mouseX = d3.mouse(this)[0]
          var mouseY = d3.mouse(this)[1] - 100
          var x0 = Math.round(xScale.invert(mouseX))
          var xPart = xScale(x0) - 100
            //改变竖线位置
          tooltip.attr({
              'transform': 'translate(' + xPart + ',0)'
            })
            //改变进入图表的三角和圆
          tooltipAccess.select('circle').attr({
            'cy': yScale(accessData[x0])
          })
          tooltipAccess.select('path').attr({
              'transform': function() {
                var tx = yScale(accessData[x0]) - 30
                return 'translate(90,' + tx + ') scale(1.4,2)'
              }
            })
            //改变离开图表的三角和圆
          tooltipLeave.select('circle').attr({
            'cy': yScale(leaveData[x0])
          })
          tooltipLeave.select('path').attr({
            'transform': function() {
              var tx = yScale(leaveData[x0]) - 30
              return 'translate(90,' + tx + ') scale(1.4,2)'
            }
          })
        })

      //添加坐标轴
      //重新设置y轴比例尺的值域，与原来的相反
      yScale.range([height - 100, 100]);
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(5)
      var isYAxis = svg.select('.y-axis').empty()
      var yAxisG
      if (isYAxis) {
        yAxisG = svg.append('g').attr('class', 'y-axis axis')
      } else {
        yAxisG = svg.select('.y-axis')
      }
      yAxisG.attr('transform', 'translate(70,0)')
        .call(yAxis)

      //手动添加x轴
      var isXAxis = svg.select('.x-axis').empty()
      var xAxisG
      if (isYAxis) {
        xAxisG = svg.append('g').attr('class', 'x-axis axis')
      } else {
        xAxisG = svg.select('.x-axis')
      }

      var xTextUpdate = xAxisG.selectAll('text').data(xData)
      xTextUpdate.enter().append('text')
      xTextUpdate.exit().remove()
      xAxisG.selectAll('text').data(xData).attr({
          'fill': '#98adf0',
          'font-size': 22,
          'x': function(d, i) {
            return xScale(i)
          },
          'y': yScale(0) + 50,
          'text-anchor': 'middle'
        })
        .text(function(d, i) {
          return d
        })
    },
    /**
     *  创建外层包裹的g元素，用于DOM分组
     */
    creatGWrap: function(svg, gName) {
      var isExit = svg.select('.' + gName).empty()
      var g
      if (isExit) {
        g = svg.append('g').attr('class', gName)
      } else {
        g = svg.select('.' + gName)
      }
      return g
    },
    /**
     *  创建背景网格线
     */
    crearGrid: function(grid, config) {
      //网格 - 横线
      var yGridUpdate = grid.selectAll('.y-line').data(d3.range(5))
      yGridUpdate.enter().append('line').attr('class', 'y-line')
      yGridUpdate.exit().remove()
      grid.selectAll('.y-line').data(d3.range(5)).attr({
          'x1': 0,
          'y1': function(d, i) {
            return (config.height - 100) * (i + 1) / 5
          },
          'x2': config.width,
          'y2': function(d, i) {
            return (config.height - 100) * (i + 1) / 5
          },
          'fill': 'none',
          'stroke': 'rgba(70,86,138,.3)',
          'stroke-dasharray': 6
        })
        //网格 - 竖线
      var xGridUpdate = grid.selectAll('.x-line').data(d3.range(7))
      xGridUpdate.enter().append('line').attr('class', 'x-line')
      xGridUpdate.exit().remove()
      grid.selectAll('.x-line').data(d3.range(7)).attr({
        'x1': function(d, i) {
          return xScale(i)
        },
        'y1': 0,
        'x2': function(d, i) {
          return xScale(i)
        },
        'y2': config.height - 100,
        'fill': 'none',
        'stroke': 'rgba(70,86,138,.3)'
      })
    },
    /**
     *  创建线条蒙版
     *  默认defs标签已经创建
     */
    creatMaskLine: function(svg, config) {
      var splitNum = 200 //分隔份数
      var isMask = svg.select('#' + config.maskLine).empty()
      var lineMask
      if (isMask) {
        lineMask = svg.select('defs').append('mask').attr({
          'maskUnits': 'userSpaceOnUse',
          'id': config.maskLine
        })
        lineMask.append('rect').attr({
          'width': config.width,
          'height': config.height,
          'x': 0,
          'y': 0,
          'fill': 'white'
        })
      } else {
        lineMask = svg.select('#' + config.maskLine)
      }
      var lineMaskUpdate = lineMask.selectAll('line').data(d3.range(splitNum))
      lineMaskUpdate.enter().append('line')
      lineMaskUpdate.exit().remove()
      var yScaleLine = d3.scale.linear()
        .domain([0, splitNum])
        .range([-2 * config.height, 2 * config.height])
      lineMask.selectAll('line').data(d3.range(splitNum))
        .attr({
          'x1': 0,
          'y1': function(d, i) {
            return yScaleLine(i)
          },
          'x2': config.width * 2,
          'y2': function(d, i) {
            return yScaleLine(i)
          },
          'stroke-width': 1,
          'stroke': 'black',
          'fill': 'black',
          'transform': 'rotate(45)'
        })
    },
    /**
     *  创建面积图
     */
    creatArea: function(gObj, areaName, data) {
      var isExit = gObj.select('.' + areaName + '-area').empty()
      var area
      if (isExit) {
        area = gObj.append('path').attr('class', areaName + '-area')
      } else {
        area = gObj.select('.' + areaName + '-area')
      }
      area.attr({
          'd': areaPath(data),
          'stroke': 'none',
          'fill': 'url(#' + areaName + '-fill)',
          'mask': 'url(#' + config.maskLine + ')'
        })
        .style({
          'cursor': 'pointer'
        })
    },
    /**
     *  创建顶部折线
     */
    creatTopLine: function(gObj, lineName, data) {
      var isExit = gObj.select('.' + lineName + '-line').empty()
      var line
      if (isExit) {
        line = gObj.append('path').attr('class', lineName + '-line')
      } else {
        line = gObj.select('.' + lineName + '-line')
      }
      line.data([data])
        .attr({
          'd': function(d, i) {
            return linePath(d)
          },
          'fill': 'none',
          'stroke-width': 2,
          'stroke': config.baseColor[lineName]
        })
    },
    /**
     *  创建顶部折线上的圆圈
     */
    creatLineCir: function(gObj, cirName, data) {
      var cirUpdate = gObj.selectAll('.' + cirName + '-cir').data(data)
      cirUpdate.enter().append('circle').attr('class', cirName + '-cir')
      cirUpdate.exit().remove()
      gObj.selectAll('.' + cirName + '-cir').data(data).attr({
        'r': 6,
        'cx': function(d, i) {
          return xScale(i)
        },
        'cy': function(d, i) {
          return yScale(d)
        },
        'fill': config.baseColor[cirName],
        'stroke-width': 2,
        'stroke': '#17234a'
      })
    },
    /**
     *  创建图例
     */
    creatLegend: function(svg) {
      var isLegend = svg.select('.legend').empty()
      var legend
      if (isLegend) {
        legend = svg.append('g').attr({
            'class': 'legend',
            'transform': 'translate(' + 800 + ',0)'
          })
          .style({
            'cursor': 'pointer'
          })
          //进入图例
        var legendAccess = legend.append('g').attr({
          'class': 'legend-access'
        })
        legendAccess.append('rect').attr({
          'y': 14,
          'width': 50,
          'height': 16,
          'fill': '#06fffc',
          'stroke': 'none'
        })
        legendAccess.append('text').attr({
            'x': 80,
            'y': 30,
            'fill': '#fff',
            'font-size': 24
          })
          .text('进入')
          //离开图例
        var legendLeave = legend.append('g').attr({
          'class': 'legend-leave',
          'transform': 'translate(180,0)'
        })
        legendLeave.append('rect').attr({
          'y': 14,
          'width': 50,
          'height': 16,
          'fill': '#196cff',
          'stroke': 'none'
        })
        legendLeave.append('text').attr({
            'x': 80,
            'y': 30,
            'fill': '#fff',
            'font-size': 24
          })
          .text('离开')
      }
    }
  }
  return doubleArea
})