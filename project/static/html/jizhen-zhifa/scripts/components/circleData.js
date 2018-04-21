/**
 * @Author:      lee
 * @DateTime:    2017-05-25
 * @Description: 过程监督业务维度统计
 */

define(function(require) {

    var commonUnit = require('../components/commonUnit.js')
    var constants = require('../util/constants.js')

    var circleData = {
        defaultSetting: function() {
            return {
                width: 626,
                height: 400,
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                },
                minRadius: 50,
                fill: ['rgba(0,108,255,0.2)','rgba(0,108,255,0.4)','rgba(0,108,255,0.6)','rgba(0,108,255,0.8)','rgba(0,174,255,1)'],
                circleTop: 20 // 小圆圈直径方向偏移量
            }
        },
        /**
         * 绘制圆图
         */
        drawCharts: function(id, data, opt) {
            var realData  = data
            var data  = [
                {
                  "name": "办理",
                  "value": 75  
                },{
                  "name": "结案",
                  "value": 60  
                },{
                  "name": "归档",
                  "value": 45  
                },{
                  "name": "受理",
                  "value": 30  
                },{
                  "name": "打印",
                  "value": 15  
                }
            ]

           
            realData.sort(function(a, b){
              return parseInt(a.value, 10) < parseInt(b.value, 10)
            })
            //console.log(realData)
            var config = _.merge({}, this.defaultSetting(), opt)
            var width = config.width
            var height = config.height

            //创建svg
            var svg = null
            if (d3.select(id).selectAll('svg')[0].length > 0) {
                svg = d3.select(id).selectAll('svg')
            } else {
                svg = d3.select(id)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
            }

            var maxValue = d3.max(data, function(d) {
                return d.value
            })

            var minValue = d3.min(data, function(d) {
                return d.value
            })

            var dataset = data.sort(function(a, b) { //根据层级，要先绘制大的
                return b.value - a.value
            })

            var cx = (config.width - config.padding.left - config.padding.right) / 2; //中心线
            var maxRadius = Math.floor((config.height - config.padding.top - config.padding.bottom) / 2) -20; //最大半径弄小点，不然文本超出了

            var opacity = parseFloat((1 / dataset.length).toFixed(1))

            //计算圆的半径
            var linear = d3.scale.linear()
                .domain([minValue, maxValue])
                .range([config.minRadius, maxRadius])

            //组合
            var group = svg.selectAll('g')
                .data(data)
                .enter()
                .append('g')

            //画圆
            group.append('circle')
                .attr('r', function(d) {
                    return linear(d.value)
                })
                .attr('cx', cx)
                .attr('cy', function(d) {
                    return config.height - config.padding.top - config.padding.bottom - linear(d.value)
                })
                .attr('fill',function(d,i) {
                    return config.fill[i]
                })
                .attr("stroke",'#45b1f6')
                .attr("stroke-width",3)

            //小圈圈，整图片    
            group.append('image')
                .attr('width', 10)
                .attr('height', 10)
                .attr('xlink:href', constants.SVG_IMG_PATH + '/images/prgv-circle.png')
                .attr('x', cx)
                .attr('y', function(d) {
                    return (config.height - config.padding.top - config.padding.bottom - linear(d.value) * 2) + config.circleTop
                })

            group.append('line')
                .attr('x1', cx)
                .attr('y1', function(d) {
                    return (config.height - config.padding.top - config.padding.bottom - linear(d.value) * 2) + config.circleTop + 5
                })
                .attr('x2', function(d, index) {
                    if(index % 2 == 0) {
                        return width - 90
                    }
                    return 60
                })
                .attr('y2', function(d) {
                    return (config.height - config.padding.top - config.padding.bottom - linear(d.value) * 2) + config.circleTop + 5
                })
                .attr('stroke', '#fff')
                .attr('stroke-width', 1)
             //添加name   
            group.append('text')
                .attr('x', function(d, index) {
                    if(index % 2 == 0) {
                        return width - 115
                    }
                    return 85
                })
                .attr('y', function(d, index) {
                    return (config.height - config.padding.top - config.padding.bottom - linear(d.value) * 2) + config.circleTop - 4
                })
                .text(function(d, i) {
                    return realData[i].name
                })
                .attr('font-size','26px')
                .attr('fill', '#5e98cd')
                .attr('text-anchor', 'middle')

             //添加value   
            group.append('text')
                .attr('x', function(d, index) {
                    if(index % 2 == 0) {
                        return width - 115
                    }
                    return 85
                })
                .attr('y', function(d, index) {
                    return (config.height - config.padding.top - config.padding.bottom - linear(d.value) * 2) + config.circleTop + 34
                })
                .text(function(d, i) {
                    return realData[i].value
                })
                .attr('font-size','24px')
                .attr('fill', '#fff')
                .attr('text-anchor', 'middle')

        }
    }

    return circleData
})