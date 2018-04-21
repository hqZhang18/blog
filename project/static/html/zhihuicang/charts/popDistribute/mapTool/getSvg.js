/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 00:17:04
 * @Description:  创建svg对象并返回
 */
define(function(require) {
  var getSvg = function(id,width,height) {
    var stage = d3.select(id)
    var isSvg = stage.select('svg').empty()
    var svg = null
    if (isSvg) {
      svg = stage.append('svg')
    } else {
      svg = stage.select('svg')
    }
    svg.attr('width', width).attr('height', height)
    return svg
  }
  return getSvg
})