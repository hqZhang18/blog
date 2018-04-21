/**
 * @Author:      zhanghq
 * @DateTime:    2017-04-14 20:52:27
 * @Description: 柱状图
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    017-04-14 20:52:27
 */

define(function(require) {

  var commonUnit = require('../components/commonUnit.js')

  var splitBar = {

    /**
     * [defaultSetting 柱状图默认配置项]
     */
    defaultSetting: function() {

      return {
        width: 400,
        height: 200,
        fontFamily: '微软雅黑',
        min: 1,
        padding: {
          top: 10,
          right: 20,
          bottom: 0,
          left: 80
        },
        scale: 1,
        itemStyle: {
          width: 5,
          height: 12,
          color: ['#0313ae', '#03b4d4'],
          spacing: 1, //小方块之间的间距
          symbol: 'tilt',  //方块类型（矩形rect，平行四边形tilt，椭圆circle）
          skewX: 0,  //倾斜角度
          radius: 3,  //椭圆的半径
          margin: {
            left:10,
            right:10
          },
          rectMark: {
            width: 10,
            height: 20,
            fill: '#fff'
          },
        },
        leftText: {
          fontSize: 24,
          color: '#7dd3ff',
          textAnchor: 'start'
        },
        rightText: {
          fontSize: 24,
          color: '#7dd3ff',
          textAnchor: 'start'
        },
        grid: {  //文字离左右两边的距离
          x: 60,
          x2: 100
        }
     }
    },

    /**
     * [drawSplitBar 绘制柱状图]
     * @param  {[type]} svg  [svg容器]
     * @param  {[type]} data [数据]
     * @param  {[type]} opt  [配置项]
     */
    drawSplitBar: function(id, data, opt) {
     
      //获取配置项
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
      //获取data的value值
      var dataset = []
      for(var i = 0, len = data.length; i<len; i++){
        dataset.push(parseInt(data[i].value, 10))
      }
      var width = config.width
      var height = config.height

      //行高
      var lineHeigh = height/dataset.length  

      var grid = config.grid

      //设置左边文字
      var leftTxt = config.leftText

      //小矩形方块配置
      var itemStyle = config.itemStyle
          
      //右边文字配置
      var rightTxt = config.rightText

      //方块类型（矩形，平行四边形，椭圆）
      var symbol = config.itemStyle.symbol  

      //计算一系列的参数
      //添加矩形背景
      var bgWidth = width-grid.x+itemStyle.margin.left-grid.x2 - padding.left - padding.right
      var spacing = itemStyle.spacing + itemStyle.width 
      var dataWidth = width  - grid.x - grid.x2
      var max = Math.ceil(bgWidth/spacing)
      var unit = Math.floor(d3.max(dataset)/ max)
      var  index = 0

      //填充比例尺
      var linear = d3.scale.linear()  
          .domain([0, max])  
          .range([0, 1])
      var color = config.itemStyle.color
      //高亮颜色
      //var emphasis = config.itemStyle.emphasis.color
      //调用渐变色
      colorFill(color)
      //渐变色填充
      function colorFill(color){
        var a = d3.hcl(color[0]);    
        var b = d3.hcl(color[1]);    
        compute = d3.interpolate(a,b); 
      }
      
      //x轴比例尺
      var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([0, dataWidth]);
      /**
       * 获取update部分
       * 有元素与数据对应的部分称为 Update (更新属性值)
       */
      d3.select(id).selectAll('.group').remove()
      var update = svg.selectAll('.group')
        .data(data)
      
      /**
       * 获取enter部分
       * 初始化的时候数据没有任何对应的元素，这时候称为 Enter (添加元素后，赋予属性值)
       */
      var enter = update.enter()

      //获取exit部分
      var exit = update.exit()

      //处理update部分
      var updateGroup = update.attr('transform', function(d,i){
          return 'translate(0,'+(lineHeigh*i)+')'
         })
      
      //处理enter部分(添加组g元素)
      var group = enter.append('g')
        .attr('transform', function(d,i){

          return 'translate(0,'+(lineHeigh*i)+')'
        })
        .attr('class', 'group')


       var itemStyle = config.itemStyle 

        //添加左边文字
        group.append('text')
          .attr('fill', leftTxt.color)
          .attr('font-size', leftTxt.fontSize)
          .attr('text-anchor', leftTxt.textAnchor)
          .attr('class', 'left-text')
          .attr('x', -config.padding.left)
          .attr('y', itemStyle.height )
          .text(function(d,i){
            var name = data[i].name
            if(name.length>5){
              name = name.substring(0, 5) + '...'
            }
            return name
          })
          .attr('class', 'leftText')
         
         //添加矩形背景 
         group.append('rect')
          .attr('width', bgWidth)
          .attr('height', itemStyle.height+4)
          .attr('x', grid.x+itemStyle.margin.left)
          .attr('y', -4)
          .attr('fill', '#172850') 
          .attr('stroke', '#1b40cc')
          .attr('stroke-width', 1)
          .attr('opacity', 0.7)
          
        //添加数据矩形
        group.append('g')
         .attr('transform', 'translate('+(grid.x+itemStyle.margin.left)+',0)')
         .attr('class', function(d, i){
            return 'rect-group'+i
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
         .selectAll('.rect')
         .data(d3.range(0, max))  //产生一系列的数值(添加小矩形的个数)
         .enter()  
         .append('rect') 
         .attr("x", function(d,i){
            return spacing*i
         })
         .attr("y",function(d,i){  
          return -2
         })  
         .attr('width', itemStyle.width)
         .attr('height', itemStyle.height)
         .attr('fill', function(d, i) {
          var range = Math.ceil(dataset[index] / unit) //数据矩形个数
            if(range<=0){
              range = config.min
            }
            if(i==max-1){
              index ++
            }
            if(i<range) {
              d3.select(this).attr('class', 'rect-fill')
            }else{
              d3.select(this).attr('class', 'rect-nofill')
            }

            return i < range ? compute(linear(d)) : 'none'
          })
        
         //保存值后面用于计算位置
          var saveRange = []
          data.forEach(function(d, i){
            var range = $('.rect-group'+i).find('.rect-fill').length
            saveRange.push(range)
          })

          var rectMark = itemStyle.rectMark
          var rectW = itemStyle.width
          //添加右边小矩形
          // group.append('rect')
          //   .attr({
          //     width: rectMark.width,
          //     height: rectMark.height,
          //     fill: rectMark.fill,
          //     x: function(d, i){
          //       //位置计算
          //       var range = saveRange[i]
          //       console.log(i,  range)
          //       range = range > 23 ? (range + 4)*rectW : range*rectW
          //       var x =  bgWidth-(bgWidth - range)+grid.x+itemStyle.margin.left + rectMark.width - i

          //       return x
          //     },
          //     y: -rectMark.height/4 - 1
          //   })

        //添加右边文字(value)
        group.append('text')
          .attr('fill', rightTxt.color)
          .attr('font-size', rightTxt.fontSize)
          .attr('text-anchor', rightTxt.textAnchor)

          .attr('x', width-150)
          .attr('y', itemStyle.height )
          .text(function(d,i){
            return parseInt(data[i].value, 10)
          })
          .attr('class', 'rightText')
    }
  }

  return splitBar
})