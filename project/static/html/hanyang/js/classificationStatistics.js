/*
 * @Author: zhouyu
 * @Date:   2016-11-07 16:06:11
 * @Last Modified by:   zhouyu
 * @Last Modified time: 2016-11-07 23:27:06
 * @content: 分类数量统计图 classificationStatistics 简写成CFS
 */

'use strict';

var CFS = {};
//圆环的颜色

/*var showColor1 = ['rgba(249,215,72,1)', 'rgba(239,117,44,1)', 'rgba(235,54,33,1)'];
var hideColor1 = ['rgba(249,215,72,0.2)', 'rgba(239,117,44,0.2)', 'rgba(87,15,53,0.6)'];
var showColor2 = ['rgba(107,229,252,1)', 'rgba(58,136,247,1)', 'rgba(235,54,33,1)'];
var hideColor2 = ['rgba(107,229,252,0.2)', 'rgba(58,136,247,0.2)', 'rgba(87,15,53,0.6)'];
var showColor3 = ['rgba(37,250,75,1)', 'rgba(78,175,134,1)', 'rgba(235,54,33,1)'];
var hideColor3 = ['rgba(37,250,75,0.2)', 'rgba(78,175,134,0.2)', 'rgba(87,15,53,0.6)'];
var showColor4 = ['rgba(205,56,246,1)', 'rgba(106,33,210,1)', 'rgba(235,54,33,1)'];
var hideColor4 = ['rgba(205,56,246,0.2)', 'rgba(106,33,210,0.2)', 'rgba(87,15,53,0.6)'];*/

var showColor1 = ['rgba(249,215,72,1)', 'rgba(239,117,44,1)', 'rgba(235,54,33,1)'];
var hideColor1 = ['rgba(249,215,72,0.2)', 'rgba(239,117,44,0.2)', 'rgba(235,54,33,0.2)'];
var showColor2 = ['rgba(107,229,252,1)', 'rgba(58,136,247,1)', 'rgba(235,54,33,1)'];
var hideColor2 = ['rgba(107,229,252,0.2)', 'rgba(58,136,247,0.2)', 'rgba(235,54,33,0.2)'];
var showColor3 = ['rgba(37,250,75,1)', 'rgba(78,175,134,1)', 'rgba(235,54,33,1)'];
var hideColor3 = ['rgba(37,250,75,0.2)', 'rgba(78,175,134,0.2)', 'rgba(235,54,33,0.2)'];
var showColor4 = ['rgba(205,56,246,1)', 'rgba(106,33,210,1)', 'rgba(235,54,33,1)'];
var hideColor4 = ['rgba(205,56,246,0.2)', 'rgba(106,33,210,0.2)', 'rgba(235,54,33,0.2)'];

