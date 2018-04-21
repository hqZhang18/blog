/**
 * @Author:      zhq
 * @DateTime:    2017-01-10 20:12:27
 * @Description: Description
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-10 20:12:27
 */

define(function (require) {
    /**
     * 引入公用的文件
     */
    require('d3')
    require('lodash')
    require('jquery')

    // 引入公用的组件
    var commonUnit = require('../commonUnit')

    var areaCharts = {
        defaultSetting: function () {
            return {
                width: 600,
                height: 400,
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 40,
                    left: 0
                },
                itemStyle: {
                    barWidth: 6,
                    color: ['#008efe', '#683e84'],
                    colors: [
                        {
                            id: 'color1',
                            color: ['#aa58fd', '#008efe']
                        }, {
                            id: 'color2',
                            color: ['#191ed4', '#008efe']
                        }, {
                            id: 'color3',
                            color: ['#50adfc', '#008efe']
                        }, {
                            id: 'color4',
                            color: ['#50adfc', '#008efe']
                        }, {
                            id: 'color5',
                            color: ['#84f088', '#008efe']
                        }, {
                            id: 'color6',
                            color: ['#f97dcb', '#008efe']
                        }, {
                            id: 'color7',
                            color: ['#f0f88b', '#008efe']
                        }, {
                            id: 'color8',
                            color: ['#7bfcfb', '#008efe']
                        }, {
                            id: 'color9',
                            color: ['#7bfcfb', '#008efe']
                        }, {
                            id: 'color10',
                            color: ['#aa58fd', '#008efe']
                        }, {
                            id: 'color11',
                            color: ['#aa58fd', '#008efe']
                        }, {
                            id: 'color12',
                            color: ['#aa58fd', '#008efe']
                        }, {
                            id: 'color13',
                            color: ['#aa58fd', '#008efe']
                        }
                    ],
                    min: 20,
                    margin: {
                        left: 10
                    },
                    gradient: {
                        x1: '0%',
                        y1: '0%',
                        x2: '0%',
                        y2: '100%',
                        offset1: '20%',
                        offset2: '100%',
                        opacity1: 1,
                        opacity2: 0.2
                    },
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    gridLine: {
                        show: false
                    },
                    ticks: 6
                },
                xText: {
                    fontSize: 12,
                    fill: '#a5cfe0',
                    textAnchor: 'middle',
                    margin: {
                        left: 0,
                        bottom: 5
                    }
                },
                grid: {
                    x: 50,
                    y: 70,
                    y2: 40
                }
            }
        },

        defaultDataSource: function () {
            return [
                {
                    name: '类型1',
                    value: 123
                }, {
                    name: '类型2',
                    value: 456
                }, {
                    name: '类型3',
                    value: 456
                }, {
                    name: '类型4',
                    value: 456
                }, {
                    name: '类型5',
                    value: 456
                }, {
                    name: '类型6',
                    value: 456
                }
            ]
        },

        /**
         *  @describe [绘制图表]
         *  @param    {[type]}   id   [容器id]
         *  @param    {[type]}   data [数据]
         *  @param    {[type]}   opt  [配置项]
         *  @return   {[type]}   [description]
         */
        drawCharts: function (id, data1, opt) {
            // 合并配置项
            var config = _.merge({}, this.defaultSetting(), opt)
            // 获取数据
            var data = data1 || this.defaultDataSource()

            var dataset = []
            var xData = []
            var datalen = data.length
            for (var i = 0; i < datalen; i++) {
                dataset.push(parseInt(data[i].value, 10))
                xData.push(data[i].name)
            }

            // 创建svg
            var svg = commonUnit.addSvg(id, config)
            // 生成Y轴及网格线
            commonUnit.addYAxis(svg, config, dataset)
            // 生成X轴
            commonUnit.addXAxis(svg, config, xData)
            // 获取  x轴transform的位置
            var transX = commonUnit.getTransformX(id, data)
            config.transX = transX

            $(id + ' .axis-x').find('.tick text').attr('y', 20)

            var height = config.height

            // 获取update部分
            var update = svg.selectAll('.group')
                .data(data)

            // 获取enter部分
            var enter = update.enter()

            // 获取exit部分
            var exit = update.exit()

            // 处理enter部分(创建一个组元素)
            var updateG = enter.append('g')
                .attr({
                    class: 'group',
                    transform: function () {
                        var x = transX[0]
                        var y = height - config.grid.y
                        return 'translate(' + x + ', ' + y + ')'
                    }
                })
            // 添加每个类型上的的标识点
            var markPolygon = updateG.append('polygon')
            // 添加数据
            var polygon = updateG.append('polygon')
            // 添加顶部value
            var text = updateG.append('text')
            var dom1 = {
                markPolygon: markPolygon,
                polygon: polygon,
                text: text
            }
            this.addElement(config, data, dom1)

            // 处理update部分
            var selectG = update.attr({
                class: 'group',
                transform: function () {
                    // var x = transX[0]
                    var x = 80
                    var y = height - config.grid.y
                    return 'translate(' + x + ', ' + y + ')'
                }
            })
            markPolygon = selectG.select('.mark-polygon')
            polygon = selectG.select('.data-polygon')
            text = selectG.select('.top-text')
            var dom2 = {
                markPolygon: markPolygon,
                polygon: polygon,
                text: text
            }
            this.addElement(config, data, dom2)

            // 处理exit部分
            exit.remove()

            // 添加数据的矩形柱子
            var colors = config.itemStyle.colors
            // 渐变配置项
            var gradientCfg = config.itemStyle.gradient

            commonUnit.addGradient(id, colors, gradientCfg)
        },

        /**
         *  @describe [添加元素]
         *  @param    {object}   config 配置项
         *  @param    {array}    data   数据源
         *  @param    {object}   dom    根元素
         */
        addElement: function (config, data, dom) {
            var dataset = []
            var transX = config.transX
            var datalen = data.length
            var height = config.height
            for (var i = 0; i < datalen; i++) {
                dataset.push(parseInt(data[i].value, 10))
            }
            // 定义比例尺
            var linear = d3.scale.linear()
                .domain([0, d3.max(dataset)])
                .range([0, height - config.grid.y - config.grid.y2])

            var itemStyle = config.itemStyle

            var barWidth = itemStyle.barWidth
            var colors = config.itemStyle.colors

            dom.polygon.attr({
                fill: function (d, i) {
                    return 'url(#' + colors[i].id + ')'
                },
                opacity: 0.45,
                class: 'data-polygon',
                points: function (d, i) {
                    var p1 = -1
                    var p2 = 0
                    var p3 = p1
                    var p5 = transX[datalen - 1] - 40
                    var points = '' + transX[i] - transX[0] + ',' + p2 + ' ' + (p1 - barWidth) + ', ' + p3 + ' ' + p5 + ' ' + p3 + ' '
                    return points
                },
            })
                .transition()
                .ease('out-in')
                .duration(1000)
                .attr({
                    points: function (d, i) {
                        var p1 = -1
                        var p2 = -linear(d.value) + 8
                        if (p2 >= 0) {
                            p2 = -itemStyle.min
                        }
                        var p3 = p1
                        var p5 = transX[datalen - 1] - 40
                        var points = '' + transX[i] - transX[0] + ',' + p2 + ' ' + (p1 - barWidth) + ', ' + p3 + ' ' + p5 + ' ' + p3 + ' '
                        return points
                    },
                })

            // 线断上添加多边形标记点
            var points = '5, 0, 0, 5, 5, 10, 10, 5'
            var zoom = 1.2
            var oPoints = points
            oPoints = oPoints.split(',')
            var points = []
            for (var i = 0, len = oPoints.length; i < len; i++) {
                var num = oPoints[i] / zoom
                if (isNaN(num)) {
                    num = 0
                }
                points.push(num)
            }
            // 创建多边形
            dom.markPolygon.attr({
                points: points,
                transform: function (d, i) {
                    var x = transX[i] - transX[0] - 4
                    var y = 0
                    if (y <= itemStyle.min) {
                        y = itemStyle.min
                    }
                    return 'translate(' + x + ', ' + -y + ')'
                },
                fill: '#5acaff',
                class: 'mark-polygon'
            })
                .transition()
                .ease('out-in')
                .duration(1000)
                .attr({
                    transform: function (d, i) {
                        var x = transX[i] - transX[0] - 4
                        var y = linear(d.value) - 4
                        if (y <= itemStyle.min) {
                            y = itemStyle.min
                        }
                        return 'translate(' + x + ', ' + -y + ')'
                    }
                })

            // 添加top的value
            var xText = config.xText
            dom.text.attr({
                fill: xText.fill,
                'font-size': xText.fontSize,
                'text-anchor': xText.textAnchor,
                class: 'top-text',
                x: function (d, i) {
                    return transX[i] - transX[0] - xText.margin.left
                },
                y: 0,
                opacity: 0
            })
                .transition()
                .ease('out-in')
                .duration(1000)
                .attr({
                    y: function (d) {
                        var y = linear(d.value) + xText.margin.bottom
                        if (y <= itemStyle.min) {
                            y = itemStyle.min
                        }
                        return -y
                    },
                    opacity: 1
                })
                .text(function (d) {
                    return d.value
                })
        }
    }
    return areaCharts
})

