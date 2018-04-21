/**
 * @Author XieYang
 * @DateTime 2017/8/21 9:43
 * @Description
 * @LastModifiedBy
 * @LastModifiedTime
 */

function RadarChart(id, data, options) {
    var cfg = {
        w: 400,				//宽度
        h: 400,				//高度
        margin: {top: 20, right: 20, bottom: 20, left: 20}, //SVG边界值
        levels: 3,				//雷达图的刻度数（圆圈数量）
        maxValue: 0, 			//最大的刻度（圆圈）代表的值
        labelFactor: 1.25, 	//放置文本标签位置
        opacityArea: 1, 	//区域图的不透明度
        dotRadius: 1, 			//区域图顶点圆圈的大小
        strokeWidth: 2, 		//区域图的笔触宽度
        roundStrokes: false,	//区域图边线样式（设置为true为圆滑的曲线）
        color: d3.scale.category10()	//颜色
    };

    //将所有选项放入cfg变量中
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) {
                cfg[i] = options[i];
            }
        }
    }

    //如果提供的maxValue小于实际值，则替换为数据中的最大值
    data = [data]
    var maxValue = Math.max(cfg.maxValue, d3.max(data, function (i) {
        return d3.max(i.map(function (o) {
            return o.value;
        }))
    }))

    /**
     * 轴名称
     * @type {Array|*}
     */
    var allAxis = (data[0].map(function (i) {
        return i.name
    }))
    /**
     * 轴的数量
     * @type {Number}
     */
    var total = allAxis.length
    /**
     * 最外圈的半径
     * @type {number}
     */
    var radius = Math.min(cfg.w / 2, cfg.h / 2)
    /**
     * 百分比格式
     */
    var Format = d3.format('%')
    /**
     * 控制雷达图轴的旋转：如果轴数量为4，根据项目需求将轴顺时针旋转45度，如果为其他数量则不旋转
     */
    var num = total === 4 ? total : 2
    /**
     * 每一个轴之间相距的角度大小
     * @type {number}
     */
    var angleSlice = Math.PI * 2 / total

    /**
     * 半径比例尺
     */
    var rScale = d3.scale.linear()
        .range([0, radius])
        .domain([0, maxValue]);

    //删除存在同名的id/class图表
    d3.select(id).select("svg").remove();

    //初始化雷达图的svg
    var svg = d3.select(id).append("svg")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar" + id);

    var g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");


    //渐变滤镜
    var raGradient = g.append('defs')
        .append('linearGradient')
        .attr('id', 'ra-gradient')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '100%')
        .attr('y2', '0%')

    raGradient.append('stop')
        .attr('offset', '0%')
        .attr('style', 'stop-color:#2649f8;stop-opacity: 0.9')

    raGradient.append('stop')
        .attr('offset', '100%')
        .attr('style', 'stop-color:#7c1bf8;stop-opacity: 0.9')


    /**
     * 绘制圆形网格
     */
        //网格和轴的容器
    var axisGrid = g.append("g").attr("class", "axisWrapper");

    //网格形式：采用画弧函数
    var arc = d3.svg.arc()

    //画刻度圆圈
    axisGrid.selectAll(".levels")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter()
        .append("path")
        .attr("class", "gridCircle")
        .style("fill", 'none')
        .style("stroke", 'none')
        .style('opacity', 0)
        .style('stroke-width', 1)
        .transition().duration(1000).ease('sin-out')
        .attr("d", function (d) {
            arc
                .outerRadius(radius / (cfg.levels * 2) * d * 2)
                .innerRadius(radius / (cfg.levels * 2) * (d * 2 - 1))
            return arc({'startAngle': 0, 'endAngle': Math.PI * 2})
        })
        .style('opacity', 1)
        .style("fill", '#022567')
        .style("stroke", function (d, i) {
            if (d % 2 === 0) {
                return '#024eb0'
            }
        })
        .style('stroke-width', 2)

    /**
     * 画坐标轴
     */
        //创建从中心向外辐射的直线
    var axis = axisGrid.selectAll(".axis")
            .data(data[0])
            .enter()
            .append("g")
            .attr("class", "axis");

    //添加直线
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function (d, i) {
            return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / num);
        })
        .attr("y2", function (d, i) {
            return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / num);
        })
        .attr("class", "line")
        .style("stroke", "#0053bb")
        .style("stroke-width", "2px");

    //添加文本的分割线
    axis.append("path")
        .attr("class", "textLine")
        .attr('transform', function (d, i) {
            return 'translate(' + rScale(maxValue * 1.13) * Math.cos(angleSlice * i - Math.PI / num) + ',' + rScale(maxValue * 1.12) * Math.sin(angleSlice * i - Math.PI / num) + ')'
        })
        .style('fill', '#01779b')
        .attr('d', function (d, i) {
            var x = rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / num)
            var s = ''
            if (x >= 0) {
                s = ''
            } else {
                s = '-'
            }

            return 'M0,0 L' + s + '20,0 L' + s + '40,20 L' + s + '100,20 L' + s + '100,21 L' + s + '40,21 L' + s + '20,2 L0,2'
        })

    //添加文本的导向图形
    axis.append('path')
        .attr("class", "polygon")
        .style('fill', '#00ffff')
        .attr('transform', function (d, i) {
            return 'translate(' + rScale(maxValue * 1.12) * Math.cos(angleSlice * i - Math.PI / num) + ',' + rScale(maxValue * 1.12) * Math.sin(angleSlice * i - Math.PI / num) + ')'
        })
        .attr('d', 'M4.401,4.703 L-0.875,4.705 L-3.515,0.136 L-0.878,-4.434 L4.398,-4.436 L7.077,0.133 Z')

    //添加轴文本
    axis.append("text")
        .attr("class", "legend")
        .attr("text-anchor", function (d, i) {
            if (rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / num) > 0) {
                return 'start'
            } else {
                return 'end'
            }
        })
        .attr("dy", "0")
        .attr("x", function (d, i) {
            var x = rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / num)
            if (x > 0) {
                return x + 35
            } else {
                return x - 35;
            }
        })
        .attr("y", function (d, i) {
            var y = rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / num)
            if (y > 0) {
                return y + 2
            } else {
                return y + 22
            }
        })
        .style('fill', '#febf00')
        .each(function (d, i) {
            d3.select(this)
                .append('tspan')
                .text(d.name)
            d3.select(this)
                .append('tspan')
                .attr('x', function () {
                    var x = rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / num)
                    if (x > 0) {
                        return x + 35
                    } else {
                        return x - 35
                    }
                })
                .attr('dy', '2em')
                .text(Format(d.value))
        })

    /**
     * 画雷达图的区域
     * @type {*|{startAngle, clockwise, splitNumber, axisLabel}}
     */

        //径向线
    var radarLine = d3.svg.line.radial()
            .interpolate("linear-closed")
            .radius(function (d) {
                return rScale(d.value);
            })
            .angle(function (d, i) {
                return i * angleSlice;
            });

    //是否采用圆滑的曲线
    if (cfg.roundStrokes) {
        radarLine.interpolate("cardinal-closed");
    }

    //雷达区域图容器
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    //雷达图区域
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function (d) {
            return radarLine(d.map(function (d) {
                return {
                    name: d.name,
                    value: 0
                }
            }))
        })
        .transition().duration(1000).ease('sin-out')
        .attr("d", function (d) {
            return radarLine(d);
        })
        .style("fill", "url(#ra-gradient)")
        .style("fill-opacity", cfg.opacityArea)
        .attr("transform", function () {
            if (total === 4) {
                return 'rotate(' + 180 / total + ')'
            } else {
                return ''
            }
        })

    setTimeout(function () {
        blobWrapper
            .select(".radarArea")
            .on('mouseover', function () {
                d3.selectAll(".radarArea")
                    .transition().duration(300)
                    .style("fill-opacity", 0.1);

                d3.select(this)
                    .transition().duration(300)
                    .style("fill-opacity", 0.7);
            })
            .on('mouseout', function () {
                d3.selectAll(".radarArea")
                    .transition().duration(300)
                    .style("fill-opacity", cfg.opacityArea);
            })
    }, 1000)

    //创建轮廓
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function (d) {
            return radarLine(d.map(function (d) {
                return {
                    name: d.name,
                    value: 0
                }
            }))
        })
        .transition().duration(600).ease('sin-out')
        .attr("d", function (d) {
            return radarLine(d);
        })
        .attr("transform", function () {
            if (total === 4) {
                return 'rotate(' + 180 / total + ')'
            } else {
                return ''
            }
        })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", '#0fb4f8')
        .style("fill", "none")

}