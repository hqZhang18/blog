/**
 * @Author:      zhq
 * @DateTime:    2017-01-13 13:43:27
 * @Description: 关系图
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-13 13:43:27
 */

define(function(require) {
  
    var commonUnit = require('../components/commonUnit.js')
    var constants = require('../util/constants.js')
    //webSocket要把变量提出来，不然会导致内存泄漏
    var config = {}
    var width = 0
    var height = 0
    var self = null
    var svg = null
    var dataLen = 0
    var dataset = []
    var dataset2 = []
    var color= {}  
    var linear //比例尺
    var pie  
    var pieData 
    var outerRadius = 215
    var innerRadius = 215
    //创建弧生成器
    var arc  
    var onnectLine 
    var distance = 2.3
    var scale = 0
    //外边关系圆(背景图片)
    var widths = [160, 150, 140, 125]
    var imgWidth = 148
    var imgW = 0
    //文字范围
    var txtScale = 0

    //文字配置项
    var textCfg = {
      y: 40,
      fontSize: 22,
      textAnchor: 'middle',
      fill: '#7dd3ff'
    }

    var textCfg2 = {
      y: -5,
      fontSize: 28,
      textAnchor: 'middle',
      fill: '#fff'
    }

    var relationChart = {
      /**
       * 组件默认配置项
       */
      defaultSetting: function() {
          return {
            width: 1425,
            height: 1200,
            padding: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            },
            outerCircle: {
              radius: 95,
              color: ['#082463', '#09194a', '#3f00c9', '#6d00bf'] 
            },
            onnectLine:{
              color: '#00feff',
              width: 2
            },
            radius: 190
          }
      },
      /**
       * 画关系图
       * @param {object} svg svg对象
       * @param {object} data 数据
       * @param {object} config 图表配置项
       */
      
      drawCharts: function(id, data, opt) {
        config = _.merge({}, this.defaultSetting(), opt)
        width = config.width
        height = config.height
        self = this
        //创建svg
        svg = commonUnit.addSvg(id, config)
        data.sort(function(a, b ){
          return b.value - a.value
        })
       //  var firstData = data.slice(data.length-1, data.length)
       //  var savaData  = data.slice(0, data.length-2)
       // // var newData = savaData.splice(2, 0, firstData)
       //  data = firstData.concat(savaData)
        dataLen = data.length
        dataset = data
        dataset2 = []
        color= config.color
        data.forEach(function(item) {
          dataset2.push(item.value)
        })
        
        linear = d3.scale.linear()
          .domain([0, d3.max(dataset2)])
          .range([0, width]);

        //画圆参照物
        // var circle = null
        // if(d3.select('circle')[0].length==0){
        //   svg.append('circle')
        //   .attr('r', config.radius)
        //   .attr('cx', config.width/2)
        //   .attr('cy', config.height/2)
        //   .attr('stroke', 'none')
        //   .attr('stroke-width', 5)
        //   .attr('fill', 'none')
        // }
        

        pie = d3.layout.pie()
          .value(function(d) {
              return 1
          })
          .sort(null)
                  
        pieData = pie(dataset)
        //创建弧生成器
        arc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
   
      
        //添加对应数目的弧，即<g>元素
		    d3.select(id).selectAll('.arcs').remove()
        var arcs = svg.selectAll('g')
          .data(pieData)
          .enter()
          .append('g')
          .attr('transform', 'translate(' + (config.width / 2) + ',' + (config.height / 2) + ')')
          .attr('class', 'arcs')

        onnectLine = config.onnectLine
        //添加连接弧外文字的第一条直线元素
        arcs.append('path')
          .attr({
            'stroke-dasharray': 3,  //设置虚线
            'stroke-width': onnectLine.width,
             stroke : onnectLine.color,
             fill: 'none',
             d: function(d, i) {
              var x1 = arc.centroid(d)[0] 
              var y1 = arc.centroid(d)[1] 
              var x2 = arc.centroid(d)[0] * 2
              var y2 = arc.centroid(d)[1] * 2 
              var x3 = x2
              if(x3<0){
                x3 -= 120
              }else{
                x3 += 120
              }
              var coorPoint =  ' M '+x1+' '+y1+' '+x2+'  '+y2+' '
               return coorPoint
             },
             class: 'connect-line',
             //filter: 'url(#filter1)'
          })
 

        
        arcs.append('g')
          .attr('class', 'outerCircle')
          .append('image')
          .attr({
            'xlink:href': constants.SVG_IMG_PATH + '/images/ballBg.png',
            width: function(d) {
              var value = linear(d.data.value)
              imgW = self.imgScales(value)
              return imgW
            },
            height: function(d) {
              var value = linear(d.data.value)
              imgW = self.imgScales(value)
              return imgW
            },
            x: function(d) {
              var x = arc.centroid(d)[0] * distance - imgWidth/2 
              return  x
            },
            y: function(d) {
              var y = arc.centroid(d)[1] * distance - imgWidth/2
              return y
            },
            class: function(d, i){
              // return 'ballBg ballBg' + i
            }
          })

          
          //添加文字(name, value)
		 
          this.addText(arc, distance, textCfg, 0, linear)
          this.addText(arc, distance, textCfg2, 1, linear)
 
      },

      /**
       *  @describe [图片范围大小]
       *  @param    {[type]}   value [description]
       *  @return   {[type]}   [description]
       */
      imgScales: function(value) {
        if(value>100){
            scale = widths[0]
          }else if(value<100 && value>10){
            scale = widths[1]
          }else if(value<10 && value>1){
            scale = widths[2]
          }else if(value<1 ){
            scale = widths[3]
          }
        return scale
      },



      /**
       *  @describe [添加文字]
       *  @param    {[type]}   arc      [圆弧生成器方法]
       *  @param    {[type]}   distance [内圆到外圆的距离]
       *  @param    {[type]}   cfg      [配置项]
       *  @param    {[type]}   type     [类型(添加0name/1value)]
       */
      addText: function(arc, distance, cfg, type, linear){
        //添加弧外的文字(名字)
        
        d3.selectAll('.outerCircle').append('text')
          .attr({
            transform: function(d) {
              var x = 0
              var y = 0
              var value = linear(d.data.value)
                x = arc.centroid(d)[0] * distance - 10
                y = arc.centroid(d)[1] * distance + cfg.y - 20

              if(value>100){
                x = arc.centroid(d)[0] * distance
                y = arc.centroid(d)[1] * distance + cfg.y
              }else if(value<100 && value>10){
                x = arc.centroid(d)[0] * distance - 5
                y = arc.centroid(d)[1] * distance + cfg.y - 5
              }else if(value<10 && value>1){
                x = arc.centroid(d)[0] * distance - 5
                y = arc.centroid(d)[1] * distance + cfg.y - 5
              }else if(value<1 ){
                x = arc.centroid(d)[0] * distance - 10
                y = arc.centroid(d)[1] * distance + cfg.y - 20
              }
              
              var tranArr = [ 'translate(', x, ',', y,')']
              return tranArr.join('')
            },
            'text-anchor': cfg.textAnchor,
            'font-size': cfg.fontSize,
             fill: cfg.fill,
      			 class: function(d, i) {
      				if(!type){
      					return 'name-text'
      				}else{
      					return 'value-text'
      				}
      			 }
          })
          .text(function(d, i) {
            var text = ''
            if(!type){
               var strs = []
               text = d.data.name
               var tLen = text.length
               var j = 0
               var maxL = 6
               if(tLen>maxL){
                  text = text.substring(0, 4) + '...'
                  for(var i=0; i<tLen/maxL; i++){
                    var str = text.substring(j, (i+1)*maxL)
                    strs.push(str)
                    j = (i+1)*maxL
                  }
               }
            }else{
              text = parseInt(d.data.value).toLocaleString()
            }
            return text
            
          })
      },
    }

    return relationChart
})