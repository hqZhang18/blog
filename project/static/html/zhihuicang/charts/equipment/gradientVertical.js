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
        /**
         * 柱状图默认配置项
         */
        defaultSetting: function () {
            return {
                width: 500,
                height: 200,
                fontFamily: '微软雅黑',
                min: 1,
                // svg的上右下左的值(用于控制文字显示不全)
                padding: {
                    top: 35,
                    right: 30,
                    bottom: 0,
                    left: 30
                },
                // 条形图配置项
                itemStyle: {
                    width: 6,
                    height: 6,
                    // 背景色填充
                    color: '#282f36',
                    // 渐变配置项
                    gradient: {
                        color: ['#9936e8', '#49aefe'],
                        id: 'linearColor',
                        x1: '0%',
                        y1: '0%',
                        x2: '100%',
                        y2: '0%',
                        offset1: '0%',
                        offset2: '100%',
                        opacity1: 1,
                        opacity2: 1
                    },
                    radius: 0,  // 条形图两边的半径,
                    margin: {
                        top: 10,
                        right: 30,
                        bottom: 0,
                        left: 50
                    }
                },
                // 左边文字配置项
                leftText: {
                    fontSize: 12,
                    color: 'yellow',
                    textAnchor: 'end'
                },
                // 右边文字配置项
                rightText: {
                    fontSize: 12,
                    color: '#fff',
                    textAnchor: 'middle'
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
            var config = _.merge({}, this.defaultSetting(), opt)
            var dataset = []
            for (var i = 0, len = data.length; i < len; i++) {
                dataset.push(data[i].value)
            }
            var padding = config.padding

            var height = config.height + padding.top + padding.bottom

            // 创建svg
            var svg = commonUnit.addSvg(id, config)
            /**
             * 获取update部分
             */
            var update = svg.selectAll('.group')
                .data(data)

            // 获取enter部分
            var enter = update.enter()

            // 获取exit部分
            var exit = update.exit()

            // 处理exit
            exit.remove()

            // y轴
            var yxis = svg.append('g').attr('class','yxis')
            var ydata = []
            var yitem = Math.floor(d3.max(dataset) / 4)
            for (var i=0; i< 6; i++){
                ydata.push(yitem*i)
            }
            var yxisT = yxis.selectAll('text').data(ydata)

            // 样式标识
            var flag = svg.append('g').attr('class','flag')

            // 计算行高
            var height = config.height
            var lineHeigh = height / dataset.length
            // 处理enter部分
            var appendG = enter.append('g')
                .attr('transform', function (d, i) {
                    return 'translate(' + (i) + ',0)'
                })
                .attr('class', 'group')

            // 处理update部分
            var selectG = update

            var lText = appendG.append('text')
            var rect = appendG.append('rect')
            var rectbg = appendG.append('rect')
            var rText = appendG.append('text')
            var dom = {
                lText: lText,
                rect: rect,
                rectbg: rectbg,
                rText: rText,
                yxis: yxisT,
                flag: flag
            }
            // 初始化调用添加元素的方法
            this.addElement(id, data, dom, config)

            lText = selectG.select('.left-text')
            rect = selectG.select('.rect-data')
            rectbg = selectG.select('.rect-bg')
            rText = selectG.select('.right-text')
            yxis = svg.select('.yxis').selectAll('text').data(ydata)
            flag = svg.select('.flag')

            dom = {
                lText: lText,
                rect: rect,
                rectbg: rectbg,
                rText: rText,
                yxis: yxis,
                flag: flag
            }
            // 有更新的调用添加元素的方法
            this.addElement(id, data, dom, config)
        },


        /**
         *  @describe [添加元素(text, rect, rect, text)]
         *  @param    {[string]}   id   [容器id]
         *  @param    {[object]}   dom  [各元素集合]
         */
        addElement: function (id, data, dom, config) {
            var dataset = []
            for (var i = 0, len = data.length; i < len; i++) {
                dataset.push(data[i].value)
            }
            var padding = config.padding

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

            // 添加标识渐变
            var gradientFlag = _.cloneDeep(itemStyle.gradient)
            gradientFlag.id = 'gradientf'
            gradientFlag.x1 = '30%'
            gradientFlag.x2 = '100%'
            gradientFlag.y2 = '0%'
            var colorsFlag = [
                {
                    id: gradientFlag.id,
                    color: gradientFlag.color
                }
            ]
            commonUnit.addGradient(id, colorsFlag, gradientFlag)

            var height = config.height - padding.top - padding.bottom
            // 数据的显示范围
            // 设置左边文字
            var leftTxt = config.leftText

            // 右边文字配置
            var rightTxt = config.rightText
            var margin = itemStyle.margin
            // 数据最大宽度
            var dataHeight = height

            var yScale = d3.scale.linear()
                .domain([0, d3.max(dataset)])
                .range([dataHeight, 0])

            var xScale = d3.scale.linear()
                .domain([0, dataset.length])
                .range([(config.width-config.padding.right) * 0.065, (config.width-config.padding.right) * 1.036])

            // 添加左边文字
            dom.lText
                .attr({
                    fill: leftTxt.color,
                    'font-size': leftTxt.fontSize,
                    'text-anchor': leftTxt.textAnchor,
                    class: 'left-text',
                    x: function (d, i) {
                        return xScale(i) + 60
                    },
                    y: itemStyle.height,
                    'transform': function (d, i) {
                        return 'translate(0,' + (dataHeight + 50) + ')'
                    }
                })
                .text(function (d, i) {
                    return data[i].name
                })

            // 添加数据
            dom.rect
                .attr({
                    class: 'rect-data',
                    fill: 'url(#' + gradientCfg.id + ')',
                    y: function (d) {
                        var dHeight = dataHeight - yScale(d.value)
                        if (dHeight <= 0) {
                            dHeight = config.min
                        }
                        return height - dHeight + 10
                    },
                    x: function (d, i) {
                        return xScale(i) + padding.left
                    },
                    rx: itemStyle.radius,
                    ry: itemStyle.radius,
                    width: itemStyle.width,
                    height: function (d) {
                        var dHeight = dataHeight - yScale(d.value)
                        if (dHeight <= 0) {
                            dHeight = config.min
                        }
                        return dHeight - 10
                    }
                })
            // 背景框
            dom.rectbg
                .attr({
                    class: 'rect-bg',
                    fill: 'none',
                    stroke: '#0c40a3',
                    'stroke-width': 2,
                    width: itemStyle.width + 24,
                    height: dataHeight + 88,
                    x: function(d,i){
                        return xScale(i) + padding.left -12
                    },
                    y: function (d) {
                        return - dataHeight + padding.top + 136
                    },
                    rx: itemStyle.radius,
                    ry: itemStyle.radius
                })
            // 添加右边文字
            dom.rText
                .attr({
                    fill: rightTxt.color,
                    'fill-opacity': 0.4,
                    'font-size': rightTxt.fontSize,
                    'text-anchor': rightTxt.textAnchor,
                    x: function (d, i) {
                        return xScale(i) + 60
                    },
                    y: function (d) {
                        var dHeight = dataHeight - yScale(d.value)
                        if (dHeight <= 0) {
                            dHeight = config.min
                        }
                        return yScale(i) - dHeight - 20
                    },
                    class: 'right-text'
                })
                .text(function (d, i) {
                    return data[i].value
                })
            // 添加Y轴
            dom.yxis
                .enter()
                .append('text')
                .attr({
                    class: 'yxis',
                    fill: leftTxt.color,
                    'font-size': leftTxt.fontSize,
                    'text-anchor': leftTxt.textAnchor,
                    x: 50,
                    y: function(d,i){
                        return dataHeight - d
                    }
                })
                .text(function(d){
                    return d
                })
            dom.yxis
                .attr({
                    class: 'yxis',
                    fill: leftTxt.color,
                    'font-size': leftTxt.fontSize,
                    'text-anchor': leftTxt.textAnchor,
                    x: padding.left + 20,
                    y: function(d,i){
                        var offset = dataHeight - 105*i
                        return offset
                    }
                })
                .text(function(d){
                    return d
                })
            // 添加标识
            if (!dom.flag.select('rect')[0][0]){
                dom.flag.append('rect')
                    .attr({
                        fill: 'url(#' + gradientFlag.id + ')',
                        width: 65,
                        height: 18,
                        x: config.width - config.padding.right - config.padding.left -140,
                        y: 0,
                        transform: 'translate(0,'+(-config.padding.top+rightTxt.fontSize/2.5)+')'
                    })
                dom.flag.append('text')
                    .attr({
                        fill: rightTxt.color,
                        'fill-opacity': 0.4,
                        'font-size': rightTxt.fontSize,
                        'text-anchor': rightTxt.textAnchor,
                        x: config.width - config.padding.right - config.padding.left -20,
                        y: 0,
                        transform: 'translate(0,'+(-config.padding.top+rightTxt.fontSize)+')'
                    })
                    .text('总数')
            }else{
                dom.flag.select('rect')
                    .attr({
                        fill: 'url(#' + gradientFlag.id + ')',
                        width: 65,
                        height: 18,
                        x: config.width - config.padding.right - config.padding.left -140,
                        y: 0,
                        transform: 'translate(0,'+(-config.padding.top+rightTxt.fontSize/2.5)+')'
                    })
                dom.flag.select('text')
                    .attr({
                        fill: rightTxt.color,
                        'fill-opacity': 0.4,
                        'font-size': rightTxt.fontSize,
                        'text-anchor': rightTxt.textAnchor,
                        x: config.width - config.padding.right - config.padding.left -20,
                        y: 0,
                        transform: 'translate(0,'+(-config.padding.top+rightTxt.fontSize)+')'
                    })
                    .text('总数')
            }
        }
    }
    return gradientBar
})