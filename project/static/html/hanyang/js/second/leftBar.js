
define(function(require) {


	var linearGradient1 = ''
	var linearGradient2 = ''
	var rinkingBar = {
		drawChart: function(cfg,data){
			var id = cfg.container
			var width = cfg.width
			var height = cfg.height
			var color = cfg.color
			
     var width = cfg.width
     var height = cfg.height
     d3.select(id).html('')
		var svg = d3.select(id)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      var _slef = this
      var dataset = []
      var dataX = []
      for(var i = 0; i<data.length; i++){
        dataset.push(data[i].value)
        dataX.push(data[i].name)
      }

      //定义一个线性渐变     
      var color = cfg.itemStyle.color
        _slef.Gradient(svg, color) 
      var ticks = 10
      var max = d3.max(dataset)

       if(max<10){
        max = 10
        ticks = 5
       }

       //定义y轴标尺
      var yScale = d3.scale.linear()
        .domain([0, max])
        .range([height-cfg.grid.y-cfg.grid.y2, 0])
        
      //定义纵轴  
      var yAxis=d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(ticks)

      //定义比例尺
      var linear = d3.scale.linear()  
          .domain([0, max])  
          .range([0, height-cfg.grid.y-cfg.grid.y2])

      //添加y轴
      var yBar=svg.append("g")
        .attr('class','axis axis-y')
        .attr('transform', 'translate('+cfg.grid.x+', '+cfg.grid.y2+')')
        .call(yAxis)

      //定义纵轴网格线
        var yInner = d3.svg.axis()
        .scale(yScale)
        .tickSize(-(width- cfg.grid.x-10),0)
        .tickFormat("")
        .orient("left")
        .ticks(ticks)
        
        //添加纵轴网格线
        var yInnerBar=svg.append("g")
        .attr("class", "inner_line")
        .attr('transform', 'translate('+cfg.grid.x+', '+cfg.grid.y2+')')
        .call(yInner)  
      
        //x轴线
        svg.append('rect')
          .attr('width', width- cfg.grid.x-10)
          .attr('height', 1)
          .attr('fill', cfg.xAxis.color)
          .attr('x', cfg.grid.x)
          .attr('y', (height - cfg.grid.y))

        var itemStyle = cfg.itemStyle
        var dLen = dataset.length
        var dwidth = (width - cfg.grid.x - itemStyle.barWidth)/dLen
        var barWidth = itemStyle.barWidth
		  	//超标线
        var baseValue = parseInt(cfg.baseValue)

        if(baseValue!=0){

        	svg.append('rect')
            .attr('width', width- cfg.grid.x-10)
            .attr('height', 1)
            .attr('fill', 'red')
            .attr('x', cfg.grid.x)
            .attr('y', (yScale(baseValue)+cfg.grid.y2-itemStyle.min)) 
        }
        
        var group =  svg.selectAll(".group")
           .data(dataset)
           .enter()
           .append('g')
           .attr('class', 'group')
           .attr('transform', function(d, i){
              var x= i*dwidth+cfg.grid.x+barWidth*2+itemStyle.margin.left
              var y = height - cfg.grid.y
              return 'translate('+x+', '+y+')'
           })

        group.append('polygon')  
          .attr('points', function(d, i){
            var p1 = -1
            var p2 = -linear(d) 
            if(p2==0){
              p2 = -itemStyle.min
            }
            var p3 = p1
            var points = ''+p1+', '+p2+'  '+(p1-barWidth)+',  '+p3+' '+(p1+barWidth)+' '+p3+' '
            return points
          })
        .attr("fill", function(d,i){
          if(d>baseValue){
              return 'url(#' + linearGradient1.attr('id') + ')'
            }else{
              return 'url(#' + linearGradient2.attr('id') + ')'
            }
        })
        .attr('stroke-width', itemStyle.borderWidth)
        .attr('stroke', itemStyle.borderColor)
        .on('mouseover', function(d, i){
            d3.select(this).style('cursor', 'pointer')
             var top = event.offsetY + 32 ;
             var left = event.offsetX;
            if(left>300){
              left  = left - 120
            }
            if(top>150){
              top = top -80
            }
            var tooltip = d3.select(id).append('div')
              .attr('class', 'txtTooltip')
            var str = ' '+data[i].name+'<br/>数量：'+data[i].value+''
            tooltip.html(str)
              .style('left', left+'px')
              .style('top', top+'px')
            
          })
          .on('mouseout', function(){
            d3.selectAll('.txtTooltip').remove('div')
          })

        //添加上面小圆圈
        group.append('circle')
          .attr('r', itemStyle.circle.r)
          .attr('cx', function(d,i){
            var cx = i*dwidth+cfg.grid.x+barWidth*2
            return -1
          })
          .attr('cy', function(d,i){
            var cy =   linear(d) 
            if(cy==0){
              cy = itemStyle.min
            }
            return -cy
          })

          .attr('fill', itemStyle.circle.color) 

        var xText = cfg.xText  
 
        group.append('text')
          .attr('fill', xText.color)
          .attr('font-size', xText.fontSize)
          .attr('text-anchor', xText.textAnchor)
          .attr('transform','rotate(55)')
          .attr('x', function(d,i){
            var x = xText.margin.left
            return x 
          })
          .attr('y', function(d,i){
            var y = xText.margin.top
            return y 
          })
          .text(function(d,i){
            var txt = dataX[i]
            
            if(txt.length>5){
              txt = txt.slice(0, 4) + ' ...'
            }
            return txt
          })
		},
		Gradient: function(svg, color){
			 //定义一个线性渐变
				var a = d3.hcl(color[0])
				var b = d3.hcl(color[1])
				var defs = svg.append("defs");
				//添加渐变色
				 linearGradient1 = defs.append("linearGradient")
	            .attr("id","linearColor")
	            .attr("x1","0%")
	            .attr("y1","20%")
	            .attr("x2","0%")
	            .attr("y2","100%");
	
			var stop1 = linearGradient1.append("stop")
			        .attr("offset","0%")
			        .style("stop-color",a.toString());
			
			var stop2 = linearGradient1.append("stop")
			        .attr("offset","100%")
			        .style("stop-color",b.toString());   
			        
			 //定义一个线性渐变
				var c = d3.hcl(color[2])
				var d = d3.hcl(color[3])
				var defs = svg.append("defs");
				//添加渐变色
				 linearGradient2 = defs.append("linearGradient")
	            .attr("id","linearColor2")
	            .attr("x1","0%")
	            .attr("y1","20%")
	            .attr("x2","0%")
	            .attr("y2","100%");
	
			var stop3 = linearGradient2.append("stop")
			        .attr("offset","0%")
			        .style("stop-color",c.toString());
			
			var stop4 = linearGradient2.append("stop")
			        .attr("offset","100%")
			        .style("stop-color",d.toString());           
		}
		
	}
	return rinkingBar
})
