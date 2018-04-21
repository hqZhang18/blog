/**
 * @Author XieYang
 * @DateTime 2017/8/31 13:26
 * @Description 案件模块
 * @LastModifiedBy
 * @LastModifiedTime
 */

define(function (require) {
    require('jquery')
    require('handlebars')
    require('lodash')
    require('d3')
    var request = require('request')
    var baseConfig = require('baseConfig')
    var util = require('util')

    //图表
    require('focusOnCases')

    //Mock数据
    require('caseNatureData')
    require('focusOnCasesData')
    require('caseNumberData')
    require('caseNumTendencyData')
    require('areaDistributionData')

    return {
        /**
         * 渲染模版
         */
        render: function () {
            var tpl = require('../../../templates/qinqing/case/index.tpl')
            $('.case').html(tpl)

            var date

            function gDate() {
                date = new Date()
                $('.date').text(formateDate(date.getHours()) + ':' + formateDate(date.getMinutes()) + ':' + formateDate(date.getSeconds()))
            }

            gDate()

            function formateDate(t) {
                if (t < 10) {
                    return '0' + t
                }
                return t
            }

            setInterval(function () {
                gDate()
            }, 1000)
        },
        /**
         * 渲染案件性质总览模块
         *
         * @param {array} data 列表数据
         *
         */
        renderNature: function (data) {
            var caseNature = d3.select('.caseNature')
                .selectAll('.nature-box')
                .data(data)

            caseNature
                .enter()
                .append('div')
                .attr('class', 'nature-box')
                .each(function (d, i) {
                    d3.select(this)
                        .append('div')
                        .attr('class', 'caseNatureName')

                    d3.select(this)
                        .append('div')
                        .attr('class', 'caseNatureValue')
                        .each(function () {
                            d3.select(this)
                                .append('span')

                            d3.select(this)
                                .append('span')
                        })
                })

            caseNature
                .each(function (d) {
                    d3.select(this)
                        .select('.caseNatureName')
                        .text(d.name)

                    d3.select(this)
                        .select('.caseNatureValue')
                        .each(function () {
                            d3.select(this)
                                .select('span:first-child')
                                .text(d.value.toLocaleString())

                            d3.select(this)
                                .select('span:last-child')
                                .text('件')
                        })
                })
        },

        /**
         * 渲染重点关注案件数量模块
         *
         * @param {array} data 列表数据
         *
         */
        renderFocOnCases: function (data) {
            //雷达图参数设置
            var radarChartOptions = {
                w: 953,
                h: 472,
                maxValue: 1,
                levels: 10,
                color: d3.scale.ordinal().range(["#EDC951"])
            }

            //启动雷达图组件
            RadarChart(".focusOnCases", data, radarChartOptions);
        },

        /**
         * 渲染案件数量（同比/环比）模块
         *
         * @param {array} data 列表数据
         *
         */
        renderCaseNumber: function (data) {

        },

        /**
         * 渲染案件数量趋势模块
         *
         * @param {array} data 列表数据
         *
         */
        renderCaseNumTendency: function (data) {

        },

        /**
         * 渲染案件地图分布情况模块
         *
         * @param {array} data 列表数据
         *
         */
        renderAreaDistribution: function (data) {

        },

        init: function () {
            /**
             * 当缩放页面后，进行相应的缩放
             */
            window.addEventListener('resize', function () {
                util.zoom()
            })

            util.zoom()

            this.getApi()
        },
        getApi: function () {
            var self = this

            self.render()

            request.sendAjax(baseConfig.caseNature, function (data) {
                self.renderNature(data.caseNature)
            })

            request.sendAjax(baseConfig.focusOnCases, function (data) {
                self.renderFocOnCases(data.focusOnCases)
            })

            request.sendAjax(baseConfig.caseNumber, function (data) {
                self.renderCaseNumber(data.caseNumber)
            })

            request.sendAjax(baseConfig.caseNumTendency, function (data) {
                self.renderCaseNumTendency(data.caseNumTendency)
            })

            request.sendAjax(baseConfig.areaDistribution, function (data) {
                self.renderAreaDistribution(data.areaDistribution)
            })
        }
    }
})