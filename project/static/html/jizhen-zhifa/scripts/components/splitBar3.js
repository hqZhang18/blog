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

        itemStyle: {
          width: 3,
          height: 6,
          bgStyle: {
            width: 3,
            height: 32,
            fill: '#000620',
            spacing: 4 //小方块之间的间距
          },
          margin: {
            left:10,
            right:10
          },
          series: [
            {
              color: ['#5810ed', '#9446f8', '#9446f8'],
            },{
              color: ['#5810ed', '#9446f8', '#9446f8'],
            },{
              color: ['#5810ed', '#9446f8', '#9446f8']
            }
          ]
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
      var _self = this
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
      var dataset1 = []//装订证据材料
      var dataset2 = []//听阅卷
      var dataset3 = [] //移送案 
      for(var i = 0, len = data.length; i<len; i++){
        dataset1.push( parseInt(data[i].value, 10) )
        dataset2.push( parseInt(data[i].value, 10) )
        dataset3.push( parseInt(data[i].value, 10) )
      }
      var width = config.width
      var height = config.height

      //行高
      var lineHeigh = height/data.length  + 20

      var grid = config.grid

      

      //图形样式配置项
      var itemStyle = config.itemStyle

      // var common = {
      //   linear: function(name, data){
      //     console.log(name)
      //     var max = d3.max(data)
      //     name = d3.scale.linear()  
      //       .domain([0, max])  
      //       .range([0, width - grid.x - grid.x2/2])
      //   }

      // }
      //装订证据材料
      var linear1 = d3.scale.linear()  
          .domain([0, d3.max(dataset1)])  
          .range([0, width - grid.x - grid.x2/2])
      
      //听阅卷
      var linear2 = d3.scale.linear()  
          .domain([0, d3.max(dataset2)])  
          .range([0, width - grid.x - grid.x2/2]) 

      //移送案  
      var linear3 = d3.scale.linear()  
          .domain([0, d3.max(dataset3)])  
          .range([0, width - grid.x - grid.x2/2]) 
    
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
        //设置左边文字
       var leftTxt = config.leftText
        //添加左边文字
        leftText
          .attr('fill', leftTxt.color)
          .attr('font-size', leftTxt.fontSize)
          .attr('text-anchor', leftTxt.textAnchor)
          .attr('class', 'left-text')
          .attr('x', grid.x)
          .attr('y', itemStyle.height + 10 )
          .text(function(d,i){
            return data[i].name
          })
          .attr('class', 'leftText')

        var bgStyle = itemStyle.bgStyle  

        //添加数据矩形
        var max = width - grid.x / bgStyle.width * bgStyle.spacing
        group
          .attr('class', 'rectBg-group')
          .attr('transform', 'translate('+(grid.x+itemStyle.margin.left)+',0)')
         .selectAll('.rect-group')
         .data(d3.range(0, max))  //产生一系列的数值(添加小矩形的个数)
         .enter()  
         .append('rect') 
         .attr('width', bgStyle.width)
         .attr('height', bgStyle.height)
         .attr('x', function(d,i){
            return bgStyle.spacing * i
         })
         .attr("y",function(d,i){  
          return 0
         })
         .attr('fill', bgStyle.fill)
  
        var color = config.itemStyle.series[0].color

      _self.Gradient(svg, color)

        var dataGroup = group
              .append('g')
              .attr('class', 'dataGroup')

        //装订证据材料
        dataGroup.append('rect')
          .attr('width', function(d, i){
            var width = linear1(d.value1)
            return width
          })
          .attr('height', itemStyle.height)
          .attr('fill','url(#' + linearGradient.attr('id') + ')')
          .attr('y', 0)  
        //单独的小矩形  
        dataGroup.append('rect')
          .attr('width', itemStyle.width)
          .attr('height', itemStyle.height)
          .attr('fill','#56a2ff')
          .attr('x', function(d, i){
            var x = linear1(d.value1) + 2
            return x
          })

        //听阅卷  
        dataGroup.append('rect')
          .attr('width', function(d, i){
            var width = linear2(d.value2)

            return width
          })
          .attr('height', itemStyle.height)
          .attr('fill','url(#' + linearGradient.attr('id') + ')')
          .attr('y', 10) 

        dataGroup.append('rect')
          .attr('width', itemStyle.width)
          .attr('height', itemStyle.height)
          .attr('fill','#56a2ff')
          .attr('x', function(d, i){
            var x = linear2(d.value2) + 2
            return x
          })
          .attr('y', 10) 

          //移送案
         dataGroup.append('rect')
          .attr('width', function(d, i){
            var width = linear3(d.value3)
            return width
          })
          .attr('height', itemStyle.height)
          .attr('fill','url(#' + linearGradient.attr('id') + ')')
          .attr('y', 20)  

        dataGroup.append('rect')
          .attr('width', itemStyle.width)
          .attr('height', itemStyle.height)
          .attr('fill','#56a2ff')
          .attr('x', function(d, i){
            var x = linear3(d.value3) + 2
            return x
          })   
          .attr('y', 20)   

      }
    },

  /**
   *  @describe [渐变]
   *  @param    {[type]}   svg   [description]
   *  @param    {[type]}   color [description]
   */
  Gradient: function(svg, color) {

    //定义一个线性渐变
    var a = d3.hcl(color[0])
    var b = d3.hcl(color[1])
    var defs = svg.append('defs');
     //添加渐变色
    linearGradient = defs.append('linearGradient')
        .attr('id','linearColor3')
        .attr('x1','0%')
        .attr('y1','0%')
        .attr('x2','100%')
        .attr('y2','0%');

    var stop1 = linearGradient.append('stop')
            .attr('offset','0%')
            .style('stop-color',a.toString())
    
    var stop2 = linearGradient.append('stop')
            .attr('offset','100%')
            .style('stop-color',b.toString())
  }
}

  return splitBar
})