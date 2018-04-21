/**
 * 六边形组合柱状图组件
 * @autor zhanghq
 * @date 2016-1-5
 */

define(function(require) {
  /**
   * 引入公用的文件
   */
  var barCharts = {
    /**
     * 柱状图默认配置项
     */
    defaultSetting: function() {
      var width = 450
      var height = 400
      return {
        width: width,
        height: height,
        min: 1,
        zoom: 14,
        left: 20,
        ratio: false,
        coordinate: ['130,20, 20,40, 20,220, 130,200, 220,220, 220,40', '60,20, 20,90, 60,160, 140,160, 180,90, 140,20'] , //正六边形的六个坐标点
        pointStyle: 0,
        itemStyle:{
          strokeWidth: 1,
          stroke: 'none',
          color: ['#846ffb', '#fce76e'],
          margin: {
            left: -90,
            bottom:8,
          },
          emphasis: {  //强调样式
            color: ['#c9ff4c', '#d63200'],
            borderColor: '#c9ff4c'
          }
        },
        xText: {
          size: 36,
          color: '#6792ff',
          textAnchor: 'start',
          left: 0,
          top: -120
        },
        yAxis: {
          show: true
        },
        xAxis: {
          color: '#fff'
        },
        grid: {  //文字离左右两边的距离
          x: 0,
          x2: 0,
          y: 45
        }
      }
    },

    /**
     * 绘制柱状图
     * @param {object} svg svg对象
     * @param {object} data 数据
     * @param {object} config 图表配置项
     */
    drawPolygonBar: function(id, data, opt) {
      var config = _.assign({}, this.defaultSetting(), opt)
      var className = id.replace('#', '')
      //空数据处理
      if(data.length==0){
        $(id).next().show()
      }else{
        $(id).next().hide()
      }
      var dataset = []
      var xData = []
      var ratio = config.ratio
      for(var i = 0, len = data.length; i<len; i++){
        var value = data[i].value
        if(!ratio) {
          value = parseInt(value)
        }
        dataset.push(value)
        xData.push(data[i].name)
      }
      var pointStyle = config.pointStyle
      var oPoints = []
      var polygonW = 0
      //点的形状样式
      if(pointStyle==1){
          polygonW = 100/config.zoom
          oPoints = config.coordinate[0]
        
       }else{
          polygonW = 130/config.zoom
          oPoints = config.coordinate[1]
       }
       oPoints = oPoints.split(',')

      var dataLen = data.length

      var width = config.width
      var height = config.height 
      //dataWidth max 决定了画多少个六边形
      var dataWidth = height - config.grid.y - 75
      var max = Math.ceil(dataWidth/polygonW) 
     
      var svg = null
      if(d3.select(id).selectAll('svg')[0].length > 0) {
        svg = d3.select(id).selectAll('svg')
      } else {
        svg = d3.select(id)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('margin-left', config.left)  
      }    

       svg.html('') 
       /**
       * 获取update部分
       */
      var update = svg.selectAll('.'+className+'-areas')
        .data(data)
      
      //获取enter部分
      var enter = update.enter()

      //获取exit部分
      var exit = update.exit()
     
       //默认颜色
      var color = config.itemStyle.color
      //高亮颜色
      var emphasis = config.itemStyle.emphasis.color
      //调用渐变色
      colorFill(color)
      //渐变色填充
      function colorFill(color){
        var a = d3.hcl(color[0]);    
        var b = d3.hcl(color[1]);    
        compute = d3.interpolate(a,b); 
      }
      //填充比例尺
      var linear = d3.scale.linear()  
          .domain([0, max])  
          .range([0, 1.5])
          

      //添加六边形的area
      var itemStyle = config.itemStyle
      var spacing  = (width - config.grid.x - polygonW)/dataLen
      var areas = enter.append('g')
        .attr('class', className+'-areas')
        .on('mouseenter', function(d, i){
          var $this = d3.select(this)
          $this.style('cursor', 'pointer')
          //是否按占比计算 
          if(ratio){
            var value = Math.ceil(data[i].value * 100) + '%'
          }else{
            var value = data[i].value
          }
          var txt = '<p>'+data[i].name+'<br /></p><p>数量：'+value+'</p>'
          //添加提示框
          var tooltip = d3.select(id)
            .append('div')
            .attr('class', 'tooltip')
            .html(txt)
         
          var height = $('.tooltip').height()
          var width = $('.tooltip').width()
          var top = event.offsetY - height
          var left = event.offsetX 
    		  if(top < -20){
      			$this.style('cursor', 'default')
      			d3.selectAll('.tooltip').remove()
      			colorFill(color)
      			$this.selectAll('.polygon')
                  .style("fill",function(d){  
                    return compute(linear(d)) 
                 })
    		  }
          if(left>700){
            left = left -100
          }
          tooltip
            .style('top', top+'px')
            .style('left', left+'px')

          colorFill(emphasis) //调用颜色
          $this.selectAll('.polygon')
            .style("fill",function(d){  
              return compute(linear(d)) 
          })
        })
        .on('mouseleave', function(){
          var $this = d3.select(this)
          d3.selectAll('.tooltip').remove()
          //渐变色填充
          colorFill(color)
          $this.selectAll('.polygon')
            .style("fill",function(d){  
              return compute(linear(d)) 
          })
        })

        //如果按比例算需要*100
        if(ratio){
          var unit = parseInt((d3.max(dataset)*100 / max).toFixed(0), 10)
           // var unit = Math.ceil(d3.max(dataset)*100 / max)
        }else{
          var unit =  Math.ceil((d3.max(dataset) / max))
        }

        var points = []
        for(var i = 0;i<oPoints.length;i++){
          points.push(oPoints[i]/11) //六边形缩放
        }
        var index = 0
        var textPosi = []

        //添加矩形背景
        areas.append('rect')
            .attr('width', 26)
            .attr('height', height-100)
            .attr('fill', '#191e32')
            .attr('x', -5)
            .attr('y', - height+110)
        //添加多边形点   
        // 对小于10的值做处理，全部保存起来，后面对比最大值 
        var ranges = []
        dataset.forEach(function(d) {
          if(ratio){
            var range = Math.ceil(d*100 / unit)
          }else{
            var range = Math.ceil(d/ unit)
          }
          ranges.push(range)    
        })
        
        areas.selectAll(".polygon")
           .data(function(d,i){
              //按比例计算要*100  
              if(ratio){
                var range = Math.ceil(dataset[i]*100 / unit)
              }else{
                var range = Math.ceil(dataset[i]/ unit)
                // 小于10的特殊处理不换算

               // if(dataset[i] <= 10 && d3.max(ranges) <= 10) {
               //    if(ratio) {
               //      range = dataset[i] * 100
               //    }else {
               //      range = dataset[i]
               //    }
               // }

              }
              if(range<0){
                range = config.min
              }
             // 超过最大的限制
             if(range>max || range == d3.max(ranges)){
               range = max
             }
           //  console.log(range, dataset[i]/ unit, dataset)
              textPosi.push(range)
              return d3.range(0, range)
           })
           .enter()
           .append("polygon")
           .style("stroke-width", itemStyle.strokeWidth)
           .style("stroke", itemStyle.stroke)
           .attr("points", points)
           //渐变色
           .style("fill",function(d){  
              return compute(linear(d));  
           })
          .attr('transform',function(d,i){
              return 'translate(-1,'+-(i*polygonW+itemStyle.margin.bottom+i)+')'
           })
          .attr('class', 'polygon')

          //x轴文字
           var xText = config.xText

          //添加value
          areas.append('text')
            .attr('fill', '#87a8fb')
            .attr('font-size', xText.size)
            .attr('text-anchor', 'middle')
            .attr('x', 6)
            .attr('y', function(d,i){
              return xText.top
            })
            .text(function(d,i){

              if(ratio){
                var value = Math.ceil(data[i].value * 100) + '%'
              }else{
                var value = data[i].value
              }
              return value
            });

            //定义X轴比例尺(序数比例尺)
      var xScale = d3.scale.ordinal()
        .domain(xData)
        .rangeRoundBands([0, width]);  

      //定义X轴    
      var xAxis = d3.svg.axis()
          .scale(xScale)      //指定比例尺
          .orient('bottom')   //指定刻度的方向
          
      //添加X轴    
      //d3.selectAll('.axis-x').remove() 
      svg.append("g")
        .attr('class', 'axis-x')
        .call(xAxis)
        .attr('transform',function(d,i){
          return 'translate(0,'+(height - config.grid.y+10)+')'
      })

      var transX = []    

      for(var i=0, len = data.length; i<len; i++){
        var posiX = $(''+id+' .axis-x').find('.tick').eq(i).attr('transform')
        var parent = $(this).parent().attr('transform')
        posiX = posiX.replace(' ' ,',')  //ie兼容处理
        var index = posiX.indexOf(',')
        transX.push(posiX.substring(10, index))
      }  

      d3.selectAll('.'+className+'-areas')
      .attr('transform',function(d,i){
        return 'translate('+transX[i]+', '+(height-config.grid.y)+')'
      })
        
      //处理x轴的文字
      var textLength = $('.tick').find('text').length
      for(var k = 0; k<textLength; k++){
        var text = $('.tick').find('text').eq(k).text()
        if(text.length>5){
          var str = text.substr(0, 4) + '...'
          $('.tick').find('text').eq(k).text(str)
        }

      }

      //处理exit部分
       exit.remove()

    }
  }

  return barCharts
})