/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-15 14:32:11
 * @Description: 对部js文件
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-03-15 14:32:11
 */

define(function(require){


  /**
   * 引入公用的文件
   */
  var _request = require('./request.js') 
  var symbol = ''

  function indexOf(arr, str){
    // 如果可以的话，调用原生方法
    if(arr && arr.indexOf){
        return arr.indexOf(str);
    }
     
    var len = arr.length;
    for(var i = 0; i < len; i++){
        // 定位该元素位置
        if(arr[i] == str){
            return i;
        }
    }
    // 数组中不存在该元素
    return -1;
  }

  var duibu = {
    /**
     *  @describe [渲染数据]
     *  @param    {[type]}   data [对部数据]
     */
    renderData: function(data){
      var _self = this
      var dataset = []
      var mapData = data.map
      var total = 0
      total = data.duibuTotal
      console.log('total', total)

      for(var i=0, len=mapData.length; i<len; i++){
        dataset.push(mapData[i].value)
      }
      dataset.push(total)

      var linear = d3.scale.linear()
          .domain([0, d3.max(dataset)])
          .range([0, 100])

      if(data.length==0){
        $('.duibu-total').html()
        return
      }
      var dataH = linear(total) 

      if( dataH<5 && dataH>0 ){
        dataH = 5
      }
  
      $('.duibu-total').html(total)
     
      //判断是柱子还是饼图
      if(symbol=='bar'){
        $('.charts-data').css('height', dataH+'px')
      }else{
        $('.duibu').find('.charts').hide()
        //饼图配置
      
        var config = {
          circle: {
            fill: '#1981d3',
            stroke: '#2b97ed',
            strokeWidth: 6
          },
          polygon: {
            fill: '#3fb0dc',
            stroke: '#fff3b9',
            strokeWidth: 3,
            sideLength: 30
          },
          path: {
            fill: '#ffe542'
          }
        }
        var polygonX=  50
        var polygonY= 50
        var per = dataH/100

        if(per>1){
          per = 1
        }

        config.sideLength = 30
        config.polygonX = polygonX,
        config.polygonY = polygonY,
        config.per = per
        if(window.clickNav){
          _self.drawPercentChart(config)
        }
      }

    },

    /**
     *  @describe [绑定事件]
     *  @param    {[string]}   url [点击对部的url]
     */
    bindEvent: function(url, title){
      
      //点击队部
      $('.duibu').off().on('click', function(evt){
        var commonUrl = '/type/'+window.oneType+'/childType/'+window.childType
        var commonTimeUrl = '/startTime/'+window.startTime+'/endTime/'+window.endTime 
   
        //判断是否有时间轴
        if(!window.isTime){
          var dataUrl = url + commonUrl
        }else{
          var dataUrl = url + commonUrl + commonTimeUrl
        }

        var navs = ['equipmentResource', 'personnelFrequently', 'telecomResources', 'victory']
        var thisNav = window.thisNavs
        var index = indexOf(navs, thisNav)
        
        //0设备资源, 1人员在勤， 2电信资源
        switch(index){
          case 0:  
            var commonUrl = '/type/'+window.oneType+'/deviceState/'+window.deviceState + url
            var dataUrl = window.BASEURL + 'equipmentResource/duibu' + commonUrl 
          break;
          case 1:
            var dataUrl = window.BASEURL + 'personnelFrequently/duibu'+ url
          break;
          case 2:
            var dataUrl = window.BASEURL + 'telecomResources/duibu'
          break;
          case 3:
            var dataUrl = window.BASEURL + 'victory/duibu'
          break;
        }
        
        var dataUrl = '../../data/duibu.json'
        var duibuDialog = require('../../components/dialog/duibuDialog.tpl')
        var duibuTemplate = Handlebars.compile(duibuDialog)
        _request.sendAjax(dataUrl, function(res){
          var data = res.result
          var total = 0
          var dataset = []
         
          for(var i=0, len=data.length; i<len; i++){
            total += data[i].value
            dataset.push(data[i].value)
          }
          var max = d3.max(dataset)
          var linear = d3.scale.linear()
              .domain([0, max])
              .range([0, 690])

          var datas = []
          for(var j=0, len2=data.length; j<len2; j++){
              var value = data[j].value
              var dataW = linear(value)
              if(dataW<10 && dataW > 0){
                dataW = 10
              }
              datas.push({
                value: data[j].value,
                name: data[j].name,
                dataW: dataW
              })
          }     

          var html = duibuTemplate({
              total: total,
              title: title,
              data: datas
            })
          $('.show-modal-dialog').html(html)
          $('#duibuDialog').fadeIn(300)
          if(data.length==0){
             $('#duibuDialog').find('.no-data').show()
            }else{
             $('#duibuDialog').find('.no-data').hide()
          }
        })

      })

     // $('body').off().on('click', function(evt){
     //    $('#duibuDialog').fadeOut(500)
     //    $('.show-modal-dialog').html('')
     //  })

      //关闭队部弹窗
      $(document).on('click', '.close-model', function(evt){
        $('#duibuDialog').fadeOut(600)
        $('.show-modal-dialog').html('')
      })
    },

        /**
     *  @describe [绘制六边形]
     *  @param    {[type]}   svg [svg元素]
     *  @param    {[type]}   config    [配置项]
     *  @return   {[type]}   [description]
     */
    drawPercentChart: function(cfg){
      console.log(angle)
        d3.select('.pie-charts').select('svg').remove()
        var svg = d3.select('.pie-charts').append('svg')
            .attr('width', 100)
            .attr('height', 100)
        //构造绘制六边形的数据
        var points=[];
        points.push([cfg.polygonX,cfg.polygonY-cfg.sideLength])
        points.push([cfg.polygonX+Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY-cfg.sideLength/2])
        points.push([cfg.polygonX+Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY+cfg.sideLength/2])
        points.push([cfg.polygonX,cfg.polygonY+cfg.sideLength])
        points.push([cfg.polygonX-Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY+cfg.sideLength/2])
        points.push([cfg.polygonX-Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY-cfg.sideLength/2])
        //创建多边形组
        var hexagon = svg.append('g')
          .attr('class', 'hexagonG-group')
         
         //绘制圆  
        hexagon
            .append('circle')
            .attr('cx',  cfg.polygonX)
            .attr('cy', cfg.polygonY)
            .attr('r', 35 )
            .attr('fill', cfg.circle.fill)
            .attr('stroke-width', cfg.circle.strokeWidth)
            .attr('stroke', cfg.circle.stroke)
        //绘制六边形    
        hexagon
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
        hexagon
          .append('path')
          .attr("d",linePath(polylineArr))
          .attr('fill', cfg.path.fill)
                
     },

    /**
     *  @describe [初始化]
     *  @param    {[type]}   data [对部数据]
     */
    init: function(data, url, title, type){
      symbol = type
      var _self = this
      _self.renderData(data)
      _self.bindEvent(url, title)
    }

  }
  return duibu
})