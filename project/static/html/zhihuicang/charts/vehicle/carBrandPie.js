/**
 * @Author:      zhanghq
 * @DateTime:    2017-07-18 15:49:23
 * @Description: 饼图
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-07-18 15:49:23
 */


define(function(require) {
  /**
  * 引入公用的文件
  */
  require('d3')
  require('lodash')
  // 引入公用的组件
  var commonUnit = require('./../commonUnit')
  var IMG_PATH = '../../images/'
  var IMGPATH = commonUnit.imgPath()
  var IMGS = [
    ''+IMGPATH[0]+'vehicle/bm.png',
    ''+IMGPATH[0]+'vehicle/byd.png',
    ''+IMGPATH[0]+'vehicle/other.png',
    ''+IMGPATH[0]+'vehicle/ad.png',
    ''+IMGPATH[0]+'vehicle/dz.png',
    ''+IMGPATH[0]+'vehicle/bc.png'
  ]
  
  var config // 通用配置项
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
    width: 1110,
    height: 830,
    padding: {
      top: 0,
      right: 0,
      bottom: 100,
      left: 0
    },
    itemStyle: {
      innerRadius: 125,
      outerRadius: 160,
      colors: ['#f7d926', '#ed970c'],
      circleBor: '#174793',
      circleBorW: 2
    },
    lineStyle: {
      fill: '#174793',
      strokeWidth: 2
    },
    text: {
      fontSize: 60,
      fill: '#fff',
      textAnchor: 'middle'
    }
  }

  /**
   *  默认数据源
   */
  var defaultDataSource = []

  /**
   *  g元素tansfrom的位置 
   */
  function gTrans() {
    this.attr({
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
  function circleAttr() {
    this.attr({
      cy: 0,
      cx: 0,
      r: outerRadius + 10,
      fill: 'none',
      stroke: config.itemStyle.circleBor,
      'stroke-width': config.itemStyle.circleBorW
    })
    .call(gTrans)
  }

  /**
   *  获取饼图填充色
   *  @example: [example]
   *  @param    {numbter}  idx [下标]
   */
  function getColor(idx) {
    // 默认颜色
    var defauleColor = [
      '#f7d926', '#ed970c', '#dd400a', '#00d89f', '#29e6ef',
      '#2492ff', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
      '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
      '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
    ]
    var palette = _.merge([], defauleColor, config.itemStyle.colors)
    return palette[idx % palette.length]  
  }  

  /**
   *  path属性设置
   */
  function arcPathAttr(roots, id) {
    roots.attr({
      d: function(d) {
        return arc1(d)
      },
      fill: function(d, i) {
        return getColor(i)
      },
     // filter: 'url(#filter1)'
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
      // 换算百分比
      d.data.value = d.value + '%'
      commonUnit.addTooltip(id, d.data)  
      d3.selectAll('.charts-tooltip')
        .style('display', 'block')
    })
    .on('mouseout', function(d, i) {
      d3.select(this)
        .attr({
          fill: function() {
            return getColor(i)
          }
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
  function arcGroup(roots, id) {
    roots.attr('class', 'arcGroup')
      .call(gTrans)

    // 获取update部分 
    var update =  roots.selectAll('path')
      .data(pieData)
      .call(arcPathAttr, id)

    // 处理enter部分  
    update.enter()
      .append('path')
      .call(arcPathAttr, id)

    // 处理exit部分
    update.exit().remove()  
  }

  /**
   *  text属性设置
   */
  function textAttr(roots, type) {
    roots.attr({
      fill: '#fff',
      'text-anchor': function(d) {
        return midAngel(d) < Math.PI ? 'start' : 'end'
      },
      transform: function(d) {
        var pos = lEndArc.centroid(d)
        // 改变文字标识的x坐标
         var radius = config.itemStyle.innerRadius 
        pos[0] = radius * (midAngel(d) < Math.PI ? 1.7 : -1.7) 
        pos[0] < 0  ? pos[0] = pos[0] - 40 : pos[0] = pos[0] + 120
        return 'translate(' + pos + ')'
      },
      class: 'name-text',
      dy: -10,
      'font-size': 28
    })
    .text(function(d) {
      return d.data.name  
    }) 
    .append('tspan')
    .text(function(d) {
      return  + d.value + '%'
    })
    .attr('font-size', 34)
    .attr('dy', 45)
    .attr('x', 0)
  }

  function textbgGroup() {
    this.attr('class', 'textbgGroup')
      .call(gTrans)

    // 获取name update部分 
    var update =  this.selectAll('.image')
      .data(pieData)
      .call(textbgAttr)
    // 处理enter部分  
    update.enter()
      .append('image')
      .call(textbgAttr)
    // 处理exit部分
    update.exit().remove() 
  }

  function textbgAttr() {
    this.attr('xlink:href', IMGPATH[0] + 'vehicle/text-bg.png')
    .attr('transform', function(d, i) {
      var pos = lEndArc.centroid(d)
      // 改变文字标识的x坐标
      var radius = config.itemStyle.innerRadius 
      pos[0] = radius * (midAngel(d) < Math.PI ? 1.7 : -1.7) 
      pos[0] < 0  ? pos[0] = pos[0] - 180 : pos[0] = pos[0] + 100
      pos[0] = pos[0] - 72 + 80
      pos[1] = pos[1] - 43.5 + 10
      return 'translate(' + pos + ')'
    })
    .attr('preserveAspectRatio', 'xMidYMin meet') 
 
    .attr('width', 142)
    .attr('height', 47)
  }


  function imgeGroup() {
    this.attr('class', 'imgeGroup')
      .call(gTrans)
    // 获取update部分 
    var update =  this.selectAll('.image')
      .data(pieData)
      .call(imageAttr)
    // 处理enter部分  
    update.enter()
      .append('image')
      .call(imageAttr)
    // 处理exit部分
    update.exit().remove()   
  }

  function imageAttr() {
    this.attr('xlink:href', function(d, i) {
      return IMGS[i]
    })
    .attr('transform', function(d, i) {
      var pos = lEndArc.centroid(d)
      pos[1] = pos[1] - 40
      // 改变文字标识的x坐标
       var radius = config.itemStyle.innerRadius 
      pos[0] = radius * (midAngel(d) < Math.PI ? 1.7 : -1.7) 
      pos[0] < 0  ? pos[0] = pos[0] - 180 : pos[0] = pos[0] + 100
 
      return 'translate(' + pos + ')'
    })
    .attr('width', 80)
    .attr('height', 80)

  }

  /**
   *  文字组元素 
   */
  function textGroup() {
    this.attr('class', 'textGroup')
    .call(gTrans)

    // 获取name update部分 
    var updateN =  this.selectAll('.name-text')
      .data(pieData)
      .call(textAttr, 1)
    // 处理enter部分  
    updateN.enter()
      .append('text')
      .call(textAttr, 1)
    // 处理exit部分
    updateN.exit().remove()      

  }


  /**
   *  线条属性设置
   */
  function polylineAttr() {
    var cfg = config.lineStyle
    this.attr({
      points: function(d) {
        var pos = lEndArc.centroid(d)
        var radius = config.itemStyle.outerRadius + 80
        pos[0] = radius * (midAngel(d) < Math.PI ? 1.5 : -1.5)  
        return [lineArc.centroid(d), lEndArc.centroid(d), pos] 
      },
      fill: 'none',
      stroke: function(d, i) {
        return getColor(i)
      },
      'stroke-width': cfg.strokeWidth
    })
  }

  /**
   *  线条组元素
   */
  function lineGroup() {
    this.attr('class', 'lineGroup')
    .call(gTrans)

    // 获取update部分 
    var update =  this.selectAll('polyline')
      .data(pieData)
      .call(polylineAttr)
    // 处理enter部分  
    update.enter()
      .append('polyline')
      .call(polylineAttr)
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
    config = _.merge({}, defaultSetting, opt)
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
      // 线条的
      lineArc = d3.svg.arc()
        .innerRadius(1.3 * innerRadius)
        .outerRadius(1.3 * outerRadius)
      // 文字  
      lEndArc = d3.svg.arc()
        .innerRadius(1.6 * innerRadius)
        .outerRadius(1.6 * outerRadius)

      // 画一个外圈圆
      // svg.append('circle')
      //   .call(circleAttr)  

      // 调用高斯模糊
      commonUnit.addFilter(id)  
    }

    // 使用pie函数处理数据
    pieData = pie(data) 
    // 创建弧形路径组元素
    if(svg.selectAll('.arcGroup').node()) {
      svg.select('.arcGroup')
        .call(arcGroup, id) 
    }else {
      svg.append('g')
        .call(arcGroup, id) 
    }
    // 创建文字组元素 
    if(svg.selectAll('.textGroup').node()) {
      svg.select('.textGroup')
        .call(textGroup) 
    }else {
      svg.append('g')
        .call(textGroup) 
    }
    // 创建线组元素  
    if(svg.selectAll('.lineGroup').node()) {
      svg.select('.lineGroup')
        .call(lineGroup) 
    }else {
      svg.append('g')
        .call(lineGroup) 
    }

    // 创建图片组元素
    // if(svg.selectAll('.imgeGroup').node()) {
    //   svg.select('.imgeGroup')
    //     .call(imgeGroup) 
    // }else {
    //   svg.append('g')
    //     .call(imgeGroup) 
    // }

    // 创建文字背景组元素
    // if(svg.selectAll('.textbgGroup').node()) {
    //   svg.select('.textbgGroup')
    //     .call(textbgGroup) 
    // }else {
    //   svg.append('g')
    //     .call(textbgGroup) 
    // }



  }

  var result = {
    drawCharts: drawCharts
  } 
  return result
})
