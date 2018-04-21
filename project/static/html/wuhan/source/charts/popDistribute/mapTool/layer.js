/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-08-31 20:42:46
 * @Description:  给地图添加撒点
 */
define(function(require) {
  var layer = function(svg, path, rootData, layerData) {
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
    /**
     *  绘制圆圈组说明：
     *  1.撒点圆圈由数据layerData驱动
     *  2.一组撒点圆圈由一个g元素包裹
     *  3.撒点圆圈组的最大半径（即该圆圈组的最外层圆的半径）范围为[15,130]
     *  4.最外层圆的半径由地区的数据值（value值）决定，即由比例尺rLinear计算所得
     *  5.内层圆的半径由最外层圆半径结合各自的大小比例（相应的都有注释说明）计算所得
     */

    var markUpdate = mark.selectAll('g').data(layerData)
    var markEnter = markUpdate.enter().append('g')
    markUpdate.exit().remove()

    var rMax = 130
    var rMin = 15
    var rLinear = d3.scale.linear()
      .domain([0, d3.max(layerData, function(d) {
        return d.value
      })])
      .range([rMin, rMax])
    /**
     *  将每个圆圈组移动到地图上各自所属地图地区的中心，由数据layerData中的name决定
     *  var markCircle = mark.selectAll('g').data(layerData)有点多余
     *  但不想采用call()的写法，因为变量markCircle后续有用
     */
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
     *  用CSS添加放大动画
     */
      markEnter.append('circle').attr('class', 'ball-scale')
      markCircle.select('.ball-scale')
        .attr({
          'r': function(d, i) {
            return rLinear(d.value)
          }
        })
    /**
     *  绘制最外层圆[class='cir-one']
     *  半径由比例尺计算所得
     */
    markEnter.append('circle').attr('class', 'cir-one')
    markCircle.select('.cir-one')
      .attr({
        'r': function(d, i) {
          return rLinear(d.value)
        },
        'fill': 'rgba(239,109,20,.37)'
      })
    /**
     *  绘制从外到内的第二个圆[class='cir-two']
     *  半径为外层圆的 0.7倍
     */
    markEnter.append('circle').attr('class', 'cir-two')
    markCircle.select('.cir-two')
      .attr({
        'r': function(d, i) {
          return rLinear(d.value) * 0.7
        },
        'fill': 'rgba(239,109,20,.4)'
      })
    /**
     *  绘制三段圆弧[class='arc0']、[class='arc1']、[class='arc2']
     *  圆弧外半径是外层圆的 0.43倍
     *  圆弧内半径取外层圆的 0.34倍
     *  每段弧的弧度为 Math.PI*8 / 15
     */
    var arcData = [{
      startAngle: Math.PI * (-4 / 15),
      endAngle: Math.PI * (4 / 15)
    }, {
      startAngle: Math.PI * (6 / 15),
      endAngle: Math.PI * (14 / 15)
    }, {
      startAngle: Math.PI * (16 / 15),
      endAngle: Math.PI * (24 / 15)
    }]
    arcData.map(function(item, index) {
      markEnter.append('path').attr('class', 'arc' + index)
      markCircle.select('.arc' + index).attr({
        'd': function(d, i) {
          var outerRadius = rLinear(d.value) * 0.43
          var innerRadius = rLinear(d.value) * 0.34
          var arcPath = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius)
          return arcPath(item)
        },
        'fill': '#db430e'
      })
    })
    /**
     *  绘制从外到内的第三个圆[class='cir-three']
     *  半径为外层圆的 0.3倍
     */
    markEnter.append('circle').attr('class', 'cir-three')
    markCircle.select('.cir-three')
      .attr({
        'r': function(d, i) {
          return rLinear(d.value) * 0.3
        },
        'fill': 'rgba(239,109,20,.2)'
      })
    /**
     *  绘制从外到内的第四个圆[class='cir-four']
     *  半径为外层圆的 0.15倍
     */
    markEnter.append('circle').attr('class', 'cir-four')
    markCircle.select('.cir-four')
      .attr({
        'r': function(d, i) {
          return rLinear(d.value) * 0.15
        },
        'fill': 'rgba(239,109,20,.2)',
        'stroke-width': 1,
        'stroke': '#ED8816'
      })
    /**
     *  绘制圆心 的 圆 [class='cir-five']
     *  半径为外层圆的 0.05倍
     */
    markEnter.append('circle').attr('class', 'cir-five')
    markCircle.select('.cir-five')
      .attr({
        'r': function(d, i) {
          return rLinear(d.value) * 0.05
        },
        'fill': '#FDC21D'
      })
  }
  return layer
})