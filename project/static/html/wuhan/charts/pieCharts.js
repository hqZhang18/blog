/**
 * @Author:      训练总量饼图
 * @DateTime:    2017-08-21 10:11:25
 * @Description: Description
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-21 10:11:25
 */

define(function(require) {
  /**
  * 引入公用的文件
  */
  require('d3')
  require('lodash')
  // 引入公用的组件
  var commonUnit = require('./commonUnit')
  
  var pie // 转换原始数据为能用于绘图的数据
  var pieData // pie函数处理后的数据
  var innerRadius  // 定义内半径
  var outerRadius  // 定义外半径
  var arc1 // 定义计算弧形路径的函数
  var arc2 // 定义计算弧形路径hover的函数
  var lineArc // 折线开始的弧生成器
  var lEndArc // 折线结束的弧生成器 
  var isInit = 0 // 是否初始化
   
  /**
   *  默认配置项
   */
  var defaultSetting = {
    width: 150,
    height: 150,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
    itemStyle: {
      innerRadius: 35,
      outerRadius: 60,
      colors: [
        {
          id: 'drill1',
          color: ['#0156bb', '#0572e3']
        }, {
          id: 'drill2',
          color: ['#7818e9', '#7818e9']
        }, {
          id: 'drill3',
          color: ['#00b3d8', '#00c19d']
        },{
          id: 'drill4',
          color: ['#e57f57', '#e53241']
        },
        {
          id: 'drill5',
          color: ['#086ad7', '#0056bb']
        }
      ],
      circleBor: '#0a0c3f',
      circleBorW: 20
    },
    gradient: {
      id: 'drillCharts',
      x1: '0%',
      y1: '0%',
      x2: '0%',
      y2: '100%',
      offset1: '20%',
      offset2: '100%',
      opacity1: 1,
      opacity2: 1
    },
    lineStyle: {
      fill: '#174793',
      strokeWidth: 2
    },
    text: {
      fontSize: 16,
      fill: '#fff',
      textAnchor: 'middle'
    }
  }

  /**
   *  默认数据源
   */
  var defaultDataSource = [
    {
      name: "入警训练",
      value: 6025
    }, {
      name: "晋升训练",
      value: 4928
    }, {
      name: "专业训练",
      value: 3831
    }, {
      name: "发展训练",
      value: 5839
    } 
  ]

  /**
   *  g元素tansfrom的位置 
   */
  function gTrans(roots, config) {
    roots.attr({
      transform: 'translate(' + config.width / 2 + ',' + config.height / 2 + ')'
    })
  }

  /**
   * 计算弧长的中心位置  
   */
  function midAngel(d) {
    // 计算弧长的中心位置 =（起始弧度 + 终止弧度）/2 = 弧度的中心位置
    return d.startAngle + (d.endAngle - d.startAngle) / 2
  }

  /**
   * 画最外层圆的圆
  */
  function circleAttr(roots, cfg, config) {
    roots.attr({
      cy: 0,
      cx: 0,
      r: cfg.radius,
      fill: 'none',
      stroke: cfg.stroke,
      'stroke-width': cfg.strokeWidth
    })
    .call(gTrans, config)
  }

  /**
   *  获取饼图填充色
   *  @example: [example]
   *  @param    {numbter}  idx [下标]
   */
  function getColor(idx) {
    // 默认颜色
    var defauleColor = [
      '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
      '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
      '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
      '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
    ]
    var palette = _.merge([], defauleColor, config.itemStyle.colors)
    return palette[idx % palette.length]  
  }  

  /**
   *  path属性设置
   */
  function arcPathAttr(roots, id, config) {
    roots.attr({
      d: function(d) {
        return arc1(d)
      },
      // fill: function(d, i) {
      //   return getColor(i)
      // }
      fill: function(d, i) {
        return 'url(#' + config.itemStyle.colors[i++].id + ' )'
      },
    })
    .on('mouseover', function(d) {
      d3.select(this)
        .attr({
          cursor: 'pointer',
          'fill': '#e6e752'
        })
        .transition()
        .attr('d', function(d) {
          return arc2(d)
        })
      commonUnit.addTooltip(id, d.data)  
      d3.selectAll('.charts-tooltip')
        .style('display', 'block')
    })
    .on('mouseout', function(d, i) {
      d3.select(this)
        .attr({
          fill: function() {
            return 'url(#' + config.itemStyle.colors[i++].id + ' )'
          },
        })
        .transition()
        .attr('d', function(d) {
          return arc1(d) 
        })
      // 隐藏提示框  
      d3.selectAll('.charts-tooltip')
        .style('display', 'none')  
    })
  }

  /**
   *  path组元素(饼图)
   */
  function arcGroup(roots, id, config) {
    roots.attr('class', 'arcGroup')
      .call(gTrans, config)

    // 获取update部分 
    var update =  roots.selectAll('path')
      .data(pieData)
      .call(arcPathAttr, id, config)

    // 处理enter部分  
    update.enter()
      .append('path')
      .call(arcPathAttr, id, config)

    // 处理exit部分
    update.exit().remove()  
  }


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
  function drawCharts(id, data1, opt) {
    // 合并配置项
    var config = _.merge({}, defaultSetting, opt)
    // 获取数据
    var data = data1 || defaultDataSource
    // 处理空数据
    var isData = commonUnit.noData(id, data)
    if (isData) {
      return
    }
    // 创建svg
    var svg = commonUnit.addSvg(id, config)

    // 转换原始数据为能用于绘图的数据
    pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d.value
      })
     
    // 初始化的时候生成弧形函数
    if(!isInit) {
      innerRadius = config.itemStyle.innerRadius // 获取内半径
      outerRadius = config.itemStyle.outerRadius // 获取外半径
      // 创建弧生成器(计算弧形路径的函数)
      arc1 = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius) 
      // hover事件用的  
      arc2 = d3.svg.arc()
        .innerRadius(innerRadius - (innerRadius) / 15 )   
        .outerRadius(outerRadius + (outerRadius) / 30 )   
     

      // 画一个外圈圆
      var cfg = {
        stroke: '#3d3d6b',
        strokeWidth: 8,
        radius: innerRadius - 6
      }
      svg.append('circle')
        .call(circleAttr, cfg, config)  

      // 画一个外圈圆
      var cfg = {
        stroke: '#05c9fd',
        strokeWidth: 4,
        radius: innerRadius - 1
      }
      svg.append('circle')
        .call(circleAttr, cfg, config)   

      var colors = config.itemStyle.colors
      // 渐变配置项
      var gradientCfg = config.gradient
      
      commonUnit.addGradient(id, colors, gradientCfg)  
    }

    // 使用pie函数处理数据
    pieData = pie(data) 
    // 创建弧形路径组元素
    if(svg.selectAll('.arcGroup').node()) {
      svg.select('.arcGroup')
        .call(arcGroup, id, config) 
    }else {
      svg.append('g')
        .call(arcGroup, id, config) 
    }
  }

  var result = {
    drawCharts: drawCharts
  } 
  return result
})
