/**
 * @Author:      zhanghq
 * @DateTime:    2017-06-16 15:15:47
 * @Description: 饼图组件
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-06-16 15:15:47
 */

define(function (require) {
    /**
     * 引入公用的文件
     */
    require('d3')
    require('lodash')
    // 引入公用的组件
    var commonUnit = require('../commonUnit')

    var splitPie = {

        /**
         * 饼图默认配置项
         */
        defaultSetting: function () {
            return {
                width: 260,
                height: 260,
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                min: 0,
                max: 40, // 限制平分最多个数
                scale: 0.6, // 用于控制平分后圆的大小
                outerRadius: 260 / 4,
                innerRadius: 260 / 3,
                color: ['#c00cee', '#351393'],
                stroke: '#051046',
                strokeWidth: 3
            }
        },

        /**
         *  默认数据源
         */
        defaultDataSource: function () {
            return [20, 100]
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
        drawCharts: function (id, data1, opt) {
            var config = _.merge({}, this.defaultSetting(), opt)
            var data = data1[0] || this.defaultDataSource()
            var name = data1[1]
            var svg = commonUnit.addSvg(id, config)
            var nums = []
            var dataset = data
            var dataSum = 0
            var w = config.width
            var h = config.height
            var max = config.max
            var min = config.min
            var scale = config.scale

            var pie = d3.layout.pie().sort(null) // 饼图布局
            var pieData = []
            var sum = 0

            // 计算一个比例
            var unit = Math.ceil(d3.max(dataset) * scale / (max - min))

            for (var i = 0, len = dataset.length; i < len; i++) {
                // 根据比例得到每个值平分多少份
                var num = Math.ceil(dataset[i] / unit)
                for (var j = 1; j < num + 1; j++) {
                    pieData.push(1)
                }
                //计算总值
                dataSum += dataset[i]
                // 保存平分多少份的值用于后面填充颜色
                nums.push(num)
                sum += num
            }

            // 获取update部分
            var update = svg.selectAll('g')
                .data(pie(pieData))

            // 获取enter部分
            var enter = update.enter()

            // 获取exit部分
            var exit = update.exit()

            // 处理enter部分
            var appendG = enter.append('g')
                .attr({
                    class: 'group',
                    transform: 'translate(' + w / 2 + ', ' + (h / 2) + ')'
                })
            var path = appendG.append('path')
            this.addElement(path, nums, config)

            // 处理update部分
            var selectG = update.attr({
                class: 'group',
                transform: 'translate(' + w / 2 + ', ' + (h / 2) + ')'
            })
            path = selectG.select('path')
            this.addElement(path, nums, config)

            // 处理exit部分
            exit.remove()

            svg.selectAll('.nameGroup')
              .data(name)
              .enter()
              .append('g')
              .attr('class', 'nameGroup')
              .each(function (d, i) {
                  var attr = {}
                  var angle = Math.PI * 2 / sum
                  var count = 0
                  var last = 0
                  var midAngel

                  for (var k = 0; k <= i; k++) {
                      count += nums[k]
                      last = nums[k]
                  }

                  attr.startAngle = angle * (count - last)
                  attr.endAngle = angle * count

                  midAngel = attr.startAngle + (attr.endAngle - attr.startAngle) / 2

                  // 线条弧度
                  var lineArc = d3.svg.arc()
                      .innerRadius(1.1 * 166)
                      .outerRadius(1.1 * 212)

                  // 文字弧度
                  var lEndArc = d3.svg.arc()
                      .innerRadius(1.4 * 166)
                      .outerRadius(1.4 * 212)

                  var pos = lEndArc.centroid(attr)
                  // 改变文字标识的x坐标
                  var radius = 400
                  pos[0] = radius * (midAngel < Math.PI ? 1.1 : -1.1)

                  d3.select(this)
                      .append('polyline')
                      .attr('points', [lineArc.centroid(attr), lEndArc.centroid(attr), pos])
                      .style('fill', 'none')
                      .style('stroke', function () {
                          return config.color[i]
                      })
                      .attr('transform', 'translate(' + w / 2 + ', ' + (h / 2) + ')')
                      .attr('stroke-width', 2)

                  //文字
                  d3.select(this)
                      .append('text')
                      .attr('x', pos[0])
                      .attr('y', pos[1])
                      .style('fill', config.color[i])
                      .style('text-anchor', midAngel < Math.PI ? 'end' : 'start')
                      .attr('transform', 'translate(' + w / 2 + ', ' + (h / 2) + ')')
                      // .attr('width', 260)
                      .each(function () {
                          d3.select(this)
                              .append('tspan')
                              .attr('x', pos[0])
                              .attr('y', pos[1] - 20)
                              .text(Math.round(dataset[i] / dataSum * 100) + '%')

                          d3.select(this)
                              .append('tspan')
                              .attr('x', pos[0])
                              .attr('y', pos[1] + 50)
                              .text(name[i])
                              .attr('dy', 10)
                      })
              })
        },

        /**
         *  @describe [添加元素]
         */
        addElement: function (dom, nums, config) {
            var c = 0
            var cc = nums[0]
            var outerRadius = config.outerRadius  // 外半径
            var innerRadius = config.innerRadius // 内半径
            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)
            // 填充颜色
            var color = config.color
            dom.attr({
                fill: function (d, i) {
                    if (i === cc) {
                        c++
                        cc += nums[c]
                    }
                    return color[c]
                },
                d: arc,
                stroke: config.stroke,
                'stroke-width': config.strokeWidth
            })
        }
    }
    return splitPie
})
