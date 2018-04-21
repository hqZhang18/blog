define(function(require) {
    var colorArr = ['rgb(239,140,49)', 'rgb(250,236,75)','rgb(120,215,235)','rgb(142,217,65)','rgb(238,59,59)'];
    var legendDataArr = [{
        name: "诈骗",
        icon: "rect"
    }, {
        name: "盗窃",
        icon: "rect"
    },{
    	name:"殴打他人",
    	icon:"rect",
    },{
    	name:"其他",
    	icon:"rect"
    },{
    	name:"黄赌毒",
    	icon:"rect"
    }];
	var line = {
		init:function(data){
			 var datax = this.reset(data.ZP).name
			 var data1 = this.reset(data.ZP).value //诈骗
			 var data2 = this.reset(data.DQ).value  //盗窃
			 var data3 = this.reset(data.QT).value  //其它
			 var data4 = this.reset(data.ODTR).value   //殴打他人
			 var data5 = this.reset(data.HDD).value   //黄赌毒
		     this.setLine(datax,data1,data2,data3,data4,data5)
		},

		reset:function(data){
			var resetData = {
				name:[],
				value:[]
			}
			console.log(data)
			for (var i = 0; i < data.length; i++) {
				resetData.name[i] = data[i].name
				resetData.value[i] = data[i].value
			}
			return resetData
		},
		setLine:function(datax,data1,data2,data3,data4,data5){
			var myLine = echarts.init(document.getElementById('line02')) 
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
		                top: 15,
		                x:'right',
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
		                data:datax
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
		            series: [{
		 				name: '诈骗',
		                type: 'line',
/*		                step: 'middle',   设置梯形*/
		                showSymbol: false,
		                connectNulls: true,
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
		                            color: 'rgba(227,135,50,0)'
		                        }, {
		                            offset: 1,
		                            color: 'rgba(239,140,49,0.6)'
		                        }], false)
		                    }
		                },
		                smooth: true,
		                data:data1
		            },{
		 				name: '盗窃',
		                type: 'line',
/*		                step: 'middle',*/
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
		                        type: 'solid'
		                    }
		                },
		                areaStyle: {
		                    normal: {
		                        color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
		                            offset: 0,
		                            color: 'rgba(228,218,86,0)'
		                        }, {
		                            offset: 1,
		                            color: 'rgba(250,236,75,0.6)'
		                        }], false)
		                    }
		                },
		                smooth: true,
		                data: data2
		            },{
		 				name: '其他',
		                type: 'line',
/*		                step: 'middle',*/
		                showSymbol: false,
		                connectNulls: true,
		                itemStyle: {
		                    normal: {
		                        color: colorArr[2]
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                        color: colorArr[2],
		                        width: 2,
		                        type: 'solid'
		                    }
		                },
		                areaStyle: {
		                    normal: {
		                        color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
		                            offset: 0,
		                            color: 'rgba(128,215,181,0)'
		                        }, {
		                            offset: 1,
		                            color: 'rgba(120,215,235,0.6)'
		                        }], false)
		                    }
		                },
		                smooth: true,
		                data: data3
		            },{
		 				name: '殴打他人',
		                type: 'line',
/*		                step: 'middle',*/
		                showSymbol: false,
		                connectNulls: true,
		                itemStyle: {
		                    normal: {
		                        color: colorArr[3]
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                        color: colorArr[3],
		                        width: 2,
		                        type: 'solid'
		                    }
		                },
		                areaStyle: {
		                    normal: {
		                        color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
		                            offset: 0,
		                            color: 'rgba(135,205,70,0)'
		                        }, {
		                            offset: 1,
		                            color: 'rgba(142,217,65,0.6)'
		                        }], false)
		                    }
		                },
		                smooth: true,
		                data: data4
		            },{
		 				name: '黄赌毒',
		                type: 'line',
/*		                step: 'middle',*/
		                showSymbol: false,
		                connectNulls: true,
		                itemStyle: {
		                    normal: {
		                        color: colorArr[4]
		                    }
		                },
		                lineStyle: {
		                    normal: {
		                        color: colorArr[4],
		                        width: 2,
		                        type: 'solid'
		                    }
		                },
		                areaStyle: {
		                    normal: {
		                        color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
		                            offset: 0,
		                            color: 'rgba(135,205,70,0)'
		                        }, {
		                            offset: 1,
		                            color: 'rgba(142,217,65,0.6)'
		                        }], false)
		                    }
		                },
		                smooth: true,
		                data: data5
		            }]

		        }

		        var arrMax = Math.max.apply(null,[Math.max.apply(null,data1),Math.max.apply(null,data2),Math.max.apply(null,data3),Math.max.apply(null,data4),Math.max.apply(null,data5)])
				if (arrMax<4) {
					option.yAxis.max = 4
				}
		        myLine.setOption(option)

		}
	}	
	return line
})