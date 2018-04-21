/**
 * @Author XieYang
 * @DateTime 2017/8/31 13:48
 * @Description
 * @LastModifiedBy
 * @LastModifiedTime
 */

define(function (require) {
    return {
        init: function (data) {
            this.render(data)
        },
        render: function (data) {
            var svg = d3.select('.regPerDistribution')

            //获取最大值
            var dataset = []
            data.forEach(function (d) {
                dataset.push(d.value)
            })

            var xScale = d3.scale.linear().domain([0, data.length + 1]).range([0, 3160])
            var yScale = d3.scale.linear().domain([d3.max(dataset), 0]).range([0, 540])

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .tickPadding(20)

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left')
                .ticks(6)

            //渲染坐标轴
            svg
                .append('g')
                .attr('class', 'axes')
                .each(function () {
                    d3.select(this)
                        .append('g')
                        .attr('class', 'x axis')
                        .attr('transform', function () {
                            return 'translate(' + 140 + ',' + 540 + ')'
                        })
                        .call(xAxis)
                        .selectAll('text')
                        .style('text-anchor', 'middle')
                        .text(function (d) {
                            if (!d || d === data.length + 1) {
                                return ''
                            } else {
                                return data[d - 1].name
                            }
                        })

                    d3.select(this)
                        .append('g')
                        .attr('class', 'y axis')
                        .attr('transform', function () {
                            return 'translate(' + 30 + ',' + 0 + ')'
                        })
                        .call(yAxis)
                        .selectAll('text')
                        .attr('x', 100)
                        .attr('y', 0)
                        .style('text-anchor', 'end')
                        .text(function (d) {
                            return d
                        })

                    d3.selectAll('g.y g.tick')
                        .append('line')
                        .attr('class', 'grid-line')
                        .attr('transform', function (d, i) {
                            return 'translate(' + 110 + ',' + 0 + ')'
                        })
                        .attr('x1', 0)
                        .attr('y1', 0)
                        .attr('x2', 3160)
                        .attr('y2', 0)
                })


            var chart = svg
                .selectAll('.v-bar')
                .data(data)

            var vGradient = svg.append('defs')
                .append('linearGradient')
                .attr('id', 'vGradient')
                .attr('x1', '0%')
                .attr('y1', '0%')
                .attr('x2', '0%')
                .attr('y2', '100%')

            vGradient.append('stop')
                .attr('offset', '0%')
                .attr('style', 'stop-color:#0194ff')

            vGradient.append('stop')
                .attr('offset', '100%')
                .attr('style', 'stop-color:#01edff')

            chart
                .enter()
                .append('g')
                .attr('class', 'bar-box')
                .each(function (d, i) {
                    d3.select(this)
                        .append('rect')
                        .attr('class', 'vbar-bg')

                    d3.select(this)
                        .append('rect')
                        .attr('class', 'vbar')
                })

            chart
                .each(function (d, i) {
                    d3.select(this)
                        .select('.vbar-bg')
                        .attr('x', xScale(i + 1) + 100)
                        .attr('y', 48)
                        .attr('width', 83)
                        .attr('height', 490)
                        .style('fill', '#0d153a')
                        .style('fill-opacity', '0.3')

                    d3.select(this)
                        .select('.vbar')
                        .attr('x', xScale(i + 1) + 100)
                        .attr('y', yScale(d.value) + 48)
                        .attr('width', 83)
                        .attr('height', 490 - yScale(d.value))
                        .style('fill', 'url(#vGradient)')
                })
        }
    }
})