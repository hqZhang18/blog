define(function(require) {
     /**
     * 引入公用的文件
     */
    require('lodash')
    require('d3')
    var realValse = []
    var realValse1 = []

    var RadarChart = {
        defaultSetting: function() {
            return {
                r: 100,
                level: 4,
                min: 0,
                max: 100,
                arc: 2*Math.PI,
                fixed: false,
                count: 8,
                polygon: {
                    fill: '#050e55',
                    fillOpacity: 0.5,
                    stroke: '#03539b',
                    //strokeDasharray: '10 5'
                },
                lines: {
                    stroke: '#00a0e9',
                    strokeWidth: 2,
                    strokeDasharray: '10 5'
                },
                areas: {
                    fillOpacity: 0.3,
                    fill: ['#01ccdd', '#7227b3'],
                    strokeWidth: 2,
                    stroke: ['#01ccdd', '#7227b3']
                },
                points: {
                    show: false,
                    fill: '#b6a2de',//['', '']
                    stroke: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3'],
                    r: 3
                },
                texts: {
                    show: true,
                    fill: '#5e98cd',
                    fontSize: 22,
                    offset: 20,
                    x: -14,
                    y: 5
                }
            }
        },
        drawRadarChart: function(container, data, realData, opt) {

            var newData = []
            data.forEach(function(item) {
                var qingbao = parseInt(item.qingbao, 10)
                var xingshi = parseInt(item.xingshi, 10)
            })
            var config = _.merge({}, this.defaultSetting(), opt)
            var radius = config.r;
            var level = config.level;
            var rangeMin = config.min;
            var rangeMax = config.max;
            var arc = config.arc;
            var polygonConfig = config.polygon
            var linesConfig = config.lines
            var areasConfig = config.areas
            var pointConfig = config.points
            var textConfig = config.texts
            var fixed = config.fixed
            
            var width = config.width
            var height = config.height
            var svg = null
            d3.select(container).selectAll('.radar-chart').remove()
            if(d3.select(container).selectAll('svg')[0].length > 0) {
                svg = d3.select(container).selectAll('svg')
                .append('g')
                .attr('class', 'radar-chart')
                .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
                
            }else {
                svg = d3.select(container)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append('g')
                    .attr('class', 'radar-chart')
                    .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')')
              }
       
            
            //转换数据
            var fieldNames = []
            var fillValues = []
            var values = []
            var values1 = []
            realValse = []
            realValse1 = []
            for(var i = 0, len = data.length; i < len; i++) {
                var current = data[i]
                var current2 = realData[i]
                fieldNames.push(current.name)
                values.push(current.xingshi)
                values1.push(current.qingbao)
                //用于显示真实值
                realValse.push(current2.xingshi)
                realValse1.push(current2.qingbao)
            }
           
            fillValues = realValse.concat(realValse1)
            fillValues.sort(function(a, b){
                return a - b
            })
            var cLen = parseInt(Math.ceil(data.length), 10)
            //取数组中的部分值
            var slice1 = fillValues.slice(0, 2)
            var slice2 = fillValues.slice(cLen, cLen+1)
            var slice3 = fillValues.slice(fillValues.length-2, fillValues.length)
            var fillValues2 = slice1.concat(slice2, slice3)
            //console.log(fillValues2)
            var radarData = {
                fieldNames: fieldNames,
                values: [values],
                values1: [values1]
            }

            //数据量个数，即指标的个数
            var total = 0
            if(fixed) {
                total = config.count
            } else {
                total = fieldNames.length
            }

            //每项指标所在的角度
            var onePiece = arc/total

            //网轴的正多边形所在的坐标
            var polygons = {
                webs: [],
                webPoints: []
            }

            for(var i = level; i > 0; i--) {
                var webs = ''
                var webPoints = []
                var r = radius/level * i
               // console.log(r)

                for(var k = 0; k < total; k++) {
                    var x = r * Math.sin(k * onePiece)
                    var y = r * Math.cos(k * onePiece)

                    webs += x + ',' + y + ' '
                    webPoints.push({
                        x: x,
                        y: y
                    })
                }
                //polygons.webs.push(webs)
                polygons.webs.push(r)
                polygons.webPoints.push(webPoints)
            }

            //绘制网轴

            var groups = svg.append('g')
                .attr('class', 'groups')
            
            // groups.selectAll('.polygon-radar')
            //     .data(polygons.webs)
            //     .enter()
            //     .append('polygon')
            //     .attr('fill', polygonConfig.fill)
            //     .attr('fill-opacity', polygonConfig.fillOpacity)
            //     .attr('stroke', polygonConfig.stroke)
            //     .attr('stroke-dasharray', polygonConfig.strokeDasharray)
            //     .attr('points', function(d) {
            //         return d
            //     })
            groups.selectAll('.polygon-radar')
                .data(polygons.webs)
                .enter()
                .append('circle')
                .attr('fill', polygonConfig.fill)
                .attr('fill-opacity', polygonConfig.fillOpacity)
                .attr('stroke', polygonConfig.stroke)
                .attr('stroke-dasharray', polygonConfig.strokeDasharray)
                .attr('r', function(d) {
                    return d
                })

            //添加纵轴
            var lines = svg.append('g')
                .attr('class', 'lines')
            
            lines.selectAll('.lines-radar')
                .data(polygons.webPoints[0])
                .enter()
                .append('line')
                .attr('stroke', linesConfig.stroke)
                .attr('stroke-width', linesConfig.strokeWidth)
                .attr('stroke-dasharray', linesConfig.strokeDasharray)
                .attr('class', 'lines-radar')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', function(d) {
                    return d.x
                })
                .attr('y2', function(d) {
                    return d.y
                })

            drawMianji(radarData.values, 0)
            drawMianji(radarData.values1, 1)

            function drawMianji(values, flag) {
                //计算雷达图区域并添加
                //计算雷达图的坐标
                var areasData = []
                for(var i = 0, len = values.length; i < len; i++) {
                    var value = values[i]
                    var area = ''
                    var points = []

                    for(var k = 0; k < total; k++) {
                        var r = radius * (value[k] - rangeMin)/(rangeMax - rangeMin)
                        var x = r * Math.sin(k * onePiece)
                        var y = r * Math.cos(k * onePiece)
                        area += x + ',' + y + ' '
                        points.push({
                            x: x,
                            y: y
                        })
                    }
                    areasData.push({
                        polygon: area,
                        points: points
                    })
                }

                //添加雷达图区域分组

                
                var areas = svg.append('g')
                    .attr('class', 'areas-radar')
                
                areas.selectAll('g')
                    .data(areasData)
                    .enter()
                    .append('g')
                    .attr('class', function(d, i) {
                        return 'area-radar' + (i + 1)
                    })
                
                for(var i = 0, len = areasData.length; i < len; i++) {
                    //依次循环每个雷达图区域
                    var area = areas.select('.area-radar' + (i + 1))
                    var areaData = areasData[i]

                    //绘制雷达图区域下的多边形
                    area.append('polygon')
                        .attr('points', areaData.polygon)
                        .attr('stroke', function(d, index) {
                            return areasConfig.stroke[flag]
                        })
                        .attr('stroke-width', areasConfig.strokeWidth)
                        .attr('fill', function(d, index) {
                            return areasConfig.fill[flag]
                        })
                        .attr('fill-opacity', areasConfig.fillOpacity)
                    
                    //绘制雷达图区域上的点
                    if(pointConfig.show) {
                        var circles = areas = area.append('g')
                            .attr('class', 'circle-radar')
                    
                        circles.selectAll('circle-radar-point')
                            .data(areaData.points)
                            .enter()
                            .append('circle')
                            .attr('cx', function(d) {
                                return d.x
                            })
                            .attr('cy', function(d) {
                                return d.y
                            })
                            .attr('r', pointConfig.r)
                            .attr('stroke', function(d, index) {
                                //每个圆点边框色都不同
                                if(pointConfig.stroke && _.isArray(pointConfig.stroke)) {
                                    return pointConfig.stroke[index]
                                }
                                return pointConfig.stroke
                            })
                            .attr('fill', function(d, index) {
                                //每个圆点填充色都不同
                                if(pointConfig.fill && _.isArray(pointConfig.fill)) {
                                    return pointConfig.fill[index]
                                } else if(pointConfig.fill && _.isString(pointConfig.fill)) {
                                    //单一填充色
                                    return pointConfig.fill
                                } else {
                                    //不填充
                                    return 'none'
                                }
                            })
                    }
                    
                    if(textConfig.show) {
                        //绘制文本内容
                        //计算文本的标签坐标
                        var textPoints = []
                        var textRadius = radius + textConfig.offset
                        for(var i = 0; i < total; i++) {

                            var x = textRadius * Math.sin(i * onePiece)
                            var y = textRadius * Math.cos(i * onePiece)
                            textPoints.push({
                                x: x,
                                y: y
                            })
                        }

                        //添加到画布中
                        var texts = svg.append('g')
                            .attr('class', 'text-radar-g')
                            .attr('transform', 'translate(' + textConfig.x + ',' + textConfig.y + ')')
                        
                        texts.selectAll('.text-radar')
                            .data(textPoints)
                            .enter()
                            .append('text')
                            .attr('x', function(d) {
                                var x = d.x
                                if(x<0){
                                    x = x + x/2
                                }
                                return x
                            })
                            .attr('y', function(d) {
                                return d.y
                            })
                            .attr('fill', textConfig.fill)
                            .attr('font-size', textConfig.fontSize)
                            .attr('font-family', textConfig.fontFamily)
                            .text(function(d, i) {
                                return radarData.fieldNames[i]
                            })

                         //添加value
                         // texts.selectAll('.text-radar')
                         //    .data(textPoints)
                         //    .enter()
                         //    .append('text')
                         //    .attr('x', function(d) {
                                
                         //        return 0
                         //    })
                         //    .attr('y', function(d, i) {
                         //        return  -35*i
                         //    })
                         //    .attr('fill', '#fff')
                         //    .attr('font-size', textConfig.fontSize)
                         //    .attr('font-family', textConfig.fontFamily)
                         //    .text(function(d, i) {

                         //        return Math.floor(fillValues2[i]) 
                         //    })   
                         //添加value
                         //console.log(textPoints)
                         texts.selectAll('.text-radar')
                            .data(textPoints)
                            .enter()
                            .append('text')
                            .attr('x', function(d) {
                                var x = d.x + 10
                                if(x<0){
                                    x = x + x/2
                                }
                                return x
                            })
                            .attr('y', function(d) {
                                if(flag==1){
                                 return d.y + 25
                                }else{
                                 return d.y - 25
                                }
                            })
                            .attr('fill', function(){
                                if(flag==1){
                                 return '#b617cf'
                                }else{
                                 return '#00e9f1' 
                                }
                            })
                            .attr('font-size', textConfig.fontSize)
                            .attr('font-family', textConfig.fontFamily)
                            .text(function(d, i) {
                                if(flag==1){
                                 return realValse1[i]
                                }else{
                                 return realValse[i]
                                }
                            })  
                    }
                }
            }
        }
    }

    return RadarChart
    
});