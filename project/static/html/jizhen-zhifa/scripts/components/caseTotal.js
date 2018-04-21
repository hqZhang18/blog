/**
 * @Author:      name
 * @DateTime:    2017-05-17 18:29:07
 * @Description: 案件受理总数
 * @Last Modified By:   name
 * @Last Modified Time:    2017-05-17 18:29:07
 */


define(function(require) {
 
  var commonUnit = require('../components/commonUnit.js')
  var constants = require('../util/constants.js')

  var caseTotal = {
    /**
     * 柱状图默认配置项
     */
    defaultSetting: function() {
      return {
        width: 400,
        height: 200,
        fontFamily: '微软雅黑',
        min: 8,
        padding: {
          top: 10,
          left: 0, 
          bottom: 0,
          right: 10
        },
        itemStyle: {
          height: 12,
          color: '#172850',
          gradientColor: ['#6626ee', '#2a25bf'], 
          stroke: '#5391ff',
          fillId: 'caseTotalG',
          storkeWidth: 1,
          radius: 5,  //椭圆的半径
          margin: {
            left:10,
            right:40
          },
        },
        yAxis: {
          show: true
        },
        leftText: {
          fontSize: 24,
          color: '#5e98cd',
          textAnchor: 'end',
          left: 135
        },
        rightText: {
          fontSize: 26,
          color: '#7dd3ff',
          textAnchor: 'start',
          right: 50
        },
        grid: {  //文字离左右两边的距离
          x: 150,
          x2: 30
        },
        tooltip: {
          show: false
        }

     }
    },
    /**
     * 绘制图表
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
        dataset.push( parseInt(parseInt(data[i].value, 10), 10) )
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

      var linear = d3.scale.linear()
          .domain([0, d3.max(dataset)])
          .range([0, dataWidth])

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
      var gradientconfig = {
        x1: '0%',
        y1: '0%',
        x2: '0%',
        y2: '100%',
        offset1: '0%',
        offset2: '100%',
        opacity1: 1,
        opacity2: 1
      }    

      var colors = [
        {
          color: itemStyle.gradientColor,
          id: config.itemStyle.fillId
        }
      ]
  
      commonUnit.addGradient(id, colors, gradientconfig)
      commonUnit.addFilter(svg, id)
      
       //最边y轴的圆角矩形
       var isYAxis = config.yAxis.show
       if(isYAxis){
         d3.select(id).selectAll('.rect-bg').remove()
         svg.append('rect')
          .attr({
            x: grid.x - 5,
            y: 0,
            width: 6,
            height: height - 35,
            rx: 5,
            ry: 5,
            fill: '#172853',
            stroke: '#5b2d49',
            'stroke-width': 2,
            filter: 'url(#filter1)',
            class: 'rect-bg'
          })
       }

        var lineHeigh = height/dataset.length 
   
        d3.select(id).selectAll('.group').remove()
        //创建组元素
        var group = svg.selectAll(".group")  
          .data(data)
          .enter() 
          .append('g')
          .attr('transform', function(d,i){
            return 'translate(0,'+(lineHeigh*i)+')'
          })
          .attr('class', 'group')

        if(isYAxis){
          //添加小圆点图标
          group.append('image')
            .attr({
              'xlink:href': constants.SVG_IMG_PATH + '/images/mark.png',
              width: 16,
              height: 16,
              x: grid.x - 9,
              y: -2
            })
        }

        //添加左边文字
        group.append('text')
          .attr('fill', leftTxt.color)
          .attr('font-size', leftTxt.fontSize)
          .attr('text-anchor', leftTxt.textAnchor)
          .attr('class', 'left-text')

          .attr('x', leftTxt.left)
          .attr('y', itemStyle.height + 5 )
          .text(function(d,i){
            var name = data[i].name
            if(name.length>5){
              name = name.substring(0, 5) + '...'
            }
            return name
          })
          .attr('class', 'leftText')

      //矩形背景
        group.append("rect")
          .attr("class","MyRect")
          .attr({
            class: 'rect-bg',
            fill: itemStyle.color,
            y: 0,
            x: itemStyle.margin.left+grid.x,
            height: itemStyle.height,
            width: dataWidth,
            rx: itemStyle.radius,
            ry: itemStyle.radius,
            stroke: '#2034b9',
            'stroke-width': 1
          })

          //添加数据
        group.append("rect")
          .attr({
            class: 'rect-data',
            fill: 'url(#'+itemStyle.fillId+')',
            stroke: itemStyle.stroke,
            'stroke-width': itemStyle.storkeWidth,
            filter: 'url(#filter1)',
            x: itemStyle.margin.left+grid.x,
            y: 0,
            rx: itemStyle.radius,
            ry: itemStyle.radius,
            height: itemStyle.height,
            width: function(d, i){
              var dWidth = linear( parseInt(d.value) )
              if(dWidth< 5 && dWidth> 0){
                dWidth = config.min
              }
              if(dWidth>dataWidth){
                dWidth = dataWidth
              }
              return dWidth
            }
          })
          .on('mouseover', function(d, i) {
            if(config.tooltip.show){
              d3.select(this).style('cursor', 'pointer')
              //添加提示框
              commonUnit.addTooltip(id, d)
            }
          })
          //鼠标移开 
          .on('mouseout', function(){
            d3.selectAll('.charts-tooltip').remove()
          })
  
          //添加右边文字
          group.append('text')
            .attr({
              x: width - rightTxt.right,
              y: itemStyle.height + 5,
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
  return caseTotal
})