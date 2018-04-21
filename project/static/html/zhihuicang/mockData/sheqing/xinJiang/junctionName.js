define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('junctionName'), {
        'code': 1,
        'msg': 'success',
        'result': {
            'junctionName|5': [
                {
                    'name|+1': ['路口1','路口2','路口3','路口4', '路口5'],   //路口名称
                    'value|1000-10000': 100   //车辆数量
                }
            ]
        }
    })
})