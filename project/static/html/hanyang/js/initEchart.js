

define(function(){
	var setEchart = {
	 RFirstOption : {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line'
        },
        textStyle: {
            fontSize: 14
        },
/*		formatter:function(params){
			console.info(params)
		}*/
    },
    legend: {
        left: '60%',
        data: [],
        textStyle: {
            color: '#fff'
        }
    },
    grid: {
        left: '8%',
        right: '8%',
        bottom: '0',
        top: '20%',
        containLabel: true
    },
    xAxis:
        {
            data: [],
            boundaryGap: false,
            type: 'category',
            axisTick: {
				alignWithLabel:true,
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#fff'
                }
            },
            axisLabel: {
				interval:0,
                textStyle: {
                    fontSize: 12,
                    color: "#caccd2"
                },
            },
 
   },
    yAxis: [
        {
            nameTextStyle: {
                color: "#fff"
            },
            type: 'value',
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12,
                    color: "#caccd2"
                }
            }
   }
    ],
	series: []
},
RSecondOption : {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line'
        },
        textStyle: {
            fontSize: 14
        },
    },
    legend: {
        left: '60%',
        top: '-1%',
        data: [],
        textStyle: {
            color: '#fff'
        }
    },
    grid: {
        left: '8%',
        right: '8%',
        bottom: '0',
        top: '20%',
        containLabel: true
    },
    xAxis:{
            data: [],
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
				interval:0,
                textStyle: {
                    fontSize: 12,
                    color: "#caccd2"
                },
            },
            splitLine: {
                show: false
            },
            boundaryGap: false
  },
    yAxis: {
        nameTextStyle: {
            color: "#fff"
        },
        type: 'value',
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: true,
            interval: 2,
            textStyle: {
                fontSize: 14,
                color: "#caccd2"
            }
        }
    },
    series: []
},
 
RThirdOption : {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line'
        }
    },
    grid: {
        left: '8%',
        right: '8%',
        bottom: '0',
        top: '20%',
        containLabel: true
    },
    legend: {
        left: '60%',
        top: '-1%',
        data: [],
        textStyle: {
            color: '#fff'
        }
    },
    xAxis:{
            data: [],
            type: 'category',
            axisTick: {
                show: false
            },
            axisLabel: {
				interval:0,
                textStyle: {
                    fontSize: 12,
                    color: "#caccd2"
                }
            },
            splitLine: {
                show: false
            },
            boundaryGap: false
   },
   yAxis: [{
            nameTextStyle: {
                color: "#fff"
            },
            type: 'value',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    fontSize: 12,
                    color: "#caccd2"
                }
            }
	}],
    series: []
}

	}

return setEchart

})
