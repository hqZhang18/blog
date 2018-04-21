define(function(require, factory) {
  require('d3')
  require('lodash')
  // 引入公用的组件
  var commonUnit = require('./commonUnit')

  // 图片路径
  var IMGPATH = commonUnit.imgPath()

  var defaultConfig = {
      width: 365,
      height: 400,
      fontFamily: '微软雅黑',
      min: 1,
      // svg的上右下左的值(用于控制文字显示不全)
      padding: {
        top: 50,
        right: 70,
        bottom: 30,
        left: 100
      },
      // 条形图配置项
      itemStyle: {
      height: 34,
      // 背景色填充
      color: '#282f36',
      // 渐变配置项
      gradient: {
          color: ['#9936e8', '#49aefe'],
          id: 'linearColor',
          x1: '30%',
          y1: '0%',
          x2: '100%',
          y2: '0%',
          offset1: '0%',
          offset2: '100%',
          opacity1: 1,
          opacity2: 1
      }, 
      radius: 0,  // 条形图两边的半径,
      margin: {
          top: 0,
          right: 30, 
          bottom: 0,
          left: 30
      },
      },
      // 左边文字配置项
      leftText: {
        fontSize: 28,
        color: '#fff',
        textAnchor: 'middle'
      },
      // 右边文字配置项
      rightText: {
        fontSize: 28,
        color: '#fff',
        textAnchor: 'start'
      }
  }

  function drawCharts(id, data, opt) {
      var config = _.merge({}, defaultConfig, opt)
      var dataset = []
      var width = config.width
      var height = config.height
      for(var i = 0, len = data.length; i < len; i++) {
          dataset.push(data[i].value)
      }
      var padding = config.padding
  
      var height = config.height + padding.top + padding.bottom

      // 创建svg
      var svg = null
      
      if(d3.select(id).selectAll('svg').node()) {
          svg = d3.select(id).select('svg')
          .attr('width', width)
          .attr('height', height)
          .style('padding', function() {
              var top = padding.top
              var bottom = padding.bottom
              var left = padding.left
              var right = padding.right
              return top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px'
          })
      }else {
          svg = d3.select(id)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('padding', function() {
              var top = padding.top
              var bottom = padding.bottom
              var left = padding.left
              var right = padding.right
              return top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px'
          })
      }
      
      var defs = svg.append('defs')
          .append('pattern')
          .attr('id', 'img-bg-id')
          .attr('patternUnits', 'userSpaceOnUse')
          .attr('patternContentUnits', 'userSpaceOnUse')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 6)
          .attr('height', 16)
          
      defs.append('image')
          .attr('width', 6)
          .attr('height', 16)
          .attr('x', 0)
          .attr('y', 0)
          .attr('preserveAspectRatio', 'none')
          .attr('xlink:href', IMGPATH[0] + 'vehicle/icon-bar-bg.png')
      /**
      * 获取update部分
      */
      var update = svg.selectAll('g')
          .data(data)
      
      // 获取enter部分
      var enter = update.enter()

      // 获取exit部分
      var exit = update.exit()

      // 处理exit
      exit.remove()
  
      // 计算行高
      var height = config.height
      var lineHeigh = height / dataset.length 
      // 处理enter部分
      var appendG = enter.append('g')
          .attr('transform', function(d, i) {
          return 'translate(0,' + (lineHeigh * i) + ')'
          })
          .attr('class', 'group')
          .on('mouseenter', function(d) {
              d3.select(this)
                  .select('.rect-bg')
                  .attr('fill', '#126df0')
          })
          .on('mouseout', function() {
              d3.select(this)
                  .select('.rect-bg')
                  .attr('fill', '#062b5c')
          })

      // 处理update部分
      var selectG = update.attr('transform', function(d, i) {
          return 'translate(0,' + (lineHeigh * i) + ')'
      }) 

      var ltextBg = appendG.append('rect')
      var lText = appendG.append('text')
      var rectBg = appendG.append('rect')
      var bgRect = appendG.append('rect')
      var rect = appendG.append('rect')
      var rText = appendG.append('text')
      var iconImg = appendG.append('image')
      
      var dom = {
          ltextBg: ltextBg,
          lText: lText,
          rectBg: rectBg,
          rect: rect,
          rText: rText,
          bgRect: bgRect,
          iconImg: iconImg
      }
      // 初始化调用添加元素的方法
      addElement(id, data, dom, config)
      ltextBg = appendG.select('.left-text-bg')
      lText = selectG.select('.left-text')
      rectBg = selectG.select('.rect-bg')
      rect = selectG.select('.rect-data')
      rText = selectG.select('.right-text')
      bgRect = selectG.select('.bg-rect')
      iconImg = selectG.select('icon-img')
      dom = {
          ltextBg: ltextBg,
          lText: lText,
          rectBg: rectBg,
          rect: rect,
          rText: rText,
          bgRect: bgRect,
          iconImg: iconImg
      }
      // 有更新的调用添加元素的方法
      addElement(id, data, dom, config)
  }

  function addElement(id, data, dom, config) {
      var dataset = []
      for(var i = 0, len = data.length; i < len; i++) {
          dataset.push(data[i].value)
      }
      var padding = config.padding

      // 小矩形方块配置
      var itemStyle = config.itemStyle
      // 渐变配置项
      var gradientCfg = itemStyle.gradient
      var colors =  [
          {
            id: itemStyle.gradient.id,
            color: itemStyle.gradient.color
          }
      ]

      var width = config.width - padding.left - padding.right
      // 数据的显示范围
      // 设置左边文字
      var leftTxt = config.leftText

      // 右边文字配置
      var rightTxt = config.rightText
      var margin = itemStyle.margin
      // 数据最大宽度
      var dataWidth = width  - padding.left - padding.right - margin.left - margin.right
  
      var xScale = d3.scale.linear()
          .domain([0, d3.max(dataset)])
          .range([dataWidth, 0])

      dom.ltextBg
        .attr('width', 192)
        .attr('height', 40)
        .attr('fill', '#091f5e')  
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('stroke-width', 1)
        .attr('stroke', '#1755b2')
        .attr('x', -80)  
        .attr('class', 'left-text-bg')

      // 添加左边文字
      dom.lText
          .attr({
            fill: leftTxt.color,
            'font-size': leftTxt.fontSize,
            'text-anchor': leftTxt.textAnchor,
            class: 'left-text',
            x: 5,
            y: itemStyle.height
          })
          .text(function(d, i) {
            return data[i].name
          })
          .style('font-family', 'digifacewide')

      // 矩形背景
      dom.rectBg.attr('class', 'rect-bg')
          .attr({
              fill: '#05295b',
              y: function() {
                  return 0
              },
              x: padding.left + itemStyle.margin.left,
              height: itemStyle.height,
              width: dataWidth,
              rx: itemStyle.radius,
              ry: itemStyle.radius,
              stroke: '#8f670f',
              'stroke-width': 3
          })
      
      dom.bgRect
          .attr({
              class: 'bg-rect',
              // filter: 'url(#img-bg-id)',
              fill: 'url(#img-bg-id)',
              y: 0,
              x: padding.left + itemStyle.margin.left,
              rx: itemStyle.radius,
              ry: itemStyle.radius,
              height: 34,//itemStyle.height,
              width: function(d) {
                  var dWidth = dataWidth - xScale(d.value)
                  if(dWidth <= 0) {
                  dWidth = config.min
                  }
                  return dWidth
              }
          })

      // 添加数据
      dom.rect
          .attr({
              class: 'rect-data',
              // filter: 'url(#img-bg-id)',
              fill: '#54b5f7', // 'url(#img-bg-id)',
              y: 6,
              x: padding.left + itemStyle.margin.left,
              rx: itemStyle.radius,
              ry: itemStyle.radius,
              height: 20,//itemStyle.height,
              width: function(d) {
                  var dWidth = dataWidth - xScale(d.value)
                  if(dWidth <= 0) {
                  dWidth = config.min
                  }
                  return dWidth
              }
          })

      dom.iconImg.attr('width', 32)
          .attr('height', 34)
          .attr('xlink:href', IMGPATH[0] + 'vehicle/xiaoguo.png')
          .attr('x', function(d) {
                  var dWidth = dataWidth - xScale(d.value)
                  if(dWidth <= 0) {
                  dWidth = config.min
                  }
                  return dWidth + padding.left + itemStyle.margin.left - 5
              }
          )
          .attr('y', 8)

      // 添加右边文字
      dom.rText.attr({
          fill: rightTxt.color,
          'font-size': rightTxt.fontSize,
          'text-anchor': rightTxt.textAnchor,
          x: width - padding.right,
          y: itemStyle.height,
          class: 'right-text'
      })
      .text(function(d, i) {
          return data[i].value + '人'
      })
  }

  return drawCharts
})