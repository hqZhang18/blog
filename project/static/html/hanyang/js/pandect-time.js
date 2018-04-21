/*
* @Author: tangquankun,
* @Date:   2016-12-26
* @description：警情雷达图总览
*/

define(function(require,exports,module){
    var  radar = require("index.js")
    var initUrl = window.global.baseUrl+"/hy-radarmap/init"
    var initDataUrl =window.global.baseUrl+"/hy-radarmap/pandect"
    var nowYear = ""
    var initUrl = 'data/init.json'
    var initDataUrl = 'data/pandect2017.json'
    /**
     * 获取时间轴的数据
     */
	var initTime = function(index){
		var date = new Date()
		var year = date.getFullYear()
		var month = parseInt(date.getMonth()) + 1
		var day = date.getDate()
		month = month<10?("0"+month):month
		day = day<10?("0"+day):day
		var toDay = year+''+month+''+day
		$.get(initUrl,{date:toDay},function(responseData){
			if (responseData.state) {
				if (index==0) {
					getData(responseData.data.years[0],"","","")
				}else{
					getData(responseData.data.years[0],"","",6)
				}
				nowYear = responseData.data.years[0]
				$(".year").eq(0).children("p").text(responseData.data.years[0]+"年")
				setDate($("#year"),responseData.data.years)
				setDate($("#quarter"),responseData.data.quarter)
			}else{
				alert(responseData.message)
			}
		})
	}
	/**
	 * 点击年、季度、月份弹出下拉框
	 */
	$(".year p").click(function(){
		var _this = $(this) 
		$(".year ul").hide()
		var li = _this.next().show()
	})

	$('.year').on('mouseleave', 'ul', function() {    
        $(this).hide()
    })
	/**
	 * 点击年
	 */
	 $("#year").on("click","li",function(){
	 	$("#month").empty()
	 	var _this = $(this)
	 	_this.parent().prev('p').html(_this.text()+"年")
	 	_this.parent().hide()
	 	$(".year").eq(1).children("p").html("季")
	 	$(".year").eq(2).children("p").html("月")
	 	//设置背景
	 	$(".year").eq(1).children("p").removeClass("bagup").addClass("bagdown")
	 	$(".year").eq(2).children("p").removeClass("bagup").addClass("bagdown")
	 	$(".year").eq(3).children("p").removeClass("bagup").addClass("bagdown")
	 	getData(_this.text(),"","","")
	 })
	 /**
	 * 点击季
	 */
	 $("#quarter").on("click","li",function(){
	 	var _this = $(this)
	 	_this.parent().prev('p').html(_this.text()+"季")
	 	_this.parent().prev('p').removeClass("bagdown").addClass("bagup")
	 	_this.parent().hide()
	 	$(".year").eq(2).children("p").html("月")
	 	$(".year").eq(2).children("p").removeClass("bagup").addClass("bagdown")
	 	$(".year").eq(3).children("p").removeClass("bagup").addClass("bagdown")
	 	var _year = $(".year").eq(0).children("p").text().substring(0,4)
	 	var _quarter = $(".year").eq(1).children("p").text().substring(0,1)
	 	getData(_year,_quarter,"","")
	 })

	 /**
	 * 点击月
	 */
	 $("#month").on("click","li",function(){
	 	var _this = $(this)
	 	_this.parent().prev('p').html(_this.text()+"月")
	 	_this.parent().prev('p').removeClass("bagdown").addClass("bagup")
	 	_this.parent().hide()
	 	$(".year").eq(3).children("p").removeClass("bagup").addClass("bagdown")
	 	var _year = $(".year").eq(0).children("p").text().substring(0,4)
	 	var _quarter = $(".year").eq(1).children("p").text().substring(0,1)
	 	var _month = $(".year").eq(2).children("p").text()
	 	_month = _month.substring(0,_month.length-1)
	 	getData(_year,_quarter,_month,"")
	 })
	 //点击本周
	 $("#week").on("click",function(){
	 	$("#month").empty()
	 	$(this).removeClass("bagdown").addClass("bagup")
	 	$(".year").eq(1).children("p").removeClass("bagup").addClass("bagdown")
	 	$(".year").eq(2).children("p").removeClass("bagup").addClass("bagdown")
	 	$(".year").eq(2).children("p").html("月")
	 	$(".year").eq(1).children("p").html("季")
	 	nowYear = disposeDate("years")[0]
	 	$(".year").eq(0).children("p").html(nowYear+"年")
	 	initTime(1)

	 })

	/**
	 * 渲染年、季度、月份
	 * @param {[string]} dom  [dom元素]
	 * @param {[array]} data [数据]
	 */
	var setDate = function(dom,data){
		$(dom).empty()
		var li=""
		for (var i = 0; i < data.length; i++) {
			    li=li+"<li>"+data[i]+"</li>"
		}
		$(dom).append(li)
	}
	/**
	 * 记录年、季度、月份下面的时间,记录状态
	 * @param {[string]} dom  [dom元素]
	 * @param {[array]} data [数据]
	 */
	var record = function(dom,name){
		var text = ""
		for (var i = 0; i < dom.length; i++) {
			text = text+","+dom.eq(i).text()
		}
		window.global.setCookie(name,text)
	}
	/**
	 * 处理存在cookie的数据
	 * @param  {[string]} data [数据]
	 * @return {[array]}      [处理返回后数据]
	 */
	var disposeDate = function(name){
		var data = window.global.getCookie(name)
		var _data = data.split(",")
			_data.shift()
			return _data
	}
	//判断浏览是初次打开 还是点击返回来的
	var init = function(){
       var year = window.global.getCookie("year")
       var quarter = window.global.getCookie("quarter")
       var month =  window.global.getCookie("month")
       var week =window.global.getCookie("week")
       if (year==undefined||year==null||year=="") {
       		initTime(0)
       }else{
       		$(".year").eq(0).children("p").text(year+"年")
       		setDate($("#year"),disposeDate("years"))
       		setDate($("#quarter"),disposeDate("quarters"))
       		if (quarter==undefined||quarter==null||quarter=="") {
       		}else{
       			$(".year").eq(1).children("p").text(quarter+"季")
       			$(".year").eq(1).children("p").removeClass("bagdown").addClass("bagup")
       		}
       		if (month==undefined||month==null||month=="") {
       		}else{
       			$(".year").eq(2).children("p").text(month+"月")
       			$(".year").eq(2).children("p").removeClass("bagdown").addClass("bagup")
       			setDate($("#month"),disposeDate("months"))
       		}
       		if (week==undefined||week==null||week==""){}else{
       			$(".year").eq(3).children("p").removeClass("bagdown").addClass("bagup")
       		};
       		getData(year,quarter,month,week)
       		
       }
	}
	/**
	 * 从后台获取总览页面所有数据
	 * @param  {[string]} year    [年]
	 * @param  {[string]} quarter [季度]
	 * @param  {[string]} month   [月]
	 */
	var getData = function(year,quarter,month,week){
		$(".loading").show()
		var toDay = {
			year:year,
			quarter:quarter,
			month:month,
			week:week
		}
		//记录时间，方便跳转
		window.global.setCookie("year",year)
		window.global.setCookie("quarter",quarter)
		window.global.setCookie("month",month)
		window.global.setCookie("week",week)
		$.get(initDataUrl,toDay,function(responseData){
			if (responseData.state) {
				$(".loading").hide()
				radar.init(year,responseData)
				var data = responseData.data
				if (data.quarter) {
					setDate($("#quarter"),data.quarter)
				}
				if (data.month) {
					setDate($("#month"),data.month)
				}
				 record($("#year li"),"years")
				 record($("#quarter li"),"quarters")
				 record($("#month li"),"months")
			}else{
				alert(responseData.message)
			}
		})
	}
	init()
})