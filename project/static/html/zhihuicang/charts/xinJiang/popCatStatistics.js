/**
 * @Author XieYang
 * @DateTime 2017/8/31 13:48
 * @Description 人数总类图表
 * @LastModifiedBy
 * @LastModifiedTime
 */

define(function (require) {
    return {
        /**
         * 初始化
         * @param data 数据集
         * @param max 最大值（不是当前数据集[data]的最大值，而是整个接口返回的数据集的最大值）
         */
        init: function (data, max) {
            this.render(data, max)
        },
        /**
         * 渲染图表
         * @param data 数据集
         * @param max 最大值
         */
        render: function (data, max) {
            var svg = d3.select('.popCatStatistics')
            var chart = svg
                .selectAll('.bar-box')
                .data(data)

            chart.exit().remove()

            //渐变
            if (!svg.select('defs').node()) {
                var gradient = svg.append('defs')
                    .append('linearGradient')
                    .attr('id', 'bar-gradient')
                    .attr('x1', '0%')
                    .attr('y1', '0%')
                    .attr('x2', '100%')
                    .attr('y2', '0%')

                gradient.append('stop')
                    .attr('offset', '0%')
                    .attr('style', 'stop-color:#b515eb')

                gradient.append('stop')
                    .attr('offset', '100%')
                    .attr('style', 'stop-color:#0580ff')
            }

            //渲染DOM结构
            chart
                .enter()
                .append('g')
                .attr('class', 'bar-box')
                .attr('transform', function (d, i) {
                    return 'translate(0, ' + (i+1) * 60 + ')'
                })
                .each(function () {
                    d3.select(this)
                        .append('rect')
                        .attr('class', 'text-bg')

                    d3.select(this)
                        .append('text')
                        .attr('class', 'text-title')

                    d3.select(this)
                        .append('line')
                        .attr('class', 'text-line')

                    d3.select(this)
                        .append('rect')
                        .attr('class', 'bar-bg')

                    d3.select(this)
                        .append('rect')
                        .attr('class', 'bar-line-bg')

                    d3.select(this)
                        .append('rect')
                        .attr('class', 'bar')

                    d3.select(this)
                        .append('rect')
                        .attr('class', 'bar-line')

                    d3.select(this)
                        .append('text')
                        .attr('class', 'text-value')
                })

            //获取最大值
            var dataset = []
            data.forEach(function (d) {
                dataset.push(d.value)
            })

            //设置柱状图的比例尺
            var barScale = d3.scale.linear()
                .domain([0, max])
                .range([0, 493])

            chart
                .each(function (d, i) {
                    d3.select(this)
                        .select('.text-bg')
                        .attr('x', 0)
                        .attr('y', 107 * i + 10)
                        .attr('width', 240)
                        .attr('height', 82)

                    d3.select(this)
                        .select('.text-title')
                        .attr('x', 120)
                        .attr('y', 107 * i + 65)
                        .text(d.name)

                    d3.select(this)
                        .select('.text-line')
                        .attr('x1', 0)
                        .attr('y1', 107 * i + 89)
                        .attr('x2', 240)
                        .attr('y2', 107 * i + 89)

                    d3.select(this)
                        .select('.bar-bg')
                        .attr('x', 284)
                        .attr('y', 107 * i + 35)
                        .attr('width', 493)
                        .attr('height', 23)
                        .style('fill', '#032760')

                    d3.select(this)
                        .select('.bar-line-bg')
                        .attr('x', 284)
                        .attr('y', 107 * i + 63)
                        .attr('width', 493)
                        .attr('height', 3)
                        .style('fill', '#032760')

                    d3.select(this)
                        .select('.bar')
                        .attr('width', 0)
                        .transition()
                        .duration(1000)
                        .attr('x', 284)
                        .attr('y', 107 * i + 35)
                        .attr('width', barScale(d.value))
                        .attr('height', 23)
                        .style('fill', 'url(#bar-gradient)')

                    d3.select(this)
                        .select('.bar-line')
                        .attr('width', 0)
                        .transition()
                        .duration(1000)
                        .attr('x', 284)
                        .attr('y', 107 * i + 63)
                        .attr('width', barScale(d.value))
                        .attr('height', 3)
                        .style('fill', 'url(#bar-gradient)')

                    d3.select(this)
                        .select('.text-value')
                        .attr('x', 950)
                        .attr('y', 107 * i + 65)
                        .text(d.value)
                })
        }
    }
})