/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 00:24:29
 * @Description:  绘制地图阴影
 */
define(function(require) {
  var mapShade = function(svg, georoot, path, setCity) {
    var renderRootData
    if (setCity) { //绘制重庆（只包含主城）地图阴影
      renderRootData = georoot.features.filter(function(d) {
        return setCity.has(d.properties.name)
      })
    } else { //绘制重庆(非主城区域)地图阴影
      renderRootData = georoot.features
    }
    var isShades = svg.select('.shades').empty()
    var shades
    if (isShades) {
      shades = svg.append('g').attr('class', 'shades')
    } else {
      shades = svg.select('.shades')
    }
    //添加阴影
    var shadeUpdate = shades.selectAll('.shade').data(d3.range(5))

    shadeUpdate.enter().append('g').attr('class', 'shade')
    shadeUpdate.exit().remove()

    var shadePathUpdate = shades.selectAll('.shade').selectAll('path').data(renderRootData)
    shadePathUpdate.enter().append('path')
    shadePathUpdate.exit().remove()

    shades.selectAll('.shade').selectAll('path').data(renderRootData)
      .attr({
        'stroke': '#09245d',
        'stroke-width': 4,
        'fill': 'none',
        'd': path,
        'transform': 'translate(4,0)'
      })
  }
  return mapShade
})