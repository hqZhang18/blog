define(function(require, exports, module) {
    var initUrl = 'data/init.json'
    var initLeftUrl = '../fe/data/2017left.json'
    var initRightUrl = '../fe/data/2017right.json'
    // var initLeftUrl = window.global.baseUrl + "/hy-radarmap/init.java"
    // var initRightUrl = window.global.baseUrl + "/hy-radarmap/linte.java"
    var setRightData = require("rightEcharts")
    var init = function() {
         $(".year").children("p").text( "2017年")
        var date = new Date()
        var year = date.getFullYear()
        var month = parseInt(date.getMonth()) + 1
        var day = date.getDate()
        month = month < 10 ? ("0" + month) : month
        day = day < 10 ? ("0" + day) : day
        var toDay = year + '' + month + '' + day
        $.get(initUrl, {
            date: toDay
        }, function(responseData) {
            if (responseData.state) {
                $(".year").children("p").text(responseData.data.years[0] + "年")
                nowYear = responseData.data.years[0]
                setDate($(".year ul"), responseData.data.years)
                setDate($(".quarter ul"), responseData.data.quarter)
                getData(nowYear, "", "", "")
            } else {
                alert(responseData.message)
            }
        })
    }
    /**
     * 渲染年、季度、月份
     * @param {[string]} dom  [dom元素]
     * @param {[array]} data [数据]
     */
    var setDate = function(dom, data) {
        $(dom).empty()
        var li = ""
        for (var i = 0; i < data.length; i++) {
            li = li + "<li>" + data[i] + "</li>"
        }
        $(dom).append(li)
    }
    /**
     * 点击年、季度、月
     * @return {[]}     弹出年、季度、月
     */
    $('.time').on('click', 'p', function() {    
        $('.time ul').hide()    
        	 var liLength = $(this).next('ul').children('li').length    
        if (liLength) {        
            $(this).next('ul').show()    
        } else {        
            $(this).next('ul').hide()    
        }
    })
    $('.time').on('mouseleave', 'ul', function() {    
        $(this).hide()
    })
    /*点击年*/
    $('.year ul').on('click', 'li', function () {
        var _this = $(this)
        $(".month ul").empty()
        _this.parent().prev('p').html(_this.text()+"年")
        _this.parent().hide()
        $(".quarter").children("p").html("季")
        $(".month").children("p").html("月")
        //设置背景
        $(".quarter").children("p").removeClass("bagup").addClass("bagdown")
        $(".month").children("p").removeClass("bagup").addClass("bagdown")
        $(".week").children("p").removeClass("bagup").addClass("bagdown")
        getData(_this.text(),"","","")
    })


    /*点击季度*/
    $('.quarter ul').on('click', 'li', function () {
        var _this = $(this)
        _this.parent().prev('p').html(_this.text()+"季")
        _this.parent().hide()
        $(".month").children("p").html("月")
        //设置背景
        $(".quarter").children("p").removeClass("bagdown").addClass("bagup")
        $(".month").children("p").removeClass("bagup").addClass("bagdown")
        $(".week").children("p").removeClass("bagup").addClass("bagdown")
        var _year = $(".year p").text().substring(0,4)
        var _quarter = $(".quarter p").text().substring(0,1)
        getData(_year,_quarter,"","")
    })
    /*点击月*/
    $('.month ul').on('click', 'li', function () {
        var _this = $(this)
        _this.parent().prev('p').html(_this.text()+"月")
        _this.parent().hide()
        //设置背景
        $(".month").children("p").removeClass("bagdown").addClass("bagup")
        $(".week").children("p").removeClass("bagup").addClass("bagdown")
        var _year = $(".year p").text().substring(0,4)
        var _quarter = $(".quarter p").text().substring(0,1)
        var _month = $(".month p").text()
        _month = _month.substring(0,_month.length-1)
        getData(_year,_quarter,_month,"")
    })

    /*点击本周*/
    $(".week").on('click',function(){
        $(".quarter").children("p").html("季")
        $(".month").children("p").html("月")
        $(".month").children("p").removeClass("bagup").addClass("bagdown")
        $(".quarter").children("p").removeClass("bagup").addClass("bagdown")
        $(".year").children("p").text( nowYear+"年")
        getData(nowYear,"","","6")
        $(".week").children("p").removeClass("bagdown").addClass("bagup")
    })
    //获取右边的数据
    var getRightData = function(year, quarter, month, week) {
        var toDay = {
            year: year,
            quarter: quarter,
            month: month,
            week: week
        }
        $.get(initRightUrl, toDay, function(responseData) {
            $(".loading").hide()
        	setRightData(responseData.data,year,month)
        })
    }
    //调用左边及中间雷达图数据接口
    var getData = function(year, quarter, month, week) {
        var toDay = {
            year: year,
            quarter: quarter,
            month: month,
            week: week
        }
        $(".loading").show()
        $.get(initLeftUrl, toDay, function(responseData) {
            if (responseData.state) {
                PCS.init(year, responseData.data)
                CFS.init(year, responseData.data)
                window.radar.renderList(responseData.data, responseData.data.yujing, year)
                var data = responseData.data
                if (data.quarter) {
                    setDate($(".quarter ul"),data.quarter)
                }
                if (data.month) {
                    setDate($(".month ul"),data.month)
                }
                getRightData(year, quarter, month, week)
            } else {
                alert(responseData.message)
                return false
            }
        })
    }
    init()
    /*返回按钮*/
    $("#back").click(function(){
        window.history.back(); 
    })
})