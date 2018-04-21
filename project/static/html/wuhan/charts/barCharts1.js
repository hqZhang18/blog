/**
 * @Author:      zhanghq
 * @DateTime:    2017-08-18 11:43:14
 * @Description: 柱状图(总览-评估)
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-18 11:43:14
 */

define(function(require) {
 /**
  * 引入公用的文件
  */
  require('d3')
  require('lodash')
  // 引入公用的组件
  var commonUnit = require('./commonUnit')

  // 公用变量
  var height
  var itemStyle
  var config
  var linear

  var charts = {
    defaultSetting: function() {
      return {
        width: 370,
        height: 288,
        padding: {
          top: 10,
          left: 30,
          bottom: 20,
          right: 50,
        },
        min: 10,
        itemStyle: {
          borderColor: 'none',
          borderWidth: 1,
          width: 2.5,
          colors: [
            {
              id: 'color1',
              color: ['#099acf', '#00c3ff']
            }, {
              id: 'color2',
              color: ['#8e2744', '#bd5d4d']
            }, {
              id: 'color3',
              color: ['#f2fe08', '#1faf71']
            },
          ],  
          gradient: {
            id: 'brushBarColor1',
            x1: '0%',
            y1: '0%',
            x2: '0%',
            y2: '100%',
            offset1: '20%',
            offset2: '100%',
            opacity1: 1,
            opacity2: 0.8
          },
          margin: {
            left: 10
          },
          topMark: {
            fill: '#018eff',
            margin: {
              bottom: 2
            }
          }
        },
        yAxis: {
          unit: 'w'
        },
        xText: {
          fontSize: 14,
          fill: '#a5cfe0',
          textAnchor: 'middle',
          margin: {
            bottom: 10
          }
        },
        grid: {
          x: 50,
          x2: 0,
          y: 125,
          y2: 0
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
     *      name: '江北区',
     *      value: 234
     *    }
     *  ] 
     */
    drawCharts: function(id, data1, opt) {
      // 合并配置项
      config = _.merge({}, this.defaultSetting(), opt)
      // 获取数据
      var data = data1 || this.defaultDataSource()
      //  空数据处理
      var isData = commonUnit.noData(id, data)
      if(isData) { 
        return
      }
      /*
      *  全局配置项
      */
      height = config.height
      itemStyle = config.itemStyle
      var padding = config.padding
      // 创建svg
      var svg = commonUnit.addSvg(id, config)
      var dataset = [] 
      for(var i = 1; i<4; i++) {
        for(var j = 0, len = data.length; j < len; j++) {
          dataset.push(data[j]['value'+i])
        }
      } 
 
      // 旋转文字  
      d3.select(id).selectAll('.axis-x text')
        .attr({
          transform: 'rotate(-35) ',
          x: function(d, i) {
            return -17
          },
          y: function(d, i) {
            return 9 
          },
        })
      commonUnit.addYAxis(svg, config, dataset)


      // 定义比例尺
      var dataH = height - config.grid.y - config.grid.y2
      linear = d3.scale.linear()  
            .domain([0, d3.max(dataset)])  
            .range([0, dataH])

      var colors = itemStyle.colors
      // 渐变配置项
      var gradientCfg = itemStyle.gradient
      
      commonUnit.addGradient(id, colors, gradientCfg)
     
      
      // 获取update部分
      var update = svg.selectAll('.bar-group')
        .data(data)
        .call(this.groupAttr, id, data)

      // 获取enter部分
      var enter = update.enter()

      var exit = update.exit() 

      // 处理enter部分
      var enterG = enter.append('g')
         .call(this.groupAttr, id, data)

     // 数据柱子配置项
      var rectCfg = null
      for(var i=0; i<3; i++) {
        rectCfg = {
          class: 'data-rect' + i,
          x: 8 * i - 10,  // x的位置
          index: i  // data下标
        }
        // 添加数据矩形  
        enterG.append('rect')
          .call(this.rectAttr, rectCfg, id) 
        // 选择数据柱子      
        update.select('.data-rect' + i)
          .call(this.rectAttr, rectCfg, id)
      }   

      // 处理exit部分   
      exit.remove()     

             
    },
    /**
     *  组元素
     *  @param    {object}  dom  g元素容器
     *  @param    {string}  id   容器id
     *  @param    {array}   data 图表数据
     */
    groupAttr: function(dom, id, data) {
      // 获取X轴transform的位置 

      var transX = commonUnit.getTransformX(id, data) 
      this.attr({
        class: 'bar-group',
        transform: function(d, i) {
          var x = transX[i]
          var y = height - config.grid.y
          return 'translate(' + x + ', ' + y + ')'
        }
      })
      .style({
        'pointer-events': 'auto',
        'cursor': 'pointer'
      })
      .style('pointer-events', 'auto')
      .on('mouseover', function(d, i) {
        d.name = d.date
        charts.addTooltip(id, d)  
        d3.selectAll('.charts-tooltip')
          .style('display', 'block')
        // 当前下面的柱子高亮  
        d3.selectAll('.select-rect' + i)
          .attr({
            width: itemStyle.width,
            transform: 'translate(0, 0)'  
          })
          .transition()
          .duration(300)
          .attr({
            width: itemStyle.width + 3,
            transform: 'translate(-1.5, 0)'  
          })
        
      })
      .on('mouseout', function(d, i) {
        // 当前下面的柱子新式还原
        d3.selectAll('.select-rect' + i)
          .attr({
            width: itemStyle.width + 3,
            transform: 'translate(-1.5, 0)'  
          })
          .transition()
          .duration(300)
          .attr({
            width: itemStyle.width,
            transform: 'translate(0, 0)'  
          })
        // 隐藏提示框  
        d3.selectAll('.charts-tooltip')
          .style('display', 'none')  
      })
    },
    // 
    /**
     *  数据矩形属性设置
     */
    rectAttr: function(roots, cfg, id) {
      roots.attr({
        fill: function() {
          return 'url(#' + itemStyle.colors[cfg.index].id + ' )'
        },
        width: itemStyle.width,
        height: 0,
        x: cfg.x,
        y: 0,
        opacity: 0,
        rx : 5,
        ry: 5,
        'stroke-opacity': 0,
        'stroke-width': 15,
        stroke: '#fff',
        class: function(d, i) {
          return cfg.class + ' select-rect' + i
        }
      })   
      .transition()
      .duration(750)
      .attr({
        height: function(d) {
          var value = 0
          switch(cfg.index) {
            case 0:
              value = d.value1
              break;
            case 1:
              value = d.value2
              break;
            case 2:
              value = d.value3
              break;
            default:
              break
          }
          var h = linear(value)  - 12
          // 小最值设置
          if(h < config.min) {
            h = config.min
          }
          return h
        },
        y: function(d) {
          var value = 0
          switch(cfg.index) {
            case 0:
              value = d.value1
              break;
            case 1:
              value = d.value2
              break;
            case 2:
              value = d.value3
              break;
            default:
              break
          }
          var y = -linear(value)  + 12
          // 小最值设置
          if( y>-config.min ) {
            y =  - config.min
          }
          return y
        },
        opacity: 1,
      })
    },   

    /**
     *  添加提示框
     *  @param    {string}   id     容器id
     *  @param    {object}   data   配置项
     */
    addTooltip: function(id, data) {
      var html = '<p>' + data.name + ' <p>' 
        + '<p>培训:' + data.value1 + ' <p>' 
        + '<p>刑事拘留:' + data.value2 + ' <p>' 
        + '<p>行政拘留:' + data.value3 + ' <p>' 
      var tooltip
      if(d3.select('body').selectAll('.charts-tooltip').node()) {
        tooltip = d3.selectAll('.charts-tooltip')
      }else {
        tooltip = d3.select('body')
          .append('div')
          .attr('class', 'charts-tooltip')
      }
      tooltip.html(html)
      // 提示框添加内容后的width    
      var width = $('.charts-tooltip').width()
      // 提示框添加内容后的height   
      var height = $('.charts-tooltip').height()
      // 由于页面缩放了,这里的是缩放之后添加的div。用当前位置要除以缩放的值(暂时忽略这句)
      // event.clientY, event.pageY, event.y三个值相等
      var top = event.pageY / window.Y - height *2
      var left = event.pageX / window.X - width
      if(data.name.length < 5) {
        left = left + width
      }
      tooltip
        .style({
          top: top + 'px',
          left: left + 'px'
        })
    },

  }
  return charts
})


