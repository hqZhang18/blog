/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-14 10:33:27
 * @Description: 在侦案件数
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-03-14 10:33:27
 */

define(function(require){
  
  require('echarts')
  //实例化图表
  var EchartsDoms = [] 
  var caseNumber = {

    /**
     *  @describe [创建DOM]
     *  @param    {[object]}   data [数据]
     *  @param    {[string]}   id   [容器id]
     */
    createDom: function(data, id){

      if(data.length==0){
        $('#'+id).next().show()
      }else{
        $('#'+id).next().hide()
      }

      var elem = ''
      EchartsDoms = []  
      for(var i=0, len = data.length; i<len; i++){
        elem += '<div class="chartsBox">'
            + '<div id="'+id+''+i+'" class="caseCharts"></div>'
            + '<div class="gaugebg"></div>'
            + '</div>'
        EchartsDoms.push(''+id+''+i)
      }

      $('#'+id).html(elem)
    },

    /**
     *  @describe [渲染数据，创建图表]
     *  @param    {[object]}   data [图表数据]
     *  @param    {[object]}   cfg  [配置项]
     */
    renderData: function(data, cfg){
      var dataset = []
      for(var j=0, len2 = data.length; j<len2; j++){
        dataset.push(data[j].value)
      }

      //定义比例尺
      var linear = d3.scale.linear()
            .domain([0, d3.max(dataset)])
            .range([0, 180])
      //基础配置项
      var title = {
          show: true,
          offsetCenter: [0, "35%"], //标题位置设置
          textStyle: { //标题样式设置
            color: "#fff",
            fontSize: 28,
            fontFamily: "微软雅黑"
          }
        }

      var itemStyle = {
        normal: {
          color: '#959595', //指针颜色
          width: 2
        }
      } 

      var min = 10
      var x = 0
      for(var i=0, len=data.length; i<len; i++){

        var name = data[i].name
        var allName = data[i].name
        if(name.length>4){
          name = name.substr(0, 4) + '...'
        }
        var value = data[i].value
        var rate = cfg.rate
        var scale = Math.floor(linear(value/180) * 100)

        if(rate){
          var topValue = data[i].value*100 + '%'
        }else{
          var topValue = data[i].value
        }
        
        //实例化
        EchartsDoms[i] = echarts.init(document.getElementById(''+cfg.id+''+i))

        var option = {
            title: {
              text: topValue,
              subtext: '',
              left: 'center',
              padding: [10, 0],
              textStyle:{
                color: '#87a8fb',
                fontSize:  36
              }
             },
             //未使用，重新在body添加了提示框，先留着不删
             tooltip: {
              show: false,
              textStyle: {
                fontSize: 32
              },
              position: [10, 0],
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              //使用闭包来保存i的值
              formatter: (function(i){
                return function(){
                  var strName = ''
                  var name = data[i].name
                  //支队名太长显示不完做处理
                  // var j = name.indexOf('（')
                  // if(j != -1){
                  //   var name1 = name.substr(0, j)
                  //   var name2 = name.substring(j)
                  //   var name2 = name2.replace('（', '')
                  //   var name2 = name2.replace('）', '') 
                  //   strName = name1 + '<br/>' + name2
                  // }else{
                  //   strName = name
                  // }
                  // var name = data[i].name
                  //按比率显示
                  if(rate){
                    var value = data[i].value*100 + '%'
                  }else{
                    var value = data[i].value
                  }
                  return ''+ name +'<br/>'+ value+''
                }
              })(i)
             },
             series : [{
               name: "指标",
               type: "gauge",
               startAngle: 180, //总的360，设置180就是半圆
               endAngle: 0,
               
               center: cfg.series.center, //整体的位置设置
               radius: cfg.radius,
               axisLine: {
                  lineStyle: {
                    width: cfg.barWidth, //柱子的宽度
                     //color: [[scale, "#7d26b8"], [1, "#333946"]] //0.298是百分比的比例值（小数），还有对应两个颜色值
                    color: [[scale/100, new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ //添加渐变色
                      offset: 0,
                      color: cfg.color[0]
                    }, {
                      offset: 1,
                      color: cfg.color[1]
                    }]),], 
                    [1, "#333946"]]
                  }
              },
              itemStyle: itemStyle,
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              splitLine: {
                show: false
              },
              pointer: {
                width: 6, //指针的宽度
                length: "40%", //指针长度，按照半圆半径的百分比
                color: "#fff"
              },
              title: title,
              detail: {
                show: false
              },
              data: [{ //显示数据
                value: scale,
                name: name
                
              }]
          }]
        };
        EchartsDoms[i].clear()
        EchartsDoms[i].setOption(option)
      }
    },

    /**
     *  @describe [事件绑定]
     *  @param    {[type]}   data [数据]
     *  @param    {[type]}   cfg  [配置项]
     */
    bindEvent: function(data, cfg) {
      var id = cfg.id
      var rate = cfg.rate
      $('#'+id).find('.chartsBox').on('mouseover', function(evt){
        $(this).css('cursor', 'pointer')
        if(evt.relatedTarget != null){
          var target = evt.relatedTarget.nodeName
        }
        
        if(target=='DIV'){
          return
        }
        var index = $(this).index()
        var top = evt.pageY /window.Y - 140 //比例还原要除以缩放比例的值
        var left = evt.pageX /window.X + 20
        if(rate){
          var value = data[index].value*100 + '%'
        }else{
          var value = data[index].value
        }
        var tooltip = '<div class="e-tooltip" style="top: '+top+'px; left: '+left+'px">'
                     + '<p>'+data[index].name+'<br /></p><p>数量：'+value+'</p></div>'
        $('body').append(tooltip)
      })

      $('#'+id).find('.chartsBox').on('mouseout', function(evt){
        $('.e-tooltip').remove()
      })
    },

    /**
     *  @describe [初始化]
     *  @param    {[object]}   data [数据]
     *  @param    {[object]}   cfg  [配置项]
     */
    init: function(data, cfg){
      
      var _self = this
      _self.createDom(data, cfg.id)
      _self.renderData(data, cfg)
      _self.bindEvent(data, cfg)
    }
  }
  return caseNumber
})