// //多层饼图渲染
CFS.createECharts = function (id, showColor, hideColor, year, data) {
  // id : 渲染 echarts图的dom节点 id
  // showColor : echarts圆环图高亮的颜色
  // hideColor : echarts圆环图不高亮的颜色
  /* data : 渲染 echarts的数据
   数据格式如下:
   */
  //根据传入的id获取dom

  //取出三个数据中最大值
  // console.log("createECharts",data);
  if (data.map.length >= 1) {
    var Arr = [];
    for (var mapI = 0, mapLen = data.map.length; mapI < mapLen; mapI++) {
      Arr.push(data.map[mapI].value)
    }
    // console.log("MaxArr",Arr)
    var MaxValue = Math.max.apply(null, Arr);
    // console.log("MaxValue",MaxValue)
  }
  var myChart = echarts.init(document.getElementById(id));
  //显示的data圆环
  var dataStyle = {
    normal: {
      label: {show: false},
      labelLine: {show: false}
    }
  };

  //多层圆环图option
  var popEchartsOption = {
    title: {
      x: 'center',
      y: 'center',
      itemGap: 5,
      textStyle: {
        color: 'rgba(30,144,255,0.8)',
        fontFamily: '微软雅黑',
        fontSize: 35,
        fontWeight: 'bolder'
      }
    },
    legend: {
      orient: 'vertical',
      // x : document.getElementById(id).offsetWidth / 2,
      // y : 45,
      bottom: 0,
      right: 0,
      itemGap: 10,
      formatter: ' {name} {value}',
      textStyle: {
        color: '#b3b2b0',
        fontSize: 14
      }
      // data:[]
    },
    tooltip: {
      show: true,
      formatter: {}
      // formatter: function (data) {
      //     console.log(data)
      // }
    },
    series: []
  };

  popEchartsOption.color = showColor;

  var PieSeriesData = [];
  var len = data.map.length;
  console.log("len",len);

  var PieData = data.map;
  // console.log("PieData",PieData);

  // 数组重组(按照今年\去年\平均的顺序)
  var change = function (arr, index) {
    var temp;
    if (index === 0 || index > arr.length - 1) {
      return arr;
    }
    temp = arr[index];
    arr[index] = arr[index - 1];
    arr[index - 1] = temp;
    return arr;
  }
  change(PieData, 1);

  var Total = 1.5 * MaxValue; //并无意义 只是为了方便画出更直观显示的圆环图
  // console.log("Total",Total);
  //每个圆环的宽度值: 根据(最大半径:80;最小半径:40)向下取整计算
  var PieW = Math.floor(60 - 30) / len;
console.info("PieW:位"+PieW)
  var Formatter = function (data) {
    var tooltipsYear = '';
    switch (data.name) {
      case "今年":
      {
        tooltipsYear = year;
        break;
      }
      case "去年":
      {
        tooltipsYear = year - 1;
        break;
      }
      case "平均值":
      {
        tooltipsYear = "平均值";
        break;
      }
    }
    // console.log(data)
    return tooltipsYear + ':<br>' + PieData[data.seriesIndex].value + ''
  }

  popEchartsOption.tooltip.formatter = Formatter;

  var legendData = [];

  for (var i = 0; i <len ; i++) {
    // (function () {
    PieSeriesData = {
      name: '警情数',
      type: 'pie',
      // hoverAnimation:false,
      clockWise: true,
      center: [150, 80],
      tooltip: {
        textStyle: {
          color: '#fff',
          fontSize: 24
        }
      },
      radius: [60 - (PieW * (i + 1)), 60 - (PieW * i)],
      itemStyle: dataStyle,
      data: [
        {
          value: Math.floor((PieData[i].value / Total) * 100),
          name: PieData[i].name
        },
        {
          value: 100 - Math.floor((PieData[i].value / Total) * 100),
          name: '',
          itemStyle: {
            normal: {
              color: hideColor[i],
              label: {show: false},
              labelLine: {show: false}
            }
          },
          tooltip: {show: false} // 隐藏部分不显示提示框
        }
      ]
    };
    popEchartsOption.series.push(PieSeriesData);
    legendData.push({
      name: PieData[i].name,
      icon: 'rect'
    });
  }
  console.info(popEchartsOption)
  // popEchartsOption.legend.data = legendData;
  myChart.setOption(popEchartsOption);
};
//饼图右侧的信息渲染
CFS.createInfo = function (id, showColor, hideColor, year, data) {
  // id : 渲染数据的dom节点 id
  var infoHtml = '<li>' + data.classifyName + '</li>';
  // console.log('map',data.map)
  //根据data.map的数据自定义组装右边的去年/今年/平均信息
  if (data.map.length > 0) {
    //表示data.map有数据
    var mapData = [];
    for (var i = 0; i < data.map.length; i++) {
      if (data.map[i].name == "去年") {
        var mapText = year - 1 + '年 ' + data.map[i].value + ' ';
      } else if (data.map[i].name == "今年") {
        var mapText = year + '年 ' + data.map[i].value + ' ';
        //取前一个兄弟节点(类名cfsTotal)
        if (data.classifyName=="破案类") {
           $('#' + id).prev().empty().append(data.map[i].value + '<br>件');
        }else{
           $('#' + id).prev().empty().append(data.map[i].value + '<br>人');
        }
       

      } else if (data.map[i].name == "平均值") {
        var mapText = data.map[i].name + ' ' + data.map[i].value + ' ';

      }
      // console.log(mapText)
      mapData.push(mapText);
      // console.log("mapData",mapData)
    }
  } else {
  }
  // console.log(data.scale,typeof data.scale,'字符串转换成浮点数后:',Number(data.scale))
  // console.log("判断增长/降低",Number(data.scale)>0 ? 1 : 0)
  // 右侧详细信息中百分比显示样式判断
  var scaleColor = '';
  var scaleIcon = '';//表示箭头样式类名up/down
  if(data.hasOwnProperty('scale')){
    if (Number(data.scale) > 0 ? 1 : 0) {
      //百分比大于0,增长,显示红色上升箭头
      scaleColor = '#df0000';
      scaleIcon = 'up';
    } else if (Number(data.scale) < 0) {
      //百分比小于0,下降,显示绿色下降箭头
      scaleColor = '#a0ff30';
      scaleIcon = 'down';
    } else {
      //百分比等于0,无变化,不显示箭头
      scaleColor = '#fff';
      scaleIcon = '';
    }

    //百分比保留小数点后两位
    var scale = Number(data.scale).toFixed(2);
    // console.log("scale",scale)
    infoHtml += '<li style="color:' + scaleColor + '";> ' + scale + '%<p class="' + scaleIcon + '"></p></li>';
  }else{
    //如果百分比没数据(不显示) 为了保证CSS样式不错乱,添加空的标签
    infoHtml += '<li> ' +''+ '<p></p></li>';
  }

  infoHtml += '<li><i style="background-color: ' + showColor[0] + '";></i><i>' + mapData[0] + '</i></li>';
  infoHtml += '<li><i style="background-color: ' + showColor[1] + '";></i><i>' + mapData[1] + '</i></li>';
  infoHtml += '<li><i style="background-color:  ' + showColor[2] + '";></i><i>' + mapData[2] + '</i></li>';
  // console.log(infoHtml)
  $('#' + id).empty().append(infoHtml);

}
CFS.init = function (year, data) {
  console.log(data)
  // year : 页面时间下拉菜单选择的时间节点年
  var data1 = data.classifyNum[0];
  var data2 = data.classifyNum[1];
  var data3 = data.classifyNum[2];
  var data4 = data.classifyNum[3];
  // console.log(data1,data2,data3,data4);

  //饼图渲染
  CFS.createECharts('pie1', showColor1, hideColor1, year, data1);
  CFS.createECharts('pie2', showColor2, hideColor2, year, data2);
  CFS.createECharts('pie3', showColor3, hideColor3, year, data3);
  CFS.createECharts('pie4', showColor4, hideColor4, year, data4);

  //信息渲染
  CFS.createInfo('cfsInfo1', showColor1, hideColor2, year, data1);
  CFS.createInfo('cfsInfo2', showColor2, hideColor2, year, data2);
  CFS.createInfo('cfsInfo3', showColor3, hideColor3, year, data3);
  CFS.createInfo('cfsInfo4', showColor4, hideColor4, year, data4);

}

