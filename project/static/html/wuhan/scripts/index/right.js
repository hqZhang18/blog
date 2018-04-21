﻿/**
 * @Author:      baizn
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 总览右边部分业务代码
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */
define(function (require) {

    // 引入request
    var request = require('request')
    // 引入mocke数据
    require('mockData')
    // URL接口
    var apiURL = require('baseConfig')
    // 引入图表组件
    var areaCharts = require('areaCharts')
    var barCharts = require('barCharts1')


    function loadTemplate() {
        var template = require('../../templates/index/right.tpl')
        $('.page-right').html(template)
    }


    /**
     *  右边数据初始化
     *  @example: [example]
     *  @param    {[type]}  data [description]
     */
    function init(data) {
        instructorMaterial(data.instructo, 0)

        // 调用事件绑定
        bindEvent(data)
    }

    /**
     *  渲染教官教材
     *  @example: [
     *    {
     *      "name": "@cname",
     *      "value|1000-2000": 1
     *    }
     *  ]
     *  @param    {[type]}  data  教官教材数据
     */

    function instructorMaterial(data, i) {
        var newData = {}
        $.each(data, function (i, e) {
            newData['name' + (i + 1)] = e.name
            newData['value' + (i + 1)] = e.value
        })

        var tpl = require('../../templates/index/cube.tpl')
        var template = Handlebars.compile(tpl)

        $('.instructor-material').html(template(newData))

        // 添加样式移出样式
        $('.instructor-material .common-title span:nth-child(' + (i + 1) + ')')
            .addClass('active')
            .siblings()
            .removeClass('active')

        //监听立方体进入动画是否执行完毕动画
        $('.cube')[0].addEventListener('animationend', function () {
            $('.cube-box').stop(true).animate({
                'opacity': 1,
                'top': '20px'
            }, 1000, function () {
                setTimeout(function () {
                    if (data.length <= 2) {
                        $('.cube').css('animation', 'r2 4s infinite cubic-bezier(0.25, 1, 1, 1)')
                    } else {
                        $('.cube').css('animation', 'r 8s infinite cubic-bezier(0.25, 1, 1, 1)')
                    }
                }, 1000)
            })
        }, false)
    }

    /**
     *  渲染评估数据
     *  @example: [example]
     *  @param    {object}  data 评估数据
     */
    function renderAssessment(data) {
        // 绘制达标率面积图
        areaCharts.drawCharts('.assessment-charts', data.standardRate, '')
        // 绘制培训人数柱状图
        barCharts.drawCharts('.assessment-charts', data.train, '')

    }

    /**
     *  事件绑定
     */
    function bindEvent(data) {
        // 点击教官教材
        $('.page-right').on('click', '.instructor-material .common-title span', function () {
            $('.cube').css({
                width: 0,
                height: 0
            })

            var index = $(this).index()

            // index = 0 教官 1 教材
            if (index == 0) {
                instructorMaterial(data.instructo, index)
            } else {
                instructorMaterial(data.materials, index)
            }
        })

        // 点击评估达标率图例
        $('.legend').on('click', 'li', function (event) {
            event.stopPropagation()
            $('.rate').addClass('invalid')
            $(this).addClass('active').removeClass('invalid').siblings().removeClass('active')
            var index = $(this).index()
            // 点击达标率的图例重新渲染
            var config = {
                legendId: index + 1
            }
            if (index > 2) {
                // type = 1 破案率 2=110投诉率 3=受案立案审查达标率
                var type = index - 2
                request.sendAjax(apiURL.assessment + '/' + type, function (data) {
                    var data = data.assessment
                    areaCharts.drawCharts('.assessment-charts', data.standardRate, config)
                })
            }
        })

        $('.legend').on('click', 'li', function (event) {
            console.log('ddd')
        })
    }

    var result = {
        init: init,
        loadTemplate: loadTemplate,
        renderAssessment: renderAssessment
    }

    return result
})