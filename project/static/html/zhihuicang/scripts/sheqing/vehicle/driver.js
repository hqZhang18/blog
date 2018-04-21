/**
 * @Author:      baizn
 * @DateTime:    2017-08-31 14:06:08
 * @Description: 车辆管理
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-08-31 14:06:08
 */
define(function(require) {

    require('jquery')
    var iconBar = require('iconBar')

    var config = {
      width: 1084,
      height: 520
    }
    function renderDriver(data) {
      iconBar('#iconBar', data.trafficViolation, config)
    }

    return renderDriver
})