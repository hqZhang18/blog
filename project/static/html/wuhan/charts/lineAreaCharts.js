/**
 * @Author XieYang
 * @DateTime 2017/08/08 14:26
 * @Description 线图/区域图组件
 */

define(function () {
    /**
     * 构造函数
     * @param options 参数列表
     * @constructor
     */
    function LineChart(options) {
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
            top: 20,
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
        this.x = options.x || d3.time.scale()

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
        this.ease = 'sin-out'

        this.format = d3.format('%')
        this.timeFormat = d3.time.format('%Y.%m')
    }

    /**
     * 原型
     */
    LineChart.prototype = {
        /**
         * 构造函数修复
         */
        constructor: LineChart,
        /**
         * 设置x轴域
         * @returns {LineChart}
         */
        setX: function (data) {
            this.x
                .domain([new Date(data[1].date) * 0.99, new Date(data[data.length - 1].date) * 0.995])
                .range([0, this.getQuadrantWidth()])

            return this.x
        },
        /**
         * 设置外容器大小
         * 缺省高度时，高度值等于宽度值
         *
         * @param {number || string} width 容器宽度
         * @param {number || string=} height 容器高度
         * @returns {LineChart}
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
         * @returns {LineChart}
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
                    .append("g")
                    .attr("class", "axes")

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
                .orient("bottom")
                .tickValues(function () {
                    var s = _.map(self.data[0], function (d, i) {
                        if (i > 0 && i < self.data[0].length - 1) {
                            return new Date(d.date)
                        } else {
                            return ''
                        }
                    })

                    return s
                })
                .tickFormat(function (d) {
                    if (d) {
                        return self.timeFormat(d)
                    } else {
                        return ''
                    }

                })

            axesG.append('g')
                .attr("class", "x axis")
                .attr("transform", function () {
                    return "translate(" + self.xStart() + "," + self.yStart() + ")"
                })
                .call(xAxis)
                .selectAll('text')
                .attr("transform", function (d) {
                    return "rotate(-55)"
                })
                .style("text-anchor", "end")
        },
        /**
         * 渲染Y轴
         * @param axesG Y轴容器
         */
        renderYAxis: function (axesG) {
            var self = this
            var yAxis = d3.svg.axis()
                .scale(this.y.range([this.getQuadrantHeight(), 0]))
                .orient("left")
                .ticks(this.yTicks)

            axesG.append("g")
                .attr("class", "y axis")
                .attr("transform", function () {
                    return "translate(" + self.xStart() + "," + self.yEnd() + ")"
                })
                .call(yAxis)
                .selectAll('text')
                .style("text-anchor", "right")
                .text(function (d) {
                    return self.format(d)
                })
        },
        /**
         * 滤镜及裁剪
         */
        defineChartClip: function () {
            var padding = 10

            this.svg
                .append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", -6)
                .attr("y", -padding)
                .attr("width", this.getQuadrantWidth())
                .attr("height", this.getQuadrantHeight() + padding)

            //渐变滤镜
            var gradient = this.svg.select('defs')
                .append('linearGradient')
                .attr('id', 'gradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '0%')

            gradient.append('stop')
                .attr('offset', '0%')
                .attr('style', 'stop-color:#028b9b;stop-opacity:0.7')

            gradient.append('stop')
                .attr('offset', '100%')
                .attr('style', 'stop-color:#013c89;stop-opacity:0.7')

            //渐变笔触滤镜
            var strokeGradient = this.svg.select('defs')
                .append('linearGradient')
                .attr('id', 'strokeGradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '100%')
                .attr('y2', '0%')

            strokeGradient.append('stop')
                .attr('offset', '0%')
                .attr('style', 'stop-color:#00f5f6;stop-opacity:1')

            strokeGradient.append('stop')
                .attr('offset', '100%')
                .attr('style', 'stop-color:#028bfe;stop-opacity:1')

            //径向渐变滤镜
            var radialGradient = this.svg.select('defs')
                .append('radialGradient')
                .attr('id', 'radialGradient')
                .attr('r', '50%')
                .attr('cx', '50%')
                .attr('cy', '50%')
                .attr('fx', '50%')
                .attr('fy', '50%')

            radialGradient.append('stop')
                .attr('offset', '0%')
                .attr('style', 'stop-color:#1afefe;stop-opacity:1')

            radialGradient.append('stop')
                .attr('offset', '100%')
                .attr('style', 'stop-color:#08fdfd;stop-opacity:0')
        },
        /**
         * 渲染图表主体
         */
        renderChart: function () {
            if (!this.chart) {
                this.chart = this.svg
                    .append("g")
                    .attr("class", "chartBody")
                    .attr("transform", "translate("
                        + (this.xStart() + 8) + ","
                        + (this.yEnd() - 2) + ")")
                    .attr("clip-path", "url(#body-clip)")
            }

            this.renderLines()

            this.renderAreas()

            this.renderDots()
        },
        /**
         * 渲染线图
         */
        renderLines: function () {
            var self = this
            var line = d3.svg.line()
                .x(function (d) {
                    return self.x(new Date(d.date))
                })
                .y(function (d) {
                    return self.y(d.value)
                })
                .interpolate('cardinal')

            self.chart
                .selectAll("path.line")
                .data(self.data)
                .enter()
                .append("path")
                .style("stroke", 'url(#strokeGradient)')
                .style('stroke-width', 4)
                .style('fill', 'none')
                .attr("class", "line")

            self.chart
                .selectAll("path.line")
                .data(self.data)
                .attr("d", function (d) {
                    return line(d.map(function (d) {
                        return {
                            date: d.date,
                            value: 0
                        }
                    }))
                })
                .transition().duration(600).ease(self.ease)
                .attr("d", function (d) {
                    return line(d)
                })
        },
        /**
         * 渲染线图上的圆圈及tooltip
         */
        renderDots: function () {
            var self = this
            var calcPos = function (x) {
                if (x < 0) {
                    return x + 80
                } else if (x + 60 > self.getQuadrantWidth()) {
                    return x - 80
                } else {
                    return x
                }
            }

            this.data.forEach(function (list) {
                self.chart
                    .selectAll('g.circleBox')
                    .data(list)
                    .enter()
                    .append('g')
                    .attr('class', 'circleBox')
                    .each(function (d, j) {
                        d3.select(this)
                            .append("circle")
                            .attr("class", "dot rg_" + j)

                        d3.select(this)
                            .append("circle")
                            .attr("class", "dot _" + j)

                        d3.select(this)
                            .append('g')
                            .attr('class', 'tt-' + j + ' m-tooltip')
                            .each(function () {
                                d3.select(this)
                                    .append('rect')
                                    .attr('class', 'tip-con')

                                d3.select(this)
                                    .append('text')
                                    .attr('class', 'tips')
                                    .style('text-anchor', 'start')
                            })
                    })

                self.chart
                    .selectAll('g.circleBox')
                    .each(function (d, j) {
                        d3.select(this)
                            .select('.rg_' + j)
                            .attr("r", 0)
                            .style('opacity', 0)
                            .transition().duration(1000).ease(self.ease)
                            .attr("cx", self.x(new Date(d.date)))
                            .attr("cy", self.y(d.value))
                            .attr("r", 10)
                            .style('fill', 'url(#radialGradient)')
                            .style('opacity', 1)

                        d3.select(this)
                            .select("._" + j)
                            .attr("r", 0)
                            .style("stroke", '#1afdfd')
                            .style('opacity', 0)
                            .transition().duration(1000).ease(self.ease)
                            .attr("cx", self.x(new Date(d.date)))
                            .attr("cy", self.y(d.value))
                            .attr("r", 3)
                            .style('fill', '#d4ffff')
                            .style('stroke-width', 2)
                            .style('opacity', 1)

                        d3.select(this)
                            .select('.tt-' + j)
                            .each(function (d) {
                                if (j > 0 && j < self.data[0].length) {
                                    d3.select(this)
                                        .select('.tip-con')
                                        .attr('x', calcPos(self.x(new Date(d.date)) + 14))
                                        .attr('y', -50)
                                        .attr('rx', 2)
                                        .attr('ry', 2)

                                    d3.select(this)
                                        .select('.tips')
                                        .attr('x', calcPos(self.x(new Date(d.date)) + 20))
                                        .attr('y', -30)
                                        .text((d.value * 100).toFixed(2) + '%')
                                }
                            })

                        self.chart.select("circle.rg_" + j)
                            .on('mouseover', function () {
                                d3.select(this)
                                    .transition().duration(300).ease(self.ease)
                                    .attr("r", 15)

                                d3.select('.m-tooltip.tt-' + j)
                                    .transition().duration(300).ease(self.ease)
                                    .style("opacity", 1)
                                    .each(function () {
                                        d3.select(this)
                                            .select('.tip-con')
                                            .transition().duration(300).ease(self.ease)
                                            .attr('y', self.y(d.value) - 20)

                                        d3.select(this)
                                            .select('.tips')
                                            .transition().duration(300).ease(self.ease)
                                            .attr('y', self.y(d.value))
                                    })
                            })
                            .on('mouseout', function () {
                                d3.select(this)
                                    .transition().duration(300).ease(self.ease)
                                    .attr("r", 10)

                                d3.select('.m-tooltip.tt-' + j)
                                    .transition().duration(300).ease(self.ease)
                                    .style("opacity", 0)
                                    .each(function () {
                                        d3.select(this)
                                            .select('.tip-con')
                                            .transition().duration(300).ease(self.ease)
                                            .attr('y', -50)

                                        d3.select(this)
                                            .select('.tips')
                                            .transition().duration(300).ease(self.ease)
                                            .attr('y', -30)
                                    })
                            })

                        self.chart.select("circle._" + j)
                            .on('mouseover', function () {
                                d3.select("circle.rg_" + j)
                                    .transition().duration(300)
                                    .attr("r", 15)

                                d3.select('.m-tooltip.tt-' + j)
                                    .transition().duration(300)
                                    .style("opacity", 1)
                                    .each(function () {
                                        d3.select(this)
                                            .select('.tip-con')
                                            .transition().duration(300)
                                            .attr('y', self.y(d.value) - 20)

                                        d3.select(this)
                                            .select('.tips')
                                            .transition().duration(300)
                                            .attr('y', self.y(d.value))
                                    })
                            })
                    })
            })
        },
        /**
         * 渲染面积图
         */
        renderAreas: function () {
            var self = this
            var area = d3.svg.area()
                .x(function (d) {
                    return self.x(new Date(d.date))
                })
                .y0(self.yStart())
                .y1(function (d) {
                    return self.y(d.value)
                })
                .interpolate('cardinal')

            self.chart.selectAll("path.area")
                .data(self.data)
                .enter()
                .append("path")
                .attr("class", "area")
                .style("fill", "url(#gradient)")

            self.chart.selectAll("path.area")
                .data(self.data)
                .attr("d", function (d) {
                    return area(d.map(function (d) {
                        return {
                            date: d.date,
                            value: 0
                        }
                    }))
                })
                .transition().duration(1000).ease('sin-out')
                .attr("d", function (d) {
                    return area(d)
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
         * @returns {LineChart}
         */
        setData: function (data) {
            if (!data) {
                this.data = this.getData()
            } else {
                this.data = [data]
            }

            this.data[0].unshift({
                date: (new Date(this.data[0][0].date).getFullYear() - 1) + '',
                value: 0.5
            })
            this.data[0].push({
                date: (new Date(this.data[0][this.data[0].length - 1].date).getFullYear() + 1) + '',
                value: 0.5
            })

            return this
        }
    }

    return LineChart
})
