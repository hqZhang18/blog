/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-08-31 09:44:20
 * @Description:  绘制 中下页面 重庆地图
 */
define(function(require) {
  /**
   * 引入公用文件
   */
  require('topojson')
  require('d3')
  var areaCity = require('./mapTool/areaCity.js')
  var mainCity = require('./mapTool/mainCity.js')

  
  var cqmap = function(data) {
    d3.json('../../mockData/sheqing/popDistribute/chongqing.json', function(error, root) {
      if (error) {
        return console.error(error);
      }
      var georoot = topojson.feature(root, root.objects.chongqing)
      //渲染整个重庆的地图
      areaCity(georoot,data)

      //渲染主城
      mainCity(georoot,data)
    })
  }
  return cqmap
})