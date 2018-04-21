/**
 * @Author:      name
 * @DateTime:    2017-05-18 15:34:04
 * @Description: 目标总量
 * @Last Modified By:   name
 * @Last Modified Time:    2017-05-18 15:34:04
 */

define(function(require) {

  var commonUnit = require('../components/commonUnit.js')
  var constants = require('../util/constants.js')

  var behaviorCount = {
    defaultSetting: function() {
      return {
        width: 400,
        height: 300,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 60 
        },
        yAxis: {
          axisLine: {
            show: true
          },
          gridLine: {
            show: false
          },
          line: {
            show: true,
            height: 8,
            fill: '#172853',
            stroke: '#5c1e3c',
            strokeWidth: 2,
            radius: 5
          },
          ticks: 5
        },
        xText: {
          fill: '#7dd3ff',
          fontSize: 24,
          textAnchor: 'middle',
          margin:{
            bottom: 10
          }
        },
        grid:{
          x: 50,
          y: 85, //底部距离
          y2: 40  //顶部距离
        }
      }
    },

    drawCharts: function(id, data, opt) {
      var config = _.merge({}, this.defaultSetting(), opt)
      var width = config.width
      var height = config.height
      
      //创建svg
      var svg = commonUnit.addSvg(id, config)

      var datas = []
      for(var i = 0, len = data.length; i<len; i++){
        datas.push(parseInt(data[i].value, 10))
      }
      var max = d3.max(datas)

      var dataset = [max]
      var xData = []

      for(var i = 0; i<data.length; i++){
        dataset.push(parseInt(data[i].value, 10))
        xData.push(data[i].name)
      }
      dataset.push(max)
       
      d3.select(id).selectAll('.axis').remove()
      //生成Y轴及网格线
      var yScale =  commonUnit.addYAxis(svg, config, dataset)
      //生成X轴
      commonUnit.addXAxis(svg, config, xData)

      //旋转文字  
      d3.select(id).selectAll('.axis-x text')
        .attr('transform', 'rotate(-35)')   
        .attr('x', -35)

      var grid = config.grid
      var lineShow = config.yAxis.line.show
      //添加x轴轴线  (圆角矩形)
      if(lineShow){
        var yAxisCfg = config.yAxis.line
        d3.select(id).selectAll('.rect-line').remove()
         svg.append('rect')
          .attr({
            x: 0 ,
            y: height - grid.y - 2,
            width: width - 40,
            height: yAxisCfg.height,
            rx: yAxisCfg.radius,
            ry: yAxisCfg.radius,
            fill: yAxisCfg.fill,
            stroke: yAxisCfg.stroke,
            'stroke-width': yAxisCfg.strokeWidth,
            filter: 'url(#filter1)',
            class: 'rect-line'
          }) 
      }
      
      //横坐标轴比例尺
      var xScale = d3.scale.linear()
        .domain([0, dataset.length-1])
        .range([10, width -grid.x])
      
      //定义一个线性渐变  
      var colors1 = [
        {
          color: ['#4c1d7c', '#4c1d7c'],
          id: 'targetT'
        }
      ] 
      //渐变配置项
      var gradientCfg = {
        x1: '0%',
        y1: '20%',
        x2: '0%',
        y2: '100%',
        offset1: '0%',
        offset2: '90%',
        opacity1: 0.1,
        opacity2: 1
      }
      commonUnit.addGradient(id, colors1, gradientCfg)   
      d3.select(id).selectAll('.group').remove()
      var group = svg.append('g')
        .attr({
          class: 'group'
        })
 
        var points = []    
        
        for(var i = 0, len = dataset.length; i<len; i++){
          var x = xScale(i)
          var y = yScale(dataset[i] - grid.y2) 
          points.push(x, y)
        }

      //生成一个多边形  
      group.append('polygon')
        .attr({
          points: points,
          stroke: 'none',
          'stroke-width': 2,
          fill: 'url(#targetT)'
        })

        //生成线段
        var linePath = d3.svg.line()
        .x(function(d,i){
          return xScale(i)
        })
        .y(function(d){
          return yScale(d) + grid.y2 - 2
        })

      group.append('path')
        .attr({
          d: linePath(dataset),
          stroke: '#a9425d',
          'stroke-width': 2,
          fill: 'none'
        })

       group.selectAll('.lineMark')
        .data(dataset)
        .enter()
        .append('image')
        .attr({
          'xlink:href': function(d, i){
            var href = ''
            if(i==0 || i == data.length + 1){
              href = ''
            }else{
              href = constants.SVG_IMG_PATH + '/images/mark.png'
            }
            return href
          },
          width: 16,
          height: 16,
          transform: function(d, i){
            var x = xScale(i) - 8
            var y =  yScale(d)  - 8 + grid.y2
            return 'translate('+x+', '+y+')'
          }
        })   

      var xText = config.xText
      group.selectAll('.lineText')
        .data(dataset)
        .enter()
        .append('text')
        .attr({
          r: 4,
          x: function(d, i){
            return xScale(i) 
          },
          y: function(d, i){
            return  yScale(d) + 30 + grid.y2
          },
          fill: xText.fill,
          'text-anchor': xText.textAnchor,
          'font-size': xText.fontSize
        }) 
        .text(function(d, i){
          var value = 0
          if(i==0 || i == data.length + 1){
            value = ''
          }else{
            value = d
          }
          return value 
        })   


    }
  }

  return behaviorCount

})