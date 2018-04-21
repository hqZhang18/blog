/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 00:47:43
 * @Description:  绘制真实（即非阴影）地图
 */
define(function(require) {
  var mapReal = function(svg, georoot, path, setCity) {
    var stressArea = ['巫山县', '城口县', '云阳县', '梁平县', '石柱土家族自治县', '忠县', '黔江区', '秀山土家族苗族自治县', '垫江县', '长寿区', '涪陵区', '武隆区', '南川区', '綦江县', '永川区', '荣昌县', '铜梁区', '璧山区', '合川区', '潼南县']
    var renderRootData
    if (setCity) { //绘制重庆（只包含主城）地图阴影
      renderRootData = georoot.features.filter(function(d) {
        return setCity.has(d.properties.name)
      })
    } else { //绘制重庆(非主城区域)地图阴影
      renderRootData = georoot.features
    }

    var isReal = svg.select('.real').empty()
    var real
    if (isReal) {
      real = svg.append('g').attr('class', 'real')
    } else {
      real = svg.select('.real')
    }

    var realPathUpdate = real.selectAll('path').data(renderRootData)
    realPathUpdate.enter().append('path')
    realPathUpdate.exit().remove()

    real.selectAll('path').data(renderRootData)
      .attr({
        'stroke': '#1a6fb9',
        'stroke-width': 1,
        'fill': function(d, i) {//当为绘制'非主城区域'且需要强调区分填充色时
          if (!setCity && stressArea.indexOf(d.properties.name) >= 0) {
            return '#063984'
          } else {
            return '#1141a7'
          }
        },
        d: path,
        'cursor': 'pointer'
      })
  }
  return mapReal
})