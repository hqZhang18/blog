/**
 * Created by zhouyu on 17/1/4.
 * 毒品种类分析[仪表盘]
 */

define(function (require) {
    require('../lib/echarts')

    var colorBg="rgba(49, 91, 149, .8)";
    var color=["#82e5fa","#feef32","#acff55"];
    var option = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        series: []
    };
    var gauge = {

        init:function (id,data) {
            console.log(data)
            var dom = echarts.init(document.getElementById(id));
            gauge.setSeries(data);
            dom.setOption(option)
        },
        
        setSeries:function (data) {
            var seriesArr = [];
            if(data.length>0){
                //数据中最大的Value数
                var maxValue = 0;
                //设置数据最大Value的1.5倍为100%圆环值
                var totalValue = 0;
                var centerStrY= '50%';
                var len = data.length;
                var totalValue = 0
                //计算出所以分类的和
                if (data[0].percent!==0) {
                    totalValue = (data[0].value*100)/data[0].percent
                };
/*                for(var i=0;i<len;i++){
                    totalValue += data[i].value;
                }*/

                // console.log("totalValue",totalValue)

                for(var i = 0; i<len;i++){
                    // 根据数组长度计算仪表盘中心的位置(横向排列X变化,Y保持50%居中)
                    // center: ['20%', '50%'],
                    // center: [centerStrX, centerStrY],
                    var centerStr=[];
                    var centerNumX ;
                    var centerStrX ;
                    centerNumX = 20+30*i;
                    centerStrX = centerNumX +'%';
                    centerStr = [centerStrX,centerStrY];
                    // console.log(centerStrX);
                    // console.log(centerStr)

                    // 根据value计算颜色设置(0 < colorFillNum < 1)
                    // color: [
                    //     [colorFillNum, color[i]],
                    //     [1, colorBg]
                    // ]
                    if (totalValue==0) {
                        var colorFillNum = 0
                    }else{
                        var colorFillNum =  data[i].value / totalValue;
                    }
                    seriesArr.push({
                        name: data[i].name,
                        type: 'gauge',
                        center: centerStr, // 默认垂直居中
                        radius: '90%',
                        min:50,
                        axisLine: {
                            show: false,
                            lineStyle: { // 属性lineStyle控制线条样式
                                color: [
                                    [colorFillNum, color[i]],
                                    [1, colorBg]
                                ],
                                width: 10
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: false
                        },
                        pointer: {
                            show: false,
                            length: '0',
                            width: '0'
                        },
                        title : {
                            offsetCenter:[0,'-20%'],
                            textStyle: {
                                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                color:color[i],
                                fontSize: 14
                            }
                        },
                        detail: {
                            formatter: function (value) {
                                if (totalValue==0) {
                                    return value + '人\n\n' + "0%";
                                };
                                return value + '人\n\n' + (( value/totalValue ) * 100 ).toFixed(0) + "%";
                            },
                            offsetCenter: [0, '50%'],
                            textStyle:{
                                color:'#fff',
                                fontSize:18
                            }
                        },
                        data: [{
                            name:data[i].name,
                            value: data[i].value,
                            label: {
                                textStyle: {
                                    fontSize: 12
                                }
                            }
                        }]
                    });
                }
                // console.log(seriesArr)
                option.series =seriesArr;

            }else{
                return;
                // console.log("无数据")
            }
        }

    }
    return gauge
})