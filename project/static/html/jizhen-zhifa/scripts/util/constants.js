/**
 * @Author:      baizn
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 公用常量
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */

define(function(require) {
  var apiURL = require('../api.config.js') 

  var Constants = {
      // 页面缩放
      MAIN_PAGE_WIDTH: 2475,
      MAIN_PAGE_HEIGHT: 1856,
      PAGE_WIDTH: 2475,
      PAGE_HEIGHT: 928,
      SVG_IMG_PATH: apiURL.apiHost
  }

  return Constants
})
