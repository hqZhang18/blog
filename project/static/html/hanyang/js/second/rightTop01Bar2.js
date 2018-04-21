define(function(require) {
	var dataX = ["二桥派出所","永丰派出所","琴断派出所","五里派出所","翠微派出所","建桥派出所","月湖派出所","晴川派出所","鹦鹉派出所","洲头派出所","江提派出所","江北派出所","经开派出所","西新派出所","国博派出所"]
	var dataY = []
	var Bar = {
		count:1,
		init:function(data){
			dataY = data[0].value
			this.setBar()
			var _this = this
			var start = setInterval(function(){
				_this.change()
			},5000)
		},
		/**
		 * 每隔5s切换图标
		 */
		change:function(){
			$(".right03_bar .span_right p").css("background-color","transparent")
			$(".right03_bar .span_right p").eq(this.count).css("background-color","#003a66")
			this.count = this.count + 1
			if (this.count>4) {
				this.count=0
			}
			// console.info(this.count)
		},
		/**
		 * 渲染echarts图表
		 */
		setBar:function(){
			var myEchart = echarts.init(document.getElementById('bar'))
			//echarts图表配置
			option = {
			    color: ['#3398DB'],
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '13%',
			        top:"10%",
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : dataX,
			            axisTick: {
			                alignWithLabel: true
			            },
			            axisLine:{
			            	show:true,
		                	lineStyle:{
		                		color:"#2b668e"
		                	}
			            },
			            axisLabel:{
			            	rotate:-30,
			            	textStyle:{
			            		color:"#83e6fb"
			            	}
			            },
		                splitLine:{
		                	show:false
		                }

			        }
			    ],
			    yAxis : [
			        {
			            type : 'value',
			           	axisLabel:{
			            	textStyle:{
			            		color:"#83e6fb"
			            	}
			            },
			           axisTick: {
			                textStyle:{
			            		color:"#83e6fb",
			            		type:"dotted"

			            	}
			            },
			            axisLine:{
			            	show:false,
		                	lineStyle:{
		                		color:"#83e6fb"
		                	}
			            },
			            splitLine:{
			            	show:true,
			            	lineStyle:{
			            		color:"#2b668e",
			            		type:"dashed"
			            	}
			            }
			        }
			    ],
			    series : [
			        {
			            name:'直接访问',
			            type:'bar',
			            barWidth: '60%',
			            data:dataY,
			           	itemStyle:{
	                	normal:{
/*	                		color:new echarts.graphic.LinearGradient(
	                			0,0,0,1,
	                			[
	                				{offset: 0, color: '#00ffff'},
	                				{offset: 1, color: '#0aa9f4'}
	                			]
	                		)*/
							color: function(d) {
								if(d.dataIndex<6){
									return "#83e6fb"
								}else{
									return "#7CCD7C"
								}

                            }
	                	}
		               
	                }
			        }
			    ]
			};

			myEchart.setOption(option)

		}
	}



	return Bar

})