/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-08-31 16:09:16
 * @Description:  绘制重庆（只包含主城）地图
 */
define(function(require) {

  var getSvg = require('./getSvg.js')
  var getCenter = require('./getCenter.js')
  var getScale = require('./getScale.js')
  var mapShade = require('./mapShade.js')
  var mapReal = require('./mapReal.js')
  

  var mainCity = function(id, georoot, data, opt) {
    
    if(opt.type === 'pie') {
      var layer = require('./layer.js')
    }else {
      var layer = require('./layerBar.js')
    }
    var rootData = georoot.features
    var width = 1200;
    var height = 1100;
    //创建svg
    var svg = getSvg(id, width, height)
    var scale = getScale(rootData, width, height)
    var center = getCenter(rootData)

    var projection = d3.geo.mercator()
      .scale(scale * 200)
      .center(center)
      .translate([1400,0]);

    var path = d3.geo.path()
      .projection(projection)

    var setCity = d3.set(['渝北区', '北碚区', '江北区', '沙坪坝区', '南岸区', '九龙坡区', '大渡口区', '巴南区', '渝中区','两江新区'])

    /**
     *  绘制地图 -- 阴影部分
     */
    mapShade(svg,georoot,path,setCity)
    /**
     *  绘制地图 -- 真实部分
     */
    mapReal(svg,georoot,path,setCity)
    /**
     *  绘制撒点图标
     */
    layer(svg,path,rootData,data.mainCity)
  }
  return mainCity
})