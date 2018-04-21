/**
 * @Author:      zhq
 * @DateTime:    2017-01-10 20:12:27
 * @Description: Description
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-10 20:12:27
 */

define(function(require){
 

  var commonUnit = require('../components/commonUnit.js')



  var areaCharts = {
    defaultSetting: function() {
      var width = 800
      var height = 400
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
         
          color: ['#008efe', '#683e84'],
          colors: [
            {
              id: 'color1',
              color: ['#aa58fd', '#008efe']
            },{
              id: 'color2',
              color: ['#191ed4', '#008efe']
            },{
              id: 'color3',
              color: ['#50adfc', '#008efe']
            },{
              id: 'color4',
              color: ['#50adfc', '#008efe']
            },{
              id: 'color5',
              color: ['#84f088', '#008efe']
            },{
              id: 'color6',
              color: ['#f97dcb', '#008efe']
            },{
              id: 'color7',
              color: ['#f0f88b', '#008efe']
            },{
              id: 'color8',
              color: ['#7bfcfb', '#008efe']
            },{
              id: 'color9',
              color: ['#7bfcfb', '#008efe']
            },{
              id: 'color10',
              color: ['#aa58fd', '#008efe']
            },{
              id: 'color11',
              color: ['#aa58fd', '#008efe']
            },{
              id: 'color12',
              color: ['#aa58fd', '#008efe']
            },{
              id: 'color13',
              color: ['#aa58fd', '#008efe']
            }
          ],
          borderColor: 'none',
          borderWidth: 1,
          min: 20,
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
        yAxis: {
          axisLine: {
            show: true
          },
          gridLine: {
            show: false
          },
          ticks: 6
        },
        xText:{
          fontSize: 24,
          fill: '#a5cfe0',
          textAnchor: 'middle',
          margin: {
            left: 0,
            bottom: 5
          }
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
    drawCharts: function(id, data, opt) {
      var _self = this
      var config = _.merge({}, this.defaultSetting(), opt)
      var width = config.width
      var height = config.height
      if(data.length==0){
        $('.no-data').html('暂无数据').show()
      }else{
        $('.no-data').html('暂无数据').hide()
      }

      //创建svg
      var svg = commonUnit.addSvg(id, config)

      var color = config.itemStyle.color
      var _slef = this
      var dataset = []
      var xData = []
      var data = data.slice(0, 13)
      // 数据去重
      var data = commonUnit.unique(data)
      var datalen = data.length
      for(var i = 0; i<datalen; i++){
        dataset.push(parseInt(data[i].value, 10))
        xData.push(data[i].name)
      }

      //定义比例尺
      var linear = d3.scale.linear()  
            .domain([0,d3.max(dataset)])  
            .range([0, height-config.grid.y-config.grid.y2])


      d3.select(id).selectAll('.axis').remove()
      //生成Y轴及网格线
      var yScale =  commonUnit.addYAxis(svg, config, dataset)
      //生成X轴
      commonUnit.addXAxis(svg, config, xData)
      //获取  x轴transform的位置 
      var transX = commonUnit.getTransformX(id, data) 
      console.log(transX)
      
      $(''+id+' .axis-x').find('.tick text').attr('y', 50)

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
              var x=  transX[0]
              var y = height - config.grid.y  
              return 'translate('+x+', '+y+')'
           })

        //添加数据的矩形柱子
        
      var colors = config.itemStyle.colors
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
      // var names = [
      //   _self.addDefs(svg, color), _self.addDefs(svg, color2)
      // ]
      group.append('polygon')  
        .attr({
          points: function(d, i){
            var p1 = -1

            var p2 = -linear(d.value) + 8 
            if(p2>=0){
              p2 = -itemStyle.min
            }
            var p3 = p1
            var p5 = transX[datalen-1]-40
            
            var points = ''+transX[i]-transX[0]+' '+p2+',  '+(p1-barWidth)+' '+p3+', '+ p5 +' '+p3+' '
           
            return points
          },
          fill: function(d, i){
            return 'url(#' + colors[i].id + ')' 
          },
          opacity: 0.45
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
      //创建多边形
      group.append('polygon')
        .attr({
          points: points,
          transform: function(d, i){
            var x = transX[i] - transX[0] - 4 
            var y =  linear(d.value) - 4 
          
              if(y<=itemStyle.min){
                y = itemStyle.min
              }
            return 'translate('+x+', '+-y+')'
          },
          fill: '#5acaff'
    
        })


 
        // //添加上面小圆圈
        // group.append('rect')
        //   .attr({
        //     width: 7,
        //     height: 7,
        //     x: function(d, i){
        //       return transX[i] - transX[0] - 4 
        //     },
        //     y: function(d, i){
        //       var y =   linear(d.value) - 4 
        //       if(y==0){
        //         y = itemStyle.min
        //       }
        //       return -y
        //     },
        //     fill: itemStyle.circle.color,
        //     filter: 'url(#filter1)',
        //     //transform: 'rotate(45)' 
        //   })

        //添加top的value  
        var xText = config.xText
        group.append('text')
          .attr({
            x: function(d, i){
              return transX[i] - transX[0] - xText.margin.left
            },
            y: function(d, i){
              var y =   linear(d.value) + xText.margin.bottom
              if(y<=itemStyle.min){
                y = itemStyle.min
              }
              return -y
            },
            fill: xText.fill,
            'font-size': xText.fontSize,
            'text-anchor': xText.textAnchor
          })
          .text(function(d, i){
            return d.value
          })
    }
}

  return areaCharts
})