/**
 * @Author:      zhq
 * @DateTime:    2017-01-13 13:52:27
 * @Description: 渐变柱状图
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-13 13:52:27
 */

define(function (require) {
    /**
     * 引入公用的文件
     */
    require('d3')
    require('lodash')
    // 引入公用的方法组件
    var commonUnit = require('../commonUnit')

    var gradientBar = {
        json: {},
        xScale: null,
        yScale: null,
        /**
         * 柱状图默认配置项
         */
        defaultSetting: function () {
            return {
                width: 1050,
                height: 570,
                fontFamily: '微软雅黑',
                min: 1,
                // svg的上右下左的值(用于控制文字显示不全)
                padding: {
                    top: 30,
                    right: 70,
                    bottom: 70,
                    left: 270
                },
                // 条形图配置项
                itemStyle: {
                    //图形的高度
                    height: 25,
                    // 背景色填充
                    color: '#282f36',
                    // 渐变配置项
                    gradient: {
                        color: ['#3b32ed', '#a60a54'],
                        id: 'linearColor',
                        x1: '30%',
                        y1: '0%',
                        x2: '100%',
                        y2: '0%',
                        offset1: '0%',
                        offset2: '100%',
                        opacity1: 1,
                        opacity2: 1
                    },
                    // 条形角半径,
                    radius: 10,
                    margin: {
                        top: 10,
                        right: 60,
                        bottom: 0,
                        left: 120
                    },
                    //图形文本配置项
                    textStyle: {
                        height: 68,
                        width: 68
                    }
                },
                // 右边文字配置项
                rightText: {
                    fontSize: 32,
                    color: '#fff',
                    textAnchor: 'start'
                },
                xAxis: {
                    id: 'xaxis',
                    position: 'bottom',
                    direction: 0,
                    innerTickSize: 1,
                    outerTickSize: 1,
                    /**
                     * 比例尺类型 （'linear'||'pow'||'sqrt'） 线性比例尺，指数比例尺，对数比例尺
                     *
                     *      d3.scale.pow().domain([0,100]).range([0,700]).exponent(2);
                     * 指数比例尺与线性比例尺相似，区别是pow比例尺首先对输入数据进行指数变换，
                     * 默认指数为1，所以默认情况下也是数值 1:1 的缩放。
                     *
                     *      d3.scale.sqrt().domain([0,100]).range([0,700])
                     *      平方根比例尺是pow比例尺的特殊类型，相当于 d3.scale.pow().exponent(0.5)
                     */
                    scale: 'sqrt',
                    /**
                     * 指数，在csale为 pow 时生效
                     */
                    exponent: 2,
                    // 轴样式
                    style: {
                        'fill': 'none',
                        'stroke': '#4b4f89',
                        'stroke-width': 2
                    },
                    // 轴文字样式
                    textStyle: {
                        'font-size': 24,
                        'fill': '#7d96de',
                        'font-family': 'digifacewide',
                        'stroke': 'none',
                        'stroke-width': 0,
                        'text-anchor': 'middle'
                    },
                    unit: '0',
                    axisLine: {
                        show: true //是否显示X轴
                    },
                    gridLine: {
                        show: true //是否显示X轴网格线
                    },
                    ticks: 6, //刻度数
                    tickPadding: 20, //刻度与文本的距离
                    /**
                     * 设置轴定义域的起始值从何处开始
                     * 默认false：从0开始
                     * true：从传入数组的最小值开始
                     * 如果数组的最小值为负数，则坐标轴启用负数轴
                     */
                    domainStart: true,
                    /**
                     * 是否在轴上刻度的最小值之前缓冲一段距离
                     * （如果轴定义域的起始值与终止值相差太大，为了使图形易于观看，）
                     */
                    bufferAxis: true,
                    ratio: false //按百分比显示
                },
                yAxis: {
                    id: 'yaxis',
                    position: 'left',
                    direction: 0,
                    innerTickSize: 1,
                    outerTickSize: 1,
                    // 注释同 X轴
                    scale: 'linear',
                    //轴样式
                    style: {
                        fill: 'none',
                        stroke: '#363963',
                        'stroke-width': 2
                    },
                    // 轴文字样式
                    textStyle: {
                        'font-size': 36,
                        fill: '#e3e8ec',
                        stroke: 'none',
                        'stroke-width': 0,
                        'text-anchor': 'end'
                    },
                    unit: '0',
                    axisLine: {
                        show: true
                    },
                    gridLine: {
                        show: true
                    },
                    ticks: 0,
                    tickPadding: 40,
                    domainStart: false,
                    bufferAxis: false,
                    ratio: false //按百分比显示
                }
            }
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
         *      name: "江北区",
         *      value: 234
         *    }
         *  ]
         */
        drawCharts: function (id, data, opt) {
            gradientBar.json = data

            var dataLength = data.length
            var config = _.merge({}, this.defaultSetting(), opt)

            var value = [], name = []
            for (var i = 0, len = data.length; i < len; i++) {
                value.push(data[i].value)
                name.push(data[i].name)
            }

            // 创建svg
            var svg = commonUnit.addSvg(id, config)

            /**
             * 获取update部分
             */
            var update = svg.selectAll('g')
                .data(data)

            // 获取enter部分
            var enter = update.enter()

            // 获取exit部分
            var exit = update.exit()

            // 处理exit
            exit.remove()

            // 生成X, Y轴及网格线
            // 此处因X轴网格线在Y轴网格线之上，所以先生成Y轴
            gradientBar.yScale = this.addYAxis(svg, config, name)
            gradientBar.xScale = this.addXAxis(svg, config, value)

            // 处理enter部分
            var appendG = enter.append('g')
                .attr('transform', function (d, i) {
                    var y = gradientBar.yScale(i + 1)
                    return 'translate(0,' + y + ')'
                })
                .attr('class', 'group')

            // 处理update部分
            var selectG = update.attr('transform', function (d, i) {
                var y = gradientBar.yScale(dataLength - i)
                return 'translate(5,' + y + ')'
            })

            //初始化结构
            var rectBg = appendG.append('rect')
            var rect = appendG.append('foreignObject')
            rect
                .append(function () {
                    return document.createElementNS('http://www.w3.org/1999/xhtml', 'body')
                })
                .attr('class', 'c-body')
                .each(function () {
                    console.log(d3.select(this))
                    d3.select(this).append('div')
                        .attr({
                            class: 'rect-data'
                        })

                    d3.select(this).append('div')
                        .attr({
                            class: 'rect-data-shadow'
                        })

                    d3.select(this).append('div')
                        .attr({
                            class: 'rect-data-circle'
                        })
                })

            var dom = {
                rectBg: rectBg,
                rect: rect
            }
            // 初始化调用添加元素的方法
            this.addElement(id, data, dom, config)

            rectBg = selectG.select('.rect-bg')
            rect = selectG.select('foreignObject')

            dom = {
                rectBg: rectBg,
                rect: rect
            }
            // 有更新的调用添加元素的方法
            this.addElement(id, data, dom, config)
        },

        /**
         * 定义轴比例尺类型，可在配置项配置比例尺类型
         * @param {string} axis 坐标轴标识, 'x' or 'y', default 'x'
         * @param {Object} config 配置项
         * @returns {*} 返回坐标轴对象
         */
        axesScale: function (axis, config) {
            axis = axis && axis === 'y' ? 'yAxis' : 'xAxis'
            switch (config[axis].scale) {
                case 'pow':
                    return d3.scale.pow().exponent(config[axis].exponent)
                case 'sqrt':
                    return d3.scale.sqrt()
                default://linear or other scale
                    return d3.scale.linear()
            }
        },

        /**
         * 添加X轴及其网格线并返回该轴的比例尺
         * @param svg SVG容器
         * @param {Object} config 配置项
         * @param {Array} data 数据
         * @returns {d3.scale} xScale x轴比例尺
         */
        addXAxis: function (svg, config, data) {
            var domain //定义域
            var isNumberAxis = !isNaN(data[0]) //是否是数字轴，false为文本轴
            var gridWidth = config.width - config.padding.left - config.padding.right
            var xScale = gradientBar.axesScale('x', config) //定义轴比例尺类型，可在配置项配置比例尺类型
                .range([0, gridWidth]) //定义比例尺值域

            if (isNumberAxis) {//数字轴
                var domainStart = config.xAxis.domainStart
                if (domainStart) {
                    var min = d3.min(data)
                    var max = d3.max(data)

                    if (min > 0 && config.xAxis.bufferAxis) {
                        domain = [min / 2, max]
                    } else {
                        domain = [min, max]
                    }
                } else {
                    domain = [0, d3.max(data)]
                }
            } else {//文本轴
                domain = [0, data.length - 1]
            }

            // 初始化比例尺
            xScale
                .domain(domain)

            // 设置轴并初始化轴样式
            var xAxis = d3.svg.axis()
                .scale(xScale)      // 指定比例尺
                .orient('bottom')   // 指定刻度的方向
                /**
                 * 指定刻度，可以设置为大于0的整数，默认为数据数组的长度，但最大为10
                 */
                .ticks(config.xAxis.ticks ? config.xAxis.ticks : data.length > 10 ? 9 : data.length)
                .tickPadding(config.xAxis.tickPadding) //指定刻度与刻度文本的距离
                .innerTickSize(config.xAxis.innerTickSize)//内刻度大小
                .outerTickSize(config.xAxis.outerTickSize)//外刻度大小
                .tickFormat(function (d, i) {
                    if (d >= 1000000000) {
                        return d / 1000000000 + 'B'
                    } else if (d >= 1000000) {
                        return d / 1000000 + 'M'
                    } else if (d >= 1000) {
                        return d / 1000 + 'K'
                    }
                    return d
                })

            // 初始化轴或更新轴
            if (svg.select('.axis-x').node()) {
                svg.select('.axis-x')
                    .call(axisXAttr)
            } else {
                svg.append('g').call(axisXAttr)
            }

            //网格线
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
                    .attr("y1", 0)
                    .attr("x2", 0)
                    .attr("y2", -(config.height - config.padding.top - config.padding.bottom))
                    .attr('stroke-dasharray', '8 2 8 6')
                    .attr('stroke-width', 1)
                    .attr('stroke', '#292b45');
            }

            var text = svg.select('.axis-x')
                .selectAll('text')
            // 设置轴文本样式
            text.attr(config.xAxis.textStyle)
            //当刻度数多于理想的（便于识别的排版）数量时，设置轴文本倾斜显示
            if (text[0].length > config.xAxis.ticks) {
                text
                    .transition()
                    .duration(500)
                    .attr('transform', function () {
                        return 'rotate(-25),translate(-10, 5)'
                    })
            }

            /**
             * 初始化坐标系
             */
            function axisXAttr() {
                this
                    .attr({
                        class: 'axis axis-x',
                        transform: function () {
                            return 'translate(0,' + (config.height - config.padding.top - config.padding.bottom) + ')'
                        }
                    })
                    .call(xAxis)
                    .attr(config.xAxis.style)
            }

            return xScale
        },

        /**
         * 添加Y轴及其网格线并返回该轴的比例尺
         * @param svg SVG容器
         * @param {Object} config 配置项
         * @param {Array} data 数据
         * @returns {d3.scale} yScale y轴比例尺
         */
        addYAxis: function (svg, config, data) {
            var yScale
            var domain = []
            var isNumberAxis = !isNaN(data[0]) // 是否是数字轴，false为文本轴

            if (isNumberAxis) {//数字轴
                var domainStart = config.yAxis.domainStart
                if (domainStart) {
                    domain = [d3.min(data), d3.max(data)]
                } else {
                    domain = [0, d3.max(data)]
                }
            } else {//文本轴
                domain = [0.3, data.length * 1.1]
            }

            // 定义轴比例尺类型，可在配置项配置比例尺类型
            yScale = gradientBar.axesScale('y', config)

            //初始化比例尺
            yScale
                .domain(domain)
                .range([config.height - config.padding.top - config.padding.bottom, 0])

            // 定义y轴样式
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient(config.yAxis.position)
                .ticks(config.yAxis.ticks ? config.yAxis.ticks : data.length > 10 ? 9 : data.length)
                .tickPadding(config.yAxis.tickPadding)
                .innerTickSize(config.yAxis.innerTickSize)//内刻度大小
                .outerTickSize(config.yAxis.outerTickSize)//外刻度大小
                .tickFormat(function (d) {
                    if (config.yAxis.ratio) {
                        return d != 0 ? d + '%' : d
                    }
                    if (config.yAxis.unit == 'w') {
                        return d / 10000
                    }
                    return d
                })

            // 设置Y轴属性
            function axisYAttr() {
                this
                    .attr({
                        class: 'axis axis-y',
                        id: config.yAxis.id,
                        transform: function () {
                            return 'translate(' + config.yAxis.direction + ', ' + 0 + ')'
                        }
                    })
                    .call(yAxis)
                    .attr(config.yAxis.style)
            }

            var isAxisLine = config.yAxis.axisLine.show
            if (isAxisLine) {
                var axis
                if (svg.selectAll('#' + config.yAxis.id + '.axis-y').node()) {
                    axis = svg.select('#' + config.yAxis.id + '.axis-y')
                        .call(axisYAttr)
                } else {
                    axis = svg.append('g')
                        .call(axisYAttr)
                }
                if (!isNumberAxis) {
                    var length = gradientBar.json.length
                    axis.selectAll('text')
                        .text(function (d, i) {
                            if (gradientBar.json[length - 1 - i]) {
                                return gradientBar.json[length - 1 - i].name
                            } else {
                                return ''
                            }
                        })
                        .attr(config.yAxis.textStyle)
                }
            }

            // 网格线
            if (config.yAxis.gridLine.show) {
                svg.select('.axis-y')
                    .selectAll("g.tick")
                    .select("line.grid-line")
                    .remove();

                svg.select('.axis-y')
                    .selectAll("g.tick")
                    .append('line')
                    .attr("class", 'grid-line')
                    .attr("x1", 11)
                    .attr("y1", 0)
                    /**
                     * 减去的最后一个值为属性 stroke-linecap 设置为 round 时，两边线条两边额外增加的宽度值
                     */
                    .attr("x2", config.width - config.padding.left - config.padding.right - 22)
                    .attr("y2", 0)
                    .attr('stroke-width', config.itemStyle.height)
                    .attr('stroke', '#06070a')
                    .attr('stroke-linecap', 'round')
            }

            return yScale
        },

        /**
         * 添加图表元素
         * @param id 元素选择器
         * @param {Array | Object} data 数据集
         * @param dom
         * @param {Object} config 配置项
         */
        addElement: function (id, data, dom, config) {
            var dataSet = []
            for (var i = 0, len = data.length; i < len; i++) {
                dataSet.push(data[i].value)
            }

            // 小矩形方块配置
            var itemStyle = config.itemStyle
            // 渐变配置项
            var gradientCfg = itemStyle.gradient
            var colors = [
                {
                    id: itemStyle.gradient.id,
                    color: itemStyle.gradient.color
                }
            ]
            // 调用添渐变
            commonUnit.addGradient(id, colors, gradientCfg)

            // 初始化图形
            dom.rect
                .attr('width', 0)
                .transition().duration(500).ease('out-in')
                .attr({
                    height: itemStyle.height,
                    width: function (d) {
                        var dWidth = gradientBar.xScale(d.value) - config.itemStyle.textStyle.height / 2
                        if (dWidth <= 0) {
                            dWidth = config.min
                        }
                        return dWidth
                    },
                    y: -itemStyle.height / 2,
                    x: 0
                })

            dom.rect
                .select('.c-body')
                .attr('style', 'height:100%')

            // 初始化图形关联的文字
            dom.rect
                .select('.rect-data-circle')
                .html(function (d, i) {
                    var value = data[i].value
                    var unit = ['K', 'M', 'B']

                    if (value >= 10000 && value < 1000000) {
                        return Math.round(value / 1000) + '<span>' + unit[0] + '</span>'
                    } else if (value >= 1000000 && value < 1000000000) {
                        return Math.round(value / 1000000) + '<span>' + unit[1] + '</span>'
                    } else if (value >= 1000000000) {
                        return Math.round(value / 1000000000) + '<span>' + unit[2] + '</span>'
                    } else {
                        return value
                    }
                })
                .attr('style', function () {
                    return 'width: ' + 0 + ';' +
                        'height: ' + 0 + ';' +
                        'margin-top: ' + -24 + 'px;' +
                        'margin-right: ' + 0

                })
                .transition().duration(500).ease('out-in')
                .attr({
                    x: function (d) {
                        var dWidth = gradientBar.xScale(d.value)
                        if (dWidth <= 0) {
                            dWidth = config.min
                        }
                        return dWidth + 20
                    },
                    y: itemStyle.height + 10,
                    style: function () {
                        return 'width: ' + config.itemStyle.textStyle.width + 'px;' +
                            'height: ' + config.itemStyle.textStyle.height + 'px;' +
                            'margin-top: ' + -56 + 'px;' +
                            'margin-right: ' + -66 + 'px'
                    }
                })
        }
    }
    return gradientBar
})
