/**
 * Created by zhouyu on 17/1/4.
 * 毒品罪案分析 渐变条形图
 */

define(function(require) {

    var progressBar = {
        /**
         * [init progressBar渲染函数]
         * @param  {[string]} id   [渲染图表的Dom节点]
         * @param  {[object]} data [渲染图表的数据(从后台获取)]
         * @return {[type]}      [description]
         */
        init: function(id, data,year) {
            console.log(data)
            //获取渲染对象的dom父亲节点
            var dom =document.getElementById(id);
            var $dom = $(dom);
            $dom.empty();
            //数据判断和处理
            if(data.data.length>0) {
                var Data = data;
                var type;
                var ratio;
                var ratioTypeClassName;
                // var ratioType = {
                //     "up": "radio-icon-up",
                //     "down": "radio-icon-down"
                // }
                var dataArr;
                var progressBar1;
                var progressBar1Text;
                var progressBar1Value;
                var progressBar2;
                var progressBar2Text;
                var progressBar2Value;


                    if(Data.hasOwnProperty("type")){
                        // console.log(Data.type)
                        type = Data.type;
                    }
                    if(Data.hasOwnProperty("ratio")){
                        console.log(Data.ratio)
                        ratio = Data.ratio;
                        ratioTypeClassName = ratio>0 ? "radio-icon-up":"radio-icon-down";
                        //如果同比为零的时候，不显示箭头
                        if (ratio==0) {
                            ratioTypeClassName = ""
                        }
                        console.log(ratioTypeClassName)
                    }
                    if(Data.hasOwnProperty("data")||Data.data.length>0){
                        // console.log(Data.data)
                        progressBar1 = Data.data[0];
                        progressBar2 = Data.data[1];
                        // console.log("Bar1",progressBar1,"Bar2",progressBar2)
                        progressBar1Text = year;
                        progressBar1Value = progressBar1.number;
                        progressBar2Text = year-1;
                        progressBar2Value = progressBar2.number;
                        var MaxValue = progressBar1Value > progressBar2Value ? progressBar1Value:progressBar2Value;
                        // console.log("MaxValue",MaxValue)
                        // 
                        //处理除0
                        if (!MaxValue==0) {
                            var progressBar1Width = (progressBar1Value / MaxValue) * 80 + '%';
                            var progressBar2Width = progressBar2Value / MaxValue * 80 +'%';
                        }else{
                            var progressBar1Width ='0%';
                            var progressBar2Width ='0%';
                        }
                        

                        // console.log(progressBar1Width,progressBar2Width)
                    }

                var html = '<p class="progressChartTitle">'
                    + '<span class="rect"></span>'
                    + '<span class="title">' + type + '案件数' + '</span>'
                    + '<span class="radio gradient">同比' + ratio + '%<i class="' + ratioTypeClassName + '"></i></span>'
                    + '</p>'
                    + '<div class="progressChart"><ul>'
                    + '<li><span class="progressText">'+ progressBar1Text +'</span><span class="progressBarBg"><p class="progressBar1"><span class="progressBarValueNum">'+progressBar1Value+'件</span></p></span></li>'
                    + '<li><span class="progressText">'+ progressBar2Text +'</span><span class="progressBarBg"><p class="progressBar2"><span class="progressBarValueNum">'+progressBar2Value+'件</span></p></span></li>'
                    + '</ul></div>';
                $dom.html(html)
                $("#"+id+" .progressBar1").css({"width":progressBar1Width,"min-width":"9%"})
                $("#"+id+" .progressBar2").css({"width":progressBar2Width,"min-width":"9%"})
            }else{
                console.log("无数据")
            }
                // $('.progressChartBox').html('');
        }
    }
    return progressBar
});
