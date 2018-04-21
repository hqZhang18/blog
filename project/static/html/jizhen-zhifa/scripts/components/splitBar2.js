/**
 * @Author:      zhanghq
 * @DateTime:    2017-04-14 20:52:27
 * @Description: 柱状图
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    017-04-14 20:52:27
 */

define(function(require) {

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
        itemStyle: {
          width: 5,
          height: 10,
          color: ['#5810ed', '#282f36'],
          spacing: 4, //小方块之间的间距
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
          color: '#fff',
          textAnchor: 'middle'
        },
        grid: {  //文字离左右两边的距离
          x: 60,
          x2: 40
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
      //创建svg
      var svg = null
      if(d3.select(id).selectAll('svg')[0].length > 0) {
        svg = d3.select(id).selectAll('svg')
      } else {
        svg = d3.select(id)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('padding-top', '10px')
         
      } 
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
      var spacing = itemStyle.spacing + itemStyle.width 
      var dataWidth = width  - grid.x - grid.x2
      var max = Math.floor(dataWidth/(itemStyle.width*2))-itemStyle.width
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
      var updateGroup = update.attr('transform', function(d,i){
          return 'translate(0,'+(lineHeigh*i)+')'
         })
      
      //处理enter部分(添加组g元素)
      var enterGroup = enter.append('g')
        .attr('transform', function(d,i){
          return 'translate(0,'+(lineHeigh*i)+')'
        })
        .attr('class', 'group')

      //处理exit部分(删除元素（remove）)
       exit.remove()  
 
      //里面的小矩形太多了，直接移出
      d3.selectAll('.rect-group').remove()

      var exitLen = exit[0].length

      //exitLen如果等于0就是初始化执行else
      if(exitLen!=0){
        //updateData 如果已经添加过相应的元素，就直接选择更新
        var group = updateGroup.select('.group')
        var leftText = updateGroup.select('.leftText')
        var rightText = updateGroup.select('.rightText')
        var dom0 = {
          group: group,
          leftText: leftText,
          rightText: rightText
        }
        addElement(dom0)
      }else{
        //enterData 如果没有就append添加
        var group = enterGroup.append('g')
        var leftText = enterGroup.append('text')
        var rightText = enterGroup.append('text')
        var dom = {
          group: group,
          leftText: leftText,
          rightText: rightText
        }
        addElement(dom)
      } 

      //添加元素 (left-text, rect, right-text )
      function addElement(dom){
        var group = dom.group
        var leftText = dom.leftText
        var rightText = dom.rightText

        //添加左边文字
        leftText
          .attr('fill', leftTxt.color)
          .attr('font-size', leftTxt.fontSize)
          .attr('text-anchor', leftTxt.textAnchor)
          .attr('class', 'left-text')
          .attr('x', grid.x)
          .attr('y', itemStyle.height )
          .text(function(d,i){
            return data[i].name
          })
          .attr('class', 'leftText')

        //添加数据矩形
        group
         .attr('class', 'rect-group')
         .attr('transform', 'translate('+(grid.x+itemStyle.margin.left)+',0)')
         .selectAll('.rect-group')
         .data(d3.range(0, max))  //产生一系列的数值(添加小矩形的个数)
         .enter()  
         .append('rect') 
         .attr("x", function(d,i){

            //如果所有间距一样，不需要加if
            // if(i%2==0){
            //     return spacing*i  +3
            // }
            return spacing*i
         })
         .attr("y",function(d,i){  
          return 0
         })  
         .attr('width', itemStyle.width)
         .attr('height', itemStyle.height)
         .attr('fill', function(d, i) {
          var range = Math.floor(dataset[index] / unit) //数据矩形个数

            if(range<=0){
              range = config.min
            }
            if(i==max-1){
              index ++
            }
            return i < range ? compute(linear(d)) : 'none'
          })
         .attr('class', 'rect')
          //类型样式     
          if(symbol=='circle'){
            d3.selectAll('rect')
              .attr('rx', itemStyle.radius)
              .attr('ry', itemStyle.radius)
              .attr('width', itemStyle.width+2)
          }
          if(symbol=='tilt'){
            d3.selectAll('rect')
              //倾斜
              .attr('transform','skewX('+-(itemStyle.skewX)+')')
          }

        //添加右边文字(value)
        rightText
          .attr('fill', rightTxt.color)
          .attr('font-size', rightTxt.fontSize)
          .attr('text-anchor', rightTxt.textAnchor)
          .attr('x', function(d, i){
            var range = Math.floor(dataset[i] / unit) //数据矩形个数
            console.log(range * 7)
            return   itemStyle.width*range * 2 + 90
          })
          .attr('y', itemStyle.height )
          .text(function(d,i){
            return parseInt(data[i].value, 10)+'人'
          })
          .attr('class', 'rightText')

      }
    }
  }

  return splitBar
})