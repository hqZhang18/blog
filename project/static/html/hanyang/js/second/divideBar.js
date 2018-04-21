/**
 * Created by zhouyu on 17/1/5.
 * 强戒次数分析 id="detoxification"
 */

define(function (require) {
    var divideBar = {
        init:function (id,data) {
            console.log(data);
            if(data.length>0||data.length<3){
                var dom =document.getElementById(id);
                var $dom = $(dom);
                $dom.empty();
                var leftData = data[0];
                var rightData = data[1];
                var leftValue = leftData.value +'人' + leftData.percent + '%';
                var rightValue =rightData.value +'人'+ rightData.percent + '%';
                // console.log("leftValue",leftValue,"rightValue",rightValue)
                var leftBarWidth = leftData.percent + '%';
                var rightBarWidth =rightData.percent +'%';
                // console.log("leftBarWidth",leftBarWidth,"rightBarWidth",rightBarWidth)
                $dom.html(
                    '<ul>'
                    +'<li><span class="leftBarValue">'+leftValue+'</span><span class="rightBarValue">'+rightValue+'</span></li>'
                    +'<li><span class="leftBarText">'+'首次'+'</span><span class="rightBarText">'+'多次'+'</span></li>'
                    +'<li><span class="leftBarLength"></span><span class="rightBarLength"></span></li>'
                    +'</ul>'
                );
                $(".leftBarLength").css("width",leftBarWidth);
                $(".rightBarLength").css("width",rightBarWidth)
            }else{
                console.log("无数据");
                return
            }
        }
    }

    return divideBar
})