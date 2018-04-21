/**
 * @Author:      name
 * @DateTime:    2017-05-17 18:29:07
 * @Description: 案件受理总数
 * @Last Modified By:   name
 * @Last Modified Time:    2017-05-17 18:29:07
 */


define(function(require) {
 
  var commonUnit = require('../components/commonUnit.js')

  var violation = {
    /**
     * 柱状图默认配置项
     */
    defaultSetting: function() {
      return {
        width: 470,
        height: 500,
        padding: {
          top: 30,
          right: 40, 
          bottom: 0,
          left: 70,
        },
        itemStyle: {
          height: 15,
          color: '#ff456c',
          gradientColor: ['#761944', '#761944'], 
          stroke: '#ff456c',
          storkeWidth: 1,
          radius: 5,  //椭圆的半径
          margin: {
            left:10,
            right:40
          },
        },
        leftText: {
          fontSize: 24,
          color: '#7ed2ff',
          textAnchor: 'end'
        },
        rightText: {
          fontSize: 26,
          color: '#5e98cd',
          textAnchor: 'end'
        },
        grid: {  //文字离左右两边的距离
          x: 65,
          x2: 60
        }

     }
    },
    /**
     * 绘制图
     */
    drawCharts: function(id, data, opt) {

      var config = _.merge({}, this.defaultSetting(), opt)
      var width = config.width
      var height = config.height
      var padding = config.padding
      //创建svg
      var svg = commonUnit.addSvg(id, config)
      var dataset = []
      for(var i = 0, len = 6; i<len; i++){
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
      var dataWidth = width  - grid.x - grid.x2 - padding.left - padding.right

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
      var cradientconfig = {
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
          id: 'caseTotalV'
        }
      ]
     
      commonUnit.addGradient(id, colors, cradientconfig)



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
      

          //添加数据
        group.append("rect")
          .attr({
            class: 'rect-data',
            fill: 'url(#caseTotalV)',
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
            fill: '#ff456c',
            
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
              x: function(d, i){
              var dWidth = dataWidth-xScale(d.value) + itemStyle.margin.left+grid.x+grid.x2
              if(dWidth<=0){
                dWidth = config.min
              }

              return dWidth
            },
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
  return violation
})