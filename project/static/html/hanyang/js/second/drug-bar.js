define(function(require) {
	var background = ["bar_01","bar_02","bar_03","bar_04"] 
	var color = ["#83e6fb","#adff55"," #fff033","#ef8b33"]
	var drugBar = {
		init:function(data){
			console.info("come in")
			console.info(data)
			$(".total").html(data.total+"人")
			for (var i = 0; i < data.values.length; i++) {
				if (data.total!==0) {
					var percent = Math.round((data.values[i].value/data.total).toFixed(2)*100)
				}else{
					var percent = 0
				}

				var span = "<span><p class='"+background[i]+"'></p><p>"+data.values[i].value+"人"+percent+"%"+"</p></span><span>"+data.values[i].name+"</span>"
				console.info(span)
				$(".bar_title").eq(i).append(span)
			}
			var myEchart = echarts.init(document.getElementById('pie'))
			option = {
/* 					backgroundColor: '#ffffff',*/
				    color: color,
				    tooltip: { },
				    legend: {     // 饼图外的各项数据item
				        orient: 'vertical',
				        left: '60%',
				        top: '30%',
				        itemWidth: 8,
				        itemHeight: 8,
				    },
				    series: [{    // 饼图的属性配置
				        name: '',
				        type: 'pie',
/*				        center: ['30%','50%'],*/
				        radius: ['55%', '90%'],
				        avoidLabelOverlap: false,
				        startAngle:20,
				        itemStyle: {
				   		 normal: {
				        label: {
				            show: false
				        },
				        labelLine: {
				            show: false
				        },
				        borderWidth: 5,
				        borderColor: '#193c55',	       
				    }
				},
				// 图形样式
		        label: {
		            normal: {
		                show: false,
		                position: 'center'
		            },
		            emphasis: {
		                show: false,
		                formatter: function(param) {
		                	return param.name;
		                },
		                textStyle: {
		                    fontSize: '16',
		                    fontWeight: 'bold'
		                }
		            }
		        },
		        labelLine: {
		            normal: {
		                show: false
		            }
		        },
		        data:data.values
				    }]
 				};

 		myEchart.setOption(option)








		}
	}
	return drugBar
})