/*
* @Author: zhanghongqiao
* @Date:   2017-01-03
* @description：强戒类数据
* @File Name: drug.js
*/

define(function(require) {
  require('../canvas1')
  require('../lib/d3.v3.min')
  var leftBar = require('./leftBar')
  var rightBar = require('./rightBar')
  var drugBar = require('./drug-bar')       //强戒人员年龄分析
  var progressBar = require('./progressBar')  //零包案件数和50克以上毒品案件数
  var gaugeChart = require('./gaugeChart')   //仪表盘
  var centerPie = require('./centerPie')  //强戒 - 中间饼图
  var divideBar = require('./divideBar')  //强戒次数分析
  var dataUrl = './data/drug2017.json' 
  var year = window.global.getCookie("year")
  // var dataUrl = window.global.baseUrl+"/hy-radarmap/drug"
  var drug = {

    sentAjax: function(){
      var _self = this
      if (year==undefined||year==null||year=="") {
        window.location.href = "index.html"
      };
      var ajaxData = {
        year:window.global.getCookie("year"),
        quarter:window.global.getCookie("quarter"),
        month:window.global.getCookie("month"),
        week:window.global.getCookie("week")
      }
      $.ajax({
        type: "get",
        url: dataUrl,
        data:ajaxData,
        success: function(data) {
          if (!data.state) {
            alert('数据异常')
            return false
          }
          //添加中间饼图的当前年和历史年
/*          $(".legend a").eq(0).html(year)
          $(".legend a").eq(1).html(year-1)*/
          var rankingData = data.data
          var progressBarData1 = data.data.drugCaseType1
          var progressBarData2 = data.data.drugCaseType2
          var gaugeData = data.data.drugType

          //强戒次数分析数据
          var divideBarData = data.data.detoxification
          var personAge =  data.data.personAge
          _self.drugRanking(rankingData) //毒品罪案排名
          _self.rightBar(rankingData)
          drugBar.init(personAge)
          progressBar.init("progressChart-1", progressBarData1,year)
          progressBar.init("progressChart-2", progressBarData2,year)

          gaugeChart.init("drugTypeGauge",gaugeData)
          divideBar.init("detoxification",divideBarData)
          centerPie.drawChart(['drugCase', 'strongCase'], rankingData.caseType,year) //中间饼图


        }
      })
    },
    //毒品案件排名
     drugRanking: function(data){
      var cfg = {
        container: '#charts',

        width: 480,
        height: 280,
 
        itemStyle: {
          barWidth: 6,
          color: ['#de2528', '#a41e26', '#b3ff03', '#54a707'],
          borderColor: '#de2528',
          borderWidth: 1,
          margin:{
            left:0
          },
          min: 0,
          circle:{
            color:'#fff',
            r: 3,
          }
        },
        xText:{
          fontSize: 12,
          color: '#a5cfe0',
          textAnchor: 'start',
          margin:{
            top: 15,
            left: 0
          }
        },
        xAxis: {
          color: '#2c668e'
        },
        grid:{
          x: 50,
          y: 70,
          y2:40
        },
        baseValue: data.drugValue //超标变颜色
      }
      leftBar.drawChart(cfg, data.drugRanking)
     },
    //各排出所强戒人员排名
    rightBar: function(data){
      var cfg = {
        container: '#barCharts',
        width: 500,
        height:230,
        padding:{
          left: 45,
          bottom: 60,
          top:20
        },
        barWidth: 12,
        lineColor: '#2c668e',
        color: ['#ff2f2f', '#9936e8', '#7bdaf0', '#9936e8'],
        separate: 0, //两种颜色区分
        baseValue: data.personValue
      }

      rightBar.drawChart(cfg, data.personRanking)
    },
 

    init: function(){
      this.sentAjax()
    } 
  }

  return drug
  
})  