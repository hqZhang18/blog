/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 14:29:41
 * @Description:  高速路口流量
 */
define(function(require) {
  var util = require('util')
  require('mock')
  Mock.mock(util.urlReg('highSpeed'), {
    'code': 1,
    'msg': 'success',
    'result':{
      'highSpeed|7':[
        {
          'name|+1':['高速路口2','高速路口3','高速路口4','高速路口5','高速路口6','高速路口7','高速路口8','高速路口9','高速路口10','高速路口11'],
          'access|10-100':10,
          'leave|10-100':10
        }
      ]
    }
  })
})