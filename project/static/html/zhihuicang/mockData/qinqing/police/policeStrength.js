define(function(require) {

    
    var util = require('util')
    
    // 警力分类
    Mock.mock(util.urlReg('qinqing/police/policeStrength'), {
        'code': 1,
        'msg': 'success',
        'result': {
          "policeStrength|5": [
            {
              'name|+1': ['流动警务车', '摩托车', '其他警用车辆', 'PDT', '巡警专用车'],
              'value|+1': [350, 387, 6675, 53, 32]
            }
          ]
          
        }
    })
})