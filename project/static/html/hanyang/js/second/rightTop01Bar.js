define(function(require) {
	/*var dataX = ["二桥派出所","永丰派出所","琴断派出所","五里派出所","翠微派出所","建桥派出所","月湖派出所","晴川派出所","鹦鹉派出所","洲头派出所","江提派出所","江北派出所","经开派出所","西新派出所","国博派出所"]*/
/*	var dataY = []*/
	var Bar = {
		count:1,
		init:function(data,index){
			//动态添加tab标签
			$("#TAB").empty()
			var _length = data.length
			var p = ""
			for (var i = 0; i < _length; i++) {
				p = p + "<p>"+data[i].name+"</p>"
			};
			$("#TAB").append(p)
			/*
			点击跳转到tab页上
			 */
			var _this = this
			$("#TAB").on('click','p',function(){
				console.info(this)  //这个this应该指向的是p标签对吧
				_this.count = $(this).index()
				_this.toDO(_this.count,data)
				$(".right03_bar .span_right p").css("background-color","transparent")
				$(".right03_bar .span_right p").eq(_this.count).css("background-color","#003a66")
				_this.count = _this.count + 1
				if (_this.count>index) {
					_this.count=0
				}
			})
			this.toDO(0,data)
			var start
			    start = setInterval(function(){
				_this.change(data,index)
			},5000)
			//鼠标移到图表上不自动切换
			$(".right03").mouseover(function(){
				clearInterval(start)
			})
			//鼠标移上去自动切换
			$(".right03").mouseout(function(){
				start = setInterval(function(){
				_this.change(data,index)
				},5000)
			})
			
		},
		/**
		 * 每隔5s切换图标
		 */
		change:function(data,index){

			console.info(this.count)
			this.toDO(this.count,data)
			$(".right03_bar .span_right p").css("background-color","transparent")
			$(".right03_bar .span_right p").eq(this.count).css("background-color","#003a66")
			this.count = this.count + 1
			if (this.count>index) {
				this.count=0
			}
		
		},
		/**
		 * 
		 */
		 toDO:function(index,data){
		 	var dataY = this.getData(data[index]).value
			var dataX = this.getData(data[index]).name
			var dMin1 = dataX[4]  //标记前六所中最低
			var dMin2 = dataX[5]   //标记前六所中最低
			var dMin3 = dataX[13]   //标记后九所中最低
			var dMin4 = dataX[14]   //标记后九所中最低
			this.setBar(dataY,dMin1,dMin2,dMin3,dMin4,dataX)
		 },

		/**
		 * 获取数据,处理后台返回来的数据
		 */
		getData:function(data){
			var Data = {
				name:[],
				value:[]
			}
			for (var i = 0; i < data.values.length; i++) {
				 Data.name[i] = data.values[i].name
				 Data.value[i] = data.values[i].value
			}
			return Data
		},
		/**
		 * 获取最大值跟最小值的位置
		 */
/*		 getMaxMin:function(data){
		 	var max = data[0]
		 	var min = data[0]
		 	var _dMax = 0
		 	var _dMin = 0
		 	for (var i = 1; i < data.length; i++) {
		 		if (max<data[i]) {
		 			max = data[i]
		 			_dMax = i
		 		}
		 		if (min>data[i]) {
		 			min = data[i]
		 			_dMin = i
		 		}
		 	}
		 	return [_dMax,_dMin]
		 },*/

		/**
		 * 渲染echarts图表
		 */
		setBar:function(dataY,_dMin1,_dMin2,_dMin3,_dMin4,dataX){
			var myEchart = echarts.init(document.getElementById('bar'))
			myEchart.clear()
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
			        left: '1%',
			        right: '9%',
			        bottom: '15%',
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
			            	interval:0,
			            	rotate:-35,
			            	formatter:function(value){
			            		if (value.length>5) {
			            			return value.substring(0,5)+"..."
			            		}
			            		return value
			            	},
/*			            	textStyle:{
			            		color:function(val){
			            			if (val==_dMin1||val==_dMin2||val==_dMin3||val==_dMin4) {
			            				return "#FF0000"
			            			}
			            			return "#83e6fb"
			            		}
			            	}*/
			            	textStyle:{
			            		color:'#83e6fb'
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
/*			           		formatter:function(index,value){
			           			return value.toFixed(1)
			           		},*/
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
		                		color:"#2b668e"
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
			            name:'数量',
			            type:'bar',
			            barWidth: 10,
			            data:dataY,
			           	itemStyle:{
	                	normal:{
	                		barBorderRadius: [10, 10, 0, 0],
/*	                		color:new echarts.graphic.LinearGradient(
	                			0,0,0,1,
	                			[
	                				{offset: 0, color: '#00ffff'},
	                				{offset: 1, color: '#0aa9f4'}
	                			]
	                		)*/
							color: function(d) {
								if(d.dataIndex<6){
									return new echarts.graphic.LinearGradient(
			                			0,0,0,1,
			                			[
			                				{offset: 0, color: '#00ffff'},
			                				{offset: 1, color: '#8cd344'}
			                			]
			                		)
								}else{
									return new echarts.graphic.LinearGradient(
			                			0,0,0,1,
			                			[
			                				{offset: 0.4, color: '#7FFFD4'},
			                				{offset: 1, color: '#cc7d36'}
			                			]
			                		)
								}

                            }
	                	}
		               
	                }
			        }
			    ]
			};
			var arrMax = Math.max.apply(null,dataY)
			if (arrMax<4) {
				option.yAxis[0].max = 4
			}else{
				option.yAxis[0].max = 'auto'
			}
			myEchart.setOption(option)

		}
	}



	return Bar

})