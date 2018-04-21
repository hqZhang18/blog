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
	dataUrl = 'data/01.json'
	//dataUrl = 'http://192.168.1.92:8080/hy-radarmap/init.java?&year=2016&quarter=&month=&week='
	var colorscale = ['#fbe84c', '#ed6e2b', '#a4f4fd', '#df331f', '#8d3bf7', '#6be35e', '#4badf6']

 
	var callPolice = ''
	window.radar = {
	renderList: function(data,yujingData){
		//d3.json(dataUrl, function(data){ 
				var radarData = data.radarMap
				var yujingData = yujingData
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
				//取年-图例
				for(var i = 0;i<2; i++){
					legendSet.push(radarData[i].name)
				}
				radarChart.draw('#radarChart', radarData, mycfg, yujingData)
				
				//调用图例
				radar.legend()
				//左右显示报警预警
				radar.showText(radarData,yujingData)
 	//	}) 
		},
		
		showText: function(data, yujingData){
			
			//报警信息
			var txtList =''
			var baojing = []
			for(var i2 = 0; i2<2; i2++){
				baojing = data[i2].type
				for(var i3 = 0,len3 = baojing.length; i3< len3;i3++)	{
					var bjTooltip = baojing[i3].tooltip
					if(bjTooltip!==undefined && bjTooltip.length!=0){
						for(var i4 = 0;i4<bjTooltip.length; i4++){
							var warTxt = bjTooltip[i4].warning
							var proposal = bjTooltip[i4].proposal
							txtList += '<p><b>报警'+(i4+1)+'：</b>'+warTxt+'</p><p><b>工作建议'+(i4+1)+'：</b>'+proposal+'</p>'
						}
					}	
				}
			}
			$('.left').html(txtList)
			
			//预警信息
			var JQ = yujingData.jingq
			var ZA = yujingData.admin
			var QJ = yujingData.qj
			var PA = yujingData.pa
			var XS = yujingData.penal
			var saveYJ = []
			if(JQ!=0){
				for(var y = 0; y < JQ.length; y++){
					var saveTool = {
						advise: '',
						forecast: ''
					}
					saveYJ.length = 0
					saveTool.advise = JQ[y].advise
					saveTool.forecast = JQ[y].forecast
					saveYJ.push(saveTool)
				}
			}
			if(ZA!=0){
				for(var y2 = 0; y2 < ZA.length; y2++){
					var saveTool = {
						advise: '',
						forecast: ''
					}
					saveTool.advise = ZA[y2].advise
					saveTool.forecast = ZA[y2].forecast
					saveYJ.push(saveTool)
				}
			}
			if(QJ!=0){
				for(var y3 = 0; y3 < ZA.length; y3++){
					var saveTool = {
					advise: '',
					forecast: ''
				}
					saveTool.advise = QJ[y3].advise
					saveTool.forecast = QJ[y3].forecast
					saveYJ.push(saveTool)
				}
			}
			if(PA!=0){
				for(var y4 = 0; y4 < PA.length; y4++){
				var saveTool = {
					advise: '',
					forecast: ''
				}
					saveTool.advise = PA[y4].advise
					saveTool.forecast = PA[y4].forecast
					saveYJ.push(saveTool)
				}
			}
			if(XS){
				for(var y5 = 0; y5 < XS.length; y5++){
				var saveTool = {
					advise: '',
					forecast: ''
				}
					saveTool.advise = XS[y5].advise
					saveTool.forecast = XS[y5].forecast
					saveYJ.push(saveTool)
				}
			}
			var txtList2 = ''
			for(var i4 = 0;i4<saveYJ.length; i4++){
				var warTxt2 = saveYJ[i4].advise
				var proposal2 = saveYJ[i4].forecast
				txtList2 += '<p><b>预测'+(i4+1)+'：</b>'+warTxt+'</p><p><b>工作建议'+(i4+1)+'：</b>'+proposal+'</p>'
			}
			$('.right').html(txtList2)
		},
		
		legend: function(){
			$('#yearS span').text(legendSet[0])
			$('#yearE span').text(legendSet[1])
			var legendW = $('#legend').width()
			$('.legend').css('left',(1440-legendW)/2)
		}
	}
	//radar.renderList()
})

