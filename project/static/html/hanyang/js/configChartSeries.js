define(function(){
	var config = {
		series1:[{
            name: '',
            type: 'line',
            itemStyle: {
                normal: {
                    color: '#fffc53'
                }
            },
            lineStyle: {
                normal: {
                    color: '#fffc53',
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    //从上到下的渐变色
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(255, 252, 83, 1)'
                           }, {
                            offset: 1,
                            color: 'rgba(23, 41, 66, 0.2)'
                          }])
                        }
            },
            data: []
		},{
            name: '',
            type: 'line',
            // hoverAnimation:true,
            itemStyle: {
                normal: {
                    color: '#66ffff'
                }
            },
            lineStyle: {
                normal: {
                    color: '#66ffff',
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    //从上到下的渐变色
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(115, 247, 253, 1)'
     }, {
                            offset: 1,
                            color: 'rgba(50, 120, 150, 0.3)'
     }])
                }
            },
            data: [],
            markPoint: {
            }
   }, {		name:'',
            type: 'line',
            itemStyle: {
                normal: {
                    color: 'rgba(120, 43, 120, 1)'
                }
            },
            lineStyle: {
                normal: {
                    color: 'rgba(120, 43, 120, 1)',
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    //从上到下的渐变色
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(120, 43, 120, 1)'
     }, {
                            offset: 1,
                            color: 'rgba(120, 43, 120, 0.3)'
     }])
                }
            },
            data: []
       }],
	series2:[{
            name: '实时线',
            type: 'line',
            symbol: 'rect',
            symbolSize: 6,
            symbolRotate: 45,
            data: [],
            color: ['#74fbfd'],
		},{
            name: '预测线',
            type: 'line',
            symbol: 'rect',
            symbolRotate: 45,
            symbolSize: 6,
            data: [],
            color: ['#ff6633'],
		}, {
            name: '平均',
            type: 'line',
            symbol: 'rect',
            symbolRotate: 45,
            symbolSize: 6,
            data: [],
            color: ['rgba(120, 43, 120, 1)']
		}],
	series3:[{
            type: 'line',
            name: '',
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
                normal: {
                    color: 'rgba(115,247,253,0.6)',
                    borderColor: 'rgb(115,247,253)',
                    borderWidth: 2
                }
            },
            lineStyle: {
                normal: {
                    color: 'rgb(115,247,253)',
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    color: "rgba(115,247,253,0.5)"
                }
            },
            data: [],
            smooth: true,
            smoothMonotone: 'x'
		}, {
            type: 'line',
            name: '',
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
                normal: {
                    color: 'rgba(51,102,255,0.6)',
                    borderColor: 'rgb(51,102,255)',
                    borderWidth: 2
                }
            },
            lineStyle: {
                normal: {
                    color: 'rgb(51,102,255)',
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    color: "rgba(51,102,255,0.5)"
                }
            },
            data: [],
            smooth: true,
            smoothMonotone: 'x'
        }, {
            type: 'line',
            name: '',
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
                normal: {
                    color: 'rgba(120, 43, 120, 0.6)',
                    borderColor: 'rgba(120, 43, 120, 1)',
                    borderWidth: 2
                }
            },
            lineStyle: {
                normal: {
                    color: 'rgba(120, 43, 120, 1)',
                    width: 2
                }
            },
            areaStyle: {
                normal: {
                    color: "rgba(120, 43, 120, 0.5)"
                }
            },
            data: [],
            smooth: true,
            smoothMonotone: 'x'
         }]

	}

	return config
})