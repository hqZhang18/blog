/**
 * @Author:      zhq
 * @DateTime:    2017-03-14 20:52:27
 * @Description: 地图
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-03-01 08:52:27
 */

define(function(require) {

  /**
   * 引入公用的文件
   */
  require('lodash')
  require('d3')
  require('topojson')
  require('jquery')
  // 引入公用的组件
  var commonUnit = require('./../commonUnit')
 
  var mapUrl = '../../mockData/sheqing/popuMigration/china.json'
  var centerPoint = [] // 主城中心点 用于连线
  var eterLineGroup = null // 迁入线条
  var outLineGroup = null
  var datascale = null
  var setTime = 30000 // 定时器

  var map = {

    /**
     * 地图默认配置项
     */
    defaultSetting: function(){
      return {
        width: 2126,
        height: 1718,
        itemStyle: {
          fill: '#001e5a',
          stroke: 'none',
          strokeWidth: 1
        }
      }
    },


    /**
     *  绘制地图
     *  @param    {string}  id      容器id
     *  @param    {string}  mapUrl  地图josn路径 
     *  @param    {object}  mapData 撒点数据
     *  @param    {object}  opt     配置项
     */
    renderMap: function(id, mapUrl, mapData, opt) {
      var self = this
      // 获取配置项
      var config = _.merge({}, this.defaultSetting(), opt)
      var width = config.width
      var height = config.height
      
      //1.创建svg容器
      var svg = null
      // 地图class
      var mapClass = 'china-map'
 
      if(d3.select(id).selectAll('svg').node()){
        svg = d3.select(id).selectAll('.' + mapClass)
          .attr({
            width: width,
            height: height,
            id: 'mapWrap',
            class: mapClass
          })
      }else{
        svg = d3.select(id)
          .append('svg')
          .attr({
            width: width,
            height: height,
            id: 'mapWrap',
            class: mapClass
          })
      }
 
       //获取地图json数据 
      d3.json(mapUrl, function(error, root) {  
        if (error){
          return console.error(error)
        }

        var features =  root.features
        //获取地图缩放值
        var scale = self.getZoomScale(features, width, height)
        //获取地图显示的中心点
        var center = self.getCenters(features);
        //定义一个投影函数
        var projection = d3.geo.mercator()  
          .scale(scale * 55)
          .center(center)
          .translate([width / 2, (height/2 )])

        //定义一个路径函数  
        var path = d3.geo.path()  
            .projection(projection)   

        var mainMap = null
        if(svg.selectAll('.main-map-path').node()) {
          mainMap = svg.select('.main-map-path')
        }else {
          mainMap = svg.append('g')
          .classed('main-map-path', true) 
        }

        var textGroup = null
        if(svg.selectAll('.text-group').node()) {
          textGroup = svg.select('.text-group')
        }else {
          textGroup = svg.append('g')
          .classed('text-group', true) 
        }

        // 渲染地图路径
        self.renderPath(mainMap, path, features)
        self.renderData(svg, mapData, features)
        // 地区名
        self.renderText(textGroup, path, features)
      })    
    }, 

    /**
     *  渲染数据
     *  @param    {array}   svg      svg容器
     *  @param    {object}  mapData  地撒点数据
     *  @param    {array}   features 地图josn数据
     */
    renderData: function(svg, mapData, features) {
      // 圆点和线条配置项
        var cfg1 = {
          stroke: '#53cdff',
          stroke2: '#2866af',
          fill: '#53cdff',
          class: 'out-line',
          type: 1,
        }
        var cfg2 = {
          stroke: '#ffc602',
          stroke2: '#f8cc33',
          fill: '#ffc602',
          class: ' enter-line' ,
          type: 2
        }

        // 迁入连线组元素
 
        if(svg.selectAll('.enter-line-group').node()) {
          eterLineGroup = svg.select('.enter-line-group')
            .attr('class', 'enter-line-group')
        }else {
          eterLineGroup = svg.append('g')
            .attr('class', 'enter-line-group')
        } 

        
        // 迁出连线组元素  
        if(svg.selectAll('.out-line-group').node()) {
          outLineGroup = svg.select('.out-line-group')
        }else {
          outLineGroup = svg.append('g')
           .attr('class', 'out-line-group')
        }
        // 标注点组元素(迁入人员)
        var qrMarkerGroup = null
        if(svg.selectAll('.qianru-marker-group').node()) {
          qrMarkerGroup = svg.select('.qianru-marker-group')
        }else {
          qrMarkerGroup = svg.append('g')
           .attr('class', 'qianru-marker-group')
        }
        // 迁入数据
        var qrData  = mapData.qianru
        this.renderMarker(qrMarkerGroup, qrData, features, cfg1) 

        // 标注点组元素(迁出人员)
        var qcMarkerGroup = null
        if(svg.selectAll('.qianchu-marker-group').node()) {
          qcMarkerGroup = svg.select('.qianchu-marker-group')
        }else {
          qcMarkerGroup = svg.append('g')
          .attr('class', 'qianchu-marker-group')
        }
        // 迁入数据
        var qcData  = mapData.qianchu
        this.renderMarker(qcMarkerGroup, qcData, features, cfg2) 
    },

    /**
     *  渲染地区名字
     *  @param    {array}     g        g元素
     *  @param    {function}  path     path方法
     *  @param    {array}     features 地图json数据
     */
    renderText: function(g, path, features) {
      // 获取update部分并处理  
      var update = g.selectAll('text')
        .data(features)
        .call(this.areaNameAttr, path)

      update.enter()
        .append('text')  
        .call(this.areaNameAttr, path)

      update.exit().remove() 
    },

    /**
     *  设置地区名字样式
     */
    areaNameAttr: function(text) {
       text.attr('font-size', 24)
        .attr('fill', '#fff')
        .attr('transform', function(d) {
          return 'translate('+d.center+')'
        })
        .text(function(d) {
          return d.properties.name
        })
    },

    /**
     *  渲染path元素
     *  @param    {array}     roots    根元素
     *  @param    {function}  path     path方法
     *  @param    {array}     features 地图json数据
     */
    renderPath: function(roots, path, features) {

      // 获取update部分并处理  
      var update = roots.selectAll('path')
        .data(features)
        .call(this.areaPathAttr, path)

      update.enter()
        .append('path')  
        .call(this.areaPathAttr, path)

      update.exit().remove()  
    
    },

    /**
     *  区域path属性设置
     *  @param    {array}     roots 根元素
     *  @param    {function}  path  path方法
     */
    areaPathAttr: function(roots, path) {
      roots.attr({
        'stroke-width': 0,
        fill: '#050840',
        opacity: 0,
        d: path,
        class: function(d, i){
          // 添加一个中心点属性
           var center = path.centroid(d)
          if(d.properties.name == '海南省') {
            center[0] = center[0] + 40
          }
          if(d.properties.name == '台湾省') {
            center[0] = center[0] + 50
          }
          d.center = center
          // 保留中间点重庆市
          if(d.properties.name=='重庆市') {
            centerPoint = path.centroid(d)
          }
          return 'path' + i 
          }
        }) 
    },

    /**
     *  @describe 添加地图上的标注点
     *  @param    {array}   root       根元素
     *  @param    {array}   mapData    标注点数据
     *  @param    {array}   features   地图json数据
     *  @param    {object}  cfg        圆点配置项
     */
    renderMarker: function(roots, mapData, features, cfg) {
      var dataset = []
      mapData.forEach(function(d) {
        dataset.push(d.value)
      })
      var scale = d3.scale.pow()
        .domain([0, d3.max(dataset)])
        .range([10, 40])
        .exponent(0.3) // 设置指数

      // 添加圆点组元素
      var update = roots.selectAll('.circle-group')
        .data(mapData)
        .call(this.circleGroupAttr, features, scale, cfg)

      update.enter().append('g')
        .call(this.circleGroupAttr, features, scale, cfg) 

      update.exit().remove()  
       
    },

    /**
     *  圆点组元素属性设置
     *  @param    {array}  roots      根元素
     *  @param    {array}  features   地图json数据
     *  @param    {function}  scale   比例尺
     *  @param    {object}  cfg       圆点及线条配置项
     */
    circleGroupAttr: function(roots, features, scale, cfg) {
      var self = this
      roots.attr('class', function(d, i) {
          for(var j = 0, len = features.length; j<len; j++) {
            if(d.name===features[j].properties.name) {
              // 获取坐标点
              var thisElem = d3.select(this)
              var coor = features[j].center
              map.drawMarker(thisElem, coor, d, cfg, scale)
              // 1迁入 2迁出
              cfg.class = cfg.class + ' line-path'+i
              if(cfg.type===1) {
                var update = eterLineGroup.selectAll('.line-path' + i)
                  .data([0])
                  .call(map.drawLine, coor, cfg, i)
                update.enter().append('path')
                  .call(map.drawLine, coor, cfg, i)
                update.exit().remove()  
              }else {
                var update = outLineGroup.selectAll('.line-path' + i)
                  .data([0])
                  .call(map.drawLine, coor, cfg, i)
                update.enter().append('path')
                  .call(map.drawLine, coor, cfg, i)
                update.exit().remove()    
              }
            }
          }
          return 'circle-group'
        })
    },

    /**
     *  绘制地图上的点
     *  @param    {array}     roots     根元素
     *  @param    {array}     position  坐标点
     *  @param    {array}     data      数据
     *  @param    {object}    cfg       配置项
     *  @param    {function}  scale     比例尺
     */
    drawMarker: function(roots, position, data, cfg, scale){
      // 添加标注点
      var r =   scale(data.value)
      var max = 45
      var min = 10
      if(r>max) {
        r = max
      }
      if(r<0) {
        r = min
      }
      cfg.r = r
      // update
      var update = roots.selectAll('circle')
        .data(d3.range(0, 3))
        .call(map.circleAttr, position, cfg)
      //enter  
      update.enter().append('circle')
        .call(map.circleAttr, position, cfg)
      //exit  
      update.exit().remove()  
    },

    /**
     *  圆点属性设置
     *  @param    {array}   roots    根元素
     *  @param    {array}   position 坐标点
     *  @param    {object}  cfg      圆点配置项
     */
    circleAttr: function(roots, position, cfg) {
      roots.attr({
        r: function(d, i){
          if(i==2) {
            var r2 = cfg.r - 8
            
            if(r2<=0) {
              return cfg.r
            }
            return r2
          }

          return cfg.r
        },
        fill: function(d, i) {
          if(i==0) {
            return cfg.fill
          }
          return 'none'
        },
        'stroke-opacity': function(d, i) {
          if(i==0) {
            return 0.1
          }
          return 1
        },
        'stroke-width': function(d, i) {
          if(i==0) {
            return 15
          }
          return 2
        },
        stroke: function(d, i) {
          if(i==0) {
            return cfg.fill
          }
          return cfg.stroke2
        },
        cx: position[0],
        cy: position[1],
        class: function(d, i) {
          return 'outerCircle' + i
        }
      })
    },

    /**
     * 画线
     * @param  {array} roots 根元素
     * @param  {array} posi  坐标点
     * @param  {object} cfg  配置项
     */
    drawLine: function(roots, posi, cfg) {
      var QPosi = [ centerPoint[0] + (posi[0] - centerPoint[0])/4,  centerPoint[1]]
       roots.attr({
          d: 'M '+centerPoint[0]+' '+centerPoint[1]+' Q'+QPosi[0]+'  '+QPosi[1]+' '+posi[0]+' '+posi[1]+'',
          fill: 'none',
          stroke: cfg.stroke,
          'stroke-width': function(d, i) {
            return 3
          },
          
          class: cfg.class
        })
    },
 

    /**
     *  @describe [初始化]
     */
    /**
     *  地图初始化
     *  @param    {array}   id     svg容器的id
     *  @param    {object}  data   地图撒点
     */
    init: function(id, data){
      this.renderMap(id, mapUrl, data)
      this.setInterval()
    },

    /*
      定时切换迁入迁出数据
     */
    setInterval: function() {
      var t = 0
      window.mapTimer = setInterval(function() {
        t++ 
        // 第一次 false
        if(t%2 === 0) {
           
           d3.select('.enter-line-group').style('opacity', 1)
           d3.select('.out-line-group').style('opacity', 0)

           d3.selectAll('.qianchu-marker-group').style('opacity', 0)
           d3.selectAll('.qianru-marker-group').style('opacity', 1)

        }else {
          d3.select('.enter-line-group').style('opacity', 0)
          d3.select('.out-line-group').style('opacity', 1)

          d3.selectAll('.qianchu-marker-group').style('opacity', 1)
          d3.selectAll('.qianru-marker-group').style('opacity', 0)
        }
        
      }, setTime)
    },

    /**
     *  @getZoomScale  [地图缩放]
     *  @param     {[object]}    features [地图数据]
     *  @param     {[number]}    width    [容器width]
     *  @param     {[number]}    height   [容器height]
     */
    getZoomScale: function(features, width, height) {
      var longitudeMin = 100000; //最小经度
      var latitudeMin = 100000; //最小维度
      var longitudeMax = 0; //最大经度
      var latitudeMax = 0; //最大纬度
      features.forEach(function(e) {
        var a = d3.geo.bounds(e); //[[最小经度，最小维度][最大经度，最大纬度]]
        if (a[0][0] < longitudeMin) {
          longitudeMin = a[0][0];
        }
        if (a[0][1] < latitudeMin) {
          latitudeMin = a[0][1];
        }
        if (a[1][0] > longitudeMax) {
          longitudeMax = a[1][0];
        }
        if (a[1][1] > latitudeMax) {
          latitudeMax = a[1][1];
        }
      });

      var a = longitudeMax - longitudeMin;
      var b = latitudeMax - latitudeMin;
      return Math.min(width / a, height / b)
    },

    /**
     *  @getZoomScale  [获取中心点]
     *  @param     {[object]}    features [地图数据]
     */
    getCenters: function(features) {
      var longitudeMin = 100000;
      var latitudeMin = 100000;
      var longitudeMax = 0;
      var latitudeMax = 0;
      features.forEach(function(e) {
        var a = d3.geo.bounds(e);
        if (a[0][0] < longitudeMin) {
          longitudeMin = a[0][0];
        }
        if (a[0][1] < latitudeMin) {
          latitudeMin = a[0][1];
        }
        if (a[1][0] > longitudeMax) {
          longitudeMax = a[1][0];
        }
        if (a[1][1] > latitudeMax) {
          latitudeMax = a[1][1];
        }
      });
      var a = (longitudeMax + longitudeMin) / 2;
      var b = (latitudeMax + latitudeMin) / 2;
      return [a, b];
    }
  }

  return map
})


