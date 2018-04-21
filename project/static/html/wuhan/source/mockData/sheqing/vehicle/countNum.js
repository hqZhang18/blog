/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 14:30:00
 * @Description:  左上角总量统计
 */
define(function(require) {
  var util = require('util')
  require('mock')
  Mock.mock(util.urlReg('countNum'), {
    'code': 1,
    'msg': 'success',
    'result|6':[
      {
        'name':'@cname',
        'value|1000-30000':1000
      }
    ]
  })
})