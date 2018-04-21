/**
 * Created by zhouyu on 16/11/30.
 */

/**
 * @author：zhanghongqiao
 * @description：雷达图
 * @modifined：2016/11/5
 */

$(function() {
    var w = 790
    var h = 690
    var ampUrl = 'http://192.168.1.240/mock/581fdf5f7c6a2d095487039c/'
    var dataUrl = ''+ampUrl+'http://localhost:8080/hanyang/init.java?year=2016&quarter=""&month="11"&week="1"'
    var legendSet = []
    dataUrl = 'data/data1.json'
    //dataUrl = 'http://192.168.1.92:8080/hy-radarmap/init.java?&year=2016&quarter=&month=&week='
    var colorscale = ['#fbe84c', '#ed6e2b', '#a4f4fd', '#df331f', '#8d3bf7', '#6be35e', '#4badf6']
    var callPolice = ''
    window.radar = {
        renderList: function(data){
            var radarData = data.data.radarMap
            var scrollText = radarData[0].type
            var txtList = ''
            var txt =""
            for(var s = 0; s < scrollText.length; s++){
                if(scrollText[s].tooltip&&scrollText[s].tooltip.length!==0)	{
                    for(var t = 0,tLen = scrollText[s].tooltip.length; t<tLen; t++){
                        if (scrollText[s].tooltip[t].warning) {

                            txt = scrollText[s].tooltip[t].warning
                        }

                    }
                    txtList += '<a>'+txt+'</a>'
                }

            }
            //滚动文字
            var str = ''+txtList+''
            $('#txtList').html(str)
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
            radarChart.draw('#radarChart', radarData, mycfg)

            //调用图例
            radar.legend()

        },

        legend: function(){
            $('#yearS span').text(legendSet[0])
            $('#yearE span').text(legendSet[1])
            var legendW = $('#legend').width()
            $('.legend').css('left',(985-legendW)/2)
        }
    }

})

