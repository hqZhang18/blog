
define(function(require) {
    require('../lib/echarts')

    var color = color || ['#ef8b32', '#fcea4f', '#83e6fa', '#90d842','#9c54f6','#ea3c32'];
    //legend数组
    var nameArr = [];
    //环形图data数组
    var dataArr = [];
    var totalNum=0 ;
    // console.log(color)
    var pieChart = {
        //数据请求,重新组装数据
        getData: function(id, data,type) {
            // console.log("pieChartData",data)
            if(data.length>0){
                var len = data.length;
                for(var i = 0; i<len;i++){
                    if(data[i].hasOwnProperty("realValue")){
                        nameArr.push(data[i].name);
                        dataArr.push({name:data[i].name,value:data[i].realValue})
/*                        dataArr.push(data[i].realValue)*/
                        totalNum =totalNum + data[i].realValue;
                    }else{
                        console.log("values没有数据")
                    }
                }

                switch(type){
                    case "alarm":
                        $("#pieChartTotal").empty().html('总数(起)<br>'+totalNum) 
                        break;
                    case "penal":
                        $("#pieChartTotal").empty().html('总数(件)<br>'+totalNum)
                        break;
                    case "deten":
                        $("#pieChartTotal").empty().html('总数(人)<br>'+totalNum)
                        break;
                    default:
                        break;
                }
                pieChart.Option(id)
            }else{
                console.log("没有获取到数据")
            }
              // if (data.map.length) {
              //     var len = data.map.length;
              //     for (var i = 0; i < len; i++) {
              //         nameArr.push(data.map[i].name);
              //         dataArr.push({name:data.map[i].name,value:data.map[i].value})
              //     }
              //     $("#pieChartTotal").empty().html('总数(件)<br>'+data.total)
              //     pieChart.Option(id)
              //     // console.log(nameArr)
              //     // console.log("dataArr",dataArr)
              // } else(
              //     console.log("无数据")
              // )
              //
              //

        },

        //设置Echarts配置
        Option: function(id) {
            // console.log("Option-dataArr",dataArr)
            var dom = echarts.init(document.getElementById(id));
            //Echarts配置
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c}({d}%)"
                    
                },
                color: color,
                //显示标题
                legend: {
                    show:true,
                    orient: 'vertical',
                    top:40,
                    left:360,
                    x: 'left',
                    data: nameArr,
                    textStyle:{
                        color:"#83e6fa",
                        fontSize: 16
                    },
                    itemWidth:10,
                    itemHeight:10,
                    formatter: "{name}"
                },
                series: [{
                    name: '各类警情数量占比',
                    type: 'pie',
                    radius: ['38%', '52%'],
                    center: ['50%', '183px'],
                    data: dataArr,
                    label:{
                        normal:{
                            show:false,
                            formatter: "{c}件 ({d}%) \n\n {b}",
                            textStyle:{
                                color:color[i],
                                fontWeight : 'bold',
                                fontSize: 15
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowColor: 'rgba(39,90,121,.6)',
                            shadowOffsetY : 5,
                            shadowBlur: 5
                        },
                        labelLine: {
                            show: true
                        }
                    }
                }]
            };
            // console.log("dataArr",dataArr)
            dom.setOption(option);
        }

    }

    return pieChart
})
