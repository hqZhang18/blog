/**
 * @Author:      zhq
 * @DateTime:    2017-01-10 20:12:27
 * @Description: Description
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-10 20:12:27
 */

define(function(require){
 

  var commonUnit = require('../components/commonUnit.js')

  var closingTotal = {
    defaultSetting: function() {
      var width = 400
      var height = 400
      return {
        width: width,
        height: height,
        id: '#triangleBar',
        padding: {
          top: 0,
          left: 30,
          bottom: 0,
          right: 35
        },
        itemStyle: {
          barWidth: 6,
          color: ['#008efe', '#683e84'],
          colors: [
            {
              id: 'tColor1',
              color: ['#1f5390', '#5cc4fe']
            }
          ],
          borderColor: '#b3c2d5',
          borderWidth: 1,
          min: 20,
          margin:{
            left:10
          },
          circle:{
            color:'#fffefe',
            r: 3,
          }
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
      var realData = data
      var padding = config.padding
      
      realData.sort(function(a, b) {
        return parseInt(a.value, 10) < parseInt(b.value, 10)
      })
      var data = [
        {
        "name": "提请案件",
        "value": 302
       },{
        "name": "协助",
        "value":  189
       },{
        "name": "检察院委托",
        "value": 132
       },{
        "name": "军队委托",
        "value": 32
       }
      ]
      if(realData.length<4){
        data = data.splice(1, 3)
      }
      

      //创建svg
      var svg = commonUnit.addSvg(id, config)

      var color = config.itemStyle.color
      var _slef = this
      var dataset = []
      var xData = []
      var datalen = data.length
      for(var i = 0; i<datalen; i++){
        dataset.push( parseInt(parseInt(data[i].value, 10), 10) )
        xData.push(data[i].name)
      }

      //生成X轴
     
     if(d3.select(id).selectAll('.axis-x')[0].length == 0){
        commonUnit.addXAxis(svg, config, xData)
     }
      
      d3.select(id).selectAll('.tick text').remove()

       //获取  x轴transform的位置 
      var transX = commonUnit.getTransformX(id, data) 
       

      var itemStyle = config.itemStyle
      var dLen = dataset.length
      var dwidth = (width - itemStyle.barWidth)/dLen
      var barWidth = itemStyle.barWidth

       //定义比例尺
      var linear = d3.scale.linear()  
          .domain([0, d3.max(dataset)])  
          .range([0, height-config.grid.y-config.grid.y2])

        //创建组元素    
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
        offset1: '50%',
        offset2: '100%',
        opacity1: 1,
        opacity2: 0.2
      }
      commonUnit.addGradient(id, colors, gradientCfg)
 
      var px = -15
      //数据只有三种类型的时候三角形处理
      if(data.length<4){
        px = -90
      }
      group.append('polygon')  
        .attr({
          points: function(d, i){
            var p1 = -1

            var p2 = -linear( parseInt(d.value) ) + 8 
         
            if(p2==0){
              p2 = -itemStyle.min
            }
            var p3 = p1
            var p5 = transX[datalen-1]-px
            var p0 = parseInt(transX[1], 10) + i*5 + padding.left
            var points = ''+ p0  +', '+p2+'  '+(p1-barWidth)+',  '+p3+' '+ p5 +' '+p3+' '
            return points
          },
          fill: function(d, i){
            return 'url(#tColor1)' 
          },
          opacity: 0.6,
          stroke: itemStyle.borderColor,
          'stroke-width':  itemStyle.borderWidth
        })

        //画线
        group.append('rect')
          .attr({
            width: 240,
            height: 1,
            x: function(d, i){
              var num = i%2
              var x = 0
              if(num==0){ //左边
                x = -parseInt(transX[1], 10) + i*5  + 40
              }else{ //右边
                x =  parseInt(transX[1], 10) + i*5  + padding.left
              }
              return x
            },
            y: function(d, i){
              var y =   linear(d.value) - 6
              if(y==0){
                y = itemStyle.min
              }
              return -y
            },
            fill: itemStyle.circle.color,
            
          })

          //添加上面小圆圈
        group.append('rect')
          .attr({
            width: 6,
            height: 6,
            x: function(d, i){
              return parseInt(transX[1], 10) + i*5 + padding.left
            },
            y: function(d, i){
              var y =   linear(d.value) - 3 
              if(y==0){
                y = itemStyle.min
              }
              return -y
            },
            fill: itemStyle.circle.color,
            filter: 'url(#filter1)',
          })

        //添加类型值
        var xText = config.xText
        group.append('text')
          .attr({
            x: function(d, i){
              var num = i%2
              var x = 0
              if(num!=0){ 
                x = parseInt(transX[1], 10) + i*5 - xText.margin.left + 150 + padding.left*2
              }else{
                x = -padding.left
              }

              return x
            },
            y: function(d, i){
              var y =   linear(d.value) + xText.margin.bottom -40
              if(y==0){
                y = itemStyle.min
              }
              return -y
            },
            fill: '#fff',
            'font-size': xText.fontSize,
            'text-anchor': xText.textAnchor
          })
          .text(function(d, i){
            return realData[i].value
          })

         //添加类型名 
        var xText = config.xText
        group.append('text')
          .attr({
            x: function(d, i){
              var num = i%2
              var x = 0
              if(num!=0){ 
                x = parseInt(transX[1], 10) + i*5 - xText.margin.left + 170 + padding.left
              }else{
                if(data.length<4){
                  x = -25
                }else{
                  x = -10
                }
              }
              return x
               
            },
            y: function(d, i){
              var y =   linear(d.value) + xText.margin.bottom
              if(y==0){
                y = itemStyle.min
              }
              return -y
            },
            fill: xText.fill,
            'font-size': xText.fontSize,
            'text-anchor': xText.textAnchor
          })
          .text(function(d, i){
            
            return realData[i].name
          })  
    }
}

  return closingTotal
})