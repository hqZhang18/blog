define(function (require) {
  
  var util = require('util')
  
  // 人员各类TOP5
  Mock.mock(util.urlReg('sheqing/personFlow/totalStatistics'), {
    'code': 1,
    'msg': 'success',
    'result': {
      'total': {
        "enterTotal|1000-20000": 1,
        "outTotal|1000-20000": 1,
        "totalPopu|1000000-2000000": 1,
        "residentPopu|1000000-2000000": 1,
        "temporaryPopu|1000000-2000000": 1
      }
    }
  })
})