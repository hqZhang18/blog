/**
 * @Author:      zhanghq
 * @DateTime:    2017-08-30 10:11:56
 * @Description: 三角形面积图
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-30 10:11:56
 */

define(function(require) {
  /**
  * 引入公用的文件
  */
  require('d3')
  require('lodash')
  // 引入公用的组件
  var commonUnit = require('./commonUnit')
  // 图片路径
  var IMGPATH = commonUnit.imgPath()

  var charts = {

    /**
     *  默认配置项
     */
    defaultSetting: function() {
      return {
        width: 950,
        height: 310,
        padding: {
          top: 30,
          right: 160,
          bottom: 40,
          left: 120
        },
        itemStyle: {
          barWidth: 6,
          mark: {
            fill: '#5acaff'
          },
          color: ['#0c66f2', '#4ad6fb'],
          min: 20,
          margin: {
            left: 10
          },
          gradient: {
            id: 'triangleID',
            x1: '0%',
            y1: '0%',
            x2: '0%',
            y2: '100%',
            offset1: '10%',
            offset2: '90%',
            opacity1: 0.8,
            opacity2: 0.6
          },
        },
        yAxis: {
          axisLine: {
            show: true
          },
          gridLine: {
            show: true
          },
          ticks: 5
        },
        xText: {
          fontSize: 23,
          fill: '#fff',
          textAnchor: 'middle',
          margin: {
            left: 0,
            bottom: 5
          }
        },
        grid: {
          x: 50,
          y: 70,
          y2: 40
        }
      }
    },

    /**
     *  绘制图表
     *  @example: [example]
     *  @param    {array}   data   数据源
     *  @param    {object}  config 配置项
     */
    drawCharts: function(id, data1, opt) {
      // 合并配置项
      config = _.merge({}, this.defaultSetting(), opt)

      // 获取数据
      var data = data1 || this.defaultDataSource()
      data = commonUnit.unique(data)
      config.datalen = data.length 
      // 处理空数据
      var isData = commonUnit.noData(id, data)
      if(isData) { 
        return
      }
      // 创建svg
      var svg = commonUnit.addSvg(id, config)
      // 获取x轴数据生成x轴
      var xData = []
      var dataset = []
      data.map(function(d) {
        xData.push(d.name)
        dataset.push(d.value)
      })
      commonUnit.addXAxis(svg, config, xData)
      // 获取x轴每个点的坐标
      var transX = commonUnit.getTransformX(id, data)
      // 生成Y轴及网格线
      this.addYAxis(svg, config, dataset)
      d3.select(id).selectAll('.axis-x text')
        .attr('x', 80)
         
      // 渐变颜色配置
      var colors =  [
        {
          color: config.itemStyle.color,
          id: config.itemStyle.gradient.id
        }
      ]
      // 渐变配置项
      var cradientCfg = config.itemStyle.gradient
      // 调用渐变
      commonUnit.addGradient(id, colors, cradientCfg)  

      // 改变x轴线长度
      d3.select(id).selectAll('.inner_line line')
        .attr('x2', 3200+160)

       // 生成一个线性比例尺  
      var linear = d3.scale.linear()
          .domain([0, d3.max(dataset) * 1.1])
          .range([0, config.height - config.grid.y - config.grid.y2])

      // 获取update部分并处理
      var updata = svg.selectAll('.group')
        .data(data)
        .call(this.groupAttr, config, transX)

      // 获取enter部分  
      var enter = updata.enter()
      // 处理enter部分
      var enterG = enter.append('g')
        .call(this.groupAttr, config, transX)

      // 添加一个多边形元素  
      enterG.append('polygon')
        .call(this.polygonAttr, config, transX, linear)

      enterG.append('use')
        .call(this.useAttr, transX, linear) 

      enterG.append('text')
        .call(this.textAttr, config, transX, linear)   

      enterG.append('image')
        .call(this.lineAttr, config, transX, linear)   

      // 选择多边形面积图(数据展示)
      updata.select('.polygon-data')
        .call(this.polygonAttr, config, transX, linear)  
      // 选择标记点  
      updata.select('.use-mark')  
        .call(this.useAttr, transX, linear) 
      // 选择文字
      updata.select('.top-text')
        .call(this.textAttr, config, transX, linear)   

      updata.select('.top-line')
        .call(this.lineAttr, config, transX, linear)    

      // 获取exit部分并exit部分
      updata.exit().remove()  
   
    },

    /**
     *  线条属性设置
     *  @param    {array}   roots  根元素
     *  @param    {object}  config 配置项
     *  @param    {array}       transX x轴坐标点
     *  @param    {funcgion}    linear 比例尺
     */
    lineAttr: function(roots, config, transX, linear) {
      roots.attr({
        class: 'top-line',
        'xlink:href': IMGPATH[0] + 'personFlow/line.png',
        transform: function(d, i) {
          return 'translate(' + transX[i] + ', 0)'
        },
        opacity: 0
      })
      // 添加过度动画
      .transition()
      .duration(750)
      .attr({
        transform: function(d, i) {
          return 'translate(' + (transX[i] -4)+ ', ' + -(linear(d.value) + 14) + ')'
        },
        opacity: 1
      })
    },

    /**
     *  文字属性设置
     *  @param    {array}   roots  根元素
     *  @param    {object}  config 配置项
     *  @param    {array}       transX x轴坐标点
     *  @param    {funcgion}    linear 比例尺
     */
    textAttr: function(roots, config, transX, linear) {
      roots.attr({
        class: 'top-text',
        'text-anchor': 'middle',
        fill: config.xText.fill,
        transform: function(d, i) {
          return 'translate(' + transX[i] + ', 0)'
        },
        opacity: 0,
        'font-size': 36,
        x: 30

      })
      .text(function(d) {
        return  d.value 
      })
      // 添加过度动画
      .transition()
      .duration(750)
      .attr({
        transform: function(d, i) {
          return 'translate(' + (transX[i] -4)+ ', ' + -(linear(d.value) + 14) + ')'
        },
        opacity: 1
      })
    },


    /**
     *  mark-use属性设置
     *  @param    {array}       roots  根元素
     *  @param    {array}       transX x轴坐标点
     *  @param    {funcgion}    linear 比例尺
     */
    useAttr: function(roots, transX, linear) {
      roots.attr({
        'xlink:href': '#polygonMark',
        transform: function(d, i) {
          return 'translate(' + (transX[i] -4) + ', 0)'
        },
        class: 'use-mark',
        opacity: 0,
      })
      .transition()
      .duration(750)
      .attr({
        transform: function(d, i) {
          return 'translate(' + (transX[i] -4)+ ', ' + -(linear(d.value) + 4) + ')'
        },
        opacity: 1
      })
    },

    /**
     *  多边形属性设置
     *  @param    {array}     roots  根元素
     *  @param    {object}    config 配置项
     *  @param    {array}     transX x轴坐标点
     *  @param    {function}  linear 比例尺
     */
    polygonAttr: function(roots, config, transX, linear) {
      roots.attr({
        points: function(d, i) {
          var p5 = parseInt(transX[i], 10) + 200
          var p1 = parseInt(transX[i], 10)  - 200
          if(i==0) {
            p1 = -50
          }
          if(i==config.datalen - 1) {
            p5 = config.width - 198
          }
           return  p1 + ' 0,' + transX[i] + ' 0,' + p5 + ' 0'
        },
        class: 'polygon-data',
        fill: function(d, i) {
          if(i%2==0) {
            return '#04a0b0'
          }
          return '#164e7c'
        },
        fill: 'url(#triangleID)',
        opacity: 0
      })
      .transition()
      .duration(750)
      .attr({
        points: function(d, i) {
          var p5 =  parseInt(transX[i], 10) + 200
          var p1 = parseInt(transX[i], 10)  - 200
          if(i==0) {
            p1 = -50
          }
          if(i==config.datalen - 1) {
            p5 = config.width - 198
          }
           return  p1 + ' 0,' + transX[i] + ' ' + -linear(d.value) + ',' + p5 + ' 0'
        },
        opacity: 0.6
      })
    },

    /**
     *  绘制一个菱形标注点
     */
    addMark: function(config) {
      var defs = commonUnit.isDefs(this.container)
      // 线段上多边形标记点  
      var point =  '5, 0, 0, 5, 5, 10, 10, 5'
      var zoom = 1.2
      var oPoints = point
      oPoints = oPoints.split(',')
      var points = []
      for(var i = 0, len = oPoints.length; i < len; i++) {
        var num = oPoints[i] / zoom
        if(isNaN(num)) {
          num = 0
        }
        points.push(num)
      }   
      defs.append('polygon')
        .attr({
          points: points,
          id: 'polygonMark',
          fill: config.itemStyle.mark.fill
        })
    },

    /**
     *  组元素属性设置
     *  @param    {[type]}  roots  [description]
     *  @param    {[type]}  config [description]
     *  @param    {[type]}  transX [description]
     *  @return   {[type]}  [description]
     */
    groupAttr: function(roots, config, transX) {
      roots.attr({
        transform: function(d, i) {
          return 'translate(80,' + (config.height - config.grid.y ) +' )'
        },
        class: 'group'
      })
    },

    /**
     *  添加Y轴及网格线
     *  @param    {object}   svg       svg容器
     *  @param    {type}     config    配置项
     *  @param    {type}     dataset   数据
     *  @return   {object}             Y轴比例尺
     */
    addYAxis: function (svg, config, dataset) {
        var padding = config.padding
        var width = config.width - padding.left - padding.right
        var height = config.height
        var yAxisCfg = config.yAxis
        var domain = []
        
        // 定义y轴比例尺
        var yScale = d3.scale.linear()
            .domain([0, d3.max(dataset) * 1.1])
            .range([height - config.grid.y - config.grid.y2 , 0])

        // 定义y轴样式
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(yAxisCfg.ticks)
             

        // 设置Y轴属性
        function axisYAttr() {
            this.attr({
                class: 'axis axis-y',
                id: yAxisCfg.id,
                transform: function () {
                    return 'translate(0, ' + config.grid.y2 + ')'
                }
            })
            .call(yAxis)
        }

        var isAxisLine = yAxisCfg.axisLine.show
        if (isAxisLine) {
            if (svg.selectAll('#' + yAxisCfg.id + '.axis-y').node()) {
                svg.select('#' + yAxisCfg.id + '.axis-y')
                    .call(axisYAttr)
            } else {
                svg.append('g')
                    .call(axisYAttr)
            }
        }

        // 定义纵轴网格线
        var yInner = d3.svg.axis()
              .scale(yScale)
              .tickSize(-width, 0)
              .tickFormat('')
              .orient('left')
              .ticks(yAxisCfg.ticks)
          // 添加纵轴网格线
          if (svg.selectAll('svg .inner-line-y').node()) {
              svg.select('#' + yAxisCfg.id + '.inner-line-y')
                  .call(innerLineAttr)
          } else {
              svg.append('g')
                  .call(innerLineAttr)
          }

          function innerLineAttr() {
              this.attr('class', 'inner_line inner-line-y')
                  .attr('transform', 'translate(0, ' + config.grid.y2 + ')')
                  .call(yInner)
          }
        return yScale
        }

  }
  return charts
})
 