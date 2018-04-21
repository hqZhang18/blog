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

  var objectTotal = {
    defaultSetting: function() {
      return {
        width: 435,
        height: 300,
        id: '#behaviorCount',
        padding: {
          top: 40,
          bottom: 0,
          left: 80,
          right: 40
        },
        mark: 1,
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
          fill: '#5e98cd',
          fontSize: 24,
          textAnchor: 'middle',
          margin:{
            bottom: 10
          },
          rotate: -35,
          x: -40
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
        fillImg: true,
        yAxis: {
          axisLine: {
            show: true
          },
          gridLine: {
            show: false
          },
          line: {
            height: 8,
            fill: '#172853',
            stroke: '#5c1e3c',
            strokeWidth: 2,
            radius: 5
          },
          ticks: 5
        },
        xAxis: {
          show: true
        },
        grid:{
          x: 50,
          x2: 0,
          y: 120,
          y2: 10
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
        return
      }
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
      for(var i = 0; i<data.length; i++){
        dataset.push(parseInt(data[i].value, 10))
        xData.push(data[i].name)
      }

      d3.select(id).selectAll('.axis').remove()
      //生成Y轴及网格线
      var yScale =  commonUnit.addYAxis(svg, config, dataset)
      //生成X轴
      commonUnit.addXAxis(svg, config, xData)
      if(data.length==1){
        d3.select(id).selectAll('.axis-x .tick').attr('transform', 'translate(20,0)')
      }

      var isfillImg = config.fillImg  
      if(isfillImg){
        //调用图片填充
        commonUnit.addPattern(id)   
      }else{
        //渐变配置项
        var gradientCfg = config.gradientCfg
        var colors1 = [
          {
            color: config.areaPath.fill,
            id:  gradientCfg.id
          }
        ] 

        //调用渐变
        commonUnit.addGradient(id, colors1, gradientCfg) 
      }  
      
      var grid = config.grid
      var yAxisCfg = config.yAxis.line
      //添加x轴轴线  (圆角矩形)
      if(config.xAxis.show){
        d3.select(id).selectAll('.rect-line').remove()
         svg.append('rect')
          .attr({
            x: 0 ,
            y: height - grid.y - 2,
            width: width ,
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
      
      //旋转文字  
      d3.select(id).selectAll('.axis-x text')
        .attr('transform', 'rotate('+config.xText.rotate+')')   
        .attr('x', config.xText.x)
        .attr("font-size",20) //纳尼 会被common.css样式覆盖

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
          return height - grid.y - yAxisCfg.height 
        })
        .y1(function(d, i){
          var value = yScale(d) 
          if(d < 1100){
            value = value   - 20
          }
          if(d == 0){
            value = value + 10
          }
          return value + grid.y2  
        })
        //线条样式 linear/linear-closed/step/... 曲线:basis/cardinal/
         //.interpolate('cardinal') 
      
      d3.select(id).selectAll('.group').remove()
      //创建组元素
     var group = svg.append('g')
        .attr('class', 'group')
        
     //绘制区域path
     group.append('path')
      .attr({
        d: areaPath(dataset),
        stroke: config.areaPath.stroke,
        'stroke-width': config.areaPath.strokeWidth,
        fill:  function(d, i){
          if(isfillImg){
            return 'url(#image)'
          }else{
            return 'url(#'+gradientCfg.id+')'
          }
        } 
      })  
      
      var mark = config.mark

      //1为图片，2为矩形
      if(mark==1){
        group.selectAll('.lineMark')
        .data(dataset)
        .enter()
        .append('image')
        .attr({
          'xlink:href': constants.SVG_IMG_PATH + '/images/mark.png',
          width: 16,
          height: 16,
          transform: function(d, i){
            var x = xScale(i) - 8
            var value = yScale(d) 
            if(d < 1100 ){
              y = value + grid.y2 - 8 - 20
            }else{
              y = value + grid.y2 - 8
            }
            return 'translate('+x+', '+y+')'
          }
        })  
      }else{
        group.selectAll('.lineMark')
        .data(dataset)
        .enter()
        .append('rect')
        .attr({
          width: 6,
          height: 6,
          transform: function(d, i){
            var x = xScale(i) - 3
            var value = yScale(d) 
            if(d < 1100 ){
              y = value + grid.y2 - 3 - 20
            }else{
              y = value + grid.y2 - 3
            }
            return 'translate('+x+', '+y+')'
          },
          fill: '#00ffff'
        })  
      }
       //添加value 
      var xText = config.xText
      group.selectAll('.lineText')
        .data(dataset)
        .enter()
        .append('text')
        .attr({
          x: function(d, i){
          
            return i==0 && d.toString().length > 1  ? 30 : xScale(i) 
          },
          y: function(d, i){
            var value = yScale(d) 
            //d < 1100 && d >0
            if(d < 1100 ){
              y = value + grid.y2 - xText.margin.bottom - 20
            }else{
              y = value + grid.y2 - xText.margin.bottom
            }
            return y
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

  return objectTotal

})