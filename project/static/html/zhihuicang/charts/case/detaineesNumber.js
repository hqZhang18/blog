/**
 * @Author:      zhanghq
 * @DateTime:    2017-07-03 15:20:16
 * @Description: 面积图
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-07-03 15:20:16
 */

define(function (require) {
    /**
     * 引入公用的文件
     */
    require('d3')
    require('lodash')
    require('jquery')

    // 公用配置项
    var config = {}
    var yScale  // y轴
    var xScale  // x轴
    var areaPath // 区域生成器
    var linePath  // 线段生成器
    var grid
    var height
    var nullData = [] // 动画路径初始化

    var commonUnit = require('./../commonUnit.js')

    var behaviorCount = {
        defaultSetting: function () {
            return {
                width: 1600,
                height: 620,
                id: '#behaviorCount',
                padding: {
                    top: 30,
                    left: 120,
                    bottom: 60,
                    right: 60
                },
                itemStyle: [
                    {
                        areaPath: {
                            fill: ['#3fdbff', '#6c65fe'],
                            stroke: 'none',
                            strokeWidth: 1
                        },
                        linePath: {
                            fill: 'none',
                            stroke: '#3fdbff',
                            strokeWidth: 3
                        }
                    }, {
                        areaPath: {
                            fill: ['#3fdbff', '#6c65fe'],
                            stroke: 'none',
                            strokeWidth: 1
                        },
                        linePath: {
                            fill: 'none',
                            stroke: '#6c65fe',
                            strokeWidth: 3
                        }
                    }
                ],
                xText: {
                    fill: ['#3fdbff', '#6c65fe'],
                    fontSize: 27,
                    textAnchor: 'middle',
                    margin: {
                        bottom: 10
                    }
                },
                xAxis: {
                    axisLine: {
                        show: true
                    },
                    gridLine: {
                        show: true
                    },
                    ticks: 10,
                    innerTickSize: 6,
                    outerTickSize: 1,
                    isLoss: false, // 负数,
                    ratio: false //按百分比显示
                },
                yAxis: {
                    axisLine: {
                        show: true
                    },
                    gridLine: {
                        show: true
                    },
                    ticks: 10,
                    isLoss: true, // 负数,
                    ratio: true //按百分比显示
                },
                grid: {
                    x: 50,
                    x2: 0,
                    y: 105,
                    y2: 0
                }
            }
        },

        /**
         *  默认数据源
         */
        defaultDataSource: function () {
            return [
                {
                    name: '江北区',
                    value1: 1140,
                    value2: -740
                }, {
                    name: '渝北区',
                    value1: 150,
                    value2: 110
                }, {
                    name: '渝中区',
                    value1: 634,
                    value2: 190
                }, {
                    name: '大渡口区',
                    value1: 127,
                    value2: 780
                }, {
                    name: '北碚区',
                    value1: 108,
                    value2: 250
                }, {
                    name: '开县',
                    value1: 527,
                    value2: 240
                }, {
                    name: '云阳',
                    value1: 388,
                    value2: 140
                }
            ]
        },

        /**
         *  绘制图表
         *  @param    {string} id   容器id
         *  @param    {array}  data 图表数据
         *  @param    {object} opt  图表配置项
         *
         *  example:
         *  [
         *    {
         *      name: '江北区',
         *      value1: 1140,
         *      value2: 740
         *    }
         *  ]
         */
        drawCharts: function (id, data1, opt) {
            // 合并配置项
            config = _.merge({}, this.defaultSetting(), opt)
            // 获取数据
            var data = data1 || this.defaultDataSource()
            data = commonUnit.unique(data)

            var padding = config.padding
            var width = config.width - padding.left - padding.right
            height = config.height
            grid = config.grid

            var newData = [1, 2]
            // 创建svg
            var svg = commonUnit.addSvg(id, config)
            // 分别获取value,name值  xData用于生成x轴name
            var dataset1 = []
            var dataset2 = []
            var xData = []
            var dataset = []
            for (var i = 0; i < data.length; i++) {
                dataset1.push(parseInt(data[i].tongbi, 10))
                dataset2.push(parseInt(data[i].huanbi, 10))
                nullData.push(0)
                xData.push(data[i].name)
            }
            // 用于添加Y轴及网格线
            var dataset = dataset1.concat(dataset2)
            // 生成Y轴及网格线
            yScale = commonUnit.addYAxis(svg, config, dataset)
            // 生成X轴
            commonUnit.addXAxis(svg, config, xData)

            //x轴网格线
            if (config.xAxis.gridLine) {
                svg.select('.axis-x')
                    .selectAll("g.tick")
                    .select("line.grid-line")
                    .remove();

                svg.select('.axis-x')
                    .selectAll("g.tick")
                    .append('line')
                    .attr("class", 'grid-line')
                    .attr("x1", 0)
                    .attr("y1", (config.height - config.padding.top - config.padding.bottom) / 2)
                    .attr("x2", 0)
                    .attr("y2", -(config.height - config.padding.top - config.padding.bottom) / 2)
                    .attr('stroke-width', 1)
                    .attr('stroke', function (d, i) {
                        if (i === parseInt(xData.length / 2)) {
                            return '#858795'
                        } else {
                            return '#1c2448'
                        }
                    });
            }

            //y轴网格线
            if (config.yAxis.gridLine) {
                svg.select('.axis-y')
                    .selectAll("g.tick")
                    .select("line.grid-line")
                    .remove();

                svg.select('.axis-y')
                    .selectAll("g.tick")
                    .append('line')
                    .attr("class", 'grid-line')
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", config.width - config.padding.left - config.padding.right)
                    .attr("y2", 0)
                    .attr('stroke-dasharray', '8 2 8 6')
                    .attr('stroke-width', 1)
                    .attr('stroke', '#292b45');
            }

            // 调用滤镜
            commonUnit.addFilter(id, config)

            // 获取y轴0轴线的坐标位置
            var axisXPos = 0
            for (var i = 0; i < dataset.length; i++) {
                var index = parseInt($(id + ' .axis-y').find('.tick text').eq(i).html(), 10)
                if (index == 0) {
                    var transY = $(id + ' .axis-y').find('.tick').eq(i).attr('transform')
                    var start = transY.indexOf(',')
                    var end = transY.indexOf(')')
                    axisXPos = parseInt(transY.substring(start + 1, end), 10)
                }
            }
            //改变x轴线的Y轴位置
            d3.select(id).selectAll('.axis-x')
                .attr('transform', 'translate(0, ' + axisXPos + ')')

            var itemStyle = config.itemStyle
            // 横坐标轴比例尺
            xScale = d3.scale.linear()
                .domain([-0.1, xData.length - 0.9])
                .range([0, width])

            // 添加菱形标注点
            this.addPoint(id)

            // 区域生成器
            areaPath = d3.svg.area()
                .x(function (d, i) {
                    return xScale(i)
                })
                .y0(function () {
                    return height - grid.y
                })
                .y1(function (d) {
                    return yScale(d) + grid.y2
                })
                // 线条样式 linear/linear-closed/step/... 曲线:basis/cardinal/
                .interpolate('cardinal')

            // 生成线段
            linePath = d3.svg.line()
                .x(function (d, i) {
                    return xScale(i)
                })
                .y(function (d) {
                    return yScale(d) + grid.y2
                })
                .interpolate('cardinal')

            // 渐变配置项
            var gradientCfg = {
                x1: '0%',
                y1: '30%',
                x2: '0%',
                y2: '100%',
                offset1: '0%',
                offset2: '100%',
                opacity1: 0.5,
                opacity2: 0.5
            }

            // 获取update
            var update = svg.selectAll('.group')
                .data(newData)

            // 获取enter
            var enter = update.enter()
            // 获取exit
            var exit = update.exit()
            // 处理enter
            enter.append('g')
                .attr('class', function (d, i) {
                    return 'group group' + (i + 1)
                })

            // 处理update部分
            svg.selectAll('.group')
                .attr('class', function (d, i) {
                    return 'group  group' + (i + 1)
                })

            // 处理exit
            exit.remove()

            for (var i = 1, len = (newData.length + 1); i < len; i++) {
                // 渐变色配置项
                var colors = [
                    {
                        color: itemStyle[i - 1].areaPath.fill,
                        id: 'BeColor' + i + ''
                    }
                ]
                // 调用渐变
                commonUnit.addGradient(id, colors, gradientCfg)

                // 获取配置项
                var opts = {
                    id: 'url(#BeColor' + i + ')',
                    areaPath: itemStyle[i - 1].areaPath,
                    linePath: itemStyle[i - 1].linePath
                }

                var group = svg.select('.group' + i)
                // 获取value
                var dataset = []
                if (i == 1) {
                    dataset = dataset1
                } else {
                    dataset = dataset2
                }
                // 调用
                // group.call(this.addElems, dataset, opts, i)
                this.addElems(group, dataset, opts, i)
            }
        },

        /**
         *  添加图形元素
         *  @param    {object}  group   [g元素]
         *  @param    {array}   dataset [path数据]
         *  @param    {object}  opt     [配置项]
         *  @param    {number}  type    [类型，用于填充颜色]
         */
        addElems: function (group, dataset, opt, type) {

            // 线条路径
            if (group.selectAll('.line-path').node()) {
                // 选择线段path
                group.select('.line-path')
                    .call(this.linePathAttr, dataset, opt)
            } else {
                // 添加线段path
                group.append('path')
                    .call(this.linePathAttr, dataset, opt)
            }

            // 标注点组元素
            var markGroup
            if (group.selectAll('.mark-group').node()) {
                markGroup = group.selectAll('.mark-group')
                    .attr('class', 'mark-group')
            } else {
                markGroup = group.append('g')
                    .attr('class', 'mark-group')
            }

            // 获取update
            var markUpdate = markGroup.selectAll('.line-point')
                .data(dataset)
                .call(this.pointAttr, type)   // 处理upate 部分
            // 获取enter
            var markEnter = markUpdate.enter()
            // 获取exit部分
            var markExit = markUpdate.exit()
            // 处理enter
            markEnter.append('use')
                .call(this.pointAttr, type)
            // 处理exit
            markExit.remove()
            // 文字组元素
            var textGroup
            if (group.selectAll('.text-group').node()) {
                textGroup = group.selectAll('.text-group')
                    .attr('class', 'text-group')
            } else {
                textGroup = group.append('g')
                    .attr('class', 'text-group')
            }

            // 获取update value
            var textUpdate = textGroup.selectAll('.top-text')
                .data(dataset)
                .call(this.textAttr, type)

            // 获取enter value
            var textEnter = textUpdate.enter()
            // 获取exit  value
            var textExit = textUpdate.exit()
            // 处理enter
            textEnter.append('text')
                .call(this.textAttr, type)
            // 处理update
            textGroup.selectAll('.top-text')
            // 处理exit
            textExit.remove()
        },

        /**
         *  区域路径属性设置
         *  @param    {string}  dom     [g元素]
         *  @param    {array}   dataset [path数据]
         *  @param    {object}  opt     [配置项]
         */
        areaPathAttr: function (dom, dataset, opt) {
            this.attr({
                stroke: opt.areaPath.stroke,
                'stroke-width': opt.areaPath.strokeWidth,
                fill: opt.id,
                class: 'area-path',
                d: areaPath(nullData)
            })
                .transition()
                .duration(750)
                .attr({
                    d: areaPath(dataset)
                })
        },

        /**
         *  线段路径属性设置
         *  @param    {string}  dom     [g元素]
         *  @param    {array}   dataset [path数据]
         *  @param    {object}  opt     [配置项]
         */
        linePathAttr: function (dom, dataset, opt) {
            this.attr({
                stroke: opt.linePath.stroke,
                'stroke-width': opt.linePath.strokeWidth,
                fill: opt.linePath.fill,
                filter: 'url(#filter1)',
                class: 'line-path',
                d: linePath(nullData)
            })
                .transition()
                .duration(750)
                .attr({
                    d: linePath(dataset),
                })
        },

        /**
         *  标注点属性设置
         */
        /**
         *  设置标注点样式
         *  @param    {array}  use  use元素
         *  @param    {number}  type 同比环比类型
         */
        pointAttr: function (use, type) {
            use.attr({
                'xlink:href': '#TopPoint',
                class: 'line-point',
                opacity: 0,
                fill: '#17234a',
                stroke: function (d, i) {
                    // if (type == 1) {
                    //     return config.itemStyle[0].linePath.stroke
                    // }
                    // return config.itemStyle[1].linePath.stroke
                    return '#ffffff'
                },
                'stroke-width': 3,
                transform: function (d, i) {
                    var x = xScale(i) - 5
                    var y = config.height - grid.y - grid.y2
                    return 'translate(' + x + ', ' + y + ')'
                }

            })
                .transition()
                .duration(750)
                .attr({
                    opacity: 1,
                    transform: function (d, i) {
                        var x = xScale(i) - 5
                        var y = yScale(d) + grid.y2 - 5
                        return 'translate(' + x + ', ' + y + ')'
                    }
                })
        },

        /**
         *  文字属性设置
         */
        textAttr: function (dom, type) {
            var xText = config.xText
            this.attr({
                r: 4,
                x: function (d, i) {
                    // return type == 1 ? xScale(i) - 5 : xScale(i) +5
                    return xScale(i)
                },
                fill: function () {
                    return type === 1 ? xText.fill[0] : xText.fill[1]
                },
                'text-anchor': xText.textAnchor,
                'font-size': xText.fontSize,
                class: 'top-text',
                y: function (d) {
                    var y = config.height - config.padding.top - config.padding.bottom
                    return y
                },
                opacity: 0
            })
                .transition()
                .duration(750)
                .attr({
                    y: function (d) {
                        var y = yScale(d) + grid.y2 - xText.margin.bottom + 2
                        return d === 0 ? y : y - 8
                    },
                    opacity: 1
                })
                .text(function (d) {
                    return d + '%'
                })
        },

        /**
         *  添加top小矩形
         *  @param    {string}  id [容器id]
         */
        addPoint: function (id) {
            var svg = d3.select(id).select('svg')
            var defs = commonUnit.isDefs(id)
            if (svg.selectAll('#TopPoint').node()) {
                return
            }
            defs.append('circle')
                .attr({
                    id: 'TopPoint',
                    r: 6,
                    x: 5,
                    y: 5
                })
        }
    }
    return behaviorCount
})
