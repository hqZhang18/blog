/**
 * Created by zhouyu on 16/12/29.
 * 阶梯折线图
 */

define(function(require) {
    require('../lib/echarts')

    var ladderLine = {};
    var colorArr = ['rgb(247,146,37)', 'rgb(26,225,255)'];

    var legendDataArr = [];
    // var xAxisDataArr = ['1', ' 2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    var xAxisDataArr1 = []
    var xAxisDataArr2 = []
    var seriesArr = [];
    var Data = {};
    var datay1 = []   //去年
    var datay2 = []  //今年
    //初始化
    /**
     * [init 折线图初始化]
     * @param  {[string]} id   [HTML中渲染图表的DOM元素ID]
     * @param  {[object]} data [Ajax获取的所需要的数据]
     * @return {[type]}      [description]
     */

    //id='ladderLineChart'

    ladderLine.init = function(id, data,year,month,week) {
        var thisYear = year+''
        var lastYear = year-1+''
        console.info(month)
        console.info(week)
        legendDataArr = [{
                name: thisYear,
                icon: "circle"
            }, {
                name:lastYear,
                icon: "circle"
            }];
            ladderLine.data(data,thisYear,lastYear)
            ladderLine.option(id,month,week,year)
        }
        //格式化数据
    ladderLine.data = function(data,thisYear,lastYear) {
        for (var i = 0; i < data.lastYear.length; i++) {
                xAxisDataArr1.push(data.lastYear[i].name)
                xAxisDataArr2.push(data.thisYear[i].name)
                datay1.push(data.lastYear[i].value)
                datay2.push(data.thisYear[i].value)
        };
        if (data.hasOwnProperty("thisYear")) {
            seriesArr.push({
                name: thisYear ,
                type: 'line',
                step: 'end',
                showSymbol: false,
                connectNulls: true,
                smooth: true,
                itemStyle: {
                    normal: {
                        color: colorArr[0]
                    }
                },
                lineStyle: {
                    normal: {
                        color: colorArr[0],
                        width: 2,
                        type: 'solid'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
                            offset: 0,
                            color: 'rgba(255,255,227,0)'
                        }, {
                            offset: 1,
                            color: 'rgba(247,146,37,0.6)'
                        }], false)
                    }
                },
                data: datay2
            })
        }
        if (data.hasOwnProperty("lastYear")) {
            seriesArr.push({
                name: lastYear,
                type: 'line',
                step: 'middle',
                showSymbol: false,
                connectNulls: true,
                itemStyle: {
                    normal: {
                        color: colorArr[1]
                    }
                },
                lineStyle: {
                    normal: {
                        color: colorArr[1],
                        width: 2,
                        type: 'dashed'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
                            offset: 0,
                            color: 'rgba(255,255,227,0)'
                        }, {
                            offset: 1,
                            color: 'rgba(26,225,255,0.6)'
                        }], false)
                    }
                },
                smooth: true,
                data: datay1
            })
        }
        // console.log(seriesArr)
    }


    //echarts配置option
    ladderLine.option = function(id,month,week,year) {
        console.info(legendDataArr)
        var dom = echarts.init(document.getElementById(id));
        //梯级折线图的部分Echarts配置
        var option = {
            tooltip: {
                show: true,
                trigger: 'axis',
                confine: true,
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: "#83e6fb"
                    }
                }

            },
            legend: {
                orient: 'horizontal',
                top: 0,
                x: 'right',
                data: legendDataArr,
                textStyle: {
                    color: "rgb(26,225,255)",
                    fontSize: 14
                },
                itemWidth: 10,
                itemHeight: 10,
                formatter: "{name}"
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#2b668e"
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: "#83e6fb"
                    }
                },
                data: []
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: "#2b668e"
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: "#83e6fb"
                    }
                },
                axisTick: {
                    textStyle: {
                        color: "#83e6fb",
                        type: "dotted"

                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#2b668e",
                        type: "dashed"
                    }
                }
            },
            series: []

        };
/*        if (week||month) {
            option.xAxis.axisLabel = {
                    textStyle: {
                        color: "#83e6fb"
                    },
                    formatter:function(value,index){
                        return index
                    }
            }
        }*/

        if (week||month) {

            if (week) {
                option.xAxis.axisLabel = {
                    textStyle: {
                            color: "#83e6fb"
                        },
                    formatter:function(value,index){
                        return index+1
                    }
                }
            }else{
                option.xAxis.axisLabel = {
                    textStyle: {
                            color: "#83e6fb"
                        },
                    formatter:function(value,index){
                        return  value.substring(6,8)
                    }
                }
            }
            option.tooltip = {
                show: true,
                trigger: 'axis',
                confine: true,
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: "#83e6fb"
                    }
                },
                formatter:function(params){
                    if (params.length == 2) {
                        return  xAxisDataArr2[params[0].dataIndex]+":"+params[0].value+"</br>"+xAxisDataArr1[params[1].dataIndex]+":"+params[1].value
                    }else if (params.length == 1&&params[0].seriesName==year) {
                        return  xAxisDataArr2[params[0].dataIndex]+":"+params[0].value
                    }else if (params.length == 1&&params[0].seriesName==year-1) {
                        return  xAxisDataArr1[params[0].dataIndex]+":"+params[0].value
                    };
                }
            }
        }else{
            option.xAxis.axisLabel = {
                interval:0,
                textStyle: {
                        color: "#83e6fb"
                    }
            }
            option.tooltip = {
                show: true,
                trigger: 'axis',
                confine: true,
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: "#83e6fb"
                    }
                }
            }
        }


        if ($.inArray('当前月无29号',xAxisDataArr1)>-1) {
            option.xAxis.data = xAxisDataArr2;
        }else{
            option.xAxis.data = xAxisDataArr1;
        }
        option.series = seriesArr;
        var arrMax = Math.max.apply(null,[Math.max.apply(null,datay1),Math.max.apply(null,datay2)])
        if (arrMax<4) {
                option.yAxis.max = 4
        }
        dom.setOption(option)
    }
    return ladderLine
})


// series: [{
//     name: '今年',
//     type: 'line',
//     step: 'start',
//     showSymbol: false,
//     connectNulls: true,
//     lineStyle: {
//         normal: {
//             color: colorArr[0],
//             width: 2,
//             type: 'solid'
//         }
//     },
//     areaStyle: {
//         normal: {
//             color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
//                 offset: 0,
//                 color: 'rgba(255,255,227,0.2)'
//             }, {
//                 offset: 1,
//                 color: 'rgb(26,225,255)'
//             }], false)
//         }
//     },
//     data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90]
// }, {
//     name: '去年',
//     type: 'line',
//     step: 'middle',
//     showSymbol: false,
//     connectNulls: true,
//     lineStyle: {
//         normal: {
//             color: colorArr[1],
//             width: 2,
//             type: 'dashed'
//         }
//     },
//     areaStyle: {
//         normal: {
//             color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
//                 offset: 0,
//                 color: 'rgba(255,255,227,0.2)'
//             }, {
//                 offset: 1,
//                 color: 'rgb(247,146,37)'
//             }], false)
//         }
//     },
//     data: [220, 282, 201, 50, 332, 401, 454, 234, 290, 240, 230, 210]
// }]
