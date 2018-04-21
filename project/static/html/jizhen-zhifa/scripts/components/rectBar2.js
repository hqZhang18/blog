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
        scale: 1,
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        itemStyle: {
          width: 5,
          height: 12,
          color: ['#0c89ff', '#8505ff'],
          spacing: 1, //小方块之间的间距
          symbol: 'tilt',  //方块类型（矩形rect，平行四边形tilt，椭圆circle）
          skewX: 0,  //倾斜角度
          radius: 3,  //椭圆的半径
          margin: {
            left:10,
            right:10
          },
        },
        leftText: {
          fontSize: 12,
          color: 'yellow',
          textAnchor: 'end'
        },
        rightText: {
          fontSize: 12,
          color: '#a5cfe0',
          textAnchor: 'middle'
        },
        grid: {  //文字离左右两边的距离
          x: 0,
          x2: 0,
          y: 38,
          y2: 0
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
      var config = _.merge({}, this.defaultSetting(), opt)
      var width = config.width
      var height = config.height
      var padding = config.padding
      //创建svg
      var svg = commonUnit.addSvg(id, config)
      
      //获取data的value值
      var dataset = []
      var xData = []
      for(var i = 0; i<data.length; i++){
        dataset.push(parseInt(data[i].value, 10))
        var name = data[i].name
				name = name.substring(5)
				name = name.replace('-', '.')
        xData.push(name)
      }
		
      d3.select(id).selectAll('.axis').remove()
      
      //生成X轴
      commonUnit.addXAxis(svg, config, xData)

       //获取  x轴transform的位置 
      var transX = commonUnit.getTransformX(id, data) 
      //行高
      var lineHeigh = height/dataset.length  

      var grid = config.grid

      //设置左边文字
      var leftTxt = config.leftText

      //小矩形方块配置
      var itemStyle = config.itemStyle
          
      //右边文字配置
      var rightTxt = config.rightText

       //计算一系列的参数
      var spacing = itemStyle.spacing + itemStyle.width 
      var dataWidth = height 

      var max = Math.floor(dataWidth/20 ) //小矩形的w,h是10，这里除20
      var unit = Math.ceil(d3.max(dataset)/ max)

      var  index = 0

      //填充比例尺
      var linear = d3.scale.linear()  
          .domain([0, max])  
          .range([0, 5])
      var color = config.itemStyle.color
      //高亮颜色
      //调用渐变色
      colorFill(color)
      //渐变色填充
      function colorFill(color){
        var a = d3.hcl(color[0]);    
        var b = d3.hcl(color[1]);    
        compute = d3.interpolate(a,b); 
      }
    
      /**
       * 获取update部分
       * 有元素与数据对应的部分称为 Update (更新属性值)
       */
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
      // var updateGroup = update.attr('transform', function(d,i){
      //     return 'translate(0,'+(lineHeigh*i)+')'
      //    })
      
      //处理enter部分(添加组g元素)
      d3.select(id).selectAll('.group').remove()
      var group =  svg.selectAll('.group')
           .data(data)
           .enter()
           .append('g')
           .attr('class', 'group')
           .attr('transform', function(d, i){
              var x= transX[i]
              var y = height - 30
              return 'translate('+x+', '+y+')'
           })
            .on('mouseover', function(d, i){
             d3.select(this).style('cursor', 'pointer')
              //添加提示框
              commonUnit.addTooltip(id, d)
           })
           .on('mouseout', function(d, i){
              d3.selectAll('.charts-tooltip').remove()
           })

       var itemStyle = config.itemStyle 

       var rects = [] //填充多少了个rect

        //添加数据矩形
        group.append('g')
         .attr('transform', 'translate(0, -20)')
         .selectAll('.rect-group')
         .data(d3.range(0, max))  //产生一系列的数值(添加小矩形的个数)
         .enter()  
         .append('rect') 
         .attr({
            x: 0,
            y: function(d, i) {
              return -12 * i +10
            },
            width: 10,
            height: 10,
            class: 'rect',
            fill: function(d, i) {
              var range = Math.floor(dataset[index] / unit) //数据矩形个数
              if(range<=0){
                range = config.min
              }
              if(i==max-1){
                 rects.push(range) //这里把值保存下来，下面用于文字的y值
                 index ++
              }
              return i < range ? compute(linear(d)) : 'none'
            },
         })
         

         //线比例尺
         var linear = d3.scale.linear()
            .domain([0, d3.max(dataset)])
            .range([0, height - grid.y])
 
         //添加value
         group.append('text')
          .attr({
            x: 0,
            y: function(d, i){
              return  -rects[i] * 10 - 20 - i
            },
            'font-size': 24,
            'text-anchor': 'middle',
            fill: '#a5cfe0'
          })
          .text(function(d, i){
            return d.value
          })
    }
  }

  return splitBar
})