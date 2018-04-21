/**
 * @Author:      name
 * @DateTime:    2017-05-18 15:34:04
 * @Description: 扣分统计
 * @Last Modified By:   name
 * @Last Modified Time:    2017-05-18 15:34:04
 */

define(function(require) {

  var config = {}
  var yScale  //y轴
  var xScale  //x轴
  var areaPath //区域生成器
  var linePath  //线段生成器

  var commonUnit = require('../components/commonUnit.js')
   
  var behaviorCount = {
    defaultSetting: function() {
      return {
        width: 800,
        height: 200,
        id: '#behaviorCount',
        padding: {
          top: 30,
          left: 80,
          bottom: 0,
          right: 40,
        },
        itemStyle: [{
          areaPath: { 
            fill: ['#32226e', '#32226e'],
            stroke: 'none',
            strokeWidth: 1,
          },
          linePath: {
            fill: 'none',
            stroke: '#6b2ba3',
            strokeWidth: 2,
          },
        },{
          areaPath: {
            fill: ['#040e59', '#040e59'],
            stroke: 'none',
            strokeWidth: 1,
          },
          linePath: {
            fill: 'none',
            stroke: '#3859f6',
            strokeWidth: 2,
          },
        }
        ],
        xText: {
          fill: '#fff',
          fontSize: 18,
          textAnchor: 'middle',
          margin:{
            bottom: 10
          }
        },
        yAxis: {
          axisLine: {
            show: true
          },
          gridLine: {
            show: true
          },
          ticks: 4
        },
        grid:{
          x: 50,
          x2: 0,
          y: 135,
          y2: 0
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
      config = _.merge({}, this.defaultSetting(), opt)
      var padding = config.padding
      var width = config.width - padding.left -padding.right
      var height = config.height
      
      //创建svg
      var svg = commonUnit.addSvg(id, config)
      //分别获取value,name值  xData用于生成x轴name
      var dataset1 = [] 
      var dataset2 = []
      var xData = []
      for(var i = 0; i<data.length; i++){
        dataset1.push(parseInt(data[i].value1, 10))
        dataset2.push(parseInt(data[i].value2, 10))
        xData.push(data[i].name)
      }
       d3.select(id).selectAll('.inner_line').remove()
      d3.select(id).selectAll('.axis').remove()
      //生成Y轴及网格线
       yScale =  commonUnit.addYAxis(svg, config, dataset1)
      //生成X轴
      commonUnit.addXAxis(svg, config, xData)

      commonUnit.addFilter(svg, id)

      //旋转文字  
      d3.select(id).selectAll('.axis-x text')
        .attr('transform', 'rotate(-35)')   
        .attr('x', -35)

      var grid = config.grid
      var itemStyle = config.itemStyle
       //横坐标轴比例尺
      xScale = d3.scale.linear()
            .domain([0, xData.length-1])
            .range([0, width ])

      //区域生成器
      areaPath = d3.svg.area()
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

       //生成线段
        linePath = d3.svg.line()
          .x(function(d,i){
            return xScale(i)
          })
          .y(function(d){
            return yScale(d) + grid.y2
          })
          .interpolate('cardinal')   

      //定义一个线性渐变 (案卷)
      var colors1 = [
        {
          color: itemStyle[0].areaPath.fill,
          id: 'BeColor1'
        }
      ] 
      //非案卷 
      var colors2 = [
        {
          color: itemStyle[1].areaPath.fill,
          id: 'BeColor2'
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
        opacity1: 0.5,
        opacity2: 0.5
      } 
      //调用渐变
      commonUnit.addGradient(id, colors1, gradientCfg)  
      commonUnit.addGradient(id, colors2, gradientCfg) 
      commonUnit.addFilter(svg, id)  
 

      //创建组元素
     d3.select(id).selectAll('.group').remove()
     var group = svg.append('g')
        .attr('class', 'group')

     commonUnit.addPattern(id)  
     var opt1 = {
      id: 'url(#BeColor1)',
      areaPath: itemStyle[0].areaPath,
      linePath: itemStyle[0].linePath
     } 

     var opt2 = {
      id: 'url(#BeColor2)',
      areaPath: itemStyle[1].areaPath,
      linePath: itemStyle[1].linePath
     } 

     this.addData(group, dataset1, opt1, 1) 
     this.addData(group, dataset2, opt2, 2) 

    },

    addData: function(group, dataset, opt, type){
      var grid = config.grid
      //绘制区域path
       group.append('path')
        .attr({
          d: areaPath(dataset),
          stroke: opt.areaPath.stroke,
          'stroke-width': opt.areaPath.strokeWidth,
           fill: opt.id 
        })  
      
        //绘制线段path  
        group.append('path')
          .attr({
            d: linePath(dataset),
            stroke: opt.linePath.stroke,
            'stroke-width': opt.linePath.strokeWidth,
            fill: opt.linePath.fill,
            filter: 'url(#filter1)'
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
            // return type == 1 ? xScale(i) - 5 : xScale(i) +5
           
            return xScale(i) 
          },
          y: function(d, i){
            var y = yScale(d) + grid.y2 - xText.margin.bottom + 2

            return d==0 ? y : y - 8
          }, 
          // return type == 1 ? '#bba0ff' : '#7992ff'
          fill: function() {
            return type == 1 ? '#7b73f6' : '#39a8f6'
          },
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