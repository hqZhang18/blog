/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-08-31 20:42:46
 * @Description:  给地图添加撒点
 */
define(function(require) {

  // 图片路径
  var IMG_PATH = '../../images/qinqing/policeDistribution/'

  var layerBar = function(svg, path, rootData, layerData) {

    /**
     *  地图的撒点圆圈由一个g[class='mark']元素包裹
     */
    var isMark = svg.selectAll('.mark').empty()
    var mark
    if (isMark) {
      mark = svg.append('g').attr('class', 'mark').style('cursor','pointer')
    } else {
      mark = svg.select('.mark')
    }

    var linear = d3.scale.linear()
      .domain([0, d3.max(layerData, function(d) {
        return d.value
      })])
      .range([30, 350])

    var markUpdate = mark.selectAll('g').data(layerData)
    var markEnter = markUpdate.enter().append('g')
    markUpdate.exit().remove()

    var markCircle = mark.selectAll('g').data(layerData).attr({
        'transform': function(d, i) {
          var x = 0, y = 0
          rootData.map(function(item, i) {
            if (item.properties.name == d.name) {
              x = path.centroid(item)[0]
              y = path.centroid(item)[1]
              return;
            }
          })
          // 两江新区北部新区json里没有，隐藏
          if(x==0 && y==0) {
            d3.select(this).attr('opacity', 0).attr('name', d.name)
          }
          return 'translate(' + x + ',' + y + ')'
        }
      })
  
    // 柱子底部图片添加
    markEnter.append('image')
      .attr('xlink:href', IMG_PATH + 'bar-bottom.png')
      .attr('width', 83)
      .attr('height', 65)
      .attr('preserveAspectRatio', 'none')
      .attr('Response.ContType', 'image/Jpeg')
      .attr('x', -23)
      .attr('y', -40)
      .attr('class', 'bar-bottom')

    // 数据柱子添加  
    markEnter.append('image')
      .attr('xlink:href', IMG_PATH + 'bar-center.png')
      .attr('width', 36)
      .attr('height', function(d) {
        return linear(d.value)
      })
      .attr('preserveAspectRatio', 'none')
      .attr('Response.ContType', 'image/Jpeg')
      .attr('x', 0)
      .attr('y',function(d){
          return - linear(d.value) 
      })  
      .attr('class', 'bar-data')

    // 柱子顶部添加  
    markEnter.append('image')
      .attr('xlink:href', IMG_PATH + 'bar-top.png')
      .attr('width', 48)
      .attr('height', function(d) {
        return 41
      })
      .attr('preserveAspectRatio', 'none')
      .attr('Response.ContType', 'image/Jpeg')
      .attr('x', -6)
      .attr('y', -20)  
      .attr('transform',function(d){
          return  'translate(0,-'+linear(d.value) +')'
      })
      .attr('class', 'bar-top') 

  }
  return layerBar
})