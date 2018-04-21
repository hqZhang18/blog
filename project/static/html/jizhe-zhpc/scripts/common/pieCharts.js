/**
 * @Author:       zhanghq
 * @DateTime:    2017-03-20 11:13:12
 * @Description: Description
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-03-20 11:13:12
 */

define(function(require) {
  /**
   * 引入公用的文件
   */

  var pieCharts = {
    drawPie: function(id, data, opt){
    //空数据处理
    if(data.length==0){
      $(id).next().show()
    }else{
      $(id).next().hide()
    }
     var cfg = opt 
     var width = cfg.width
     var height = cfg.height
     var ratio = cfg.ratio
	
      var svg = null
      if(d3.select(id).selectAll('svg')[0].length > 0) {
        svg = d3.select(id).selectAll('svg')
      } else {
        svg = d3.select(id)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('margin-left', cfg.left)  
      }  
      var dataset = []
      var xData = []
      for(var i=0, len = data.length; i<len; i++){

        dataset.push(data[i].value)
        xData.push(data[i].name)
      }    

      svg.html('') 
       /**
       * 获取update部分
       */
      var update = svg.selectAll(".areas")
        .data(dataset)
      
      //获取enter部分
      var enter = update.enter()

      //获取exit部分
      var exit = update.exit()

      //比例尺
      var linear = d3.scale.linear()
            .domain([0, d3.max(dataset)])
            .range([0, 1])

      //破发比
      var fpLinear = d3.scale.linear()
            .domain([0, 1])
            .range([0, 1])      

      var itemStyle = cfg.itemStyle
      itemStyle.sideLength = 38 //六边形大小


      var xScale = d3.scale.ordinal()
        .domain(xData)
        .rangeRoundBands([0, width]);  

      //定义X轴    
      var xAxis = d3.svg.axis()
        .scale(xScale)      //指定比例尺
        .orient('bottom')   //指定刻度的方向

       //添加X轴     
      svg.append("g")
        .attr('class', 'axis-x')
        .call(xAxis)
        .attr('transform',function(d,i){
          return 'translate(0,'+(height - cfg.grid.y+10)+')'
        })


        var transX = []    
      for(var i=0, len = data.length; i<len; i++){
        var posiX = $(''+id+' .axis-x').find('.tick').eq(i).attr('transform')
 
        var parent = $(this).parent().attr('transform')
        posiX = posiX.replace(' ' ,',')  //ie兼容处理
        var index = posiX.indexOf(',')
        transX.push(posiX.substring(10, index))
      }  
	 
      d3.selectAll('.group').remove()
      var group = enter.append('g')
          .attr('class', 'group')
          .attr('transform', function(d, i){
            var $this = d3.select(this)
            var x = 0 //封装的时时候再来配置这些参数
            var y = 65
            if(ratio){
              var per = fpLinear(d) 
			 
              if(per>1){
                per = 1
              }
            }else{
              var per = linear(d) 
			  if(per < 0.009){
				  per = 0.03
			  }
            }
			 
            itemStyle.polygonX = x,
            itemStyle.polygonY = y,
            itemStyle.per = per 
            drawPercentChart($this, itemStyle)
            return 'translate('+x+', '+y+')'
          })
          .on('mouseenter', function(d, i){
            var $this = d3.select(this)
            $this.style('cursor', 'pointer')
            if(ratio){
				console.log(fpLinear(d))
              var value =  Math.floor(fpLinear(d)*100 ) +'%'
            }else{
              var value =  Math.floor(linear(d)*100 ) +'%'
			  
            }
            if(window.thisNavs=='telecomResources' ||  window.thisNavs=='equipmentResource'){
              var value =  d
            }

            var txt = '<p>'+data[i].name+'<br /></p><p>数量：'+value+'</p>'
            var tooltip = d3.select(id)
            .append('div')
            .attr('class', 'tooltip')
            .html(txt)
         
            var height = $('.tooltip').height()
            var width = $('.tooltip').width()
            var top = event.offsetY - height
			if(top < 0){
				$this.style('cursor', 'default')
				d3.selectAll('.tooltip').remove()
			}
            var left = event.offsetX 
            if(left>700){
              left = left -100
            }
            tooltip
              .style('top', top+'px')
              .style('left', left+'px')
          })
          .on('mouseleave', function(){
            var $this = d3.select(this)
            d3.selectAll('.tooltip').remove()

        })

         d3.selectAll('.group')
        .attr('transform',function(d,i){
          return 'translate('+transX[i]+', 65)'
        })  
  

        //添加value
       var xText = cfg.xText
       group.append('text')
        .attr('fill', '#87a8fb')
        .attr('font-size', xText.size)
        .attr('text-anchor', 'middle')
        .attr('x', function(d, i){
          var x = 0
          return x
        })
        .attr('y', function(d,i){
          return -17
        })
        .text(function(d,i){

          if(ratio){
            var text =  Math.floor(fpLinear(d)*100 ) +'%'
          }else{
            var text =  Math.floor(linear(d)*100 ) +'%'
          }

          if(window.thisNavs=='telecomResources' ||  window.thisNavs=='equipmentResource'){
            var text =  d
          }
			
          return text
        });   

          
     

      //处理x轴的文字
      var textLength = $('.tick').find('text').length
      for(var k = 0; k<textLength; k++){
        var text = $('.tick').find('text').eq(k).text()

        if(text.length>4){
          var str = text.substr(0, 4) + '...'
          $('.tick').find('text').eq(k).text(str)
        }

      }  
        
    /**
     *  @describe [绘制六边形]
     *  @param    {[type]}   markPoint [g元素]
     *  @param    {[type]}   config    [配置项]
     *  @return   {[type]}   [description]
     */
    function drawPercentChart(markPoint, cfg){
       
        //构造绘制六边形的数据
        var points=[];
        points.push([cfg.polygonX,cfg.polygonY-cfg.sideLength])
        points.push([cfg.polygonX+Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY-cfg.sideLength/2])
        points.push([cfg.polygonX+Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY+cfg.sideLength/2])
        points.push([cfg.polygonX,cfg.polygonY+cfg.sideLength])
        points.push([cfg.polygonX-Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY+cfg.sideLength/2])
        points.push([cfg.polygonX-Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY-cfg.sideLength/2])
        //绘制圆
        markPoint
            .append('circle')
            .attr('cx',  cfg.polygonX)
            .attr('cy', cfg.polygonY)
            .attr('r', 46 )
            .attr('fill', cfg.circle.fill)
            .attr('stroke-width', cfg.circle.strokeWidth)
            .attr('stroke', cfg.circle.stroke)
        //绘制六边形    
        markPoint
          .append('polygon')
          .attr('points',points.toString())
          .attr('fill', cfg.polygon.fill)
          .attr('stroke-width', cfg.polygon.strokeWidth)
          .attr('stroke', cfg.polygon.stroke)

        var polylineArr=[];//存放绘制动态多边形的数据
        var angle=cfg.per*2*Math.PI;//百分比对应的弧度
        //条件判断，不同的弧度范围对应不同的计算方式
        if(angle>=0 && angle<=Math.PI/3){
            polylineArr=points.slice(0,1);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0]+Math.sin(angle)*cfg.sideLength*Math.sin(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-angle))
            tempArr.push(polylineArr[polylineArr.length-1][1]+Math.sin(angle)*cfg.sideLength*Math.cos(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-angle))
            polylineArr.push(tempArr);
        }else if(angle>Math.PI/3 && angle<=2*Math.PI/3){
            polylineArr=points.slice(0,2);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0])
            tempArr.push(polylineArr[polylineArr.length-1][1]+Math.sin(angle-Math.PI/3)*cfg.sideLength/Math.sin(Math.PI-Math.PI/3-(angle-Math.PI/3)))
            polylineArr.push(tempArr);
        }else if(angle>2*Math.PI/3 && angle<=Math.PI){
            polylineArr=points.slice(0,3);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0]-Math.sin(angle-2*Math.PI/3)*cfg.sideLength*Math.sin(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-2*Math.PI/3)))
            tempArr.push(polylineArr[polylineArr.length-1][1]+Math.sin(angle-2*Math.PI/3)*cfg.sideLength*Math.cos(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-2*Math.PI/3)))
            polylineArr.push(tempArr);
        }else if(angle>Math.PI && angle<=4*Math.PI/3){
            polylineArr=points.slice(0,4);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0]-Math.sin(angle-Math.PI)*cfg.sideLength*Math.sin(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-Math.PI)))
            tempArr.push(polylineArr[polylineArr.length-1][1]-Math.sin(angle-Math.PI)*cfg.sideLength*Math.cos(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-Math.PI)))
            polylineArr.push(tempArr);
        }else if(angle>4*Math.PI/3 && angle<=5*Math.PI/3){
            polylineArr=points.slice(0,5);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0])
            tempArr.push(polylineArr[polylineArr.length-1][1]-Math.sin(angle-4*Math.PI/3)*cfg.sideLength/Math.sin(Math.PI-Math.PI/3-(angle-4*Math.PI/3)))
            polylineArr.push(tempArr);
        }else{
            polylineArr=points.slice(0,6);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0]+Math.sin(angle-5*Math.PI/3)*cfg.sideLength*Math.sin(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-5*Math.PI/3)))
            tempArr.push(polylineArr[polylineArr.length-1][1]-Math.sin(angle-5*Math.PI/3)*cfg.sideLength*Math.cos(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-5*Math.PI/3)))
            polylineArr.push(tempArr);
        }
        //把正六边形的中心点加进去
        polylineArr.push([cfg.polygonX,cfg.polygonY]);
        //绘制动态图形
        var linePath=d3.svg.line();
        markPoint
          .append('path')
          .attr("d",linePath(polylineArr))
          .attr('fill', cfg.path.fill)
                
     }
    },
  }

  return pieCharts

})