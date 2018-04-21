/**
 * @Author XieYang
 * @DateTime 2017/08/08 14:26
 * @Description 柱状图组件
 */

define(function () {
    /**
     * 构造函数
     * @param options 参数列表
     * @constructor
     */
    function BarChart(options) {
        if (!options || !(options instanceof Object)) {
            options = {}
        }

        /**
         * 数据
         * @type {*|Array}
         */
        this.data = options.data || this.getData()

        /**
         * 容器
         * @type {*|string|string|string|string}
         */
        this.container = options.container

        /**
         * 容器宽度
         * @type {string} width 默认
         */
        this.width = options.width

        /**
         * 容器高度
         * @type {string} height
         */
        this.height = options.height

        /**
         * 边距
         *
         * @type {{
         *      top: number,
         *      right: number,
         *      bottom: number,
         *      left: number
         * }}
         */
        this.margin = {
            top: 40,
            right: 30,
            bottom: 50,
            left: 55
        }

        if (options.margin && options.margin.length > 0) {
            for (var i in options.margin) {
                if (options.margin.hasOwnProperty(i)) {
                    this.margin[i] = options.margin[i]
                }
            }
        }

        /**
         * x轴
         */
        this.x = options.x || d3.scale.linear()

        /**
         * x轴刻度数，但d3会根据图表的数据，以这个值为基础自动调整刻度数
         * @type {number}
         */
        this.xTicks = options.xTicks || 8

        /**
         * y轴
         */
        this.y = options.y || d3.scale.linear().domain([0.5, 1])

        /**
         * y轴刻度数，但d3会根据图表的数据，以这个值为基础自动调整刻度数
         * @type {number}
         */
        this.yTicks = options.yTicks || 3

        /**
         * SVG容器
         * @private
         */
        this.svg = null

        /**
         * 组件主体元素
         * @private
         */
        this.chart = null

        /**
         * 颜色尺度
         *
         * @type {Array}
         */
        this.colors = !options.colors || !options.colors.length
            ? d3.scale.category10()
            : options.colors

        /**
         * 缓动
         * "linear", "cubic", "cubic-in-out", "sin", "sin-out", "exp", "circle", "back", "bounce",
         * @type {string}
         */
        this.ease = 'cubic-in-out'

        this.format = d3.format('%')
    }

    /**
     * 原型
     */
    BarChart.prototype = {
        /**
         * 构造函数修复
         */
        constructor: BarChart,
        /**
         * 设置x轴域
         * @returns {BarChart}
         */
        setX: function (data) {
            this.x
                .domain([0, data.length])
                .range([0, this.getQuadrantWidth()])

            return this.x
        },
        /**
         * 设置外容器大小
         * 缺省高度时，高度值等于宽度值
         *
         * @param {number || string} width 容器宽度
         * @param {number || string=} height 容器高度
         * @returns {BarChart}
         */
        setSize: function (width, height) {
            if (arguments.length > 1) {
                this.width = width
                this.height = height
            } else if (arguments.length > 0) {
                this.height = this.width = arguments[0]
            }

            if (this.svg) {
                this.svg
                    .attr('width', this.width)
                    .attr('height', this.height)
            }

            return this
        },
        /**
         * 设置容器
         * @param {string} con 容器选择器
         * @returns {BarChart}
         */
        setContainer: function (con) {
            if (!con) {
                this.container = 'body'
            } else {
                this.container = con
            }

            return this
        },
        /**
         * 渲染组件
         */
        render: function () {
            if (!this.svg) {
                this.svg = d3.select(this.container)
                    .append('svg')

                this.setSize(this.width, this.height)
                this.renderAxes()
                this.defineChartClip()
            }

            this.renderChart()
        },
        /**
         * 渲染坐标轴
         * @param {boolean=} resetX 重绘x轴 默认false
         * @param {boolean=} resetY 重绘y轴 默认false
         */
        renderAxes: function (resetX, resetY) {
            var axesG

            if (resetX || resetY) {
                axesG = this.svg
                    .select('.axes')

                if (resetX) {
                    d3.select('svg g.x').remove()
                    this.renderXAxis(axesG)
                }
                if (resetY) {
                    d3.select('svg g.y').remove()
                    this.renderYAxis(axesG)
                }
            } else {
                axesG = this.svg
                    .append('g')
                    .attr('class', 'axes')

                this.renderXAxis(axesG)
                this.renderYAxis(axesG)
            }
        },
        /**
         * 渲染X轴
         * @param axesG X轴容器
         */
        renderXAxis: function (axesG) {
            var self = this

            var xAxis = d3.svg.axis()
                .scale(self.setX(self.data[0]))
                .orient('bottom')

            axesG.append('g')
                .attr('class', 'x axis')
                .attr('transform', function () {
                    return 'translate(' + self.xStart() + ',' + self.yStart() + ')'
                })
                .call(xAxis)
                .selectAll('text')
                .style('text-anchor', 'middle')
                .text('')
        },
        /**
         * 渲染Y轴
         * @param axesG Y轴容器
         */
        renderYAxis: function (axesG) {
            var self = this
            var yAxis = d3.svg.axis()
                .scale(this.y.range([this.getQuadrantHeight(), 0]))
                .orient('left')
                .ticks(this.yTicks)

            axesG.append('g')
                .attr('class', 'y axis')
                .attr('transform', function () {
                    return 'translate(' + self.xStart() + ',' + self.yEnd() + ')'
                })
                .call(yAxis)
                .selectAll('text')
                .style('text-anchor', 'right')
                .text(function (d) {
                    return self.format(d)
                })
        },
        /**
         * 滤镜
         */
        defineChartClip: function () {
            this.svg
                .append('defs')

            //背景条纹渐变
            var hGradient = this.svg.select('defs')
                .append('linearGradient')
                .attr('id', 'h-gradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '0%')

            hGradient.append('stop')
                .attr('offset', '0%')
                .attr('style', 'stop-color:#091947;stop-opacity: 1')

            hGradient.append('stop')
                .attr('offset', '100%')
                .attr('style', 'stop-color:#091947;stop-opacity: 0.2')

            //温度计柱子部分渐变滤镜
            var gradient = this.svg.select('defs')
                .append('linearGradient')
                .attr('id', 'v-gradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%')

            gradient.append('stop')
                .attr('offset', '0%')
                .attr('style', 'stop-color:#00ffff')

            gradient.append('stop')
                .attr('offset', '100%')
                .attr('style', 'stop-color:#0287ff')

            //温度计底部渐变滤镜
            var cGradient = this.svg.select('defs')
                .append('linearGradient')
                .attr('id', 'c-gradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%')

            cGradient.append('stop')
                .attr('offset', '0%')
                .attr('style', 'stop-color:#0286ff')

            cGradient.append('stop')
                .attr('offset', '100%')
                .attr('style', 'stop-color:#0277ff')

        },
        /**
         * 渲染图表主体
         */
        renderChart: function () {
            if (!this.chart) {
                this.chart = this.svg
                    .append('g')
                    .attr('class', 'chartBody')
                    .attr('transform', 'translate('
                        + (this.xStart() + 8) + ','
                        + (this.yEnd() - 3) + ')')
            }

            this.renderXSharp()
            this.renderMeter()
        },
        /**
         * 渲染X轴方向的背景图形
         */
        renderXSharp: function () {
            var self = this
            var height = self.getQuadrantHeight() / 13

            var sharpData = d3.range(7).map(function (i) {
                return height * i
            })

            this.chart
                .selectAll('.xSharp')
                .data(sharpData)
                .enter()
                .append('rect')
                .attr('class', 'xSharp')

            this.chart
                .selectAll('.xSharp')
                .data(sharpData)
                .attr('x', -7)
                .attr('y', function (d) {
                    return 2 * d + 2
                })
                .attr('width', this.getQuadrantWidth())
                .attr('height', function () {
                    return height
                })
                .style('fill', 'url(#h-gradient)')
        },
        /**
         * 渲染柱状图(温度计)
         */
        renderMeter: function () {
            var self = this

            self.chart
                .selectAll('.meter')
                .data(self.data[0])
                .enter()
                .append('g')
                .attr('class', 'meter')
                .each(function () {
                    //背景部分
                    d3.select(this)
                        .append('rect')
                        .attr('class', 's-bar')

                    d3.select(this)
                        .append('circle')
                        .attr('class', 's-circle')

                    //数据图形部分
                    d3.select(this)
                        .append('rect')
                        .attr('class', 'b-bar')

                    d3.select(this)
                        .append('circle')
                        .attr('class', 'b-circle')

                    d3.select(this)
                        .append('text')
                        .attr('class', 'b-text')

                    //tooltip部分
                    d3.select(this)
                        .append('g')
                        .attr('class', 'm-tooltip')
                        .each(function () {
                            d3.select(this)
                                .append('rect')
                                .attr('class', 'tip-con')

                            d3.select(this)
                                .append('text')
                                .attr('class', 'tips')
                        })
                })


            self.chart
                .selectAll('.meter')
                .data(self.data[0])
                .each(function (d, i) {
                    d3.select(this)
                        .select('.s-bar')
                        .attr('x', self.x(i) + 8)
                        .attr('y', self.getQuadrantHeight())
                        .attr('width', 17)
                        .attr('rx', 1)
                        .attr('ty', 1)
                        .style('fill', '#2b3a5f')
                        .style('opacity', 0)
                        .attr('height', 0)
                        .transition().duration(700).ease(self.ease)
                        .attr('y', 0)
                        .style('opacity', 0.6)
                        .attr('height', self.getQuadrantHeight())

                    d3.select(this)
                        .select('.s-circle')
                        .attr('cx', self.x(i) + 16)
                        .attr('cy', self.getQuadrantHeight() + 15)
                        .attr('r', 0)
                        .style('fill', '#2b3a5f')
                        .style('opacity', 0)
                        .transition().duration(400).ease('bounce')
                        .style('opacity', 0.6)
                        .attr('r', 20)

                    d3.select(this)
                        .select('.b-bar')
                        .attr('x', self.x(i) + 14)
                        .attr('y', self.getQuadrantHeight())
                        .attr('width', 5)
                        .attr('rx', 2)
                        .attr('ty', 2)
                        .style('fill', 'url(#v-gradient)')
                        .attr('height', 0)
                        .transition().duration(1000).ease(self.ease)
                        .attr('y', self.y(d.value))
                        .attr('height', self.getQuadrantHeight() - self.y(d.value))

                    d3.select(this)
                        .select('.b-circle')
                        .attr('cx', function () {
                            return self.x(i) + 16
                        })
                        .attr('cy', self.getQuadrantHeight() + 15)
                        .attr('r', 0)
                        .style('fill', 'url(#c-gradient)')
                        .transition().duration(200).ease('bounce')
                        .attr('r', 15)

                    d3.select(this)
                        .select('.b-text')
                        .attr('x', self.x(i) + 5)
                        .attr('y', self.getQuadrantHeight() + 20)
                        .text(function () {
                            if (self.data[0][i]) {
                                return self.data[0][i].name
                            } else {
                                return ''
                            }
                        })
                        .style('opacity', 0)
                        .transition().duration(1000).ease(self.ease)
                        .style('opacity', 1)

                    d3.select(this)
                        .each(function () {
                            d3.select(this)
                                .select('.m-tooltip .tip-con')
                                .attr('x', self.x(i) - 15)
                                .attr('y', self.y(d.value) - 40)
                                .attr('rx', 2)
                                .attr('ry', 2)

                            d3.select(this)
                                .select('.m-tooltip .tips')
                                .attr('x', self.x(i) + 17)
                                .attr('y',  self.y(d.value) - 20)
                                .text((d.value * 100).toFixed(2) + '%')
                        })

                    d3.select(this)
                        .on('mouseover', function () {
                            d3.select(this)
                                .select(".b-bar")
                                .transition().duration(500)
                                .attr("width", 17)
                                .attr('x', self.x(i) + 8)

                            d3.select(this)
                                .select(".b-circle")
                                .transition().duration(500)
                                .attr('r', 20)

                            d3.select(this)
                                .select(".m-tooltip")
                                .transition().duration(500)
                                .style('opacity', 1)
                        })
                        .on('mouseout', function () {
                            d3.select(this)
                                .select(".b-bar")
                                .transition().duration(300)
                                .attr("width", 5)
                                .attr('x', self.x(i) + 14)

                            d3.select(this)
                                .select(".b-circle")
                                .transition().duration(300)
                                .attr("r", 15)

                            d3.select(this)
                                .select(".m-tooltip")
                                .transition().duration(500)
                                .style('opacity', 0)
                        })
                })
        },
        /**
         * 获取象限宽度
         * @returns {number}
         */
        getQuadrantWidth: function () {
            return $(this.container).find('svg').width() - this.margin.left - this.margin.right
        },
        /**
         * 获取象限高度
         * @returns {number}
         */
        getQuadrantHeight: function () {
            return $(this.container).find('svg').height() - this.margin.top - this.margin.bottom
        },
        /**
         * 获取x轴起点相对位置
         * @returns {number}
         */
        xStart: function () {
            return this.margin.left
        },
        /**
         * 获取y轴起点相对位置
         * @returns {number}
         */
        yStart: function () {
            return $(this.container).find('svg').height() - this.margin.bottom
        },
        /**
         * 获取x轴终点相对位置
         * @returns {number}
         */
        xEnd: function () {
            return $(this.container).find('svg').width() - this.margin.right
        },
        /**
         * 获取y轴终点相对位置
         * @returns {number}
         */
        yEnd: function () {
            return this.margin.top
        },
        /**
         * 获取默认数据
         * @param {boolean=} isNew 是否立即生成新数据 false：返回上一次成功生成的旧数据
         * @param {number=} numberOfSeries 线条数
         * @param {number=} numberOfDataPoint 每条线条的刻度数
         * @returns {Array}
         */
        getData: function (isNew, numberOfSeries, numberOfDataPoint) {
            var DEFAULT_VALUE = {
                isNew: true,
                numberOfSeries: 3,
                numberOfDataPoint: 101
            }

            if (arguments.length === 0) {
                isNew = DEFAULT_VALUE.isNew
                numberOfSeries = DEFAULT_VALUE.numberOfSeries
                numberOfDataPoint = DEFAULT_VALUE.numberOfDataPoint
            } else if (arguments.length === 1) {
                if (typeof arguments[0] === 'boolean') {
                    isNew = arguments[0]
                    numberOfSeries = DEFAULT_VALUE.numberOfSeries
                } else {
                    isNew = DEFAULT_VALUE.isNew
                    numberOfSeries = arguments[0]
                }
                numberOfDataPoint = DEFAULT_VALUE.numberOfDataPoint
            } else if (arguments.length === 2) {
                if (typeof arguments[0] === 'boolean') {
                    isNew = arguments[0]
                    numberOfSeries = arguments[1]
                    numberOfDataPoint = DEFAULT_VALUE.numberOfDataPoint
                } else {
                    isNew = DEFAULT_VALUE.isNew
                    numberOfSeries = arguments[0]
                    numberOfDataPoint = arguments[1]
                }
            }

            var data = []

            if (isNew) {
                for (var i = 0; i < numberOfSeries; ++i) {
                    data.push(
                        d3
                            .range(numberOfDataPoint)
                            .map(function (i) {
                                    return {
                                        x: i,
                                        y: Math.random() * 10
                                    }
                                }
                            )
                    )
                }
            } else {
                for (var k = 0; k < this.data.length; k++) {
                    data.push(
                        _.slice(this.data[k], numberOfSeries, numberOfDataPoint)
                    )
                }
            }

            return data
        },
        /**
         * 设置数据
         * @param {Array=} data
         * @returns {BarChart}
         */
        setData: function (data) {
            if (!data) {
                this.data = this.getData()
            } else {
                this.data = [data]
            }

            return this
        }
    }

    return BarChart
})
