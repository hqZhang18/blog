define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('vehDistribution'), {
        'code': 1,
        'msg': 'success',
        'result': {
            'vehDistribution|5': [
                {
                    'name|+1': ['疆','渝','川','贵', '陕'],   //车辆车牌类别
                    'value|1000-10000': 100   //车辆数量

                }
            ]
        }
    })
})