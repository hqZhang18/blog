define(function(require) {

    
    var util = require('util')
    
    // 警车类型
    Mock.mock(util.urlReg('qinqing/police/policeCar'), {
        'code': 1,
        'msg': 'success',
        'result': {
          "policeCar|5": [
            {
              'name|+1': ['类型1', '类型2', '类型3', '类型4', '类型5'],
              'value|100-1000': 1
            }
          ]
          
        }
    })
})