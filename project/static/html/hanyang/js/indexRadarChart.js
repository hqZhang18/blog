/**
 * @author：zhanghongqiao
 * @description：绘制雷达图
 * @modifined：2016/12/20
 */

define(function(require) {
	var radarMain = ''
	var timer = []
	//图片缩放
	var sValue = 0.5
	var lValue = 1
	var allType = []
	var maxValue = 0

	var total = 0
	
	 var cfg = {
			 radius: 6,
			 radiusZoom: 3, //半径缩放
			 zoom: 200,  //雷达图缩放
			 factor: 1,
			 factorLegend: .85,
			 levels: 1,
			 maxValue: 0,
			 radians: 2 * Math.PI,
			 opacityArea: 0,
			 ToRight: 5,
			 TranslateX: 207,
			 TranslateY: 117,
			 ExtraWidthX: 280,
			 ExtraWidthY: 110,
			 color: ['#fbe84c', '#10fdb0'],
			 color2: ['#51b3fd', '#df331f', '#8d3bf7', '#6be35e', '#4badf6'],
			 navW: 215,
			 navH: 60
			}
	
	var radarChart = {
		draw: function(id, d, options){

		  var data = []
		  var radarRadius = 0			//其他五类半径

		var typeName = ['警情', '治安行政', '强戒', '破案', '刑事拘留',]
		var typeTooltip = ["最高峰值1.5倍","分局历史最高值","全市中心城区平均水平","近三年平均水平","分局历史最低值"]
		var notes = ['刑事+治安警情 ', '行政拘留人数', '强制隔离戒毒人数', '破案绝对数', '刑事拘留人数']
		  //处理多边形数据

		  for(var i = 0;i<2;i++){
		  	allType = []
		  	var tooltip = []
		  	for(var j = 0, jLen = d[i].type.length; j<jLen; j++ ){
		  		var value = ''
		  		var typeID = d[i].type[j].type
		  		var falg = d[i].type[j].name
	
		  	  tooltip = d[i].type[j].tooltip
	
					var realValue = parseInt(d[i].type[j].realValue)
		  		value = d[i].type[j].value //[0.509,0.213,0.475,0.636]
				
		  		allType.push({
		  			name:d[i].type[j].name,
		  			value:value,
		  			tooltip:tooltip,
		  			type:j,
		  			realValue:realValue,
		  			notes: notes[j],
		  			typeName: typeName[j]
		  		})
		  	}
				data.push(allType)
			}
		
		  var yearData = data   //多边形数据
			var thisYear = []
	  	var lastYear = []
	  	for(var i=0; i<5; i++){
				thisYear.push(yearData[0][i].value)
				lastYear.push(yearData[1][i].value)
			}
	  	var circleData = d[2]
	
	  	var minArr = [] 
	  	var min1 = d3.min(thisYear)
	      minArr.push(min1)
		  var min2 =d3.min(lastYear)
		      minArr.push(min2)
		  var min3 = d3.min(circleData)
		      minArr.push(min3)
	
		  var min = d3.min(minArr)
	
		  var cx = 500
		  var cy = 448
	
		 //雷达报警
			var warData = []  
				for(var w = 0, wlen = data[0].length; w<wlen; w++){
					var callPolice = data[0][w]['tooltip']
					if(callPolice!=undefined&&callPolice.length!==0)
						warData.push(data[0][w])
					}
	
			if('undefined' !== typeof options){
			  for(var i in options){
				if('undefined' !== typeof options[i]){
				  cfg[i] = options[i];
				}
			  }
			}
			//五个圆的值
		  var radiusAll = d[2]
			//比例尺
			//每次返回5个半径数据相差大小不定，取数组中的最大值，最小值为0 设置定义域
			var max = d3.max(radiusAll);
			//比例尺的输出范围，最大为width/2-100
			var maxRange = cfg.w/2 -140
			var linear = d3.scale.linear()
	        .domain([0, max]) //设置比例尺度的定义域
	        .range([0, maxRange]); //比例尺的输出范围

		//雷达图最大值
			cfg.maxValue = Math.max(cfg.maxValue, d3.max(yearData, function(i){
				return d3.max(i.map(function(o){ 		
					return o.value/cfg.zoom; }))
			}))
	
			//数据类型
			var allAxis = (data[0].map(function(i, j){return i.name}))
			total = allAxis.length;
			var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
			var Format = d3.format('');
			d3.select(id).select("svg").remove();
		
			radarMain = d3.select(id)
					.append("svg")
					.attr("width", cfg.w+cfg.ExtraWidthX+250)
					.attr("height", cfg.w+cfg.ExtraWidthX+250)
					.attr('class', 'svg')
					.attr('font-family', '微软雅黑')
					.append("g")
					.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")")
	
			//Tooltip
			d3.select('.tooltip').remove()
			var tooltip = d3.select('#radarChart').append('div')
							.attr('class', 'tooltip')
							.on('click', function(d){
								
									var txtList = ''
									if(warData!==undefined && warData.length!=0){
										for(var i2 = 0;i2<warData.length; i2++){
											var warTxt = warData[i2].warning
											var proposal = warData[i2].proposal
											txtList += '<p><b>报警：</b>'+warTxt+'</p><p><b>工作建议：</b>'+proposal+'</p>'
										}
										var close = '<div class="closeWar">X</div>'
										warTooltip.style('display','block')
											.html(''+txtList+''+close+'');
									}
								d3.select(this).style('display', 'none')
							})
	
					var _self = this
					//滤镜
				  _self.filter()
	
	
		   //其他四个圆
/*		   	radarMain.selectAll(".circle")
			 	  .data(circleData)
	      	.enter()
		      .append("circle")
		      .attr("cx",cx)
		      .attr("cy",cy)
		      .attr("r",function(d,i){
		      	console.log(linear(d)/5)
		        return linear(d)
		      })
		      .attr("stroke",function(d,i){
		        return cfg.color2[i]
		      })
		      .attr("fill","none")
		      .style("stroke-width", function(d,i){
			    	var w = "3px"
			    	if (i==2) {
			    		w = "8px"
			    	}
	 					return w
			    })*/

		var cxArr = [0,-0.951,-0.587,0.587,0.957]   //取角cos值，
	  var cyArr = [-1,-0.309,0.809,0.809,-0.309]   //取角的sin值
	
	  var thisPoint = "" 
	  var lastPoint = ""
	  series = 0;
		 //今年去年雷达图
		 for (var i = 0; i < thisYear.length; i++) {
	    	thisPoint  = thisPoint + (cx+linear(thisYear[i])*cxArr[i])+","+ (cy+linear(thisYear[i])*cyArr[i])+" "   
	      lastPoint  = lastPoint + (cx+linear(lastYear[i])*cxArr[i])+","+ (cy+linear(lastYear[i])*cyArr[i])+" " 
	  }
			yearData.forEach(function(d, i){
			  dataValues = [];
			  radarMain.selectAll(".nodes")
				//获取今年坐标点
				if(i==1){
					thisPoint = lastPoint
				}
			  radarMain.selectAll(".area")
							 .data([dataValues])
							 .enter()
							 .append("polygon")
							 .attr("class", "polygon"+series)
							 .attr("filter","url(#gaussinaBlur)")
							 .style("stroke-width", "3px")
							 .style("stroke", cfg.color[series])
							 //坐标点
							 .attr("points",function(d) {
								 return thisPoint 
							  })
							 .style("fill", function(j, i){return cfg.color[series]})
							 .style("fill-opacity", cfg.opacityArea)
							 .on('mouseover', function (d){
												z = "polygon."+d3.select(this).attr("class");
												radarMain.selectAll("polygon")
												 .transition(200)
												 .style("fill-opacity", 0); 
												radarMain.selectAll(z)
												 .transition(200)
												 .style("fill-opacity", .0);
											  })
							 .on('mouseout', function(){
										radarMain.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", cfg.opacityArea);
							 });
			  series++;
			});
			
			series=0;
			//今年去年连接点
			yearData.forEach(function(y, x){
				radarMain.append('g')
				.attr('class','nodesWrap_'+x+'')
			  .selectAll(".nodes")
				.data(y).enter()
				.append("g:circle")
				.attr("class", "serie"+series)
				.attr('r', cfg.radius)
	      .attr("cx",function(d,i){
	        return cx+linear(d.value)*cxArr[i]
	      })
	      //sin
	      .attr("cy",function(d,i){
	        return cy+linear(d.value)*cyArr[i]
	      })
	   
	      .attr("fill","none")
	
				.attr("data-id", function(j){return j.axis})
				.style("fill", cfg.color[series]).style("fill-opacity", .9)
				.on('mouseover', function (d,i){
						var thisClas = d3.select(this).attr('class')
						if(thisClas=='serie0'){
							d3.select('.polygon0')
								.transition(200)
								.style("fill-opacity", 0.2); 
						}else{
							d3.select('.polygon1')
								.transition(200)
								.style("fill-opacity", 0.2); 
						}

							//提示框x,y位置
							newX =  parseFloat(d3.select(this).attr('cx')) + 155 ;
							newY =  parseFloat(d3.select(this).attr('cy')) + 20;
							tooltip
								.style('left', ''+newX+'px')
								.style('top', ''+newY+'px')
								.text(Format(d.realValue))
								.transition(200)
								.style('display', 'block')
						
						  })
				.on('mouseout', function(){
							tooltip
								.transition(200)
								.style('display', 'none');
							radarMain.selectAll("polygon")
								.transition(200)
								.style("fill-opacity", cfg.opacityArea);
						  })
				
				.text(function(j){return Math.max(j.value, 0)});
			  series++;
			})


			var time
			radarMain.selectAll(".circle")
			.data(circleData)
	      	.enter()
		      .append("circle")
		      .attr("cx",cx)
		      .attr("cy",cy)
		      .attr("r",function(d,i){
		      	console.log(linear(d)/5)
		        return linear(d)
		      })
		      .attr("stroke",function(d,i){
		        return cfg.color2[i]
		      })
		      .attr("fill","none")
		      .style("stroke-width", function(d,i){
			    	var w = "6px"
			    	if (i==2) {
			    		w = "8px"
			    	}
	 					return w
			    })
		    	.style('cursor', 'pointer')
	        	.on("mouseover",function(d,i){
		      		var _this = event
		      		var left = event.pageX+500
			      	var top = event.pageY+100
		      		time = setTimeout(function() {
			      		var tooltip = d3.select('body')
			      			.append('div')
			      			.html(typeTooltip[i])
			      			.style('left',left+'px')
			      			.style('top', top+'px')
/*			      			.style('position', 'absolute')
			      			.style('color', '#fff')
			      			.style('background-color','#07104a')
			      			.style({''})*/
			      			.attr('class', 'tooltip2')
			      		}, 500);
	    		})
	      		.on("mouseout",function(d,i){
	      			d3.selectAll('.tooltip2').remove()
	      			clearTimeout(time)
	     		})
		
	  },

	  filter: function(){
	  	//雷达图滤镜高斯模糊
			var filter = radarMain.append("defs").append("filter")
	        			.attr("id", "gaussinaBlur")
	        			.attr('x', 0)
	        			.attr('y', 0)
	        			.attr('width', '200%')
	        			.attr('height', '200%')
	        			
	        filter.append("feOffset")
	      		 .attr("result", "offOut")
	      		 .attr("in", "SourceGraphic")
	      		 .attr('dx', 6)
	      		 .attr('dy', 6)
	      		 
		      //stdDeviation 模糊量
		      filter.append("feGaussianBlur")
		    		  .attr("stdDeviation", "4")
		      		 
		      filter.append("feBlend")
		    		  .attr("in", "SourceGraphic")
		    		  .attr("in2", "blurOut")
		    		  .attr('mode', 'normal')
	  }
	}
	
	return radarChart

})