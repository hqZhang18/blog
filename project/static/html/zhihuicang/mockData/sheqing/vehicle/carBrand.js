define(function(require) {

    
    var util = require('util')
    
    // 人员各类TOP5
    Mock.mock(util.urlReg('cabin/carBrand'), {
        'code': 1,
        'msg': 'success',
        'result': {
          "carBrand|6":  [
            {
              "name|+1": ['宝马', '比亚迪', '其他', '奥迪', '大众', '奔驰'],
              "value|10-100": 1,
            }
          ]
        }
    })
})