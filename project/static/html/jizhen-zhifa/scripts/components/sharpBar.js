/**
 * @Author:      name
 * @DateTime:    2017-05-23 08:58:12
 * @Description: 事后监督(装订证据材料)
 * @Last Modified By:   name
 * @Last Modified Time:    2017-05-23 08:58:12
 */

define(function(require) {

  var commonUnit = require('../components/commonUnit.js')
  var dataH = 0 //数据高大高度
  var config = {} //配置项
  var sharpBar = {
    /**
     * 柱状图默认配置项
     */
    defaultSetting: function() {
      return {
        width: 450,
        height: 300,
        padding: {
          top: 40,
          left: 0, 
          bottom: 10,
          right: 10
        },
        min: 1,
        zoom: 10,
        color: ['#d63200', '#9936e8'],
        coordinate: ['60,20, 20,90, 60,160, 140,160, 180,90, 140,20'] , //正六边形的六个坐标点

        itemStyle:{
          strokeWidth: 1,
          stroke: 'none',
          color: ['#d63200', '#9936e8'],
          margin: {
            left: 0,
            bottom:8,
          },
          emphasis: {  //强调样式
            color: ['#042769', '#00fffd'],
            borderColor: '#042769'
          }
        },
        xText: {
          size: 24,
          color: '#fff',
          textAnchor: 'start',
          padding:{
            bottom: 0
          }
        },
        yAxis: {
          axisLine: {
            show: true
          },
          gridLine: {
            show: false
          },
          line: {
            height: 8,
            fill: '#172853',
            stroke: '#5c1e3c',
            strokeWidth: 2,
            radius: 5
          },
          ticks: 5
        },
        xAxis: {
          color: '#fff'
        },
        grid: {  //文字离左右两边的距离
          x: 50,
          x2: 20,
          y: 45,
          y2: 0
        }
      }
    },

    /**
     * 绘制柱状图
     * @param {object} svg svg对象
     * @param {object} data 数据
     * @param {object} config 图表配置项
     */
    drawCharts: function(id, data, opt) {
     var isData = commonUnit.noData(id, data)
      if(isData){
        d3.select(id).selectAll('svg').html('')
        return
      }
      var self = this

      config = _.merge({}, this.defaultSetting(), opt)
      
      //创建svg
      var svg = commonUnit.addSvg(id, config)
      var padding = config.padding
      var width = config.width
      var height = config.height

      var grid = config.grid

      var dataset = []
      var xData = []


      //获取data的value值
      var dataset1 = []//装订证据材料
      var dataset2 = []//听阅卷
      var dataset3 = [] //移送案 
      for(var i = 0, len = data.length; i<len; i++){
        var value1 = data[i].value1
        if(value1=='/'){
          value1 = 0
        }
        dataset1.push( parseInt(value1, 10) )
        dataset2.push( parseInt(data[i].value2, 10) )
        dataset3.push( parseInt(data[i].value3, 10) )
        var name = data[i].name
        // name = name.replace('-', ',')
        xData.push(name)
      }

      var pointStyle = config.pointStyle
      var oPoints = config.coordinate[0]
      var polygonW = polygonW = 200/config.zoom
      oPoints = oPoints.split(',')
 
       /**
       * 获取update部分
       */
      d3.select(id).selectAll('.group').remove()
      var update = svg.selectAll(".group")
        .data(data)
      
      //获取enter部分
      var enter = update.enter()

      //获取exit部分
      var exit = update.exit()

      //处理exit部分
       exit.remove()
 
      //数据高大高度
      dataH = height - padding.bottom - padding.top - grid.y - grid.y2
      var max = d3.max(dataset1)
      //装订证据材料
      var linear1 = d3.scale.linear()  
          .domain([0, max])  
          .range([0, dataH])
      
      //听阅卷/移送案
      var linear2 = d3.scale.linear()  
          .domain([0, dataH])  
          .range([0, dataH])

      d3.select(id).selectAll('.axis').remove()
      //生成Y轴及网格线
      var yScale =  commonUnit.addYAxis(svg, config, dataset)
      //生成X轴
      commonUnit.addXAxis(svg, config, xData)  
      //获取  x轴transform的位置 
      var transX = commonUnit.getTransformX(id, data)     
      
      var group = enter.append('g')
        .attr('transform',function(d,i){
          var x = transX[i]
          return 'translate('+x+', '+(height-config.grid.y)+')'
        })
        .attr('class', 'group')
       
        var points = []
        for(var i = 0; i<oPoints.length; i++) {
          points.push(oPoints[i]/config.zoom)
        }

        //定义一个线性渐变  
          var colors1 = [
            {
              color: ['#17bec7', '#11244e'],
              id: 'sharpG1'
            }
          ] 
          //听阅卷
          var colors2 = [
            {
              color: ['#6f44d1', '#0a0d38'],
              id: 'sharpG2'
            }
          ] 
          //移送
          var colors3 = [
            {
              color: ['#0578d1', '#11286b'],
              id: 'sharpG3'
            }
          ] 
          //渐变配置项
          var gradientCfg = {
            x1: '0%',
            y1: '0%',
            x2: '0%',
            y2: '100%',
            offset1: '0%',
            offset2: '100%',
            opacity1: 1,
            opacity2: 1
          } 
        //调用渐变
        commonUnit.addGradient(id, colors1, gradientCfg)
        commonUnit.addGradient(id, colors2, gradientCfg)
        commonUnit.addGradient(id, colors3, gradientCfg)
        //装订证据材料

        self.addDatas(group, linear1, 0)
        self.addDatas(group, linear2, 1)
        self.addDatas(group, linear2, 2)
        
    },
    addDatas: function(group, linear, type) {
      var itemStyle = config.itemStyle
      var grid = config.grid
      var xText = config.xText
      group.append("polygon")
        .attr({
          points: function(d, i) {
            var p1 = 0
            var h = 10
            switch(type) {
              case 0:
                var value1 = d.value1
                if(value1=='/'){
                  value1 = 0
                }
                p1 = linear(value1)
              break;
              case 1:
                p1 = linear(d.value2)
                 h = -5
              break;
              case 2:
                p1 = linear(d.value3)
              break;
            }
            if(p1>=dataH) {
              p1 = dataH  
            }  
            //var points = '6, '+-(p1-10)+', 2, '+ -p1 +', 6, 16, 14, 16, 18, 9, 14, '+ -p1 +''
            var points = '20, '+-(p1-h)+', -15, '+ -(p1-h-8) +', -15, 44, 20, 40, 54, 44, 54, '+ -(p1-h-8) +''
            
            return points
          },
          stroke: itemStyle.stroke,
          'stroke-width': itemStyle.strokeWidth,
          fill: function(d, i){
            var fill = ''
            switch(type) {
              case 0:
                fill = 'url(#sharpG1)'
              break;
              case 1:
                fill = 'url(#sharpG2)'
              break;
              case 2:
                fill = 'url(#sharpG3)'
              break;
            }
            return fill
          },
          transform: function(d, i){
            return 'translate(-10, '+-config.grid.y+')'
          },
          class: 'polygon'
        })

       //添加value 
      group.append('text')
        .attr({
          x: 0,
          y: function(d, i){
            var y = 0
            var y2 = 38
            switch(type){
              case 0:
                var value1 = d.value1
                if(value1=='/'){
                  value1 = 0
                }
                y = linear(value1)
              break;
              case 1:
                y = linear(d.value2)
                y2 = 55
              break;
              case 2:
                y = linear(d.value3)
            }
           
            if(y>=dataH){
              y = dataH 
            }
            return -y - y2
          },
          fill: xText.color,
          stroke: xText.stroke,
          'text-anchor': xText.textAnchor,
          'text-size': xText.fontSize
        })  
        .text(function(d, i){
          var text = ''
          switch(type){
            case 0:
              var value1 = d.value1
              if(value1=='/'){
                value1 = 0
              }
              text = value1
            break;
            case 1:
              text = d.value2
            break;
            case 2:
              text = d.value3
          }
          return text
        })
    }

  }

  return sharpBar
})