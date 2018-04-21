/**
 * @Author:      zhanghq
 * @DateTime:    2017-07-03 15:20:16
 * @Description: 面积图
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-07-03 15:20:16
 */

define(function (require) {
  /**
   * 引入公用的文件
   */
  require('d3')
  require('lodash')
  require('jquery')
  
  // 公用配置项
  var config = {}
  var yScale  // y轴
  var xScale  // x轴
  var areaPath // 区域生成器
  var linePath  // 线段生成器
  var grid
  var height
  var nullData = [] // 动画路径初始化
  
  var commonUnit = require('./../commonUnit.js')
  
  var behaviorCount = {
    defaultSetting: function () {
      return {
        width: 960,
        height: 650,
        id: '#behaviorCount',
        padding: {
          top: 30,
          left: 80,
          bottom: 0,
          right: 40,
        },
        itemStyle: [{
          areaPath: {
            fill: ['#f0c429', '#32226e'],
            stroke: 'none',
            strokeWidth: 1,
          },
          linePath: {
            fill: 'none',
            stroke: '#f0c429',
            strokeWidth: 3,
          },
        }, {
          areaPath: {
            fill: ['#f0c429', '#040e59'],
            stroke: 'none',
            strokeWidth: 1,
          },
          linePath: {
            fill: 'none',
            stroke: '#2ea7aa',
            strokeWidth: 3,
          },
        }
        ],
        xText: {
          fill: ['#f0c429', '#2ea7aa'],
          fontSize: 27,
          textAnchor: 'middle',
          margin: {
            bottom: 10
          }
        },
        lineMark: {
          radius: 8,
          type: 1, // 1是小菱形， 2是圆点,
          fill: '#fff'
        },
        yAxis: {
          axisLine: {
            show: true
          },
          gridLine: {
            show: true
          },
          ticks: 8,
          isLoss: true, // 负数,
          ratio: true //按百分比显示
        },
        grid: {
          x: 50,
          x2: 0,
          y: 105,
          y2: 0
        }
      }
    },
    
    /**
     *  默认数据源
     */
    defaultDataSource: function () {
      return []
    },
    
    /**
     *  绘制图表
     *  @param    {string} id   容器id
     *  @param    {array}  data 图表数据
     *  @param    {object} opt  图表配置项
     *
     *  example:
     *  [
     *    {
     *      name: '江北区',
     *      value1: 1140,
     *      value2: 740
     *    }
     *  ]
     */
    drawCharts: function (id, data1, opt) {
      // 合并配置项
      config = _.merge({}, this.defaultSetting(), opt)
      // 获取数据
      var data = data1 || this.defaultDataSource()
      data = commonUnit.unique(data)
      
      var padding = config.padding
      var width = config.width - padding.left - padding.right
      height = config.height
      grid = config.grid
      
      var newData = [1, 2]
      // 创建svg
      var svg = commonUnit.addSvg(id, config)
      // 分别获取value,name值  xData用于生成x轴name
      var dataset1 = []
      var dataset2 = []
      var xData = []
      var dataset = []
      for (var i = 0; i < data.length; i++) {
        dataset1.push(parseInt(data[i].tongbi, 10))
        dataset2.push(parseInt(data[i].huanbi, 10))
        nullData.push(0)
        xData.push(data[i].name)
      }
      // 用于添加Y轴及网格线
      var dataset = dataset1.concat(dataset2)
      // 生成Y轴及网格线
      yScale = commonUnit.addYAxis(svg, config, dataset)
      // 生成X轴
      commonUnit.addXAxis(svg, config, xData)
      // 调用滤镜
      commonUnit.addFilter(id, config)
      
      // 获取y轴0轴线的坐标位置
      var axisXPos = 0
      for (var i = 0; i < dataset.length; i++) {
        var index = parseInt($(id + ' .axis-y').find('.tick text').eq(i).html(), 10)
        if (index == 0) {
          var transY = $(id + ' .axis-y').find('.tick').eq(i).attr('transform')
          var start = transY.indexOf(',')
          var end = transY.indexOf(')')
          axisXPos = parseInt(transY.substring(start + 1, end), 10)
        }
      }
      //改变x轴线的Y轴位置
      d3.select(id).selectAll('.axis-x')
        .attr('transform', 'translate(0, ' + axisXPos + ')')
      
      var itemStyle = config.itemStyle
      // 横坐标轴比例尺
      xScale = d3.scale.linear()
        .domain([-0.2, xData.length - 0.8]) // 右边两边各留点距离
        .range([0, width])
      // 改变x轴位置      
      d3.select(id).select('.axis-x').selectAll('.tick')
        .attr('transform', function (d, i) {
          return 'translate(' + xScale(i) + ', 0)'
        })
      
      // 添加菱形标注点      
      
      if (config.lineMark.type === 1) {
        this.addPoint(id)
      } else {
        this.addCircle(id)
      }
      
      
      // 区域生成器
      areaPath = d3.svg.area()
        .x(function (d, i) {
          return xScale(i)
        })
        .y0(function () {
          return height - grid.y
        })
        .y1(function (d) {
          return yScale(d) + grid.y2
        })
        // 线条样式 linear/linear-closed/step/... 曲线:basis/cardinal/
        .interpolate('cardinal')
      
      // 生成线段
      linePath = d3.svg.line()
        .x(function (d, i) {
          return xScale(i)
        })
        .y(function (d) {
          return yScale(d) + grid.y2
        })
        .interpolate('cardinal')
      
      // 渐变配置项
      var gradientCfg = {
        x1: '0%',
        y1: '30%',
        x2: '0%',
        y2: '100%',
        offset1: '0%',
        offset2: '100%',
        opacity1: 0.5,
        opacity2: 0.5
      }
      
      // 获取update    
      var update = svg.selectAll('.group')
        .data(newData)
      
      // 获取enter
      var enter = update.enter()
      // 获取exit
      var exit = update.exit()
      // 处理enter
      enter.append('g')
        .attr('class', function (d, i) {
          return 'group group' + (i + 1)
        })
      
      // 处理update部分
      svg.selectAll('.group')
        .attr('class', function (d, i) {
          return 'group  group' + (i + 1)
        })
      
      // 处理exit    
      exit.remove()
      
      for (var i = 1, len = (newData.length + 1); i < len; i++) {
        // 渐变色配置项
        var colors = [
          {
            color: itemStyle[i - 1].areaPath.fill,
            id: 'BeColor' + i + ''
          }
        ]
        // 调用渐变
        commonUnit.addGradient(id, colors, gradientCfg)
        
        // 获取配置项
        var opts = {
          id: 'url(#BeColor' + i + ')',
          areaPath: itemStyle[i - 1].areaPath,
          linePath: itemStyle[i - 1].linePath
        }
        
        var group = svg.select('.group' + i)
        // 获取value  
        var dataset = []
        if (i == 1) {
          dataset = dataset1
        } else {
          dataset = dataset2
        }
        // 调用
        // group.call(this.addElems, dataset, opts, i)
        this.addElems(group, dataset, opts, i)
      }
    },
    
    /**
     *  添加图形元素
     *  @param    {object}  group   [g元素]
     *  @param    {array}   dataset [path数据]
     *  @param    {object}  opt     [配置项]
     *  @param    {number}  type    [类型，用于填充颜色]
     */
    addElems: function (group, dataset, opt, type) {
      
      // 线条路径
      if (group.selectAll('.line-path').node()) {
        // 选择线段path  
        group.select('.line-path')
          .call(this.linePathAttr, dataset, opt)
      } else {
        // 添加线段path
        group.append('path')
          .call(this.linePathAttr, dataset, opt)
      }
      
      // 标注点组元素
      var markGroup
      if (group.selectAll('.mark-group').node()) {
        markGroup = group.selectAll('.mark-group')
          .attr('class', 'mark-group')
      } else {
        markGroup = group.append('g')
          .attr('class', 'mark-group')
      }
      
      var markAttr = null
      if (config.lineMark.type === 1) {
        markAttr = this.pointAttr
      } else {
        markAttr = this.useCircleAttr
      }
      
      
      // 获取update  
      var markUpdate = markGroup.selectAll('.line-point')
        .data(dataset)
        .call(markAttr, type)   // 处理upate 部分
      // 获取enter
      var markEnter = markUpdate.enter()
      // 获取exit部分
      var markExit = markUpdate.exit()
      // 处理enter
      markEnter.append('use')
        .call(markAttr, type)
      // 处理exit  
      markExit.remove()
      // 文字组元素   
      var textGroup
      if (group.selectAll('.text-group').node()) {
        textGroup = group.selectAll('.text-group')
          .attr('class', 'text-group')
      } else {
        textGroup = group.append('g')
          .attr('class', 'text-group')
      }
      
      // 获取update value  
      var textUpdate = textGroup.selectAll('.top-text')
        .data(dataset)
        .call(this.textAttr, type)
      
      // 获取enter value  
      var textEnter = textUpdate.enter()
      // 获取exit  value
      var textExit = textUpdate.exit()
      // 处理enter
      textEnter.append('text')
        .call(this.textAttr, type)
      // 处理update  
      textGroup.selectAll('.top-text')
      // 处理exit
      textExit.remove()
    },
    
    /**
     *  区域路径属性设置
     *  @param    {string}  dom     [g元素]
     *  @param    {array}   dataset [path数据]
     *  @param    {object}  opt     [配置项]
     */
    areaPathAttr: function (dom, dataset, opt) {
      this.attr({
          stroke: opt.areaPath.stroke,
          'stroke-width': opt.areaPath.strokeWidth,
          fill: opt.id,
          class: 'area-path',
          d: areaPath(nullData)
        })
        .transition()
        .duration(750)
        .attr({
          d: areaPath(dataset)
        })
    },
    
    /**
     *  线段路径属性设置
     *  @param    {string}  dom     [g元素]
     *  @param    {array}   dataset [path数据]
     *  @param    {object}  opt     [配置项]
     */
    linePathAttr: function (dom, dataset, opt) {
      this.attr({
          stroke: opt.linePath.stroke,
          'stroke-width': opt.linePath.strokeWidth,
          fill: opt.linePath.fill,
          filter: 'url(#filter1)',
          class: 'line-path',
          d: linePath(nullData)
        })
        .transition()
        .duration(750)
        .attr({
          d: linePath(dataset),
        })
    },
    
    /**
     *  设置标注点样式
     *  @param    {array}  use  use元素
     *  @param    {number}  type 同比环比类型
     */
    pointAttr: function (use, type) {
      use.attr({
          'xlink:href': '#TopPoint',
          class: 'line-point',
          opacity: 0,
          fill: function (d, i) {
            if (type == 1) {
              return config.itemStyle[0].linePath.stroke
            }
            return config.itemStyle[1].linePath.stroke
          },
          transform: function (d, i) {
            var x = xScale(i) - 5
            var y = config.height - grid.y - grid.y2
            return 'translate(' + x + ', ' + y + ')'
          }
        })
        .transition()
        .duration(750)
        .attr({
          opacity: 1,
          transform: function (d, i) {
            var x = xScale(i) - 5
            var y = yScale(d) + grid.y2 - 5
            return 'translate(' + x + ', ' + y + ')'
          }
        })
    },
    
    /**
     *  设置标注点样式
     *  @param    {array}  use  use元素
     *  @param    {number}  type 同比环比类型
     */
    useCircleAttr: function (use, type) {
      use.attr({
          'xlink:href': '#TopCircle',
          class: 'line-point',
          opacity: 0,
          'stroke-width': 3,
          stroke: function (d, i) {
            if (!config.lineMark.stroke) {
              if (type == 1) {
                return config.itemStyle[0].linePath.stroke
              }
              return config.itemStyle[1].linePath.stroke
            } else {
              return config.lineMark.stroke
            }
            
          },
          transform: function (d, i) {
            var x = xScale(i) - 5
            var y = config.height - grid.y - grid.y2
            return 'translate(' + x + ', ' + y + ')'
          }
        })
        .transition()
        .duration(750)
        .attr({
          opacity: 1,
          transform: function (d, i) {
            var x = xScale(i) - 5
            var y = yScale(d) + grid.y2
            return 'translate(' + x + ', ' + y + ')'
          }
        })
    },
    
    
    /**
     *  文字属性设置
     */
    textAttr: function (dom, type) {
      var xText = config.xText
      this.attr({
          r: 4,
          x: function (d, i) {
            return type === 1 ? xScale(i) + 20 : xScale(i) - 20
            // return xScale(i)
          },
          fill: function () {
            return type === 1 ? xText.fill[0] : xText.fill[1]
          },
          'text-anchor': function () {
            var textAnchor = 'end'
            if (type === 1) {
              textAnchor = 'start'
            }
            return textAnchor
          },
          'font-size': xText.fontSize,
          class: 'top-text',
          y: function (d) {
            var y = config.height - grid.y - grid.y2
            return y
          },
          opacity: 0
        })
        .transition()
        .duration(750)
        .attr({
          y: function (d) {
            var y = yScale(d) + grid.y2 + 18
            return d === 0 ? y : y - 8
          },
          opacity: 1
        })
        .text(function (d) {
          return d
        })
    },
    
    /**
     *  添加top小矩形
     *  @param    {string}  id [容器id]
     */
    addPoint: function (id) {
      var svg = d3.select(id).select('svg')
      var defs = commonUnit.isDefs(id)
      if (svg.selectAll('#TopPoint').node()) {
        return
      }
      var points = '5, 0, 0, 5, 5, 10, 10, 5'
      var zoom = 0.6
      var oPoints = points
      oPoints = oPoints.split(',')
      var points = []
      for (var i = 0; i < oPoints.length; i++) {
        var num = oPoints[i] / zoom
        if (isNaN(num)) {
          num = 0
        }
        points.push(num)
      }
      defs.append('polygon')
        .attr({
          points: points,
          id: 'TopPoint'
        })
    },
    // 白老师，这两天带我去查检，
    /**
     *  添加线条上的小圆点
     */
    addCircle: function (id) {
      var svg = d3.select(id).select('svg')
      var defs = commonUnit.isDefs(id)
      defs.append('circle')
        .attr({
          r: config.lineMark.radius,
          fill: config.lineMark.fill,
          id: 'TopCircle'
        })
    }
  }
  return behaviorCount
})

