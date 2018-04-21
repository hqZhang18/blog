/**
 * @Author:      name
 * @DateTime:    2017-05-17 18:29:07
 * @Description: 案件受理总数
 * @Last Modified By:   name
 * @Last Modified Time:    2017-05-17 18:29:07
 */


define(function(require) {
 
  var commonUnit = require('../components/commonUnit.js')

  var triangleBar = {
    /**
     * 柱状图默认配置项
     */
    defaultSetting: function() {
      return {
        width: 470,
        height: 500,
        padding: {
          top: 10,
          right: 40, 
          bottom: 0,
          left: 70,
        },
        itemStyle: {
          height: 15,
          barWidth: 8,
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
          textAnchor: 'start'
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
     * 绘制饼图
     */
    drawCharts: function(id, data, opt) {
      var isData = commonUnit.noData(id, data)
      if(isData){
        return
      }
      var config = _.merge({}, this.defaultSetting(), opt)
      var width = config.width
      var height = config.height
      var padding = config.padding
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
      var dataWidth = width  - grid.x - grid.x2 - padding.left - padding.right

      var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([0, dataWidth]);
    
    /**
       * 获取update部分
       */
      var update = svg.selectAll(".tick")
        .data(data)
      
      //获取enter部分
      var enter = update.enter()

      //获取exit部分
      var exit = update.exit()

     
      d3.select(id).selectAll('.group').remove()
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
            'x': -config.padding.left,
            'y': itemStyle.height,
          })
          .text(function(d,i){
            var name = data[i].name
            if(name.length>5){
              name = name.substring(0, 4) + '...'
            }
            return name
          })

        var barWidth = itemStyle.barWidth
        this.addFilter(svg, id)
          group.append('polygon')  
            .attr({
              points: function(d, i){
                var p1 = -1

                var p2 = xScale(d.value) 
                if(p2==0){
                  p2 = -itemStyle.min
                }
                var p3 = p1
                var points = ''+p1+', '+(p1+barWidth)+'  '+p1+',  '+p3+' '+ p2+' '+barWidth/2+' '
               
                return points
              },
              fill: '#018eff',
              filter: 'url(#filter1)',
              'transform': 'translate(' + 65 + ',' + 2 + ')'
            })
            .on('mouseover', function(d, i) {
              d3.select(this).style('cursor', 'pointer')
              //添加提示框
              commonUnit.addTooltip(id, d)
            })
            //鼠标移开 
           .on('mouseout', function(){
              d3.selectAll('.charts-tooltip').remove()
           })


          //最右边的小矩形
          group.append("circle")
          .attr({
            class: 'rect-data2',
            fill: '#0094ff',
            filter: 'url(#filter1)',
            r: 4,
            cx: function(d, i){
              var dWidth =  xScale(d.value) + itemStyle.margin.left+grid.x
              if(dWidth<=0){
                dWidth = config.min
              }

              return dWidth
            },
            cy: barWidth/2
          })

          //添加右边文字
          group.append('text')
            .attr({
              x: function(d, i){
              var dWidth = xScale(d.value) + itemStyle.margin.left+grid.x+grid.x2
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
       },

       //定义线性渐变
    addFilter: function(svg, id){
      
      //配置项
      var config = {
        id: 'filter1',
        blur: 5
      }
      //判断是否有defs
      var defs = null
       

      if(d3.select(id).selectAll('defs')[0].length > 0){
        defs = d3.select(id).selectAll('defs')
      }else{
        defs = svg.append('defs')
      }

      //添加渐变色
       d3.select(id).selectAll('filter').remove()
       var filter = defs.append('filter')
            .attr({
               id : config.id,
               x : '0%',
               y : '0%',
               width: '200%',
               height: '200%'
            })
        
       filter.append('feOffset')   
          .attr({
             result : 'offOut',
             in : 'SourceAlpha',
             dx : 0,
             dy : 0
          })  

        //创建模糊效果    
        filter.append('feGaussianBlur')
          .attr({
            result: 'blurOut',
            in: 'SourceGraphic',
            stdDeviation: config.blur
          })
          
        filter.append('feBlend')
          .attr({
             in : 'SourceGraphic',
             in2 : 'blurOut',
             mode : 'normal'
          })
    }
}
  return triangleBar
})