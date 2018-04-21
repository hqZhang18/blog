/*
* @Author: zhanghongqiao
* @Date:   2016-12-29
* @description：强戒 - 中间饼图
* @File Name: penal.js
*/
define(function(require){
    var pie = {

      count: function(data){
        
        for(var i=0; i<data.length; i++){
          var mark = data[i].mark
          console.log(mark)
          if(mark===true){
            $('.center').find('.icon').eq(i).attr('class', 'icon icon_up')
            $('.center').find('.arrows').eq(i).attr('class', 'arrows arrows_up')
          }else if(mark===false){
            $('.center').find('.icon').eq(i).attr('class', 'icon icon_down')
            $('.center').find('.arrows').eq(i).attr('class', 'arrows arrows_down')
          }else{
            $('.center').find('.icon').eq(i).attr('class', '')
            $('.center').find('.arrows').eq(i).attr('class', '')
          }
          
        }

        var drugData = data[0].value 
        var strongData = data[1].value 
        $('#drugTotal').html(''+data[0].total+'件')
        $('#strongTotal').html(''+data[1].total+'人')

        $('#drugCount').find('.thisYear').html(''+drugData[0]+'件')
        $('#drugCount').find('.lastYear').html(''+drugData[1]+'件')
        $('#drugCount').find('.average').html(''+drugData[2]+'件')
        $('#strongCount').find('.thisYear').html(''+strongData[0]+'人')
        $('#strongCount').find('.lastYear').html(''+strongData[1]+'人')
        $('#strongCount').find('.average').html(''+strongData[2]+'人')
        $('#drugRatio').find('span').html(''+data[0].ratio+'%')
        $('#strongRatio').find('span').html(''+data[1].ratio+'%')

      },

      drawChart: function(id, data,year){
        var _self = this
        _self.count(data)

        var lCharts =  echarts.init(document.getElementById(id[0]))
        var rCharts = echarts.init(document.getElementById(id[1]))
        var year = [year, year-1]
        $("#thisyear").text(year[0])
        $("#lastyear").text(year[1])

        var caseType = ['毒品罪案数', '强制隔离戒毒数']
        var PatternSrcA = './image/bgimg2.png'
        var PatternSrcB = './image/bgimg.png'
        var PatternSrcC = './image/bgimg3.png'

        var PatternImgA = new Image();
        var PatternImgB = new Image();
        var PatternImgC = new Image();

        PatternImgA.src = PatternSrcA;
        PatternImgB.src = PatternSrcB;
        PatternImgC.src = PatternSrcC;
   
        var itemStyleA = { 
          normal: { 
            color: {image: PatternImgA,repeat: 'repeat'},
            label: {show:false},
            labelLine: {show:false},
            shadowBlur: 40,
            shadowColor: 'rgba(40, 40, 40, 0.5)'
          }
           
        }

        var itemStyleB = { 
          normal: { 
            color: {image: PatternImgB,repeat: 'repeat'},
            label: {show:false},
            labelLine: {show:false},
            shadowBlur: 40,
            shadowColor: 'rgba(40, 40, 40, 0.5)'
          }
        }

        var itemStyleC = { 
          normal: { 
            color: {image: PatternImgC,repeat: 'repeat'},
            label: {show:false},
            labelLine: {show:false},
            shadowBlur: 40,
            shadowColor: 'rgba(40, 40, 40, 0.5)'
          }  
        }  

       
       
        var dataStyle = { 
          normal: {
              label: {show:false},
              labelLine: {show:false},
              shadowBlur: 40,
              shadowColor: 'rgba(40, 40, 40, 0.5)',
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: 'rgba(255, 122, 4, 1)'
              }, {
                  offset: 1,
                  color: 'rgba(255, 155, 67, 0.9)'
              }])
          }
      }

      var dataStyle2 = { 
          normal: {
              label: {show:false},
              labelLine: {show:false},
              shadowBlur: 40,
              shadowColor: 'rgba(40, 40, 40, 0.5)',
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                  offset: 0,
                  color: 'rgba(255, 224, 51, 1)'
              }, {
                  offset: 1,
                  color: 'rgba(255, 205, 51, 0.8)'
              }])
          }   
      }    
      var placeHolderStyle = {
          normal : {
             color: 'rgba(0,0,0,0)',
              label: {show:false},
              labelLine: {show:false}
          },
          emphasis : {
              color: 'rgba(0,0,0,0)'
          }
      }

      //渲染数据
      var option = []
      for(var i = 0; i<data.length; i++){
        var values = data[i].value
         option.push({
             tooltip : {
              show: true,
              formatter: "{a} <br/>{b} : {c} "
          },
          // legend: {
          //     itemGap:12,
          //     data:['01','02'],
          //     show: false
          // },
          series : [
            {
                name:year[0],
                type:'pie',
                radius : [200,230],
                itemStyle : itemStyleA,
                hoverAnimation: false,
                clockWise : true,
                data:[
                  {
                    value: values[0],
                    name: caseType[i]
                  },
                  {
                    value:50,
                    name:'',
                    itemStyle : placeHolderStyle,
                    tooltip: {show: false} // 隐藏部分不显示提示框
                  }
             
                ]
            }, 
           {
              name:year[1],
              type:'pie',
              radius : [170, 200],
              itemStyle : itemStyleB,
              hoverAnimation: false,
              clockWise : true,
              data:[
                  {
                    value: values[1], 
                    name: caseType[i]
                  },
                  {
                    value:60,
                    name:'',
                    itemStyle : placeHolderStyle,
                    tooltip: {show: false} // 隐藏部分不显示提示框
                  }
              ]
          },
          {
              name:'全市平均',
              type:'pie',
              radius : [140, 170],
              itemStyle : itemStyleC,
              hoverAnimation: false,
              clockWise : true,
              data:[
                  {
                    value: values[2], 
                    name: caseType[i]
                  },
                  {
                    value:60,
                    name:'',
                    itemStyle : placeHolderStyle,
                    tooltip: {show: false} // 隐藏部分不显示提示框
                  }
              ]
          }
        ]
         }) 
      }

      lCharts.setOption(option[0])
      rCharts.setOption(option[1])  
      }
      
    }

    return pie
})

