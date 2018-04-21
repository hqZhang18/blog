/**
 * @Author:      baizn
 * @DateTime:    2017-08-31 14:06:08
 * @Description: 旅店和网吧人员数量
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-08-31 14:06:08
 */
define(function (require) {

    require('jquery')
    require('handlebars')
    // 引入util
    var util = require('util')
    // 引入request
    var request = require('request')
    //URL接口
    var apiURL = require('baseConfig')
    // 引入mocke数据
    require('hotelMockData')

    // 引入图表组件
    var gradientBar = require('gradientBar')
    var gradientBar2 = require('gradientBar2')

    var time = apiURL.TIME  // 时间参数默认当前月

    /**
     * 请求后台接口，渲染各个模块
     *
     */
    function fetchApi(time) {
        request.sendAjax(apiURL.hotelCount + time, function (data) {
            var hotelPersonCount = data.hotelTotal
            $('#hotelPersonCount').text(hotelPersonCount.toLocaleString())

            var interPersonCount = data.internetAccessCount
            $('#interPersonCount').text(interPersonCount.toLocaleString())

            var activityList = data.activityList
            var stayArea = data.stayArea
            var staySource = data.staySource

            renderSource(stayArea)
            renderSource2(staySource)
            renderActivityList(activityList)
        })
    }

    /**
     * 渲染住店人员来源
     *
     * @param {any} data 数据源
     */
    function renderSource(data) {
        var config = {
            width: 1150,
            height: 605,
            leftText: {
                fontSize: 32,
                color: '#00fff8',
                textAnchor: 'middle'
            },
            // 右边文字配置项
            rightText: {
                fontSize: 32,
                color: '#fff',
                textAnchor: 'middle'
            },
            padding: {
                top: 60,
                right: 50,
                bottom: 100,
                left: 30
            },
            itemStyle: {
                width: 39,
                height: 26,
                // 背景色填充
                color: '#282f36',
                // 渐变配置项
                gradient: {
                    color: ['#c34e25', '#3716ad'],
                    id: 'linearColor',
                    x1: '0%',
                    y1: '0%',
                    x2: '0%',
                    y2: '100%',
                    offset1: '0%',
                    offset2: '100%',
                    opacity1: 1,
                    opacity2: 1
                }
            }
        }
        gradientBar.drawCharts('#sourceBar', data, config)
    }

    /**
     * 渲染住店人员来源
     *
     * @param {any} data 数据源
     */
    function renderSource2(data) {
        var config = {
            width: 1100,
            height: 625,
            leftText: {
                fontSize: 32,
                color: '#00fff8',
                textAnchor: 'end'
            },
            // 右边文字配置项
            rightText: {
                fontSize: 32,
                color: '#fff',
                textAnchor: 'start'
            },
            padding: {
                top: 35,
                right: 70,
                bottom: 0,
                left: 80
            },
            itemStyle: {
                height: 26,
                // 背景色填充
                color: '#282f36',
                // 渐变配置项
                gradient: {
                    color: ['#5325ed', '#b4ffff'],
                    id: 'linearColor2',
                    x1: '30%',
                    y1: '0%',
                    x2: '100%',
                    y2: '0%',
                    offset1: '0%',
                    offset2: '100%',
                    opacity1: 1,
                    opacity2: 1
                }
            }
        }
        gradientBar2.drawCharts('#sourceBar2', data, config)
    }

    /**
     * 渲染全市大型活动列表
     *
     * @param {any} data 数据源
     */
    function renderActivityList(data) {
        var tpl = require('../../../templates/sheqing/hotel/activityList.tpl')
        var myTemplate = Handlebars.compile(tpl)
        $('#activityList').html(myTemplate(data))
    }

    /**
     *  初始化方法
     */
    function init() {
        /**
         * 当缩放页面后，进行相应的缩放
         */
        window.addEventListener('resize', function () {
            util.zoom()
        })
        util.zoom()
        fetchApi(time)
        setTimeout(function () {
            $('#activityList').liMarquee({
                direction: 'up',
                scrollamount: 40
            })
        }, 100)
    }

    /**
     *  返回一个方法页面调用
     */
    var result = {
        init: init
    }
    return result
})