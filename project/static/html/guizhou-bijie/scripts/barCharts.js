/*
 * @Author: liqi@hiynn.com 
 * @Date: 2017-12-21 11:52:35 
 * @Description: 绘制图表
 * @Last Modified by: liqi@hiynn.com
 * @Last Modified time: 2017-12-21 15:10:23
 */

// 模拟数据
var dataset = [
    {
      'name': '网吧管理-伤上网人员',
      'value': 50234
    },
    {
      'name': 'SIS-长途汽车站',
      'value': 40934
    },
    {
      'name': '卡扣管理-车辆通过',
      'value': 40000
    },
    {
      'name': '旅店管理-国内旅客',
      'value': 39340
    },
    {
      'name': 'SIS-通话记录',
      'value': 36340
    },
    {
      'name': '户籍管理-常住人口',
      'value': 30340
    },
    {
      'name': '新警综-接警处信息',
      'value': 20340
    },
    {
      'name': '户籍管理-变更更正',
      'value': 10340
    }
  ]

// 初始化 echarts
// ==============
var chart = echarts.init(document.getElementById('barStatistics'))
var gridWidth = 370
var max = Math.max(...dataset.map(d => d.value))

// 定义背景柱形图的值
var bgdata = []
for (var [i, d] of dataset.entries()) {
  bgdata.push({
    name: d.name,
    value: [max, i]
  })
}
 
  chart.setOption({
    tooltip: {
        show: true,
        trigger: 'axis',
        confine: true,
        formatter: function(params){
          var value = params[0].value
          var name = params[0].name
          console.log(value)
          return name + '<br />' + value + '条'
        },
        axisPointer: {
            type: 'line',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    yAxis: {
      type: 'category',
      data: dataset.map(d => d.name),
      inverse: true,
      axisLabel: {
        fontSize: 14,
        color: '#00d2ff'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    xAxis: {
      type: 'value',
      min: 0,
      max,
      splitNumber: 3,
      axisLabel: {
        fontSize: 14,
        color: '#00d2ff'
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          width: 0.5,
          color: 'rgba(255, 255, 255, .3)'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    grid: {
      show: false,
      width: gridWidth,
      height: 180,
      top: 0,
      left: '28%'
    },
    series: [
      // 柱形
      {
        type: 'bar',
        data: dataset,
        barWidth: 10,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 0,
              [
                { offset: 0, color: 'rgba(20, 42, 73, .64)' },
                { offset: 1, color: 'rgba(44, 153, 193, 1)' }
              ]
            )
          }
        }
      },
      // 背景
      {
        type: 'pictorialBar',
        data: bgdata,
        symbol: 'image://./images/bar.png',
        symbolSize: ['100%', '70%']
      },
      // 斜切图形
      {
        type: 'pictorialBar',
        data: (function () {
          var chunk = []
          for (var d of dataset) {
            var rate = d.value / max
            chunk.push({
              name: d.name,
              value: d.value,
              symbolOffset: [gridWidth * rate - 8, 0]
            })
          }
          return chunk
        }()),
        symbol: 'path://M0 0, 18 0, 27 10, 9 10Z ',
        symbolSize: 10,
        itemStyle: {
          normal: {
            color: '#ffc845'
          }
        }
      }
    ]
  })
 