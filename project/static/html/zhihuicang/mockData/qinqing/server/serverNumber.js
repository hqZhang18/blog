define(function(require) {

    
    var util = require('util')
    
    // 人员各类TOP5
    Mock.mock(util.urlReg('server/serverNumber' ), {
        'code': 1,
        'msg': 'success',
        'result': {
          "serverNumber|9":  [
            {             
              "name|1": ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
              "tongbi|-100-100": 1,
              "huanbi|-100-100": 1
            }
          ]
        }
    })
})