/**
 * @Author:      zhq
 * @DateTime:    2017-01-10 20:12:27
 * @Description: 警情协查、对外协查
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-10 20:12:27
 */

define(function(require){
 
  var commonUnit = require('../components/commonUnit.js')

  var triangleBar = {
    defaultSetting: function() {
      return {
        width: 450,
        height: 280,
        padding: {
          top: 0,
					right: 0,
					bottom: 0,
					left: 0
        },
				min: 10,
        itemStyle: {
          color: ['#0091fa', '#042769'],
          borderColor: 'none',
          borderWidth: 1,
          width: 10,
          fillId: ['brushBarColor1', 'brushBarColor2'],
          margin:{
            left:10
          },
          topMark:{
            fill:'#018eff',
            margin: {
              bottom: 2
            }
          },
          emphasis: {  //强调样式
            color: ['#042769', '#00fffd'],
            borderColor: '#042769'
          }
        },
        xText:{
          fontSize: 24,
          fill: '#a5cfe0',
          textAnchor: 'middle',
          margin: {
            bottom: 10
          }
        },
        grid:{
          x: 0,
          y: 40,
          y2: 30
        }
      }
    },
    /**
     * 绘制柱状图
     */
    drawBrushBar: function(id, data, opt) {
      commonUnit.noData(id, data)
      var config = _.merge({}, this.defaultSetting(), opt)
      var width = config.width
      var height = config.height
      var padding = config.padding

      //创建svg
      var svg = commonUnit.addSvg(id, config)

      var _slef = this
      var dataset = []
      var xData = []
      for(var i = 0, len = data.length; i<len; i++){
        dataset.push( parseInt(parseInt(data[i].value, 10), 10) )
				var name = data[i].name
				name = name.substring(5)
				name = name.replace('-', '.')
        xData.push(name)
      }
	     
      //定义比例尺
      var dataH = height-config.grid.y-config.grid.y2 - padding.top - padding.bottom
      var linear = d3.scale.linear()  
            .domain([0, d3.max(dataset)])  
            .range([0, dataH])

      var min = linear(d3.min(dataset))
      d3.select(id).selectAll('.axis').remove()
     
      //生成X轴
      commonUnit.addXAxis(svg, config, xData)
      //获取  x轴transform的位置 
      var transX = commonUnit.getTransformX(id, data) 
      
      var itemStyle = config.itemStyle
		
      var emphasis = itemStyle.emphasis
      //渐变配置项
      var gradientCfg = {
        x1: '0%',
        y1: '0%',
        x2: '0%',
        y2: '100%',
        offset1: '20%',
        offset2: '100%',
        opacity1: 1,
        opacity2: 0.8
      }
      
      //创建一个组元素
      d3.select(id).selectAll('.group').remove()
      var group =  svg.selectAll('.group')
         .data(data)
         .enter()
         .append('g')
         .attr('class', 'group')
         .attr('transform', function(d, i){
            var x= transX[i]
            var y = height - 30
            return 'translate('+x+', '+y+')'
         })
         .on('mouseover', function(d, i){
            d3.select(this).style('cursor', 'pointer')
            //添加提示框
            commonUnit.addTooltip(id, d)
         })
         .on('mouseout', function(d, i){
            d3.selectAll('.charts-tooltip').remove()
         })

      //定义一个线性渐变  
      var colors1 = [
        {
          color: config.itemStyle.color,
          id: itemStyle.fillId[0]
        }
      ] 

      commonUnit.addGradient(id, colors1, gradientCfg) 
      group.append('rect')  
            .attr("fill", function(d,i){
              return 'url(#'+itemStyle.fillId[0]+' )'
            })
            .attr('width', itemStyle.width)
            .attr('height', function(d, i){
							 var h = linear(d.value)  - 12
							 if(h<0){
								 h = 0
							 }
              return h
            })
            .attr('x', 0)
            .attr('y', function(d, i){
              return -linear(d.value)  + 12
            })
            .attr('stroke-width', itemStyle.borderWidth)
            .attr('stroke', itemStyle.borderColor)
            //添加提示框
            // .on('mouseover', function(d, i){
            //   //改变颜色
            //   d3.selectAll('#'+itemStyle.fillId[1]+'').remove()
            //   var colors2 = [
            //     {
            //       color: emphasis.color,
            //       id: itemStyle.fillId[1]
            //     }
            //   ] 
            //   commonUnit.addGradient(id, colors2, gradientCfg)   
            //     d3.select(this)
            //     .attr("fill", function(d,i){
            //       return 'url(#'+itemStyle.fillId[1]+' )'
            //     })

            //  })
            //  // //鼠标移开 
            //  .on('mouseout', function(){
            //     d3.selectAll('#'+itemStyle.fillId[0]+'').remove()
            //     commonUnit.addGradient(id, colors1, gradientCfg) 
            //     d3.select(this) 
            //     .attr("fill", function(d,i){
            //       return 'url(#'+itemStyle.fillId[0]+' )'
            //     })
            //  })


        //添加上面小矩形
        var markStyle = itemStyle.topMark 
        group.append('rect')
          .attr('width', itemStyle.width)
          .attr('height', itemStyle.width - 2)
          .attr('x', function(d,i) {
            return 0
          })
          .attr('y', function(d,i){
            var cy =   linear(d.value) 
            
            if(cy<= config.min){
              cy = config.min
            }
            return (-cy + markStyle.margin.bottom) 
          })
          .attr('fill', markStyle.fill) 

        //添加top的value  
        var xText = config.xText
        group.append('text')
          .attr('x', 0)
          .attr('y', function(d, i){
            var cy =   linear(d.value)
      
            if(cy<= config.min){
              cy = config.min
            }
            return -cy - xText.margin.bottom
          })   
          .text(function(d, i){
            return d.value 
          })
          .attr('font-size', xText.fontSize)
          .attr('fill', xText.fill)
          .attr('text-anchor', xText.textAnchor)

    }

  }

  return triangleBar
})