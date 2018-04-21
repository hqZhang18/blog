/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-08-31 20:42:46
 * @Description:  给地图添加撒点
 */
define(function(require) {
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

    var markUpdate = mark.selectAll('g').data(layerData)
    var markEnter = markUpdate.enter().append('g')
    markUpdate.exit().remove()

    var markCircle = mark.selectAll('g').data(layerData).attr({
        'transform': function(d, i) {
          var x, y
          rootData.map(function(item) {
            if (item.properties.name == d.name) {
              x = path.centroid(item)[0]
              y = path.centroid(item)[1]
              return;
            }
          })
          return 'translate(' + x + ',' + y + ')'
        }
      })

    /**
     *  绘制柱子顶层椭圆
     */
    markEnter.append('ellipse').attr('class', 'bar-top')
    markCircle.select('.bar-top')
      .attr({
        'rx':26,
        'ry':10,
        'fill': 'rgba(223,66,15,.8)',
        'transform':'translate(-26,-100)'
      })

    /**
     *  绘制柱子主体
     */
    markEnter.append('rect').attr('class', 'bar-center')
    markCircle.select('.bar-center')
      .attr({
        'width': 50,
        'height':100,
        'fill': 'rgba(223,66,15,.37)',
        'transform':'translate(-50,-100)'
      })

      /**
     *  绘制柱子底层椭圆
     */
    markEnter.append('ellipse').attr('class', 'bar-bottom')
    markCircle.select('.bar-bottom')
      .attr({
        'rx':26,
        'ry':10,
        'fill': 'rgba(223,66,15,.8)',
        'transform':'translate(-26,0)'
      })

     

  }
  return layerBar
})