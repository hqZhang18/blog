var chart = echarts.init(document.querySelector('.platform-data  .chart'))
var data = [
              [1, 2000000],
              [2, 1500000],
              [3, 2300000],
              [4, 1800000],
              [5, 3500000],
              [6, 2400000],
              [7, 1400000]
            ]
var dataSet = data.slice(0)
dataSet.sort(function(a,b){
  return a[0] - b[0]
})
var min = dataSet[0][0]
var max= dataSet[dataSet.length - 1][0]
var option = {
    animation: true,
    title: {
        show:false,
        left: 'right',
        text: '平台记录增量变化趋势(单位：条)',
        subtext: '',
        textStyle: {
          color: '#f0ffe2',
          fontSize: 14,
          fontWeight: 500
        },
        top: 10,
        padding: [0, 20, 0, 0]
    },
    tooltip: {
        show: true,
        trigger: 'axis',
        confine: true,
        // formatter: function(params){
        //   var value = params[0].value
        //   return value[0] + '<br />' + value[1]
        // },
        axisPointer: {
            type: 'line',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    toolbox: {
        show: false,
        left: 'center',
        itemSize: 25,
        top: 55,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {}
        }
    },
    xAxis: {
        type: 'value',
        min: min,
        max: max,
        axisTick: {
          length: 0
        },
        axisLabel: {
          color: '#00d2ff',
          fontSize: 14
        },
        axisLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#3b5467',
            opacity: 0.5
          }
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        axisTick: {
            inside: false,
            length: 0
        },
        splitLine: {
            show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#3b5467',
            opacity: 0.5
          }
        },
        axisLabel: {
            inside: false,
            color: '#00d2ff',
            verticalAlign: 'middle',
            fontSize: 14,
            formatter: '{value}'
        },
        z: 10
    },
    grid: {
        top: 50,
        left: 100,
        right: 50,
        bottom: 60
    },
    dataZoom: [{
        type: 'inside',
        throttle: 50
    }],
    series: [
        {
            name:'增量',
            type:'line',
            smooth: false,
            symbol: 'image://./images/symbol.png',
            symbolSize: 15,
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: '#04d2d8',
                    // shadowBlur: 10,
                    // shadowColor: '#ffc845',
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                },
                emphasis: {
                  color: '#ffbb03' 
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: '#09aab7'
                    }, {
                      offset: 1,
                      color: 'rgba(9, 167, 181, 0)'
                    }])
                }
            },
            data: data
        }

    ]
};
chart.setOption(option)
