/**
 * @Author:      zhq
 * @DateTime:    2017-01-13 13:52:27
 * @Description: 渐变柱状图
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-13 13:52:27
 */

define(function(require) {
  /**
   * 引入公用的文件
   */
 

  var commonUnit = require('../components/commonUnit.js')
  var constants = require('../util/constants.js')

  var gradientBar = {
    /**
     * 柱状图默认配置项
     */
    defaultSetting: function() {
      return {
        width: 800,
        height: 300,
        fontFamily: '微软雅黑',
        min: 1,
        padding: {
          top: 20,
          right: 0,
          bottom: 0,
          left: 50
        },
        itemStyle: {
          width: 8,
          color: '#282f36',
          gradientColor: ['#00d2ff', '#0048ff'], 
          radius: 3,   
          topMark: {
            width: 15,
            height: 8,
            fill: '#fff',
            stroke: 'none',
            strokeWidth: 0
          },
          margin: {
            left:10,
            right:40
          }
        },
        isxAxis:true,
        yAxis: {
          axisLine: {
            show: true
          },
          gridLine: {
            show: false
          },
          ticks: 5
        },
        xText: {
          slice: false
        },
        grid: {  //文字离左右两边的距离
          x: 0,
          x2: 20,
          y: 80,
          y2: 10
        }

     }
    },
    /**
     * 绘制饼图
     */
    drawCharts: function(id, data, opt) {
      var isData = commonUnit.noData(id, data)
      if(isData){
        return
      }
      //获取配置项
      var config = _.merge({}, this.defaultSetting(), opt)
      var width = config.width
      var height = config.height
      //创建svg
      var svg = commonUnit.addSvg(id, config)

      var dataset = []
      var xData = [] //保存x轴的name

      for(var i = 0; i < data.length; i++) {
        dataset.push(parseInt(data[i].value, 10))
        var name = data[i].name
        // if(name.length>5){
        //   name = name.substring(0, 6) + '...'
        // }
        
        xData.push(name)
      }

      d3.select(id).selectAll('.axis').remove()
      //生成Y轴及网格线
      var yScale =  commonUnit.addYAxis(svg, config, dataset)
      //生成X轴
      commonUnit.addXAxis(svg, config, xData)

      //旋转文字  
      d3.select(id).selectAll('.axis-x text')
        .attr('transform', 'rotate(-35)')   
        .attr('x', -35)

      //x轴文字是否需要截取
      var slice = config.xText.slice
      if(slice){
        d3.select(id).selectAll('.axis-x text')
          .attr({
            transform: 'rotate(35)',
            x: 65,
            y: 20
          }) 
        for(var i=0, len = xData.length; i<len; i++){
          var name = xData[i]
          if(name.length>5){
            name = name.substring(0, 5) + '...'
          }
          var oText = $(''+id+' .axis-x').find('.tick text').eq(i).text(name)
        } 
      }
     

      //获取  x轴transform的位置 
      var transX = commonUnit.getTransformX(id, data) 

      var grid = config.grid

      //添加x轴轴线  (圆角矩形)
      d3.select(id).selectAll('.rect-line').remove()
       svg.append('rect')
        .attr({
          x: grid.x  ,
          y: height - grid.y - 2,
          //width: transX[data.length-1],
          width: config.width - config.padding.left,
          height: 6,
          rx: 5,
          ry: 5,
          fill: '#172853',
          stroke: '#285387',
          'stroke-width': 2,
          filter: 'url(#filter1)',
          class: 'rect-line'
        }) 
      var itemStyle = config.itemStyle
       //定义比例尺
      var linear = d3.scale.linear()  
          .domain([0,d3.max(dataset)])  
          .range([0, height-config.grid.y-config.grid.y2])
     //创建组元素g
     d3.select(id).selectAll('.group').remove()
      var group = svg.selectAll('.group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'group')  
        .attr('transform', function(d, i){
          var x= transX[i] -15
          return 'translate('+x+', 0)'
        })
        .on('mouseover', function(d, i){
          d3.select(this).style('cursor', 'pointer')
          commonUnit.addTooltip(id, d)
        })
        .on('mouseout', function(){
          d3.selectAll('.charts-tooltip').remove()
        })
        
      //最大高度  
      var maxHeight = height-grid.y-grid.y2
      //添加背景柱子  
      group.append('rect')
        .attr('width', itemStyle.width)
        .attr('height', maxHeight)
        .attr('rx', itemStyle.radius)
        .attr('ry', itemStyle.radius)
        .attr('fill', '#4d788a')

      //添加数据的矩形柱子
      var colors =  [
        {
          color: config.itemStyle.gradientColor,
          id: 'gColor'
        }
      ]
      //渐变配置项
      var cradientCfg = {
        x1: '0%',
        y1: '0%',
        x2: '0%',
        y2: '100%',
        offset1: '20%',
        offset2: '100%',
        opacity1: 1,
        opacity2: 0.2
      }
      commonUnit.addGradient(id, colors, cradientCfg)
      group.append('rect')
        .attr('width', itemStyle.width)
        .attr('height', function(d, i){
          var h = linear(d.value)
          if( h > maxHeight){
            h  = maxHeight
          }
         
          return h
        })
        .attr('rx', itemStyle.radius)
        .attr('ry', itemStyle.radius)  
        .attr('fill', '#00d2ff')
        .attr('fill','url(#gColor)')
        .attr('x', 0)
        .attr('y', function(d, i){
          var y = height - linear(d.value) - grid.y - 8
          // console.log(d.name)
          if( y < 0){
            y = 0
          }
          return  y 
        })


      //添加顶部的小矩形  
      var topMark = itemStyle.topMark
      group.append('rect')
        .attr({
          width: topMark.width,
          height: topMark.height,
          fill: topMark.fill,
          'stroke-width': topMark.strokeWidth,
          stroke: topMark.stroke,
          x: -itemStyle.width/2,
          y: function(d, i) {
            var h = height - linear(d.value) - grid.y - topMark.height*2
            return  h > 0 ? h : 0 
          }
        }) 

      //添加x轴的小圆点  
      if(config.isxAxis) {
        group.append('image')
          .attr('width', 16)
          .attr('height', 16)
          .attr('xlink:href', constants.SVG_IMG_PATH + '/images/mark.png')
          .attr('x', -4)
          .attr('y', function(d, i){
            return   height - grid.y - 8
          })   
      }
      
 
  }
}
  return gradientBar
})