define(function(require) {

    
    var util = require('util')
    
    // 总览页评估数据
    Mock.mock(util.urlReg('main/assessment'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "assessment": {
              "train|6": [
                  {
                    "date|+1": 2010,
                    "value1|10000-200000": 1,
                    "value2|10000-200000": 1,
                    "value3|10000-200000": 1,
                  }
              ],
              "standardRate|6": [
                {
                  "date|+1": 2010,
                  "value1|0.1-2": 1,
                  "value2|0.1-2": 1,
                  "value3|0.1-2": 1,
                }
              ]
        }
      }
    })
})