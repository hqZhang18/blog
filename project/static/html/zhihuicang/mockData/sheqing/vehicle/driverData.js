/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 14:20:37
 * @Description:  驾驶人交通违纪数
 */
define(function(require) {
  var util = require('util')
  require('mock')
  Mock.mock(util.urlReg('cabin/trafficViolation'), {
    'code': 1,
    'msg': 'success',
    'result': {
      "trafficViolation|5": [
        {
          "name|+1": ['1次', '2次', '3次', '4次', '5次以上'] ,
          "value|+1": [1, 12, 32, 153, 1635]
        }
    ]
    }
  })
})