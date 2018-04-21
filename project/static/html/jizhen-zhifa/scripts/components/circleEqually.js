/**
 * @Author:      lee
 * @DateTime:    2017-05-26
 * @Description: 平分圆
 */

define(function(require) {

    var commonUnit = require('../components/commonUnit.js')
    var constants = require('../util/constants.js')

    var circleData = {
        defaultSetting: function() {
            return {
                width: 450,
                height: 450,
                padding: {
                    left: 105,
                    right: 105,
                    top: 105,
                    bottom: 105
                },
                radius: 40,
                fill:'none',
                item:{
                    name:{
                        color:'#fcd64c',//name 字体颜色
                        fontSize:'22px'
                    },
                    value:{
                        color:'#fff',//value 字体颜色
                        fontSize:'32px'
                    }
                }

            }
        },
        /**
         * 绘制圆图
         */
        drawCharts: function(id, data, opt) {

            var config = _.merge({}, this.defaultSetting(), opt)
            var width = config.width
            var height = config.height
            var padding = config.padding

            //创建svg
            var svg = commonUnit.addSvg(id, config)

            var cx = (width - config.padding.left - config.padding.right);
            var cy = (height - config.padding.top - config.padding.bottom);

            var dataset = [];
            data.map(function(item,index) {
                dataset.push({
                    value:100
                })
            })

            var pie = d3.layout.pie()
                        .value(function(d) {
                            return d.value
                        })
            var piedata = pie(dataset)

            var outerRadius = cx / 2;
            var innerRadius = 0;

            var arc = d3.svg.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius)

            d3.select(id).selectAll('.group').remove()
            var arcs = svg.selectAll("g")
                        .data(piedata)
                        .enter()
                        .append("g")
                        .attr("transform","translate(" + (cx / 2) + "," + (cy / 2) + ")")
                        .attr('class', 'group')

            arcs.append("path")
                .attr("fill",config.fill)
                .attr("d",function(d) {
                    return arc(d)
                })
                .attr("stroke",config.fill)//把边线给抹了

            //name文本
            arcs.append("text")
                .attr("transform",function(d) {
                    var x = arc.centroid(d)[0] * 2.2;
                    var y = arc.centroid(d)[1] * 2.2;
                    return "translate(" + x + ","+ y +")"
                })
                .attr("text-anchor","middle")
                .attr('font-size',config.item.name.fontSize)
                .attr('fill', config.item.name.color)
                .text(function(d,i) {
                    return data[i].name
                })
            //value
            arcs.append("text")
                .attr("transform",function(d) {
                    var x = arc.centroid(d)[0] * 2.2;
                    var y = arc.centroid(d)[1] * 2.2 + 36;
                    return "translate(" + x + ","+ y +")"
                })
                .attr("text-anchor","middle")
                .attr('font-size',config.item.value.fontSize)
                .attr('fill', config.item.value.color)
                .text(function(d,i) {
                    return data[i].value
                })
            arcs.append('image')
                .attr('width', 16)
                .attr('height', 16)
                .attr('xlink:href',  constants.SVG_IMG_PATH+'/images/mark.png')
                .attr("transform",function(d) {
                    var x = arc.centroid(d)[0] * 1.2;
                    var y = arc.centroid(d)[1] * 1.2;
                    return "translate(" + x + ","+ y +")"
                })


        }
    }

    return circleData
})