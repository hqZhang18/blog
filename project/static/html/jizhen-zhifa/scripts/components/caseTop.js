/**
 * @Author:      lee
 * @DateTime:    2017-05-24
 * @Description: 用于过程监督页面--案件触及模型数量TOP10
 */
define(function(require){
  var commonUnit = require('../components/commonUnit.js')
  var constants = require('../util/constants.js')

  var caseTop = {
    /**
     * 绘制柱状图
     */
    drawCharts: function(id, data, config) {
      var isData = commonUnit.noData(id, data)

      if(isData){
        d3.select(id).select('svg').html('')
        return
      }
      var width = config.width;
      var height = config.height;

      //创建svg
      var isSvg = d3.select(id).selectAll("svg").empty();
      //创建svg
      var svg = commonUnit.addSvg(id, config)

      var xData = [];
      var dataset = [];
      var color = config.itemStyle.color;

      data.map(function(item,index) {
        dataset.push(item.value)
        var name = item.name
        
        // if(name.length>5){
        //   name = name.substring(0, 8) + '...'
        // }
        xData.push(name)
      })

      //定义比例尺
      var linear = d3.scale.linear()  
            .domain([0, d3.max(dataset)])  
            .range([0, height-config.grid.y-config.grid.y2])
      d3.select(id).selectAll('.axis').remove()

      
      
      //生成Y轴及网格线
      var yScale =  commonUnit.addYAxis(svg, config, dataset)

      //生成X轴
      commonUnit.addXAxis(svg, config, xData)
      //旋转文字  
      d3.select(id).selectAll('.axis-x text')
        .attr({
          transform: 'rotate(35)',
          x: 65,
          y: 20

        })
      for(var i=0, len = xData.length; i<len; i++){
        var name = xData[i]
        if(name.length>7){
          name = name.substring(0, 7) + '...'
        }
        var oText = $(''+id+' .axis-x').find('.tick text').eq(i).text(name)
      } 

      //获取  x轴transform的位置 
      var transX = commonUnit.getTransformX(id, data) 

      
      var grid = config.grid
      var itemStyle = config.itemStyle

      //创建组元素g
      d3.select(id).selectAll('.group').remove()
       var group = svg.selectAll('.group')
         .data(data)
         .enter()
         .append('g')
         .attr('class', 'group')  
         .attr('transform', function(d, i){
           var x= transX[i] - 10
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

      //添加数据的渐变柱子
      var colors =  [
        {
          color: config.itemStyle.gradientColor,
          id: 'gColor'
        }
      ]
      
      //渐变配置项
      var gradientCfg = {
        x1: '0%',
        y1: '0%',
        x2: '0%',
        y2: '100%',
        offset1: '20%',
        offset2: '100%',
        opacity1: 1,
        opacity2: 0.2
      }
      commonUnit.addGradient(id, colors, gradientCfg)
      group.append('rect')
        .attr('width', itemStyle.width)
        .attr('height', function(d, i){
          var h = linear(d.value)
          if( h > maxHeight){
            h  = maxHeight
          }
          return h
        }) 
        .attr('fill', '#00d2ff')
        .attr('fill','url(#gColor)')
        .attr('x', 0)
        .attr('y', function(d, i){
          var y = height - linear(d.value) - grid.y
          if( y < 0){
            y = 0
          }
          return  y 
        })

      //添加顶部的发光圆圈 
       group.append('image')
        .attr('width', 14)
        .attr('height', 14)
        .attr('xlink:href', constants.SVG_IMG_PATH + '/images/prgv-top-light.png')
        .attr('x', -5)
        .attr('y', function(d, i){
          var y = height - linear(d.value) - grid.y - 10
            if( y < 0){
              y = 0
            }
            return  y 
        })  

    }

  }

  return caseTop
})
