
define(function(require,exports,module){
var initEchart = require("initEchart")
var echartConfig = require("configChartSeries")
//实例化图表
var RFirstEcharts = echarts.init(document.getElementById('firstEcharts'))
var RSecondEcarts = echarts.init(document.getElementById('secondEcarts'))
var RThirdEcharts = echarts.init(document.getElementById('thirdEcharts'))
var option = [initEchart.RFirstOption, initEchart.RSecondOption, initEchart.RThirdOption]
var time //用于计时
var time1 //用于计时
var time2 //用于计时
var RsecondData //全局存储右侧第二折线图数据
var RThirdData //全局存储右侧第三个折线图数据
var switchTime2 = true //用于每隔5s切换
var switchTime3 = true //用于每隔5s切换
var mark ;//标示是否为历史或者实时数据
var thisYearName = [];//今年的日期
var lastYearName = [];//去年的日期
/**
 * 初始化右边图表函数
 * @param {[json]} data [初始化图表所需要的数据]
 */
var setEcharts = function (data,year,month) {
	this.year = year
	this.month = month
	$(".switchEcharts").eq(0).children("p").eq(1).removeClass("switchTitle01 switchTitle02").addClass("switchTitle02")
    $(".switchEcharts").eq(0).children("p").eq(0).removeClass("switchTitle01 switchTitle02").addClass("switchTitle01")	
	$(".switchEcharts").eq(1).children("p").eq(1).removeClass("switchTitle01 switchTitle02").addClass("switchTitle02")
    $(".switchEcharts").eq(1).children("p").eq(0).removeClass("switchTitle01 switchTitle02").addClass("switchTitle01")
     clearInterval(time)  
     clearInterval(time1)
     clearInterval(time2) 
     switchTime2 = true  
     mark = data.mark
    var RFirstData = data.warningConditionTime
    RsecondData = data.administrative
    RThirdData = data.solveCase
    setFirstChart(RFirstData)
    setScondChart(RsecondData, true)
    setThirdChart(RThirdData, true)
    //设置定时器，每隔5s图表切换一次
    switchEcharts(RsecondData, RThirdData)
} 
/**
 * 当点击月份的时候，重新设置鼠标移到图表的提示框,动态的配置echarts配置表
 * @param  {[json]} data  [显示日期的提示框]
 * @param  {[number]} index [三个图表的序号0,1,2]
 * @return {[""]}       [配置好的echarts]
 */
var monthTooltip = function(data,index){
		option[index].xAxis.axisLabel = {
			textStyle:{
				fontSize:12,
				color:"#caccd2"
			}
		}
		option[index].tooltip = {
			 trigger: 'axis',
			 axisPointer: {
           			 type: 'line'
			 },
			 textStyle: {
	            fontSize: 14
	        },
		}
	//历史的时候点击月份
	if (this.month!==""&&!mark) {
		for (var i = 0; i < data.length; i++) {
			thisYearName[i] = data[i].thisYearName;
			lastYearName[i] = data[i].lastYearName;
		}
		option[index].tooltip = {
			 trigger: 'axis',
			 axisPointer: {
           			 type: 'line'
			 },
			 textStyle: {
	            fontSize: 14
	        },
			formatter:function(params){
				if (params.length==3) {
					return thisYearName[params[0].dataIndex]+":"+params[0].value+"</br>"+lastYearName[params[1].dataIndex]+":"+params[1].value+"</br>"+"平均:"+params[2].value
				}
				//今年跟去年
				if(params.length==2&&params[0].seriesName==this.year&&params[1].seriesName==(this.year-1)){
					return thisYearName[params[0].dataIndex]+":"+params[0].value+"</br>"+lastYearName[params[1].dataIndex]+":"+params[1].value
				}
				//今年跟平均
				if(params.length==2&&params[0].seriesName==this.year&&params[1].seriesName=="平均"){
					return thisYearName[params[0].dataIndex]+":"+params[0].value+"</br>"+"平均:"+params[1].value
				}
				//去年跟平均
				if(params.length==2&&params[0].seriesName==(this.year-1)&&params[1].seriesName=="平均"){
					return lastYearName[params[0].dataIndex]+":"+params[0].value+"</br>"+"平均:"+params[1].value
				}
				//今年
				if (params.length==1&&params[0].seriesName==this.year) {
					return thisYearName[params[0].dataIndex]+":"+params[0].value
				}
				//去年
				if (params.length==1&&params[0].seriesName==(this.year-1)) {
					return lastYearName[params[0].dataIndex]+":"+params[0].value
				};
				//平均
				if (params.length==1&&params[0].seriesName=="平均") {
					return "平均:"+params[0].value
				};
			}
		} 
		//实时的时候点击月份
	}else if(this.month!==""&&mark){
		option[index].tooltip = {
			 trigger: 'axis',
			 axisPointer: {
           			 type: 'line'
			 },
			 textStyle: {
	            fontSize: 14
	        },
		}
		option[index].xAxis.axisLabel = {
			textStyle:{
				fontSize:12,
				color:"#caccd2"
			},
			formatter:function(value,index){
				return value.substring(6,8)
			}
		}
	}
}



/**
 * 渲染右侧第一个图表
 * @param {[json]} RFirst [渲染需要的数据]
 */
function setFirstChart (RFirstData) {
	console.info(this.month=="")
	RFirstEcharts.clear()
	option[0].series = []
	var arrMax = 0
	var series = []
	if (mark) {
		var name = [];
		var value1 = [];//实时
		var value2 = []; //预测
		for (var i = 0; i < RFirstData.length; i++) {
			name[i] = RFirstData[i].name;
			value1[i] = RFirstData[i].timeValue;
			value2[i] = RFirstData[i].forecastValue;
		}
		echartConfig.series1[0].name = "实时线";
		echartConfig.series1[0].data = value1;
		echartConfig.series1[1].name = "预测线";
		echartConfig.series1[1].data = value2;
		option[0].xAxis.data = name
		option[0].legend.data = ["实时线","预测线"]
		option[0].series[0] = echartConfig.series1[0]
		option[0].series[1] = echartConfig.series1[1]
		arrMax = Math.max.apply(null,[Math.max.apply(null,value1),Math.max.apply(null,value2)])
	}else{
		var name = []
		var value1 = [];//当前
		var value2 = []; //历史
		var value3 = []; //平均
		for (var i = 0; i < RFirstData.length; i++) {
			name[i] = RFirstData[i].name;
			value1[i] = RFirstData[i].thisYear;
			value2[i] = RFirstData[i].lastYear;
			value3[i] = RFirstData[i].average;
		}
		monthTooltip(RFirstData,0)
		echartConfig.series1[0].name = this.year;
		echartConfig.series1[0].data = value1;
		echartConfig.series1[1].name = (this.year-1).toString();
		echartConfig.series1[1].data = value2;	
		echartConfig.series1[2].name = "平均";
		echartConfig.series1[2].data = value3;
		option[0].xAxis.data = name
		option[0].legend.data = [this.year,(this.year-1).toString(),"平均"]
		option[0].series[0] = echartConfig.series1[0]
		option[0].series[1] = echartConfig.series1[1]
		option[0].series[2] = echartConfig.series1[2]
		arrMax = Math.max.apply(null,[Math.max.apply(null,value1),Math.max.apply(null,value2),Math.max.apply(null,value3)])
	}
	if (arrMax<4) {
		option[0].yAxis[0].max = 4
	}else{
		option[0].yAxis[0].max = 'auto'
	}
	monthTooltip(RFirstData,0)
	RFirstEcharts.setOption(option[0])
}

/**
 * 渲染右侧第二图表
 * @param {[json]} option [echarts配置项]
 * @param {[object]} charts [实例化的echarts]
 * @param {[json]} data   [展示到图表数据]
 */
var setScondChart = function (RsecondData, index) {
    RSecondEcarts.clear()
	option[1].series = []
	if (mark) {
		var name = [];
		var value1 = [];//实时
		var value2 = []; //预测
		if (index) {
			for (var i = 0; i < RsecondData.length; i++) {
				name[i] = RsecondData[i].name;
				value1[i] = RsecondData[i].penalTimeValue;
				value2[i] = RsecondData[i].penalForecastValue;
			}
		}else{
			for (var i = 0; i < RsecondData.length; i++) {
				name[i] = RsecondData[i].name;
				value1[i] = RsecondData[i].adminTimeValue;
				value2[i] = RsecondData[i].adminForecastValue;
			}
		}
		echartConfig.series2[0].name = "实时线";
		echartConfig.series2[0].data = value1;
		echartConfig.series2[1].name = "预测线";
		echartConfig.series2[1].data = value2;
		option[1].xAxis.data = name;
		option[1].legend.data = ["实时线","预测线"]
		option[1].series[0] = echartConfig.series2[0];
		option[1].series[1] = echartConfig.series2[1];
		arrMax = Math.max.apply(null,[Math.max.apply(null,value1),Math.max.apply(null,value2)])
	}else{
		var name = []
		var value1 = [];//当前
		var value2 = []; //历史
		var value3 = []; //平均
		if (index) {
			for (var i = 0; i < RsecondData.length; i++) {
				name[i] = RsecondData[i].name;
				value1[i] = RsecondData[i].penalThisYear;
				value2[i] = RsecondData[i].penalLastYear;
				value3[i] = RsecondData[i].penalaAverage;
			}
		}else{
			for (var i = 0; i < RsecondData.length; i++) {
				name[i] = RsecondData[i].name;
				value1[i] = RsecondData[i].adminThisYear;
				value2[i] = RsecondData[i].adminLastYear;
				value3[i] = RsecondData[i].adminAverage;
			}
		}
		monthTooltip(RsecondData,1)
		echartConfig.series2[0].name = this.year;
		echartConfig.series2[0].data = value1;
		echartConfig.series2[1].name = (this.year-1).toString();
		echartConfig.series2[1].data = value2;
		echartConfig.series2[2].name = "平均";
		echartConfig.series2[2].data = value3;
		option[1].xAxis.data = name;
		option[1].legend.data = [this.year,(this.year-1).toString(),"平均"]
		option[1].series[0] = echartConfig.series2[0];
		option[1].series[1] = echartConfig.series2[1];
		option[1].series[2] = echartConfig.series2[2];
		arrMax = Math.max.apply(null,[Math.max.apply(null,value1),Math.max.apply(null,value2),Math.max.apply(null,value3)])
	}
	if (arrMax<4) {
		option[1].yAxis.max = 4
	}else{
		option[1].yAxis.max = 'auto'
	}
	monthTooltip(RsecondData,1)
 	RSecondEcarts.setOption(option[1])
}
/**
 * 渲染右侧第三图表
 * @param {[json]} option [echarts配置项]
 * @param {[object]} charts [实例化的echarts]
 * @param {[json]} data   [展示到图表数据]
 */
var setThirdChart = function (RThirdData, index) {
    RThirdEcharts.clear()
	option[2].series = []
	if (mark) {
		var name = [];
		var value1 = [];//实时
		var value2 = []; //预测
		if (index) {
			for (var i = 0; i < RThirdData.length; i++) {
				name[i] = RThirdData[i].name;
				value1[i] = RThirdData[i].patimeValue;
				value2[i] = RThirdData[i].paforecastValue;
			}
		}else{
			for (var i = 0; i < RThirdData.length; i++) {
				name[i] = RThirdData[i].name;
				value1[i] = RThirdData[i].qjtimeValue;
				value2[i] = RThirdData[i].qjforecastValue;
			}
		}
		echartConfig.series3[0].name = "实时线";
		echartConfig.series3[0].data = value1;
		echartConfig.series3[1].name = "预测线";
		echartConfig.series3[1].data = value2;
		option[2].xAxis.data = name;
		option[2].legend.data = ["实时线","预测线"]
		option[2].series[0] = echartConfig.series3[0];
		option[2].series[1] = echartConfig.series3[1];
		arrMax = Math.max.apply(null,[Math.max.apply(null,value1),Math.max.apply(null,value2)])
	}else{
		var name = []
		var value1 = [];//当前
		var value2 = []; //历史
		var value3 = []; //平均
		if (index) {
			for (var i = 0; i < RThirdData.length; i++) {
				name[i] = RThirdData[i].name;
				value1[i] = RThirdData[i].pathisYear;
				value2[i] = RThirdData[i].palastYear;
				value3[i] = RThirdData[i].paaAverage;
			}
		}else{
			for (var i = 0; i < RThirdData.length; i++) {
				name[i] = RThirdData[i].name;
				value1[i] = RThirdData[i].qjthisYear;
				value2[i] = RThirdData[i].qjlastYear;
				value3[i] = RThirdData[i].qjaverage;
			}
		}
		monthTooltip(RThirdData,2)
		echartConfig.series3[0].name = this.year;
		echartConfig.series3[0].data = value1;
		echartConfig.series3[1].name = (this.year-1).toString();
		echartConfig.series3[1].data = value2;
		echartConfig.series3[2].name = "平均";
		echartConfig.series3[2].data = value3;
		option[2].xAxis.data = name;
		option[2].legend.data = [this.year,(this.year-1).toString(),"平均"]
		option[2].series[0] = echartConfig.series3[0];
		option[2].series[1] = echartConfig.series3[1];
		option[2].series[2] = echartConfig.series3[2];
		arrMax = Math.max.apply(null,[Math.max.apply(null,value1),Math.max.apply(null,value2),Math.max.apply(null,value3)])
	}
	if (arrMax<4) {
		option[2].yAxis[0].max = 4
	}else{
		option[2].yAxis[0].max = 'auto'
	}
	monthTooltip(RThirdData,2)
	RThirdEcharts.setOption(option[2])
}
//设置定时器，每隔5s切换统计类别
var switchEcharts = function (RsecondData, RThirdData) {
    time1 = setInterval(function () {
        switchTime2 = !switchTime2
		switcher2(RsecondData,switchTime2)
    }, 5000)

    time2 = setInterval(function () {
        switchTime3 = !switchTime3
		switcher3(RThirdData,switchTime3)
    }, 5000)


}
/*
 *鼠标移到图表上清除图表切换
 */
$("#second").mouseover(function () {
/*    clearInterval(time)*/
    clearInterval(time1)
/*    clearInterval(time2)*/

})
/*
 *鼠标移到图表上清除图表切换
 */
$("#third").mouseover(function () {
 /*   clearInterval(time)*/
/*    clearInterval(time1)*/
    clearInterval(time2)
})
/*
 *鼠标移开图表上图表切换
 */
$("#second").mouseout(function () {
    time1 = setInterval(function () {
        switchTime2 = !switchTime2
		switcher2(RsecondData,switchTime2)
    }, 5000)
})
/*
 *鼠标移开图表上图表切换
 */
$("#third").mouseout(function () {
    time2 = setInterval(function () {
        switchTime3 = !switchTime3
		switcher3(RThirdData,switchTime3)
    }, 5000)
})

/*点击刑事拘留
*/
$(".second_01").click(function(){
	switchTime2 = true
	switcher2(RsecondData,switchTime2)
})
/*治安行政
*/
$(".second_02").click(function(){
	switchTime2 =false
	switcher2(RsecondData,switchTime2)
})
/*
破案
 */
$(".third_01").click(function(){
	switchTime3 = true
	switcher3(RThirdData,switchTime3)
})
/*
强戒
 */
$(".third_02").click(function(){
	switchTime3 = false
	switcher3(RThirdData,switchTime3)
})

//每隔5s切换
var switcher2 = function(RsecondData,bool){
	$(".switchEcharts").eq(0).children("p").removeClass("switchTitle01 switchTitle02")
    if (bool) {
		$(".switchEcharts").eq(0).children("p").eq(1).addClass("switchTitle02")
        $(".switchEcharts").eq(0).children("p").eq(0).addClass("switchTitle01")	
    } else {
		$(".switchEcharts").eq(0).children("p").eq(0).addClass("switchTitle02")
        $(".switchEcharts").eq(0).children("p").eq(1).addClass("switchTitle01")	
    }
	setScondChart(RsecondData, bool)
}

//每隔5s切换
var switcher3 = function(RThirdData,bool){
	$(".switchEcharts").eq(1).children("p").removeClass("switchTitle01 switchTitle02")
    if (bool) {
		$(".switchEcharts").eq(1).children("p").eq(1).addClass("switchTitle02")
        $(".switchEcharts").eq(1).children("p").eq(0).addClass("switchTitle01")
    } else {
		$(".switchEcharts").eq(1).children("p").eq(0).addClass("switchTitle02")
        $(".switchEcharts").eq(1).children("p").eq(1).addClass("switchTitle01")
    }
	setThirdChart(RThirdData, bool)
}
 return setEcharts

})
