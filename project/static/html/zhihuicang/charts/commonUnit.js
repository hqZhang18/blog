/**
 * @Author:      zhanghq
 * @DateTime:    2017-06-16 12:40:43
 * @Description: 绘制图表共用方法
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-06-16 12:40:43
 */

define(function (require) {
    require('jquery')

    var yAxisConfig = {
        id: 'yaxis',
        ratio: false,
        axisLine: {
            show: true
        },
        gridLine: {
            show: false
        },
        ticks: 5,
        isLoss: false,
        position: 'left',
        direction: 0,
        unit: '0'
    }


    var commonUnit = {

        imgPath: function () {
            IMG_PATHS = [
                // 社情图片路径
                '../../images/sheqing/'
            ]
            return IMG_PATHS
        },
        /**
         *  @describe [创建svg]
         *  @param    {string}   id     [容器id]
         *  @param    {[object]}   config [配置项]
         */
        addSvg: function (id, config) {
            var svg = null
            var padding = config.padding
            var width = config.width - padding.right - padding.left
            var height = config.height - padding.top - padding.bottom
            if (d3.select(id).selectAll('svg').node()) {
                svg = d3.select(id).select('svg')
                    .call(addAttr)
            } else {
                svg = d3.select(id).append('svg')
                    .call(addAttr)
            }

            /**
             *  @添加svg的attr
             *  @param    {[object]} root [根元素]
             */
            function addAttr() {
                this.attr({
                    width: width,
                    height: height
                })
                    .style('padding', function () {
                        var top = padding.top
                        var bottom = padding.bottom
                        var left = padding.left
                        var right = padding.right
                        return top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px'
                    })
            }

            return svg
        },

        /**
         *  添加提示框
         *  @param    {string}   id     容器id
         *  @param    {object}   data   配置项
         */
        addTooltip: function (id, data) {
            var html = '<p>' + data.name + ' <p>'
                + '<p>数量:' + data.value + ' <p>'
            var tooltip
            if (d3.select('body').selectAll('.charts-tooltip').node()) {
                tooltip = d3.selectAll('.charts-tooltip')
            } else {
                tooltip = d3.select('body')
                    .append('div')
                    .attr('class', 'charts-tooltip')
            }
            tooltip.html(html)
            // 提示框添加内容后的width
            var width = $('.charts-tooltip').width()
            // 提示框添加内容后的height
            var height = $('.charts-tooltip').height()
            // 由于页面缩放了,这里的是缩放之后添加的div。用当前位置要除以缩放的值(暂时忽略这句)
            // event.clientY, event.pageY, event.y三个值相等
            var top = event.pageY / window.Y - height * 2
            var left = event.pageX / window.X - width
            if (data.name.length < 5) {
                left = left + width
            }
            tooltip
                .style({
                    top: top + 'px',
                    left: left + 'px'
                })
        },

        /**
         *  添加渐变
         *  @param    {string}   id      容器id
         *  @param    {array}    colors  渐变颜色
         *  @param    {object}   config  配置项
         */
        addGradient: function (id, colors, config) {
            var defs = null
            var svg = d3.select(id).select('svg')
            if (svg.selectAll('defs').node()) {
                defs = svg.selectAll('defs')
            } else {
                defs = svg.append('defs')
            }
            colors.forEach(function (item) {
                var color = item.color
                var id = item.id
                var a = d3.hcl(color[0])
                var b = d3.hcl(color[1])

                if (d3.select(id).selectAll(id).length > 0) {
                    return
                }
                // 添加渐变色
                var gradient = defs.append('linearGradient')
                    .attr({
                        'id': id,
                        'x1': config.x1,
                        'y1': config.y1,
                        'x2': config.x2,
                        'y2': config.y2
                    })

                // 开始颜色
                gradient.append('stop')
                    .attr('offset', config.offset1)
                    .style({
                        'stop-color': a.toString(),
                        'stop-opacity': config.opacity1
                    })
                // 结束颜色
                gradient.append('stop')
                    .attr('offset', config.offset2)
                    .style({
                        'stop-color': b.toString(),
                        'stop-opacity': config.opacity2
                    })
            })
        },

        /**
         *  添加滤镜效果
         *  @param    {string}   id     容器id
         *  @param    {object}   config 配置项
         */
        addFilter: function (id, config) {
            // 配置项
            var config = {
                id: 'filter1',
                blur: 2
            }
            var svg = d3.select(id).select('svg')
            // 判断是否有defs
            var defs = this.isDefs(id)
            // 判断是否存在filter
            if (svg.selectAll('filter').node()) {
                return
            }

            // 添加渐变色
            var filter = defs.append('filter')
                .attr({
                    id: config.id,
                    x: '0%',
                    y: '0%',
                    width: '200%',
                    height: '200%'
                })

            filter.append('feOffset')
                .attr({
                    result: 'offOut',
                    in: 'SourceAlpha',
                    dx: 2,
                    dy: 2
                })

            // 创建模糊效果
            filter.append('feGaussianBlur')
                .attr({
                    result: 'blurOut',
                    in: 'SourceGraphic',
                    stdDeviation: config.blur
                })

            filter.append('feBlend')
                .attr({
                    in: 'SourceGraphic',
                    in2: 'blurOut',
                    mode: 'normal'
                })
        },

        /**
         *  @describe 添加图片填充
         *  @param    {type}   id     容器id
         *  @param    {type}   config 配置项
         */
        addPattern: function (id, config) {
            var config = {
                id: 'image',
                width: 200,
                height: 200,
                image: {
                    width: 500,
                    height: 200,
                    href: './../images/barBg.png',
                }
            }
            var svg = d3.select(id).select('svg')
            var defs = this.isDefs(id)
            // 判断是否存在pattern
            if (svg.selectAll('pattern').node()) {
                return
            }
            defs.append('pattern')
                .attr({
                    id: config.id,
                    width: 0.01,
                    height: 100,
                    x: 20,
                    y: 100
                })
                .append('rect')
                .attr({
                    x: 0,
                    y: 0,
                    width: 1,
                    height: 300,
                    fill: 'none',
                    stroke: '#183baf'
                })
        },

        /**
         *  添加Y轴及网格线
         *  @param    {object}   svg       svg容器
         *  @param    {type}     config    配置项
         *  @param    {type}     dataset   数据
         *  @return   {object}             Y轴比例尺
         */
        addYAxis: function (svg, config, dataset) {
            var padding = config.padding
            var width = config.width - padding.left - padding.right
            var height = config.height
            var yAxisCfg = _.merge({}, yAxisConfig, config.yAxis)
            var domain = []
            // 是否负数
            var isLoss = yAxisCfg.isLoss
            if (isLoss) {
                domain = [d3.min(dataset) * 1.3, d3.max(dataset) * 1.3]
            } else {
                domain = [0, d3.max(dataset) * 1.3]
            }
            // 定义y轴比例尺
            var yScale = d3.scale.linear()
                .domain(domain)
                .range([height - config.grid.y - config.grid.y2, 0])

            // 定义y轴样式
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient(yAxisCfg.position)
                .ticks(yAxisCfg.ticks)
                .tickFormat(function (d) {
                    if (yAxisCfg.ratio) {
                        return d != 0 ? d + '%' : d
                    }
                    if (yAxisCfg.unit == 'w') {
                        return d / 10000
                    }
                    return d
                })

            // 设置Y轴属性
            function axisYAttr() {
                this.attr({
                    class: 'axis axis-y',
                    id: yAxisCfg.id,
                    transform: function () {
                        return 'translate(' + yAxisCfg.direction + ', ' + config.grid.y2 + ')'
                    }
                })
                    .call(yAxis)
            }

            var isAxisLine = yAxisCfg.axisLine.show
            if (isAxisLine) {
                if (svg.selectAll('#' + yAxisCfg.id + '.axis-y').node()) {
                    svg.select('#' + yAxisCfg.id + '.axis-y')
                        .call(axisYAttr)
                } else {
                    svg.append('g')
                        .call(axisYAttr)
                }
            }

            // 定义纵轴网格线
            var isGridLine = yAxisCfg.gridLine.show
            if (isGridLine) {
                var yInner = d3.svg.axis()
                    .scale(yScale)
                    .tickSize(-width, 0)
                    .tickFormat('')
                    .orient('left')
                    .ticks(yAxisCfg.ticks)
                // 添加纵轴网格线
                if (svg.selectAll('svg .inner-line-y').node()) {
                    svg.select('#' + yAxisCfg.id + '.inner-line-y')
                        .call(innerLineAttr)
                } else {
                    svg.append('g')
                        .call(innerLineAttr)
                }

                function innerLineAttr() {
                    this.attr('class', 'inner_line inner-line-y')
                        .attr('transform', 'translate(0, ' + config.grid.y2 + ')')
                        .call(yInner)
                }


            }
            return yScale
        },

        /**
         *  @describe [添加X轴]
         *  @param    {[type]}   svg     [svg容器]
         *  @param    {[type]}   config  [配置项]
         *  @param    {[type]}   dataset [数据]
         *  @return   {[object]}   [X轴比例尺]
         */
        addXAxis: function (svg, config, xData) {
            var padding = config.padding
            var width = config.width - padding.left - padding.right
            var height = config.height
            // 定义X轴比例尺(序数比例尺)
            var xScale = d3.scale.ordinal()
                .domain(xData)
                .rangeBands([0, width])
            // 定义X轴
            var xAxis = d3.svg.axis()
                .scale(xScale)      // 指定比例尺
                .orient('bottom')   // 指定刻度的方向
                .innerTickSize(6)
                .outerTickSize(6)

            // 添加X轴
            if (svg.selectAll('.axis-x').node()) {
                svg.select('.axis-x')
                    .call(axisXAttr)
            } else {
                svg.append('g')
                    .call(axisXAttr)
            }

            function axisXAttr() {
                this
                    .attr({
                        class: 'axis axis-x',
                        transform: function () {
                            return 'translate(0,' + (height - config.grid.y + 1) + ')'
                        }
                    })
                    .call(xAxis)
            }

            // 替换X轴文字
            var id = config.id
            for (var i = 0, len = xData.length; i < len; i++) {
                $('' + id + ' .axis-x').find('.tick text').eq(i).text(xData[i])
            }
            return xScale
        },

        /**
         *  @describe [获取X轴transform的x值]
         *  @param    {[array]}   data [数据]
         *  @return   {[array]}   [x轴所有transform的位置]
         *
         * * example:
         * [
         *  {
     *    name: 'name',
     *    value: 'value'
     *  }
         * ]
         */
        getTransformX: function (id, data) {
            var transX = []
            var newData = this.unique(data)
            for (var j = 0, len = newData.length; j < len; j++) {
                var posiX = $('' + id + ' .axis-x').find('.tick').eq(j).attr('transform')
                // posiX = posiX.replace(' ', ',')  // ie兼容处理
                var index = posiX.indexOf(',')
                transX.push(posiX.substring(10, index))
            }
            return transX
        },

        /**
         *  @describe [空数据处理]
         *  @param    {[type]}   id   [容器id]
         *  @param    {[type]}   data [数据]
         *  @return   {[type]}   [description]
         *
         * example:
         * [
         *  {
     *    name: 'name',
     *    value: 'value'
     *  }
         * ]
         */
        noData: function (id, data) {
            if (data === undefined || data.length === 0) {
                // var html = '<div class="no-data">暂无数据</div>'
                $(id).find('.no-data').show()
                d3.select(id).select('svg').html('')
                return true
            }
            $(id).find('.no-data').hide()
            return false
        },
        /**
         *  判断是否存在defs
         *  @param    {string}  id 容器id
         *  @return   {object}  defs元素
         */
        isDefs: function (id) {
            // 判断是否有defs
            var defs = null
            var svg = d3.select(id).select('svg')
            if (svg.selectAll('defs').node()) {
                defs = svg.selectAll('defs')
            } else {
                defs = svg.append('defs')
            }
            return defs
        },

        /**
         *  @describe 去重
         *  @return   {[type]}   [description]
         */
        unique: function (data) {
            var res = []
            var json = {}
            for (var i = 0, len = data.length; i < len; i++) {
                if (!json[data[i].name]) {
                    res.push(data[i])
                    json[data[i].name] = 1
                }
            }
            return res
        },
    }
    return commonUnit
})
