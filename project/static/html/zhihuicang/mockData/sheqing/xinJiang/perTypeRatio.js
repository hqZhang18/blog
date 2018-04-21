define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('perTypeRatio'), {
        'code': 1,
        'msg': 'success',
        'result': {
            'perTypeRatio|2': [
                {
                    'name|+1': ['暂住人口', '常住人口'],   //人口类别
                    'value|0-1000': 0   //人数
                }
            ]
        }
    })
})