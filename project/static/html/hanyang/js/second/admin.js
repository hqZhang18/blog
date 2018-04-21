/*
* @Author: zhanghongqiao
* @Date:   2016-12-27
* @description：治安行政类数据
* @File Name: admin.js
*/

define(function(require) {
	require('../canvas1')
	require('../lib/d3.v3.min')
	var common = require('./common')
	var warningCondition = require("./rightTop01")
	var rightBar = require('./rightBar')
	var line02 = require('./ladderLines2')
	var year = window.global.getCookie("year")
 var dataUrl = './data/admin2017.json' 
	// var dataUrl = window.global.baseUrl+"/hy-radarmap/admin"
	var admin = {
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
						return false
					}
					var raderData = data.data.radarMap
					var pieData = data.data.typeValue
					var rankData = data.data.ranking
					var textListData = data.data.textList
					var url = data.data.url    //领导批示跳转
					var mark = data.data.mark
					if(mark){//实时数据
						common.leftWarning(data.data.bjTooltip, data.data.yjTooltip)
					}else{
						var countData = {
						total: data.data.count.total,
						falg: data.data.count.flag,
						name: '治安行政人数',
						scale:data.data.count.rate
						}
						common.totalCount(countData)
						_self.renderType(data.data)  
					}
					_self.raderDraw(raderData, mark)
/*					_self.renderType(data.data)*/
/*					common.totalCount(countData)*/
					warningCondition.initWarning(textListData,url,"05")
					_self.ranking(rankData)
					line02.init(data.data.trend)

					
				}
			})	
		},



		//各排出所案件排名
    ranking: function(data){

      var cfg = {
        container: '#bar',
        width: 500,
        height:225,
        padding:{
          left: 45,
          bottom: 60,
          top:20
        },
        barWidth: 12,
        lineColor: '#2c668e',
        color: ['#49aefe', '#9936e8', '#86e5f7', '#9936e8'],
        separate: 6, //两种颜色区分
        baseValue: 0
      }
      rightBar.init(cfg, data)
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
			 	color: ['#fbe84c', '#10fdb0'],
			 	color2: ['#51b3fd', '#df331f', '#8d3bf7', '#6be35e', '#4badf6'],
			 	navW: 215,
			 	navH: 60,
			  cxArr: [0,-0.951,-0.587,0.587,0.957],   //取角cos值，
				cyArr: [-1,-0.309,0.809,0.809,-0.309],   //取角的sin值
 
  			typeName: ['黄赌毒', '殴打他人', '盗窃', '诈骗', '其他'],
  			mark: mark
			}
			common.radarDraw(options, data)
 			var nav = $(document).find('.nav')
			nav.eq(0).css({'left':'470px', 'top': '40px'})
			nav.eq(1).css('left','-55px')
			nav.eq(2).css({'left':'80px'})
			nav.eq(3).css('left','900px')
			
			
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
	
	return admin
})