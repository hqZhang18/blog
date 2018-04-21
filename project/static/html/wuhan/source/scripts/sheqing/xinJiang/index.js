/**
 * @Author XieYang
 * @DateTime 2017/8/31 13:26
 * @Description 涉疆模块
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
    var pcsChart = require('popCatStaChart')
    var ptrChart = require('perTypeRatioChart')
    // var vldChart = require('vehDistributionChart')
    var jnChart = require('junctionNameChart')
    var drpChart = require('regPerDistributionChart')

    //Mock数据
    require('popCatStaData')
    require('regPerDistributionData')
    // require('vehDistributionData')
    require('junctionNameData')
    require('perTypeRatioData')
    var time = baseConfig.TIME //时间参数

    return {
        /**
         * 渲染模版
         */
        render: function () {
            var tpl = require('../../../templates/sheqing/xinJiang/index.tpl')
            $('.xinJiang').html(tpl)
        },
        /**
         * 渲染人群类别统计图
         *
         * @param {array} data 列表数据
         *
         */
        renderPCS: function (data) {
            pcsChart.init(data)
        },

        /**
         * 渲染涉疆人员类型比例图
         *
         * @param {array} data 列表数据
         *
         */
        renderPTR: function (data) {
            var dataset = [], name = []
            $.each(data, function (i, e) {
                dataset.push(e.value)
                name.push(e.name)
            })

            ptrChart.drawCharts('.perTypeRatio', [dataset, name], {
                width: 1020,
                height: 700,
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                min: 0,
                max: 7, // 限制平分最多个数
                scale: 0.6, // 用于控制平分后圆的大小
                outerRadius: 212,
                innerRadius: 166,
                color: ['#38f3ff', '#ffef3d'],
                stroke: '#202640',
                strokeWidth: 15
            })
        },

        /**
         * 渲染涉疆车辆车牌分布图
         *
         * @param {array} data 列表数据
         *
         */
        // renderVLD: function (data) {
        //     var dataset = 0
        //     $.each(data, function (i, e) {
        //         dataset += e.value
        //     })
        //     $('.vehDistribution span').text(dataset)
        //
        //     vldChart.drawCharts('.vehDistribution', data, {
        //         width: 1020,
        //         height: 700,
        //         padding: {
        //             top: 0,
        //             right: 0,
        //             bottom: 0,
        //             left: 0
        //         },
        //         itemStyle: {
        //             innerRadius: 180,
        //             outerRadius: 217,
        //             colors: ['#00d3f5', '#0088f5', '#00f5dd', '#f5ed00', '#bc53ff'],
        //             circleBor: '#174793',
        //             circleBorW: 2
        //         },
        //         lineStyle: {
        //             fill: '#174793',
        //             strokeWidth: 2
        //         }
        //     })
        // },

        /**
         * 渲染涉疆车辆车牌分布图
         *
         * @param {array} data 列表数据
         *
         */
        renderJN: function (data) {
            jnChart.drawCharts('.junctionName', data, {
                width: 1000,
                height: 600,
                padding: {
                    top: 20,
                    right: 0,
                    bottom: 60,
                    left: 0
                },
                xText: {
                    fontSize: 40,
                    fill: '#a5cfe0',
                    textAnchor: 'middle',
                    margin: {
                        left: 0,
                        bottom: 5
                    }
                }
            })
        },

        /**
         * 渲染涉疆人员数量地区分布情况图
         *
         * @param {array} data 列表数据
         *
         */
        renderDRP: function (data) {
            drpChart.init(data)
        },

        /**
         * 渲染时间
         */
        renderTime: function (time) {
            var date

            function gDate() {
                if(time){
                    date = new Date(time)
                } else {
                    date = new Date()
                }

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

        init: function () {
            /**
             * 当缩放页面后，进行相应的缩放
             */
            window.addEventListener('resize', function () {
                util.zoom()
            })

            util.zoom()

            this.getApi(time)
        },
        getApi: function (time) {
            var self = this

            self.render()

            request.sendAjax(baseConfig.popCatStatistics + time, function (data) {
                self.renderPCS(data.popCatStatistics)
            })

            request.sendAjax(baseConfig.regPerDistribution + time, function (data) {
                self.renderDRP(data.regPerDistribution)
            })

            request.sendAjax(baseConfig.perTypeRatio + time, function (data) {
                self.renderPTR(data.perTypeRatio)
            })

            // request.sendAjax(baseConfig.vehDistribution + time, function (data) {
            //     self.renderVLD(data.vehDistribution)
            // })

            request.sendAjax(baseConfig.junctionName + time, function (data) {
                self.renderJN(data.junctionName)
            })

            self.renderTime()
            //调用服务器时间
            // request.sendWebSocket(baseConfig.timewebsocket, function (data) {
            //     self.renderTime(data)
            // })
        }
    }
})