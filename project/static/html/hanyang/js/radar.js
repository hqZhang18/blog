/**
 * @author：zhanghongqiao
 * @description：雷达图
 * @modifined：2016/11/5
 */

$(function() {
	var w = 990
	var h = 890
	var ampUrl = 'http://192.168.1.240/mock/581fdf5f7c6a2d095487039c/'
	var dataUrl = ''+ampUrl+'http://localhost:8080/hanyang/init.java?year=2016&quarter=""&month="11"&week="1"'
	var legendSet = []
	var dataUrl = 'data/01.json'
	//dataUrl = 'http://192.168.1.92:8080/hy-radarmap/init.java?&year=2016&quarter=&month=&week='
	var colorscale = ['#fbe84c', '#ed6e2b', '#a4f4fd', '#df331f', '#8d3bf7', '#6be35e', '#4badf6']
	var year =''
	var callPolice = ''
	window.radar = {
		renderList: function(data, yujingData, getYear){
			 year = getYear
 			//d3.json(dataUrl, function(data){ 
				var yujingData = yujingData
				var radarData = data.radarMap
				var scrollText = radarData[0].type
				var txtList = ''
				var txt =""
				var txt2 =""
				for(var s = 0; s < scrollText.length; s++){
					if(scrollText[s].tooltip&&scrollText[s].tooltip.length!==0)	{
						for(var t = 0,tLen = scrollText[s].tooltip.length; t<tLen; t++){
							if (scrollText[s].tooltip[t].warning) {
								txt = scrollText[s].tooltip[t].warning;
								txt2 =scrollText[s].tooltip[t].proposal;
							}
					 }
					 txtList += '<p>报警: '+txt+'</p><p>工作建议: '+txt2+'</p>'
					}
					 
				}
				//滚动文字
				var str = ''+txtList+''
				if (txtList==""||txtList==undefined||txtList==null) {
					$("#scroll_div").css("display","none");
				}
				$('#txtList').html(str)
				$('#scroll_end').html(str)
				var mycfg = {
				  w: w,
				  h: h,
				  maxValue: 10,
				  levels: 5,
				  ExtraWidthX: 200
				}

				radarChart.draw('#radarChart', radarData, mycfg, yujingData)

				//调用图例
				radar.legend()
		//}) 
		},
		
		legend: function(){
			$('#yearS span').text(year+'年')
			$('#yearE span').text(year-1+'年')
			var legendW = $('#legend').width()
			$('.legend').css('left',(1440-legendW)/2)
		}
	}
	
	
	//雷达图旋转 兼容ie9
		var angle = 0;
		setInterval(function(){
		    angle +=1;
		    $('#rotate').rotate(angle);
		}, 180);


/* 	radar.renderList()*/
})

