/**
 * @Author:      name
 * @DateTime:    2017-05-17 18:29:07
 * @Description: 案件受理总数
 * @Last Modified By:   name
 * @Last Modified Time:    2017-05-17 18:29:07
 */


define(function(require) {
 
  var commonUnit = require('../components/commonUnit.js')

  var processCount = {
    /**
     * 柱状图默认配置项
     */
    defaultSetting: function() {
      return {
        width: 400,
        height: 200,
        fontFamily: '微软雅黑',
        min: 1,
        padding: {
          top: 20,
          bottom: 0,
          left: 70,
          right: 40
        },
        itemStyle: {
          height: 12,
          color: '#172850',
          gradientColor: ['#6b1dbb', '#6b1dbb'], 
          stroke: '#751dd2',
          storkeWidth: 1,
          radius: 5,  //椭圆的半径
          margin: {
            left:10,
            right:40
          },
        },
        leftText: {
          fontSize: 12,
          color: '#7ed2ff',
          textAnchor: 'end'
        },
        rightText: {
          fontSize: 12,
          color: '#fff',
          textAnchor: 'end'
        },
        grid: {  //文字离左右两边的距离
          x: 65,
          x2: 20
        }

     }
    },
    /**
     * 绘制饼图
     */
    drawCharts: function(id, data, opt) {

      var config = _.merge({}, this.defaultSetting(), opt)
      var width = config.width
      var height = config.height
      //创建svg
      var svg = commonUnit.addSvg(id, config)

      var dataset = []
      for(var i = 0, len = data.length; i<len; i++){
        dataset.push(parseInt(data[i].value, 10))
      }
      
      var lineHeigh = height/dataset.length  

      var grid = config.grid

      //设置左边文字
      var leftTxt = config.leftText

      //小矩形方块配置
      var itemStyle = config.itemStyle

      //右边文字配置
      var rightTxt = config.rightText

      //数据的显示范围
      var dataWidth = width  - grid.x - grid.x2 - itemStyle.margin.left - itemStyle.margin.right

      var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([dataWidth, 0]);
    
    /**
       * 获取update部分
       */
      var update = svg.selectAll(".tick")
        .data(data)
      
      //获取enter部分
      var enter = update.enter()

      //获取exit部分
      var exit = update.exit()

      //处理update部分
 
     
        
      //渐变配置项
      var gradientCfg = {
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '0%',
        offset1: '0%',
        offset2: '100%',
        opacity1: 0,
        opacity2: 1
      }    

      var colors = [
        {
          color: itemStyle.gradientColor,
          id: 'caseTotalP'
        }
      ]
 
      commonUnit.addGradient(id, colors, gradientCfg)



        var lineHeigh = height/dataset.length 
        //添加小的矩形box
        var group = svg.selectAll(".group")  
          .data(data)
          .enter() 
          .append('g')
          .attr('transform', function(d,i){
            return 'translate(0,'+(lineHeigh*i)+')'
          })
          .attr('class', 'group')

      
        //添加左边文字
        group.append('text')
          .attr({
            fill: leftTxt.color,
            'font-size': leftTxt.fontSize,
            'text-anchor': leftTxt.textAnchor,
            'class': 'leftText',
            'x': grid.x - 15,
            'y': itemStyle.height,
          })
          .text(function(d,i){
            return data[i].name
          })
          

      //矩形背景
        group.append("rect")
          .attr("class","MyRect")
          .attr({
            class: 'rect-bg',
            fill: '#a800ff',
            opacity: 0.2,
            y: 0,
            x: itemStyle.margin.left+grid.x,
            height: itemStyle.height,
            width: dataWidth
          })

          //添加数据
        group.append("rect")
          .attr({
            class: 'rect-data',
            fill: 'url(#caseTotalP)',
            stroke: itemStyle.stroke,
            'stroke-width': itemStyle.storkeWidth,
            x: itemStyle.margin.left+grid.x,
            y: 0,
           
            height: itemStyle.height,
            width: function(d, i){
              var dWidth = dataWidth-xScale(d.value)
              if(dWidth<=0){
                dWidth = config.min
              }
              return dWidth
            }
          })

          //最右边的小矩形
          group.append("rect")
          .attr({
            class: 'rect-data2',
            fill: '#a545ff',
            
            x: function(d, i){
              var dWidth = dataWidth-xScale(d.value) + itemStyle.margin.left+grid.x
              if(dWidth<=0){
                dWidth = config.min
              }

              return dWidth
            },
            y: 0,
           
            height: itemStyle.height  ,
            width:  4
          })

          //添加右边文字
          group.append('text')
            .attr({
              x: width-grid.x2,
              y: itemStyle.height,
              fill: rightTxt.color,
              class: 'rightText',
              'font-size': rightTxt.fontSize,
              'text-anchor': rightTxt.textAnchor,
            })
            .text(function(d,i){
              return parseInt(data[i].value, 10) 
            })
             
 
  }
}
  return processCount
})