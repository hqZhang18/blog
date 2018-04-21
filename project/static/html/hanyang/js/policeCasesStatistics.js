/*
* @Author: zhouyu
* @Date:   2016-11-07 13:52:22
* @Last Modified by:   zhouyu
* @Last Modified time: 2016-11-08 11:18:54
* @content: 警情数量统计图 policeCasesStatistics  简写成PCS
*/

'use strict';

//id 表示渲染 Eharts图的dom节点 id

var PCS = {};
PCS.init = function (year,data) {
    // console.log(data)
    //year/quarter/month 分别表示 页面时间下拉菜单选择的时间节点年/季/月
    // MaxWidth(int) 根据进度条的最大宽度来计算
    var MaxWidth = 400;
    $("#policeCasesAverage").css('left','0px');

        // console.log(data);
        if(data){
            // console.log(data.code)
            //获取数据并转换成数字类型(方便计算)
            var thisYearNum = Number(data.policeCasesNum.thisYear);
            var lastYearNum = Number(data.policeCasesNum.lastYear);
            var averageNum = Number(data.policeCasesNum.average);

            $("#policeCasesThisYear").html(year+'年: ' + thisYearNum + ' 起');
            $("#policeCasesLastYear").html((year-1)+'年: ' + lastYearNum + ' 起');
            $("#policeCasesAverage").html(year+'年全市平均: '+ averageNum +' 起');

            // console.log(lastYearNum,thisYearNum,averageNum);
            var MaxNum = Math.max(thisYearNum,lastYearNum,averageNum);
            // console.log('MaxNum',MaxNum);
/*            console.info(MaxNum)*/
            // 根据进度条的最大宽度来计算今年/去年的宽度,并设置
            if (MaxNum == 0) { 
                var thisYearWidth = 0;
                var lastYearWidth = 0;
                var averageLeft = 70;
            }else{
                var thisYearWidth = (thisYearNum/MaxNum) * MaxWidth;
                var lastYearWidth = (lastYearNum/MaxNum) * MaxWidth;
                var averageLeft =  (averageNum/MaxNum) * MaxWidth+70;
            }
            $("#pbThisYear").css('width',thisYearWidth+'px');
            // console.log('thisYearWidth',thisYearWidth)

            $("#pbLastYear").css('width',lastYearWidth+'px')
            // console.log('lastYearWidth',lastYearWidth)
            // +30是使0刻度对齐,进度条设置了30px的左边距;
           
            // console.log('averageLeft',averageLeft)
            //获取刻度标志的宽度
            var selfWidth = $("#policeCasesAverage").width();
            // console.log('selfWidth',selfWidth)
            $("#policeCasesAverage").css('left',(averageLeft-selfWidth/2)+'px');



            // clientWidth = width + padding;
            // offsetWidth = width + padding + border;
        }
}

