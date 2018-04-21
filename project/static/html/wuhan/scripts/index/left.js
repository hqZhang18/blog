/**
 * @Author XieYang
 * @DateTime 2017/8/21 9:39
 * @Description 左侧模块
 * @LastModifiedBy
 * @LastModifiedTime
 */

define(function(require) {

    // 引入request
    var request = require('request')
    // 引入mocke数据
    require('mockData')
    // URL接口
    var apiURL = require('baseConfig')
    // 引入图表组件
    var lineChart = require('lineAreaCharts')
    var barChart = require('meterBarCharts')
    require('radarCharts')
    // 引入模版库文件
    require('handlebars')

    /**
     *  民警任职（晋升）资格考试合格率初始化
     *  @param {Object} data
     */
    function initCPQ(data) {
        //调用模块
        var tpl = require('../../templates/index/civil.tpl')
        var template = Handlebars.compile(tpl)

        $('.page-left').prepend(template(data.accumulate.toLocaleString()))

        //启动区域图
        var lineAreaChart = new lineChart()

        lineAreaChart
            .setContainer('.lineAreaChart')
            .setSize('100%', 160)
            .setData(data.cpqLine)
            .render()

        //雷达图参数设置
        var radarChartOptions = {
            w: 400,
            h: 210,
            maxValue: 1,
            levels: 10,
            color: d3.scale.ordinal().range(["#EDC951"])
        }
        //启动雷达图组件
        RadarChart(".radarChart", data.cpqRadar, radarChartOptions);
    }

    /**
     * 专业培训考试合格率模块初始化
     * @param {Object} data
     */
    function initPPT(data) {
        //调用模块
        var tpl = require('../../templates/index/training.tpl')
        var template = Handlebars.compile(tpl)

        $('.page-left').append(template(data.accumulate.toLocaleString()))

        //启动柱状图
        barChart = new barChart()

        barChart
            .setContainer('.meterBarChart')
            .setSize('100%', 235)
            .setData(data.ptBar)
            .render()
    }

    var result = {
        initCPQ: initCPQ,
        initPPT: initPPT
    }

    return result
})