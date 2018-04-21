/*
 * @Author: zhanghongqiao
 * @Date:   2016-12-27
 * @description：刑事拘留类数据
 * @File Name: alarm.js
 */

define(function(require) {
	require('../canvas1')
	require('../lib/d3.v3.min')
	var common = require('./common')
	var pieChart = require('./pieChart')
	var warningCondition = require("./rightTop01")
	var Bar = require("./rightTop01Bar")
	var ladderLines = require("./ladderLines")
	var year = window.global.getCookie("year")
	var month = window.global.getCookie("month")
	var week = window.global.getCookie("week")
 var dataUrl = './data/deten2017.json' 
	// var dataUrl = window.global.baseUrl+"/hy-radarmap/deten"
	var deten = {
		sentAjax: function() {
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
				type: "get",
				url: dataUrl,
				data:ajaxData,
				success: function(data) {
					if (!data.state) {
						alert('数据异常')
						return false
					}
					var raderData = data.data.radarMap   //雷达图
					var pieData = data.data.radarMap[0].type  //画饼图
					var rankData = data.data.ranking
/*					var textListData = data.data.textList*/
					var ladderLinesData = data.data.criminalCustodyTrend
/*					var countData = {
						total: data.data.count.total,
						falg: data.data.count.falg,
						name: '刑拘总数',
						scale:data.data.count.rate
					}*/
					var mark = data.data.mark
					if(mark){//实时数据
						common.leftWarning(data.data.bjTooltip, data.data.yjTooltip)
					}else{
						var countData = {
						total: data.data.count.total,
						falg: data.data.count.flag,
						name: '刑事拘留人数',
						scale:data.data.count.rate
						}
						common.totalCount(countData)
						_self.renderType(data.data)  
					}
					_self.raderDraw(raderData, mark)
/*					_self.renderType(data.data)*/
/*					common.totalCount(countData)*/
					pieChart.getData('policeCases-pieChart', pieData,"deten")
/*					warningCondition.initWarning(textListData)*/
					Bar.init(rankData,5)
					ladderLines.init('ladderLineChart', ladderLinesData,year,month,week)

				}
			})
		},

		//绘制雷达图
		raderDraw: function(data, mark) {

			var options = {
				container: '#radarChart',
				classname: 'raderChart',
				radius: 6,
				radiusZoom: 3, //半径缩放
				zoom: 200, //雷达图缩放
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
				cxArr: [0, -0.951, -0.587, 0.587, 0.957], //取角cos值，
				cyArr: [-1, -0.309, 0.809, 0.809, -0.309], //取角的sin值
				typeName: ['盗窃', '伤害', '诈骗', '抢夺抢劫', '其他'],
				mark: mark
			}
			common.radarDraw(options, data)
			var nav = $(document).find('.nav')
			nav.eq(0).css({
				'left': '470px',
				'top': '40px'
			})
			nav.eq(1).css('left', '-55px')
			nav.eq(2).css({
				'left': '80px'
			})
			nav.eq(3).css('left', '900px')


		},

		renderType: function(data) {
			var options = {
				container: '.leftBot',
			}
			common.typeCount(options, data)
		},

		legend: function() {
			$('#yearS span').text(year + '年')
			$('#yearE span').text((year - 1) + '年')
			var legendW = $('#legend').width()
			$('.legend').css('left', (1200 - legendW) / 2)
		},

		init: function() {
			this.sentAjax()
			this.legend()
		}
	}

	return deten
})
