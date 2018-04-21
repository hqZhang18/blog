/*
* @Author: zhq
* @Date:   2016-12-27
* @description：二级页面公共JS
* @File Name: common.js
*/
define(function(require) {

	var radarMain = ''
	var yujingData = {
		admin:[],
		qj:[], 
		pa:[], 
		penal:[],
		jingq: []
	}
			var timer = []
			//图片缩放
			var sValue = 0.5
			var lValue = 1
			var allType = []
			var maxValue = 0
			var warTooltip = d3.select('.warTooltip')
			var notesTooltip = d3.select('.notesTooltip')
			var yujTooltip = d3.select('.yujTooltip')
			var total = 0
		  var data = []
		  var radarRadius = 0			//其他五类半径
		  var cfg = ''

			var typeName = ['警情', '治安行政', '强戒', '破案', '刑事拘留',]
			var notes = ['刑事+治安警情 ', '行政拘留人数', '强制隔离戒毒人数', '破案绝对数', '刑事拘留人数']
	var common = {
		//页面缩放

	totalCount: function(data){
		var falg = data.falg
		if(falg){
			$('.icon_up').attr('class', 'icon_down')
		}
		$('.countName').html(data.name)
		$('.total1').html(data.total)
	},
	typeCount: function(cfg, data){
		var container = cfg.container
		//警情
		var names = ['最低', '中心城区平均', '近三年分局平均', '去年', '当前', '最高']
		var jqData = data.typeValue[0]
		var typeData = data.typeValue
		
		var typeScale = []
		var len = typeData.length
		//同比
		for(var i = 0; i<len; i++){
			var mark = typeData[i].mark
			if(!mark){
				var icon = 'up'
			}else{
				var icon = 'down'
			}
			var scale = '<div class="title">'+typeData[i].name+'</div>'
					+'<div class="ratio">'
					+'<span>同比</span><b>'+typeData[i].scale+'%</b>'		
					+'<i class='+icon+'></i>'
					+'</div>'
			typeScale.push(scale)
		}


		      //对数组进行从小到大排序
      var riseData = function(data){
          return data.sort(function(a,b){
              return a-b
          })
      }
      //对将要排序的数组进行变量存储，防止对数组排序后，影响其原来数组的顺序，（变量类型和引用类型）
      var lastData = function(data){
          var Arr = new Array()
          data.forEach(function(item){
            Arr.push(item)
          }) 
          return Arr
      }
      /**
       * 获取元素在数组中的位置
       * @param  {[number]} item [传入的元素，并获取该元素的位置]
       * @param  {[number]} init [数组从哪个点开始循环]
       * @param  {[array]} data [数组数据]
       * @return {[number]}      [item在data中位置]
       */
      var getPosition = function(init,item,data){
          var len = data.length
          for (var i = init; i < len; i++) {
            if (item == data[i]) {
              return i
            }
          }
      }

		
		
	var typeStr = []
		//类型值
      for (var i = 0 ;i < len; i++) {
      	var m = -1 
        var savePosition = []   //存放位置的数组
        var typeVal = typeData[i].values
        var arr = lastData(typeVal)     //原来的数据
        var sortData = riseData(typeVal)//从小到大的排序后的顺序
        var str = ''
        for (var j = 0, len2 = sortData.length; j < len2; j++) {
          /*
          *如果两次获取的位置一样，就从此位置的下一个位置开始，再次循环一次获取位置
          *example 
          *第一次getPosition(0,5,[1,5,6,3,5]) ==>>1        k=1,m=1
          *第二次getPosition(0,5,[1,5,6,3,5]) ==>>1  因为第一次的k与第二次的值一样，所以在执行一次获取位置的getPosition(2,5,[1,5,6,3,5]) ==>>4
          */
          var k = getPosition(0,sortData[j],arr)
          if ($.inArray(k,savePosition)>-1) {
             var start = m+1
             k = getPosition(start,sortData[j],arr)
          }
          m = k
          savePosition.push(k)
          //当前年底部小图标
          var botIcon = ''
          if (k == 4) {
            botIcon = '<div class="botIcon"></div>'
          }
          str += '<div class="valueCont color' + (k + 1) + '">'
              + '<div class="line"></div>'
              + '<div class="rect"></div>'
              + '<div class="value">'
              + '<p>' + names[k] + '</p>'
              + '<p>' + sortData[j] + '</p>'
              + '</div>'
              + '' + botIcon + ''
              + '</div>'
        }
        typeStr.push(str)
      }

		var html = ''
		for(var i = 0; i<len; i++){
			html += '<div class="typeValue">'
					+ ''+typeScale[i]+''
					+ '<div class="valueBox">'+typeStr[i]+'</div>'
					+ '</div>'
		}
		$(container).html(html)
	},
		
		//雷达图
	radarDraw: function(cfg, d){
		cfg = cfg
		var id = cfg.container
	  var data = []
	  var radarRadius = 0			//其他五类半径

	var typeName = cfg.typeName
	var notes = ['刑事+治安警情 ', '行政拘留人数', '强制隔离戒毒人数', '破案绝对数', '刑事拘留人数']
	  //处理多边形数据
	  var data2 = [9,7.5,8,8,7.6]
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
  	var len = yearData[0].length
  	for(var i=0; i<len; i++){
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
		var maxRange = cfg.w/2 -150
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
				.attr("width", cfg.w)
				.attr("height", cfg.w)
				.attr('class', 'svg')
				.attr('font-family', '微软雅黑')
				.append("g")
				.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")")
				
		//Tooltip
		d3.select('.tooltip').remove()
		var tooltip = d3.select('#radarChart').append('div')
					.attr('class', 'tooltip')
		var _self = this
		//滤镜
	  _self.filter()

   //其他四个圆
   	radarMain.selectAll(".circle")
	 	  .data(circleData)
    	.enter()
      .append("circle")
      .attr("cx",cx)
      .attr("cy",cy)
      .attr("r",function(d,i){
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
	    })

		var timer = {}
		series = 0;

		//添加导航
		d3.selectAll('.nav').remove()
		d3.select('.radar-wrap')
		.selectAll('nav')
		.data(yearData[0])
		.enter()
		.append('div')
		.attr('class', function(d,i){
			var tt = d.tooltip.length
			var saveyjData = []
			if(i==0){
				saveyjData = yujingData.jingq 
			}
			if(i==1){
				saveyjData = yujingData.admin
			}
			if(i==2){
				saveyjData = yujingData.qj
			}
			if(i==3){
				saveyjData = yujingData.pa
			}
			if(i==4){
				saveyjData = yujingData.penal
			}
		  var classs = 'nav'
			if(tt!=0){
			  classs = 'nav bjBg'
			}
			if(saveyjData.length != 0){

				classs = 'nav yjBg'
			}
			if(tt!=0 && saveyjData.length!=0){
				classs = 'nav bjyjBg'
			}
			return classs
		})
			.html(function(d,i){
				return d.typeName
			})
			.style('left', function(d, i){
				
				var left = cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-30*Math.sin(i*cfg.radians/total) - 120
				if(left<cfg.w/2){
					left = left-270
				}else{
					left = left + 65
				}
				if(i==0){
					left = 390
				}
				return (left+210)+'px'
			})
			.style('top', function(d, i){
				var top = cfg.h/2*(1-Math.cos(i*cfg.radians/total))-40*Math.cos(i*cfg.radians/total)
				if(i==0){
					top = -110
				}
				return (top+139)+'px'
			})
			.style('opacity', function(d,i){
				var self = d3.select(this)
				var tt = d.tooltip.length
				var saveyjData = []
				if(i==0){
					saveyjData = yujingData.jingq
				}
				if(i==1){
					saveyjData = yujingData.admin
				}
				if(i==2){
					saveyjData = yujingData.qj
				}
				if(i==3){
					saveyjData = yujingData.pa
				}
				if(i==4){
					saveyjData = yujingData.penal
				}
				if(tt!=0 || saveyjData.length!=0){
					timer[i] = setInterval(function(){
						self.transition()
						.duration(500)
						.ease('out')
					.style('opacity', 0.3)
						.transition()
						.duration(500)
						.ease('out')
						.style('opacity',1)
		  		},1000)
				}
				return 1
			})
			.on('mouseover', function(d,i){
				//_self.notesTooltip(d,i)
			})
			.on('mouseout', function(d,i){
				//notesTooltip.style('display', 'none')
			})
			.on('click', function(d,i){
				_self.tooltip(d,i,yujingData)
			})

		

  var cxArr = cfg.cxArr   //取角cos值，
  var cyArr = cfg.cyArr   //取角的sin值

  var thisPoint = "" 
  var lastPoint = ""
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
					
					
					warData = []
				 	warData = d.tooltip
				
						//提示框x,y位置
						newX =  parseFloat(d3.select(this).attr('cx')) + 20 ;
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
	
  },
  
  //雷达提示框
  notesTooltip:function(d,i){
  	var left = cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-30*Math.sin(i*cfg.radians/total)  
				var top = cfg.h/2*(1-Math.cos(i*cfg.radians/total))-40*Math.cos(i*cfg.radians/total)
				if(left<cfg.w/2){
					left = left - 60
				}else{
					left = left + 275
				}
				if(i==0){
					left = 810
					top = top-12
				}
				notesTooltip.style('display', 'block')
					.html(d.notes)
					.style('left', (left+500) + 'px')
					.style('top', (top+80) + 'px')
  },
  
  //报警预警提示
  tooltip: function(d,i,yujingData){
  	notesTooltip.style('display', 'none')
				warTooltip.style('display', 'none')
				yujTooltip.style('display', 'none')
				var left2 = cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-30*Math.sin(i*cfg.radians/total)  
				var top2 = cfg.h/3*(1-Math.cos(i*cfg.radians/total))-40*Math.cos(i*cfg.radians/total)
				if(left2<cfg.w/2){
					left2 = left2 - 160
				}else{
					left2 = left2 + 275
				}
				if(i==0){
					left2 = 390
					left2 = -110
					top2 = top2 + 20
				}
				if(i==3){
					left2 = left2 + 150
					top2 = top2 +160
					
				}
				//报警
				warData = []
				warData = d.tooltip
				var txtList = ''
				if(warData!==undefined && warData.length!=0){
					for(var i2 = 0;i2<warData.length; i2++){
						var warTxt = warData[i2].warning
						var proposal = warData[i2].proposal
						txtList += '<p><b>报警：</b>'+warTxt+'</p><p><b>工作建议：</b>'+proposal+'</p>'
					}
					var close = '<div class="closeWar" id="closeId1">X</div>'
					var left3
					var bottom

					if (i==0) {
						left3 = left2 + 204
						bottom = top2 + 1090
					}
					if (i==1) {
						left3 = left2 + 60
						bottom = top2 + 593
					}
					if (i==2) {
						left3 = left2 - 100
						bottom = top2 - 325
					}
					if (i==3) {
						left3 = left2 - 50
						bottom = top2 - 485
					}
					if (i==4) {
						left3 = left2 - 70
						bottom = top2 + 593
					}

					warTooltip.style('display','block')
						.html('<div class="warCont1">'+txtList+'<div>'+close+'')
						.style('left', left3 + 'px')
						.style('bottom',  bottom + 'px')
						.style('width', '300px')
				}
				
				//预警数据
				var yujingHeight
				var saveyjData = []
				if(i==0){
					saveyjData = yujingData.jingq
					left2 = left2 + 1114
					yujingHeight = 300
				}
				if(i==1){
					saveyjData = yujingData.admin
					left2 = left2 + 130
					top2 = top2 +300
					yujingHeight = 300
				}
				if(i==2){
					saveyjData = yujingData.qj
					left2 = left2 - 20
					top2 = top2 + 464
					yujingHeight = 143
				}
				if(i==3){
					saveyjData = yujingData.pa
					top2 = top2 + 310
					left2 = left2 + 20
					yujingHeight = 143
				}
				if(i==4){
					saveyjData = yujingData.penal
					top2 = top2 + 300
					yujingHeight = 300
				}
				var txtList2 = ''
				if(saveyjData.length!=0){
					for(var i3 = 0;i3<saveyjData.length; i3++){
						var yjTxt = saveyjData[i3].forecast
						var yjproposal = saveyjData[i3].advise
						txtList2 += '<p><b>预测：</b>'+yjTxt+'</p><p><b>工作建议：</b>'+yjproposal+'</p>'
					}
					var close2 = '<div class="closeWar" id="closeId2">X</div>'	
					yujTooltip.style('display','block')
						.html('<div class="warCont2">'+txtList2+'</div>'+close2+'')
						.style('left', (left2-70) + 'px')
						.style('top', (top2-20) + 'px')
						.style('width', '300px')
						.style('max-height',yujingHeight+'px')
					d3.select('.warCont2')
						.style('max-height',yujingHeight+'px')
				}
  },
	//雷达图滤镜高斯模糊
  filter: function(){
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
	    		  
	    		  
	  //全市平均模糊
		var filter = radarMain.append("defs").append("filter")
        			.attr("id", "gaussinaBlur2")
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
  },

	//雷达图旋转 兼容ie9
	rotate1: function(){
		var angle = 0;
		setInterval(function(){
	    angle +=1;
	    $('#rotate').rotate(angle);
		}, 180);
	},
		
		init: function(){
			var self = this
			
			self.rotate1()
			
		}

	}

	common.init()
	return common
})
