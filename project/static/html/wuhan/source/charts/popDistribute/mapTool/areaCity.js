/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-08-31 15:58:55
 * @Description:  绘制重庆(非主城区域)地图
 */
define(function(require) {

  var getSvg = require('./getSvg.js')
  var getCenter = require('./getCenter.js')
  var getScale = require('./getScale.js')
  var mapShade = require('./mapShade.js')
  var mapReal = require('./mapReal.js')
  var layer = require('./layer.js')
  
  var areaCity = function(georoot, data) {
    var rootData = georoot.features
    var width = 1900;
    var height = 1200;

    var svg = getSvg('#cqAreaCity',width,height)
    var scale = getScale(rootData, width, height)
    var center = getCenter(rootData)

    var projection = d3.geo.mercator()
      .scale(scale * 46)
      .center(center)
      .translate([width / 2, height / 2]);

    var path = d3.geo.path()
      .projection(projection)

    /**
     *  绘制地图 -- 阴影部分
     */
    mapShade(svg,georoot,path)
    /**
     *  绘制地图 -- 真实部分
     */
    mapReal(svg,georoot,path)
    /**
     *  绘制撒点图标
     */
    layer(svg,path,rootData,data.areaCity)
  }
  return areaCity
})