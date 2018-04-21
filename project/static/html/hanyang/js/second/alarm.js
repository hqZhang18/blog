/*
* @Author: zhanghongqiao
* @Date:   2016-12-27
* @description：警情类数据
* @File Name: alarm.js
*/

define(function(require) {
	require('../canvas1')
	require('../lib/d3.v3.min')
	
	var common = require('./common')
	console.log(common);
	var pieChart = require('./pieChart')
	var warningCondition = require("./rightTop01")
	var Bar = require("./rightTop01Bar")

	var year = window.global.getCookie("year")
	var dataUrl = window.global.baseUrl+"/hy-radarmap/alarm"
 var dataUrl = './data/alarm2017.json'  
	var alarm = {
		sentAjax: function(){
			if (year==undefined||year==null||year=="") {
				window.location.href = "index.html"
			};
			var ajaxData = {
				year:window.global.getCookie("year"),
				quarter:window.global.getCookie("quarter"),
				month:window.global.getCookie("month"),
				week:window.global.getCookie("week")
			}
			var _self = this
			$.ajax({
				type:"get",
				url:dataUrl,
				data:ajaxData,
				success: function(data){
					if(!data.state){
						alert('数据异常')
/*						return false*/
					}
					var raderData = data.data.radarMap //雷达图
					var pieData = data.data.radarMap[0].type  //画饼图
					var rankData = data.data.ranking   //柱状图
					var textListData = data.data.textList //重大警情
					var url = data.data.url    //领导批示跳转
					var mark = data.data.mark
					if(mark){//实时数据
						common.leftWarning(data.data.bjTooltip, data.data.yjTooltip)
					}else{
						var countData = {
						total: data.data.count.total,
						falg: data.data.count.flag,
						name: '警情总数',
						scale:data.data.count.rate
						}
						common.totalCount(countData)
						_self.renderType(data.data)  
					}
					_self.raderDraw(raderData, mark)  //雷达图
					pieChart.getData('policeCases-pieChart', pieData,"alarm")  //玫瑰图
					warningCondition.initWarning(textListData,url,"02")    //重大警情
					Bar.init(rankData,4)
					
				}
			})	
		},
		
		//绘制雷达图
		raderDraw: function(data, mark){

			var options = {
				container: '#radarChart',
				classname: 'raderChart',
				radius: 6,
			 	radiusZoom: 3, //半径缩放
			 	zoom: 200,  //雷达图缩放
			 	w: 920,
				h: 820,
			 	factor: 1,
			 	factorLegend: .85,
			 	levels: 1,
			 	maxValue: 0,
			 	radians: 2 * Math.PI,
			 	opacityArea: 0,
			 	ToRight: 5,
			 	TranslateX: 69,
			 	TranslateY: 105,
//			 	ExtraWidthX: 280,
//			 	ExtraWidthY: 110,
			 	color: ['#fbe84c', '#10fdb0'],
			 	color2: ['#51b3fd', '#df331f', '#8d3bf7', '#6be35e', '#4badf6'],
			 	navW: 215,
			 	navH: 60,
//			  cxArr: [0,-0.951,-0.587,0.587,0.957],   //取角cos值，
//				cyArr: [-1,-0.309,0.809,0.809,-0.309],   //取角的sin值
  		 	cxArr: [0, -1, 0, 1],   //取角cos值，
  			cyArr: [-1, 0, 1, 0],   //取角的sin值
  			typeName: ['刑事警情', '治安警情', '黄赌毒', '社会'],
  			mark: mark
			}
			common.radarDraw(options, data)
 			var nav = $(document).find('.nav')
			nav.eq(0).css({'left':'470px', 'top': '70px'})
			nav.eq(1).css('left','-55px')
			nav.eq(2).css({'left':'480px', 'top': '1020px'})
			nav.eq(3).css('left','1010px')

		},
		
		renderType: function(data){
			var options = {
				container: '.leftBot',
			}
			common.typeCount(options, data)
		},
		
		legend: function(){
			$('#yearS span').text(year+'年')
			$('#yearE span').text((year-1)+'年')
			var legendW = $('#legend').width()
			$('.legend').css('left',(1200-legendW)/2)
		},
		
		init: function(){
			this.sentAjax()
			this.legend()
		}
	}
	
	return alarm
})