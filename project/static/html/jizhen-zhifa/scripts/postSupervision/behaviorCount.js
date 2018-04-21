/**
 * @Author:      name
 * @DateTime:    2017-05-18 15:34:04
 * @Description: 目标总量
 * @Last Modified By:   name
 * @Last Modified Time:    2017-05-18 15:34:04
 */

define(function(require) {

  var commonUnit = require('../components/commonUnit.js')

  var behaviorCount = {
    defaultSetting: function() {
      return {
        width: 800,
        height: 200,
        id: '#behaviorCount',
        padding: {
          left: 20,
          right: 40
        },
        areaPath: {
          fill: ['#4c1d7c', '#1a1760'],
          stroke: 'none',
          strokeWidth: 1,
        },
        linePath: {
          fill: 'none',
          stroke: '#6b2ba3',
          strokeWidth: 2,
        },
        xText: {
          fill: '#fff',
          fontSize: 24,
          textAnchor: 'middle',
          margin:{
            bottom: 10
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          gridLine: {
            show: true
          },
          ticks: 6
        },
        grid:{
          x: 50,
          x2: 0,
          y: 60,
          y2:40
        }
      }
    },

    /**
     *  @describe [绘制图表]
     *  @param    {[type]}   id   [容器id]
     *  @param    {[type]}   data [数据]
     *  @param    {[type]}   opt  [配置项]
     *  @return   {[type]}   [description]
     */
    drawCharts: function(id, data, opt) {
      var _self = this
      var config = _.merge({}, this.defaultSetting(), opt)
      var padding = config.padding
      var width = config.width - padding.left -padding.right
      var height = config.height
      
      //创建svg
      var svg = commonUnit.addSvg(id, config)

      //分别获取value,name值  xData用于生成x轴name
      var dataset = []
      var dataset1 = []
      var xData = []
      for(var i = 0; i<data.length; i++){
        dataset.push(data[i].value1)
        dataset1.push(data[i].value2)
        xData.push(data[i].name)
      }
      d3.select(id).selectAll('.inner_line').remove()
      d3.select(id).selectAll('.axis').remove()
      //生成Y轴及网格线
      var yScale =  commonUnit.addYAxis(svg, config, dataset)
      //生成X轴
      commonUnit.addXAxis(svg, config, xData)

      var grid = config.grid
       //横坐标轴比例尺
      var xScale = d3.scale.linear()
            .domain([0, xData.length-1])
            .range([0, width ])

      //区域生成器
      var areaPath = d3.svg.area()
        .x(function(d, i){
          return xScale(i)
        })
        .y0(function(d, i){
          return height - grid.y 
        })
        .y1(function(d, i){
          return yScale(d) + grid.y2
        })
        //线条样式 linear/linear-closed/step/... 曲线:basis/cardinal/
         .interpolate('cardinal') 

      //定义一个线性渐变  
      var colors1 = [
        {
          color: config.areaPath.fill,
          id: 'BeColor'
        }
      ] 
      //渐变配置项
      var gradientCfg = {
        x1: '0%',
        y1: '30%',
        x2: '0%',
        y2: '100%',
        offset1: '0%',
        offset2: '100%',
        opacity1: 0.7,
        opacity2: 0.6
      } 
      //调用渐变
      commonUnit.addGradient(id, colors1, gradientCfg)   
     
      commonUnit.addFilter(svg, id)
       //创建组元素
     d3.select(id).selectAll('.group').remove()
     var group = svg.append('g')
        .attr('class', 'group')

    
     //绘制区域path
     group.append('path')
      .attr({
        d: areaPath(dataset),
        stroke: config.areaPath.stroke,
        'stroke-width': config.areaPath.strokeWidth,
         fill: 'url(#BeColor)'
         //fill: 'url(#image)'
      })  
      
      //生成线段
      var linePath = d3.svg.line()
        .x(function(d,i){
          return xScale(i)
        })
        .y(function(d){
          return yScale(d) + grid.y2
        })
        .interpolate('cardinal') 

      //绘制线段path  
      group.append('path')
        .attr({
          d: linePath(dataset),
          stroke: config.linePath.stroke,
          'stroke-width': config.linePath.strokeWidth,
          fill: config.linePath.fill
        })


      //线断上添加多边形标记点  
      var points =  '5, 0, 0, 5, 5, 10, 10, 5'
      var zoom = 1.2
      var oPoints = points
      oPoints = oPoints.split(',')
      var points = []
      for(var i = 0;i<oPoints.length;i++){
        var num = oPoints[i]/zoom
        if( isNaN(num) ){
          num = 0
        }
        points.push(num)
      }
      group.selectAll('.lineMark')
        .data(dataset)
        .enter()
        .append('polygon')
        .attr({
          points: points,
          transform: function(d, i){
            var x = xScale(i) - 5
            var y = yScale(d) + grid.y2 - 5
            return 'translate('+x+', '+y+')'
          },
          // cx: function(d, i){
          //   return xScale(i)
          // },
          // cy: function(d, i){
          //   return yScale(d) + grid.y2
          // },
          fill: '#5acaff'
        })  

       //添加value 
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
           
            return yScale(d) + grid.y2 - xText.margin.bottom
          },
          fill: xText.fill,
          'text-anchor': xText.textAnchor,
          'font-size': xText.fontSize
        }) 
        .text(function(d){
          return d 
        })   
    }
    
    
  }

  return behaviorCount

})