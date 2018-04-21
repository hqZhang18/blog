/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-26 14:37:01
 * @Description: 源头控制页面右边部分功能JS文件
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-26 14:37:01
 */

define(function(require) {

    var numberOperation = require('../components/behaviorCount.js')
    var constants = require('../util/constants')
    var SourceCenter = {

        /**
         *  @describe [号码操作历程图]
         *  @param    {[type]}   data [description]
         *  @return   {[type]}   [description]
         */
        renderNumberOperation: function(data) {
            $('.number-operation').find('.number').html(window.numberOperation)
            $('.number-operation').find('.detail').html(data.name)
            $('.number-operation').find('.status').html(data.status)
            $('.number-operation').find('.date-range').html(data.time)
            var data = data.group
            //console.log(data)
            var config = {
                width: 850,
                height: 335,
                zoom: 1,
                padding: {
                    left: 90
                },
                areaPath: {
                    fill: ['#01c9d8', '#0e1e71'],
                    stroke: 'none',
                    strokeWidth: 1,
                    interpolate: 'linear'
                },
                linePath: {
                    fill: 'none',
                    stroke: '#44e2f2',
                    strokeWidth: 2,
                    interpolate: 'linear'
                },
                gradientCfg: {
                    id: 'numOpt',
                    x1: '0%',
                    y1: '0%',
                    x2: '0%',
                    y2: '100%',
                    offset1: '0%',
                    offset2: '100%',
                    opacity1: 1,
                    opacity2: 0.2
                },
                yAxis: {
                    axisLine: {
                        show: true
                    },
                    gridLine: {
                        show: true
                    },
                    ticks: 6
                },
                xText: {
                    intercept: false, //文字是否截取
                    skew: true, //x轴文字是滞倾斜
                },
                topMark: {
                    fill: '#ffff00'
                },
                grid: {
                    x: 50,
                    x2: 10,
                    y: 90,
                    y2: 40
                }
            }
            var newData = []
            var checkValue = [] //存储value值，用于判断去除同value的数据
            data.map(function(item,index) {
                if(newData.length < 8 && checkValue.indexOf(item.value) == -1) {
                    checkValue.push(item.value)
                    newData.push(item)
                }
            })
            //newData.concat(data.slice(data.length - 2, data.length))
            //console.log(checkValue)
            var popData = data.pop() //获取最后一项，注意原数据已经被更改
            newData.push(popData)
            //console.log(newData)
            // if (data.length == 0) {
            //     newData = []
            // } else {
            //     var count = 0
            //     newData = newData.concat(data.slice(0, 2))
            //     var currentData = []
            //     while (count < 8) {
            //         var index = this.randomIndex(data.length - 2)
            //         newData.push(data[index])
            //         count++
            //     }
            //     newData = newData.concat(data.slice(data.length - 2, data.length))
            // }

            // if (data.length < 10) {
            //     newData = data
            // }

            numberOperation.drawCharts('.number-operation-charts', newData, config)
        },
        randomIndex: function(count) {
            var index = Math.floor(Math.random() * count)
            return index < 2 ? 2 : index
        },
        //号码触及模型统计
        renderModelCount: function(data) {
            var circleEqually = require('../components/circleEqually.js')
            var config = {}
            circleEqually.drawCharts("#circleEqually", data, config)
        }
        
    }

    return SourceCenter
})