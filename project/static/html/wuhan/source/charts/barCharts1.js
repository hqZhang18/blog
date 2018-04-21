/**
 * @Author:      zhanghq
 * @DateTime:    2017-06-27 11:25:20
 * @Description: 柱状图（渐变填充+顶部小矩形）
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-06-27 11:25:20
 */


define(function(require) {
  /**
  * 引入公用的文件
  */
  require('d3')
  require('lodash')
  // 引入公用的组件
  var commonUnit = require('./commonUnit')
 
  // 多个方法的公用配置
  var itemStyle  
  var height  
  var grid   
  var linear
  var charts = {
    /**
     *  默认配置项
     */
    defaultSetting: function() {
      return {
        width: 950,
        height: 320,
        fontFamily: '微软雅黑',
        min: 1,
        padding: {
          top: 40,
          right: 0,
          bottom: 40,
          left: 100
        },
        itemStyle: {
          width: 20,
          color: '#282f36',
          gradientColor: ['#53acf3', '#f2f996'], 
          gradient: {
            id: 'barcolor',
            color: ['#eff898', '#53acf3'],
            x1: '0%',
            y1: '0%',
            x2: '0%',
            y2: '100%',
            offset1: '20%',
            offset2: '100%',
            opacity1: 1,
            opacity2: 1
          },
          radius: 8,   
          topMark: {
            width: 15,
            height: 8,
            fill: '#fff',
            stroke: 'none',
            strokeWidth: 0
          },
          margin: {
            left: 10,
            right: 40
          }
        },
        isxAxis: true,
        yAxis: {
          axisLine: {
            show: true // 轴线
          },
          gridLine: { 
            show: true // 网格线
          },
          ticks: 3  // 刻度  
        },
        xText: {
          slice: false
        },
        grid: {  // 文字离上下左右的距离
          x: 0,
          x2: 20,
          y: 80,
          y2: 10
        }
      }
    },

    /**
     *  默认数据源
     */
    defaultDataSource: function() {
      return [
        
      ]
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
     *      name: "江北区",
     *      value: 234
     *    }
     *  ] 
     */
    drawCharts: function(id, data1, opt) {
      // 合并配置项
      config = _.merge({}, this.defaultSetting(), opt)
      // 获取数据
      var data = data1 || this.defaultDataSource()
      // 处理空数据
      var isData = commonUnit.noData(id, data)
      if(isData) { 
        return
      }
      // 创建svg
      var svg = commonUnit.addSvg(id, config)
      // 获取通用配置项
      height = config.height
      grid = config.grid
      itemStyle = config.itemStyle
      var dataset = []
      var xData = [] // 保存x轴的name
      // 处理数据
      for(var i = 0; i < data.length; i++) {
        dataset.push(data[i].value)
        var name = data[i].name
        xData.push(name)
      }
      // 比例尺
      linear = d3.scale.linear()  
          .domain([0, d3.max(dataset)])  
          .range([0, height - grid.y - grid.y2])
      // 移出轴线
      
      // 生成Y轴及网格线
      yScale =  commonUnit.addYAxis(svg, config, dataset)
      // 生成X轴
      commonUnit.addXAxis(svg, config, xData)
      // 调用滤镜
      commonUnit.addFilter(id, config)
      // 渐变颜色配置
      var colors =  [
        {
          color: config.itemStyle.gradientColor,
          id: config.itemStyle.gradient.id
        }
      ]
      // 渐变配置项
      var cradientCfg = config.itemStyle.gradient
      // 调用渐变
      commonUnit.addGradient(id, colors, cradientCfg)
      // 调用添加柱子背景,通过use引用
      this.addBgBar(id)  
      // 调用添加top小矩形框,通过use引用
      //this.addTopMark(id) 
      // 调用添加底部小圆点,通过use引用
     // this.addBotPoint(id)

     
      // 获取x轴transform的位置 
      var transX = commonUnit.getTransformX(id, data) 
      
      /*
        call 调用指定的函数一次
        通过在当前的选择以及任何可选参数。
        无论指定函数的返回值是什么，
        call操作符总是返回当前的选择。
        通过call调用函数与手动调用函数是完全一样的；
        但它可以更容易地使用方法链。
       */  


      // 设置 group的属性
      function groupAttr() {
        this.attr({
          class: 'group',
          transform: function(d, i) {
            var x = transX[i] - 15
            return 'translate(' + x + ', 8)'
          }
        })
      }
      // 获取update部分(data gruop)
      var update = svg.selectAll('.group')
        .data(data)
        .call(groupAttr)
        
      // 获取enter部分
      var enter = update.enter()
      // 获取exit部分
      var exit = update.exit()
      
      // 处理enter部分
      var enterG = enter.append('g')
        .call(groupAttr)
        .on('mouseover', function(d) {
          d3.select(this).style('cursor', 'pointer')
          commonUnit.addTooltip(id, d)  
          d3.selectAll('.charts-tooltip')
            .style('display', 'block')
        })
        .on('mouseout', function() {
          // 隐藏提示框  
          d3.selectAll('.charts-tooltip')
              .style('display', 'none')  
        })

      /**
       *  处理enter部分
      */
      // 添加背景柱子
      enterG.append('use')
        .call(this.dataBgAttr)
      // 添加数据柱子
      enterG.append('rect')
        .call(this.dataAttr)
      // 添加顶部小矩形
      enterG.append('text')
        .call(this.topTextAttr)

      /**
       *  处理upate部分
       */
      // 选择背景柱子
      update.select('.data-bg')
        .call(this.dataBgAttr)    
      // 选择数据柱子
      update.select('.rect-data')
        .call(this.dataAttr)
      // 选择顶部小矩形 
      update.select('.top-text')
        .call(this.topTextAttr)
      
      /**
       *  处理exit部分
       */
      exit.remove()
    },
 

    /**
     *  柱子(背景)属性设置 use引用defs里面的rect
     */
    dataBgAttr: function() {
      this.attr({
        'xlink:href': '#rectBg',
        class: 'data-bg'
      })
    },

    /**
     *  柱子(数据)属性设置
     */
    dataAttr: function() {
      // 最大高度  
      var maxHeight = height - grid.y - grid.y2
      // 定义比例尺
      this.attr({
        width: itemStyle.width,
        height: function(d) {
          var h = linear(d.value)
          if( h > maxHeight) {
            h  = maxHeight
          }
          return h
        },
        rx: itemStyle.radius,
        ry: itemStyle.radius,
        fill: 'url(#' + itemStyle.gradient.id + ')',
        x: 0,
        y: function(d) {
          var y = height - linear(d.value) - grid.y - 8
          if( y < 0) {
            y = 0
          }
          return  y
        },
        class: 'rect-data'
      })
    },

    /**
     *  top小矩形属性设置 use引用defs里面的rect
     */
    topTextAttr: function() {
      var topMark = itemStyle.topMark
      this.attr({
        'xlink:href': '#topMark',
        class: 'top-text',
       
        y: function(d) {
          var h = height - linear(d.value) - grid.y - topMark.height * 2 - 15
          return  h > 0 ? h : 0 
        }
      })
      .text(function(d, i) {
        return d.value
      })
    },
 
    /**
     *  添加柱子背景
     *  @param    {string}  id [容器id]
     */
    addBgBar: function(id) {
      var svg = d3.select(id).select('svg')
      var defs = commonUnit.isDefs(id)
      // 最大高度  
      var maxHeight = height - grid.y - grid.y2
      // 不允许重复添加
      if(svg.selectAll('#rectBg').node()) {
        return
      }
      defs.append('rect')
        .attr({
          width: itemStyle.width + 30,
          height: maxHeight,
          x: -15,
          opacity: 0.5,
          fill: '#091336',
          id: 'rectBg',
          stroke: '#4d5371',
          'stroke-width': 1
        })
    },
    /**
     *  添加top小矩形 
     *  @param    {string}  id [容器id]
     */
    addTopMark: function(id) {
      var svg = d3.select(id).select('svg')
      var defs = commonUnit.isDefs(id)
      if(svg.selectAll('#topMark').node()) {
        return
      }
      var topMark = itemStyle.topMark
      defs.append('rect')
        .attr({
          width: topMark.width,
          height: topMark.height,
          fill: topMark.fill,
          'stroke-width': topMark.strokeWidth,
          stroke: topMark.stroke,
 
          id: 'topMark'
        })
    },

    /**
     *  添加底部小圆点
     *  @param    {string}  id [容器id]
     */
    addBotPoint: function(id) {
      var svg = d3.select(id).select('svg')
      var defs = commonUnit.isDefs(id)
      if(svg.selectAll('#botPoint').node()) {
        return
      }
      defs.append('image')
        .attr({
          width: 16,
          height: 16,
          'xlink:href': URL.SVG_IMG_PATH + 'mark.png',
          x: -4,
          y: function() {
            return   height - grid.y - 8
          },
          id: 'botPoint'
        })
    },
  }
  return charts
})

