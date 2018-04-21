define(function(require) {

    
    var util = require('util')
    
    // 警员年龄段分布
    Mock.mock(util.urlReg('qinqing/police/policeAge'), {
        'code': 1,
        'msg': 'success',
        'result': {
          "policeAge|5": [
            {
              'name|+1': ['23-30岁', '31-40岁', '41-50岁', '51-60岁', '60岁以上'],
              'value|+1': [7761, 15686, 10887, 6016, 189]
            }
          ]
          
        }
    })
})