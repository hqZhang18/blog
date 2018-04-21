/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-17 09:58:27
 * @Description: Description
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-17 09:58:27
 */

define(function(require){



  var commonUnit = {

    addSvg: function(id, config){
      //创建svg
      var svg = null
      var width = config.width
      var height = config.height
      var padding = config.padding
      if(d3.select(id).selectAll('svg')[0].length > 0) {
        svg = d3.select(id).selectAll('svg')
      }else {
        svg = d3.select(id)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('padding', function() {
            var top = padding.top
            var bottom = padding.bottom
            var left = padding.left
            var right = padding.right
            return top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px'
          })
      }
      return svg 
    },

    /**
     *  @describe [添加提示框]
     *  @param    {[type]}   id   [description]
     *  @param    {[type]}   data [description]
     */
    addTooltip: function(id, data){
      var html = data.name + '<br /> 数量：' + data.value 
      var tooltip = d3.select('body')
          .append('div')
          .attr('class', 'charts-tooltip')
          .html(html)
          
      var height = $('.charts-tooltip').height()
      var width = $('.charts-tooltip').width()
     
      var top = event.y / window.Y - height - height/2
      var left = event.x /window.X  
      if(left>2200) {
        left = left - 120
      }
      if(data.name.length<5){
        left = left + width
      }
      tooltip
        .style('top', top+'px')
        .style('left', left+'px')
    },

    /**
     *  @describe [创建渐变]
     *  @param    {[type]}   svg    [description]
     *  @param    {[type]}   colors [description]
     */
    addGradient: function(id, colors, config) {
       var defs = null
       var svg = d3.select(id).select('svg')
        if(d3.select(id).selectAll('svg defs')[0].length > 0){
          
           defs = d3.select(id).selectAll('svg defs')
        }else{
          defs = svg.append('defs')
        }

      colors.forEach(function(item){
        var color = item.color
        var id = item.id
        var a = d3.hcl(color[0])
        var b = d3.hcl(color[1])
        
        if(d3.select(id).selectAll(id).length>0){
          return
        }
       
         //添加渐变色

        var gradient = defs.append('linearGradient')
            .attr({
              'id': id,
              'x1': config.x1,
              'y1': config.y1,
              'x2': config.x2,
              'y2': config.y2
            })

        //开始颜色    
        var stop1 = gradient.append('stop')
                .attr('offset', config.offset1)
                .style({
                  'stop-color': a.toString(),
                  'stop-opacity':  config.opacity1
                })
        //结束颜色
        var stop2 = gradient.append('stop')
                .attr('offset', config.offset2)
                .style({
                  'stop-color': b.toString(),
                  'stop-opacity':  config.opacity2
                })
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
       var svg = d3.select(id).select('svg')

        if(d3.select(id).selectAll('svg filter')[0].length > 0){
          return
           
        }else{
          defs = d3.select(id).selectAll('defs')
        }

      //添加渐变色
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
    },

    /**
     *  @describe [创建背景图片]
     *  @param    {[type]}   config [description]
     */
    addPattern: function(id, config){
      var config = {
        id: 'image',
        width: 200,
        height: 200,
        image: {
          width: 500,
          height: 200,
          href: './../images/barBg.png',
        }
      }
      //判断是否有defs
      var defs = null
       var svg = d3.select(id).select('svg')
        if(d3.select(id).selectAll('svg defs')[0].length > 0){
          return
           defs = d3.select(id).selectAll('svg defs')
        }else{
          defs = svg.append('defs')
        }
      
      defs.append('pattern')
        .attr({
          id: config.id,
          patternUnits: 'userSpaceOnUse',
          width: config.width,
          height: config.height
        })
        .append('image')
        .attr({
          preserveAspectRatio: 'none',
          width: config.image.width,
          height: config.image.height,
          'xlink:href': config.image.href
        })
    },

    /**
     *  @describe [添加Y轴及网格线]
     *  @param    {[type]}   svg     [svg容器]
     *  @param    {[type]}   config  [配置项]
     *  @param    {[type]}   dataset [数据]
     *  @return   {[object]}   [Y轴比例尺]
     */
    addYAxis: function(svg, config, dataset){
      var padding = config.padding
      var width = config.width - padding.left -padding.right
      var height = config.height

      //定义y轴比例尺
      var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset)])
        .range([height-config.grid.y-config.grid.y2, 0])

      //定义y轴样式
      var isAxisLine = config.yAxis.axisLine.show 
      if(isAxisLine){
        var yAxis=d3.svg.axis()
          .scale(yScale)
          .orient('left')
          .ticks(config.yAxis.ticks)

        //添加y轴
        var yBar=svg.append('g')
          .attr('class','axis axis-y')
          .attr('transform', 'translate(0, '+config.grid.y2+')')
          .call(yAxis)
      }

      //定义纵轴网格线
      var isGridLine = config.yAxis.gridLine.show 
      if(isGridLine){
        var yInner = d3.svg.axis()
        .scale(yScale)
        .tickSize(-(width) ,0)
        .tickFormat('')
        .orient('left')
        .ticks(config.yAxis.ticks)
        
        // //添加纵轴网格线
        var yInnerBar=svg.append('g')
          .attr('class', 'inner_line')
          .attr('transform', 'translate(0, '+config.grid.y2+')')
          .call(yInner) 
      }
         
      return yScale
    },

    /**
     *  @describe [添加X轴]
     *  @param    {[type]}   svg     [svg容器]
     *  @param    {[type]}   config  [配置项]
     *  @param    {[type]}   dataset [数据]
     *  @return   {[object]}   [X轴比例尺]
     */
    addXAxis: function(svg, config, xData){
 
      var padding = config.padding
      var width = config.width - padding.left -padding.right
      var height = config.height

      //定义X轴比例尺(序数比例尺)
      var xScale = d3.scale.ordinal()
        .domain(xData)
        .rangeBands([0, width])


        // var xScale = d3.scale.linear()
        //     .domain([0, xData.length-1])
        //     .range([0, width ])

       //定义X轴    
      var xAxis = d3.svg.axis()
        .scale(xScale)      //指定比例尺
        .orient('bottom')   //指定刻度的方向
          
      //添加X轴    
      svg.append('g')
        .attr('class', 'axis axis-x')
        .call(xAxis)
        .attr('transform',function(d,i){
          return 'translate(0,'+(height - config.grid.y+10)+')'
      })
      //替换X轴文字  
      var id = config.id
      for(var i=0, len = xData.length; i<len; i++){
        var oText = $(''+id+' .axis-x').find('.tick text').eq(i).text(xData[i])
      }
      return xScale  
    },

    /**
     *  @describe [获取X轴transform的x值]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    getTransformX: function(id, data) {
      //获取  x轴transform的位置 
      var transX = []    
      var newData =this.unique(data)
      for(var j=0, len = newData.length; j<len; j++){
        var posiX = $(''+id+' .axis-x').find('.tick').eq(j).attr('transform')
        var parent = $(this).parent().attr('transform')
        posiX = posiX.replace(' ' ,',')  //ie兼容处理

        var index = posiX.indexOf(',')
        transX.push(posiX.substring(10, index))
      }   
      return transX  
    },

    /**
     *  @describe 去重
     *  @return   {[type]}   [description]
     */
    unique: function(data) {
      var res = []
      var json = {}
      for(var i = 0, len = data.length; i<len; i++) {
        if(!json[data[i].name]) {
          res.push(data[i])
          json[data[i].name] = 1
        }
      }
      return res
    },

    noData: function(id, data) {
      if(data==undefined || data.length==0){
        $(id).find('.no-data').show().html('暂无数据')
        d3.select(id).select('svg').html('')
        return true
      }else{
        $(id).find('.no-data').hide()
      }
      
    }
  }

  return commonUnit
})