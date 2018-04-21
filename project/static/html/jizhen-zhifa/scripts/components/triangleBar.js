/**
 * @Author:      zhq
 * @DateTime:    2017-01-10 20:12:27
 * @Description: 人工布控统计
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-10 20:12:27
 */

define(function(require){
 

  var commonUnit = require('../components/commonUnit.js')

  var triangleBar = {
    defaultSetting: function() {
      var width = 450
      var height = 280
      return {
        width: width,
        height: height,
        id: '#triangleBar',
        padding: {
          top: 0,
          right: 0,
          bottom: 20,
          left: 0
          
        },
        itemStyle: {
          barWidth: 6,
          color: ['#008efe', '#008efe'],
          borderColor: 'none',
          borderWidth: 1,
          min: 10,
          margin:{
            left:10
          },
          circle:{
            color:'#018eff',
            r: 3,
          },
          emphasis: {  //强调样式
            color: ['#c9ff4c', '#c9ff4c'],
            borderColor: '#c9ff4c'
          }
        },
        xText:{
          fontSize: 12,
          color: '#a5cfe0',
          textAnchor: 'start',
          margin:{
            top: 15,
            left: 0 //反方向 -20
          }
        },
        yAxis: {
          axisLine: {
            show: true
          },
          gridLine: {
            show: true
          },
          ticks: 6
        },
        grid:{
          x: 50,
          y: 60,
          y2:40
        }
      }
    },
    /**
     * 绘制柱状图
     */
    drawTriangleBar: function(id, data, opt) {

      var config = _.merge({}, this.defaultSetting(), opt)
      var width = config.width
      var height = config.height

      //创建svg
      var svg = commonUnit.addSvg(id, config)
      // 数据去重
      var data = commonUnit.unique(data)
      var color = config.itemStyle.color
      var dataset = []
      var xData = []
      for(var i = 0; i<data.length; i++){
        dataset.push(parseInt(data[i].value, 10))
        var name = data[i].name
        //x轴名字截取
        if(name.length>4){
          name = name.substring(0, 4) + '...'
        }
        xData.push(name)
      }
      d3.select(id).selectAll('.inner_line').remove()
      d3.select(id).selectAll('.axis').remove()
      //生成Y轴及网格线
      var yScale =  commonUnit.addYAxis(svg, config, dataset)
      //生成X轴
    
      //定义比例尺
      var linear = d3.scale.linear()  
            .domain([0,d3.max(dataset)])  
            .range([0, height-config.grid.y-config.grid.y2])

      var min = linear(d3.min(dataset))      
     
      //生成X轴
      commonUnit.addXAxis(svg, config, xData)
      //获取  x轴transform的位置 
      var transX = commonUnit.getTransformX(id, data) 
		
			 //旋转文字  
      d3.select(id).selectAll('.axis-x text')
        .attr('transform', 'rotate(-35)')   
        .attr('x', -35)

      var itemStyle = config.itemStyle
      var dLen = dataset.length
      var dwidth = (width - itemStyle.barWidth)/dLen
      var barWidth = itemStyle.barWidth
      var emphasis = itemStyle.emphasis
      d3.select(id).selectAll('.group').remove()
      var group =  svg.selectAll('.group')
         .data(data)
         .enter()
         .append('g')
         .attr('class', 'group')
         .attr('transform', function(d, i){
            var x= transX[i]
            var y = height - config.grid.y
            return 'translate('+x+', '+y+')'
         })

      commonUnit.addFilter(svg, id)
      group.append('polygon')  
        .attr('points', function(d, i){
          var p1 = -1
          var p2 = -linear(d.value) + 8 
          if(p2>=-itemStyle.min){
            p2 = -itemStyle.min
          }
          var p3 = p1
          var points = ''+p1+', '+p2+'  '+(p1-barWidth)+',  '+p3+' '+(p1+barWidth)+' '+p3+' '
          return points
        })
      .attr('fill', '#018eff')
      .attr('filter', 'url(#filter1)')
      //添加提示框
      .on('mouseover', function(d, i){
        d3.select(this).style('cursor', 'pointer')
        //添加提示框
        commonUnit.addTooltip(id, d)
       })
       //鼠标移开 
       .on('mouseout', function(){
          d3.selectAll('.charts-tooltip').remove()
       })

      //添加上面小圆圈
      group.append('circle')
        .attr('r', itemStyle.circle.r)
        .attr('cx', function(d,i){
          var cx = i*dwidth+barWidth*2
          return -1
        })
        .attr('cy', function(d,i){
          var cy = linear(d.value) 
         
          if(cy<=itemStyle.min){
            
            cy = itemStyle.min * 2
          }
          return -cy  
        })
        .attr('fill', itemStyle.circle.color) 
        .attr('filter', 'url(#filter1)')
    }

  }

  return triangleBar
})