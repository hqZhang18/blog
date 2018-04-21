/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 14:20:37
 * @Description:  驾驶人交通违纪数
 */
define(function(require) {
  var util = require('util')
  require('mock')
  Mock.mock(util.urlReg('driverData'), {
    'code': 1,
    'msg': 'success',
    'result':[
      { 'name': '0次', 'value|10-100': 10},
      { 'name': '1-3次', 'value|10-100': 10},
      { 'name': '4-8次', 'value|10-100': 10},
      { 'name': '8-10次', 'value|10-100': 10},
      { 'name': '10-15次', 'value|10-100': 10},
      { 'name': '15次以上', 'value|10-100': 10}
    ]
  })
})