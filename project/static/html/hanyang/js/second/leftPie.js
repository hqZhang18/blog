/*
* @Author: zhouyu
* @Date:   2016-11-07 16:06:11
* @Last Modified by:   zhouyu
* @Last Modified time: 2016-11-07 23:27:06
* @content: 分类数量统计图 classificationStatistics 简写成CFS
*/
 define(function(require) {
 	var showColor1 = ['rgba(249,215,72,1)', 'rgba(239,117,44,1)'];
    var hideColor1 = ['rgba(249,215,72,0.4)', 'rgba(239,117,44,0.1)'];
	var hideColor2 = ['rgba(107,229,252,0.4)', 'rgba(58,136,247,0.1)','rgba(235,54,33,0.4)'];
	var showColor2 = ['rgba(107,229,252,1)', 'rgba(58,136,247,1)', 'rgba(235,54,33,1)'];

  var leftPie = {
  	//多层饼图渲染
  	createECharts: function(id,showColor,hideColor,data){
  		if(data.map.length>=1){
            var Arr =[];
            for(var i = 0, len = data.map.length; i<len; i++){
                Arr.push(data.map[i].value)
            }
            // console.log("MaxArr",Arr)
            var MaxValue = Math.max.apply(null,Arr);
            // console.log("MaxValue",MaxValue)
        }
        var myChart = echarts.init(document.getElementById(id));
        //显示的data圆环
        var dataStyle = {
            normal: {
                label: {show:false},
                labelLine: {show:false}
            }
        };

        //多层圆环图option
        var popEchartsOption = {
            title: {
                x: 'center',
                y: 'center',
                itemGap: 5,
                textStyle : {
                    color : 'rgba(30,144,255,0.8)',
                    fontFamily : '微软雅黑',
                    fontSize : 35,
                    fontWeight : 'bolder'
                }
            },
            legend: {
                orient : 'vertical',
                // x : document.getElementById(id).offsetWidth / 2,
                // y : 45,
                bottom: 0,
                right: 0,
                itemGap:10,
                textStyle:{
                    color: '#b3b2b0',
                    fontSize: 14
                }
                // data:[]
            },
            tooltip : {
                show: true,
                formatter: function(params){
                    if (params.seriesIndex) {
                        return params.name+':'+Math.floor(_scale*100)+'%'
                    }else{
                        return params.name+':'+params.value
                    }
                },
            },
            series : []
        };

        popEchartsOption.color = showColor;

        var PieSeriesData = [];
        var len = data.map.length;
        // console.log("len",len);

        var PieData = data.map;
        // console.log("PieData",PieData);

        // 数组重组(按照今年\去年\平均的顺序)
        var change= function (arr,index) {
            var temp;
            if(index === 0 || index > arr.length-1){
                return arr;
            }
            temp = arr[index];
            arr[index] = arr[index-1];
            arr[index-1] = temp;
            return arr;
        }
        change(PieData,1);



        //每个圆环的宽度值: 根据(最大半径:80;最小半径:40)向下取整计算
        var PieW = Math.floor(60 - 30) / len;


  
        var legendData = [];

        console.info(PieData)
        for (var i = 0; i < len; i++) {

            var setData = []
            if (i==0) {
            setData = [{
                    value:PieData[i].value,
                    name: PieData[i].name
                    }]
            }else{

            if (PieData[i].value==0) {
                var _scale = 0
            }else{
                var _scale = (PieData[0].value / PieData[i].value)
            }
            if (_scale>1) {
                var  setData_scale = 1
            }else{
                var  setData_scale = _scale
            }
            setData = [
                    {
                        value: Math.floor(setData_scale * 100),
                        name: PieData[i].name
                    },
                    {
                        value: 100 - Math.floor(setData_scale* 100),
                        name: '',
                        itemStyle: {
                            normal : {
                                color: hideColor[i],
                                label: {show:false},
                                labelLine: {show:false}
                            }
                        },
                        tooltip: {show: false} // 隐藏部分不显示提示框
                    }
                ]
            }

            PieSeriesData = {
                name: '',
                type: 'pie',
                // hoverAnimation:false,
                clockWise: true,
                center: [150, 80],
                tooltip:{
                  textStyle:{
                      color:'#fff',
                      fontSize: 24
                  }
                },
                radius: [60 - (PieW * (i + 1)) + 1, 60 - (PieW * i)],
                itemStyle: dataStyle,
                data: setData
            };
            popEchartsOption.series.push(PieSeriesData);
            legendData.push({
                name: PieData[i].name,
                icon: 'rect'
            });
        }

        // popEchartsOption.legend.data = legendData;
        myChart.setOption(popEchartsOption);
  	
  	
  },
 
//饼图右侧的信息渲染
    createInfo: function (id,showColor,hideColor,data,type) {
        if (type=="01") {
            console.info(data.map[0].value+"比例"+data.map[1].value)
            if(data.map.length>0){
                //表示data.map有数据
                var mapData = [];
                mapData.push("今年："+data.map[0].value)
                if (data.map[1].value==0) {
                      mapData.push("发破百分比：0%")
                }else{
                    mapData.push("发破百分比："+(data.map[0].value*100/data.map[1].value)+"%")
                }

            }
        }else{
            if(data.map.length>0){
                //表示data.map有数据
                var mapData = [];
                mapData.push("今年："+data.map[0].value)

                if (data.map[1].value==0) {
                      mapData.push("破扒窃百分比：0%")
                }else{
                    mapData.push("破扒窃百分比："+(data.map[0].value*100/data.map[1].value)+"%")
                }
            }
        }
        // 右侧详细信息中百分比显示样式判断
        var scaleColor = '';
        var scaleIcon = '';//表示箭头样式类名up/down
        if (Number(data.scale)>0 ? 1 : 0){
            //百分比大于0,增长,显示红色上升箭头
            scaleColor = '#df0000';
            scaleIcon = 'up';
        }else if(Number(data.scale) < 0 ){
            //百分比小于0,下降,显示绿色下降箭头
            scaleColor = '#a0ff30';
            scaleIcon = 'down';
        }else{
            //百分比等于0,无变化,不显示箭头
            scaleColor = '#fff';
            scaleIcon = '';
        }

        //百分比保留小数点后两位
        var scale = Number(data.scale).toFixed(2);
        // console.log("scale",scale)

        var infoHtml = '<li>'+ data.classifyName + '</li>'
           
            + '<li><i style="background-color: '+showColor[0]+'";></i><i>' + mapData[0] + '</i></li>'
            + '<li><i style="background-color: '+showColor[1]+'";></i><i>'+ mapData[1] + '</i></li>'
           ;
        $('#'+id).empty().append(infoHtml);


    },
    init:function (data) {
    	console.log(data.classifyNum[0])
        // console.log(data)
        // year : 页面时间下拉菜单选择的时间节点年
        var data1 = data.classifyNum[0];
        var data2 = data.classifyNum[1];


        // console.log(data1,data2,data3,data4);

         //饼图渲染
        leftPie.createECharts('pie1',showColor1,hideColor1,data1);
        leftPie.createECharts('pie2',showColor2,hideColor2,data2);
       

        //信息渲染
        leftPie.createInfo('cfsInfo1',showColor1,hideColor1,data1,"01");
        leftPie.createInfo('cfsInfo2',showColor2,hideColor2,data2,"02");
       
       

    }
}
 return leftPie

})

