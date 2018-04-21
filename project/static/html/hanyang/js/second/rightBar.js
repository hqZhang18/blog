/*
* @Author: zhanghongqiao
* @Date:   2016-12-29
* @description：毒品罪案案件数排名 （三角形柱状图）
* @File Name: penal.js
*/

define(function(require) {

	var linearGradient1 = ''
	var linearGradient2 = ''
	var setTime = '' //定时器
	var t = 0
	var config = {}
	var dataAll = []
	var bar = {
		drawChart: function(cfg,data){
			var _self = this
			var id = cfg.container
 			var width = cfg.width
 			var height = cfg.height
 			var color = cfg.color

			d3.select(id).html('')
			var svg = d3.select(id)
	      .append("svg")
	      .attr("width", width)
	      .attr("height", height)
	      var dataset = []
	      var dataX = []
	      for(var i = 0; i<data.length; i++){
	      	dataset.push(data[i].value)
	      	dataX.push(data[i].name)
	      }
	 			//定义y轴标尺
	   		 var ticks = 10
	   		 var max = d3.max(dataset)

	   		 if(max<10){
	        max = 10
	        ticks = 5
	      }
       
	      //调用线性渐变 
	        bar.Gradient(svg, color) 
	   		 //定义y轴标尺
				var yScale = d3.scale.linear()
	    		.domain([0, max])
	    		.range([ height-cfg.padding.bottom-cfg.padding.top, 0])
				//定义纵轴	
	    	var yAxis=d3.svg.axis()
	    		.scale(yScale)
	    		.orient("left")
	    		.ticks(ticks)
		    		
		    //添加y轴
	   		var yBar=svg.append("g")
				  .attr('class','axis axis-y')
				  .attr('transform', 'translate('+cfg.padding.left+', '+cfg.padding.top+')')
				  .call(yAxis)

				  //定义纵轴网格线
				 	var yInner = d3.svg.axis()
				 	.scale(yScale)
				 	.tickSize(-(width- cfg.padding.left-10),0)
				 	.tickFormat("")
				 	.orient("left")
				 	.ticks(ticks)
				 	
				 	//添加纵轴网格线
				 	var yInnerBar=svg.append("g")
				 	.attr("class", "inner_line")
				 	.attr('transform', 'translate('+cfg.padding.left+', '+cfg.padding.top+')')
				 	.call(yInner)

	      //x轴线
					svg.append('rect')
						.attr('width', width- cfg.padding.left-10)
						.attr('height', 1)
						.attr('fill', cfg.lineColor)
						.attr('x', cfg.padding.left)
						.attr('y', (height - cfg.padding.bottom))
				//超标线
				var baseValue = cfg.baseValue
				if(baseValue!=0){
					svg.append('rect')
						.attr('width', width- cfg.padding.left-10)
						.attr('height', 1)
						.attr('fill', 'red')
						.attr('x', cfg.padding.left)
						.attr('y', (yScale(baseValue)+cfg.padding.top/2))			
				}
				var dLen = dataset.length
				var dwidth = (width - cfg.padding.left - cfg.barWidth)/dLen
				var separate = cfg.separate

				var rectGroup = svg.selectAll('.rectGroup')
					.data(dataset)
					.enter()
					.append('g')
					.attr('class', 'rectGroup')
					.attr('transform', function(d, i){
              var x= i*dwidth+cfg.padding.left+cfg.barWidth
              var y = height - cfg.padding.bottom
              return 'translate('+x+', '+y+')'
          })
					
				rectGroup.append('rect')
					.attr('width', cfg.barWidth)
					.attr('height', function(d,i){
						
						if(yScale(d)<0){
							return 10
						}else{
							var h = height - cfg.padding.bottom - yScale(d) - cfg.padding.top
							return h
						}
						
					})
					.attr('x', function(d,i){
						return 0
					})
					.attr('y', function(d,i){
						if(yScale(d)<0){
							return -10
						}else{
							var y = height - cfg.padding.bottom - yScale(d) - cfg.padding.top
							return -y
						}
						
					})
					.attr("fill", function(d,i){
						if(separate==0){
								if(d>baseValue){
								return 'url(#' + linearGradient1.attr('id') + ')'
							}else{
								return 'url(#' + linearGradient2.attr('id') + ')'
							}
						}else{
							if(i<separate){
								return 'url(#' + linearGradient1.attr('id') + ')'
							}else{
								return 'url(#' + linearGradient2.attr('id') + ')'
							}
						}	
					})
					.on('mouseover', function(d, i){
						d3.select(this).style('cursor', 'pointer')
						var browser=navigator.appName 
						var b_version=navigator.appVersion 
						var version=b_version.split(";"); 
						var trim_Version=version[1].replace(/[ ]/g,"")
						
						if (browser =="Microsoft Internet Explorer") {
							var top = event.layerY + 32 ;
						 	var left = event.layerX;
						  console.log(top, left)
						}else{
							var top = event.offsetY + 32 ;
						 	var left = event.offsetX;
						}
						 
						// top = replace('')
						
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
						clearInterval(setTime)
					})
					.on('mouseout', function(){
						d3.selectAll('.txtTooltip').remove('div')
					})
					.on('mousemove', function(){
						clearInterval(setTime)
					})
				//添加上面小矩形	
				rectGroup.append('rect')
					.attr('width', cfg.barWidth)
					.attr('height', function(d,i){
						if(d==0){
							return 0
						}else{
							return 4
						}
					})
					.attr('x', function(d,i){
						return 0
					})
					.attr('y', function(d,i){
						if(yScale(d)<0){
							return - 16
						}else{
							var y = height - cfg.padding.bottom - yScale(d) - cfg.padding.top + 6
							return -y
						}
						
					})
					.attr("fill", function(d,i){
						//判断是超标颜色区分填充还是前六颜色区分填充
						//if是超标else是前六
						if(separate==0){
								if(d>baseValue){
								return color[0]
							}else{
								return color[2]
							}
						}else{
							if(i<separate){
								return color[0]
							}else{
								return color[2]
							}
						}
						
					})
						//添加x轴文字	
				var texts = svg.append('g')
					.attr('class', 'texts')
					.attr('transform', 'translate('+(cfg.padding.left+5)+', '+(height - cfg.padding.bottom+10)+')')
				
				var min = d3.min(dataset)	
				var max = d3.max(dataset)		
				rectGroup.append('text')
					.attr('fill', function(d, i){
						return '#a5cfe0'
/*						if(i==4||i==5 || i==13 || i==14){
							
							return 'red' 
						}else{
							return '#a5cfe0'
						}*/
					})
					.attr('font-size', 12)
					.attr('text-anchor', 'millde')
					.attr('transform','rotate(55)')
					.attr('x', function(d,i){
						return 6 
					})
					.attr('y', function(d,i){
						var y =  10
						return y
					})
					.text(function(d,i){
						var txt = dataX[i]
						
						if(txt.length>5){
							txt = txt.slice(0, 4) + ' ...'
						}
						return txt
					})
					//.style('writing-mode','tb-rl')
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
	            .attr("y1","60%")
	            .attr("x2","0%")
	            .attr("y2","100%");
	
			var stop1 = linearGradient1.append("stop")
			        .attr("offset","10%")
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
	            .attr("y1","60%")
	            .attr("x2","0%")
	            .attr("y2","100%");
	
			var stop3 = linearGradient2.append("stop")
			        .attr("offset","0%")
			        .style("stop-color",c.toString());
			
			var stop4 = linearGradient2.append("stop")
			        .attr("offset","100%")
			        .style("stop-color",d.toString());           
		},
		init: function(cfg, data){
			config = cfg
			dataAll = data
			
			var _self = this
			
			_self.drawChart(cfg,data[0].values)
			var thisCur = $(".right03_bar .span_right p")
			thisCur.eq(0).addClass('cur') 
			
			_self.bindEvent(config, dataAll)
			_self.timing(config, dataAll)
		},

		//定时切换
		timing: function(cfg, data){
			var _self = this
			
			var dLen = data.length
			var thisCur = $(".right03_bar .span_right p")
			clearInterval(setTime)
			setTime = setInterval(function(){
				t++

				if(t==dLen){
					t = 0
					_self.drawChart(cfg, data[0].values)
					thisCur.eq(0).addClass('cur').siblings().removeClass('cur')
				}else{
					_self.drawChart(cfg, data[t].values)
					thisCur.eq(t).addClass('cur').siblings().removeClass('cur')
				}
			},5000)
		},

		//点击案件数排名分类
		bindEvent: function(cfg, data){
			var _self = this
			var thisCur = $(".right03_bar .span_right p")
			$('.span_right').off('click', 'p')
			$('.span_right').on('click', 'p', function(e){
				var index = $(this).index()
				t = index 
				thisCur.eq(index).addClass('cur').siblings().removeClass('cur')
				_self.drawChart(cfg, data[index].values)
				clearInterval(setTime)
			})

			$('.right03').on('mouseleave', function(e){
				_self.timing(config, dataAll)
			})
		
		}


	}

	
	return bar
})
