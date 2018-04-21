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
  var defaultConfig = {
    type: 'pie'
  }

  var cqmap = function(marinId, areaId, data, opt) {
    var config = opt || defaultConfig
    d3.json('../../mockData/sheqing/popDistribute/chongqing2.json', function(error, root) {
      if (error) {
        return console.error(error);
      }
      var georoot = topojson.feature(root, root.objects.chongqing)
   

      //渲染主城
      mainCity(marinId, georoot,data, config)

      //渲染整个重庆的地图
      areaCity(areaId, georoot,data, config)
    })
  }
  return cqmap
})