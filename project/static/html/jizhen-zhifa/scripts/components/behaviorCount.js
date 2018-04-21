/**
 * @Author:      name
 * @DateTime:    2017-05-18 15:34:04
 * @Description: 扣分统计
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
        zoom: 1.2,
        padding: {
          top: 0,
          right: 40,
          bottom: 0,
          left: 20
        },
        areaPath: {
          fill: ['#4c1d7c', '#1a1760'],
          stroke: 'none',
          strokeWidth: 1,
          //线条样式 linear/linear-closed/step/... 曲线:basis/cardinal/
          interpolate: 'cardinal'
        },
        linePath: {
          fill: 'none',
          stroke: '#6b2ba3',
          strokeWidth: 2,
          //线条样式 linear/linear-closed/step/... 曲线:basis/cardinal/
          interpolate: 'cardinal'
        },
        gradientCfg: {
          id: 'BeColor',
          x1: '0%',
          y1: '30%',
          x2: '0%',
          y2: '100%',
          offset1: '0%',
          offset2: '100%',
          opacity1: 0.7,
          opacity2: 0.6
        }, 
        xText: {
          fill: '#a5cfe0',
          fontSize: 24,
          textAnchor: 'middle',
          margin:{
            bottom: 10
          },
          intercept: true,
          skew: false
        },
        topMark: {
          fill: '#5acaff'
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
      var isData = commonUnit.noData(id, data)
      if(isData){
        d3.select(id).select('svg').html('')
        return
      }
      commonUnit.noData(id, data)
      var _self = this
      var config = _.merge({}, this.defaultSetting(), opt)
      var padding = config.padding
      var width = config.width - padding.left -padding.right
      var height = config.height
      
      //创建svg
      var svg = commonUnit.addSvg(id, config)
      
      //分别获取value,name值  xData用于生成x轴name
      var dataset = []
      var xData = []
      var intercept = config.xText.intercept //x轴的文字是否截取
      for(var i = 0; i<data.length; i++){
        dataset.push( parseInt(parseInt(data[i].value, 10), 10) )
        var name = data[i].name
        if(intercept){
          name = name.substring(5)
          name = name.replace('-', '.')
        }
        xData.push(name)
      }

      d3.select(id).selectAll('.inner_line').remove()
      d3.select(id).selectAll('.axis').remove()
      //生成Y轴及网格线
      var yScale =  commonUnit.addYAxis(svg, config, dataset)
      //生成X轴
      commonUnit.addXAxis(svg, config, xData)

      var isSkew = config.xText.skew
      //旋转文字  
      if(isSkew){
        d3.select(id).selectAll('.axis-x text')
          .attr('transform', 'rotate(-35)')   
          .attr('x', -35)
      }


      

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
         .interpolate(config.areaPath.interpolate) 

      //定义一个线性渐变  
      var gradientCfg = config.gradientCfg
      var colors1 = [
        {
          color: config.areaPath.fill,
          id: gradientCfg.id 
        }
      ] 
      //渐变配置项
      
      //调用渐变
      commonUnit.addGradient(id, colors1, gradientCfg)
      commonUnit.addFilter(svg, id)


      //创建组元素
     d3.select(id).selectAll('.group').remove()
     var group = svg.append('g')
        .attr('class', 'group')

     commonUnit.addPattern(id)   
     //绘制区域path
     group.append('path')
      .attr({
        d: areaPath(dataset),
        stroke: config.areaPath.stroke,
        'stroke-width': config.areaPath.strokeWidth,
         fill: 'url(#'+ gradientCfg.id +')'
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
        .interpolate(config.linePath.interpolate) 

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
      var zoom = config.zoom
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
      var topMark = config.topMark
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
          fill: topMark.fill
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
            return i==0 && d.toString().length>1 ? 20 : xScale(i) 
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