/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-18 11:33:27
 * @Description: 战果动画JS文件
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-03-18 11:33:27
 */

define(function(require){
  var carouselPoint   
  var markData
  var markCfg = {}  //配置项
  var config = {}
  var projection
  
  var victoryAnimation = {

    /**
     * @describe [地图战果快报轮播]
     * @param {function} projection 计算点位置的一个算法
     * @param {Object} markData 点的经纬度数据
     * @param {Object} markData 容器id
     * @param {Object} victoryId 快报战果的id
     */
    drawPoint: function(cfg, projections, markDatas, id, victoryId){
     console.log(markDatas)
      var container = $(id).find('svg').attr('id')
      markCfg = cfg.carouselPoint //点的配置项
      config = cfg
      markData = markDatas
      projection = projections
      remove()
      function remove(){
        d3.selectAll('.vicoryTooltip').remove()
        d3.selectAll('.carouselPoint').remove()
      }
      
      //显示一断时间后自动消失
        setTimeout(function(){
          remove()
        },10000)
      var _self = this
      
      if($('.carouselPoint').length==0){
        //标注点
        carouselPoint = d3.select('#'+container)
          .append('g', '#'+container)
          .attr('id', markCfg.id)
          .attr('width', cfg.width)
          .attr('height', cfg.height)
          .attr('class', 'carouselPoint')
      }else{
        carouselPoint = d3.select('.carouselPoint')
      }

      //添加点
      var symbol = markCfg.symbol
      var lineLenght = markCfg.series[3].lineLenght
      _self.addCircle(markCfg.series[2], 'circle1')
      _self.addCircle(markCfg.series[1], 'circle2')
      _self.addCircle(markCfg.series[0], 'circle3')
      for(var i=0, len=lineLenght; i<len; i++){
        var thisCfg = markCfg.series[3]
        thisCfg.radius = markCfg.series[3].radiu+i*5
        var thisID = 'circle0'+i
        _self.addCircle(thisCfg, thisID)
      }
      var imgCfg = markCfg.series[4]
      image(imgCfg)
      //调用中间闪烁点
      _self.addPoint()
      function image(cfg){
        var coor = []
        /**
       * 获取update部分
       */
        var update = carouselPoint.selectAll(".image")
          .data(markData)
        
        //获取enter部分
        var enter = update.enter()

        //获取exit部分
        var exit = update.exit()

        //处理updata部分
        renderData(update)

        //处理enter部分
        var enters = enter.append('image')
        renderData(enters)
        function renderData($this){
          $this
          .attr('width', cfg.width)
          .attr('height', cfg.height)
          .attr("x", function(d){

           coor = projection(d.geoCoord)
   
            return coor[0] - cfg.left
          })
          .attr("y",function(d){
            return coor[1] - cfg.top
          })
          .attr('xlink:href', cfg.url)
          .attr('class', 'ratate-img')
        }

        //处理exit部分
        exit.remove()
		_self.tooltip(coor)
        //提示框,延迟2秒出现
        // setTimeout(function(){
          // if(coor.length!=0){
            // _self.tooltip(coor)
          // }
        // },2000)
      }
      
    },

    /**
     *  @describe [提示框]
     *  @param    {[type]}   position [description]
     *  @return   {[type]}   [description]
     */
    tooltip: function(position){

      var string = markData[0].content
                    

      var html = '<div class="point"></div>' 
               + '<div class="name">'+markData[0].name+'</div>'
               + '<div class="case-lists">'+string+'</div>'


      var left  = config.carouselPoint.tooltip.left  
      var top = config.carouselPoint.tooltip.top  
      var className = config.carouselPoint.tooltip.className  

      d3.select('#'+victoryId)
        .append('div')
        .attr('class', className)
        .attr('id', 'vicoryTooltip')
        .style('left', position[0]+left+'px')
        .style('top', position[1]+top+'px')
        .html(html)

      if(window.thisNavs=='victory'){
       //$('#vicoryTooltip').css('top', '529px')
      }    

        var height = $('.case-lists').height()    
        var pointTop = height/2+92-59/2
        $('.point').css('top', pointTop+'px')
        //提示框出现的动画
        $('.vicoryTooltip').fadeIn(300).animate({left: position[0]+left+209+'px'});
    },

    /**
     *  @describe [创建中间闪烁点]
     */
    addPoint: function(){
      var addPoints =  carouselPoint.selectAll('.image')
        .data(markData)
        .enter()
        .append('image')
        .attr("x", function(d){
          var coor = projection(d.geoCoord)
          return coor[0]
        })
        .attr("y",function(d){
          var coor = projection(d.geoCoord)
          return coor[1] 
        })
       
      addPoint(0)

      /**
       *  @describe [添加点]
       *  @param    {[number]}   num [当前点添加动画]
       */
      function addPoint(num){
        addPoints
          .attr('xlink:href', function(d, i){
          var $this = d3.select(this)
          var href = markCfg.imgUrl
          return href
        })
        .attr('width', markCfg.width)
        .attr('height', markCfg.height)
        .attr("x", function(d){
          var coor = projection(d.geoCoord)
          return coor[0] + markCfg.left
        })
        .attr("y",function(d){
          var coor = projection(d.geoCoord)
          return coor[1] + markCfg.top
        })
        .style('opacity', function(d,i){
          var $this = d3.select(this)
          var settime = setInterval(function(d,i){
            $this
            .style('opacity', 0.5)
            .transition()
            .duration(500)
            .style('opacity', 1)
          },1000)
        })
      }
    },
    /**
     * [addCircle 添加圆]
     * @param {[type]} cfg [配置项]
     * @param {[type]} id [id名]
     */
    addCircle: function(cfg, id){
            /**
       * 获取update部分
       */
        // var update = carouselPoint.selectAll('#'+id)
        //   .data(markData)

        var update = carouselPoint.selectAll('.circle')
            .data(markData)
        
        //获取enter部分
        var enter = update.enter()

        //获取exit部分
        var exit = update.exit()

        //处理updata部分
        renderData(update)

        //处理enter部分
        var enters = enter.append('circle')
        renderData(enters)

        //处理exit部分
        exit.remove()

        //渲染数据,updata,enter共用部分
        function renderData($this){
          $this
          .attr('fill', cfg.fill)
          .attr('stroke', cfg.stroke)
          .attr('stroke-width', cfg.strokeWidth)
          .attr('r', cfg.radius+2)
          .style('opacity', cfg.opacity)
          .attr("cx", function(d){
            var coor = projection(d.geoCoord)
            return coor[0] + 40
          })
          .attr("cy",function(d){
            var coor = projection(d.geoCoord)
            return coor[1] + 10
          })
          .style('opacity', 0.3)
          
          .attr('id', id)
          .attr('class', 'groug-circle')
        }
    }
  }

  return victoryAnimation
})