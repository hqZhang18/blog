define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('areaDistribution'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "areaDistribution|9":[
                {
                    "name|+1": ["渝中区", "渝北区", "沙坪坝区", "南岸区", "万州区", "江北区", "九龙坡区", "涪陵区", "梁平区"],
                    "occurred|1000-10000": 6487,
                    "record|1000-10000": 7487,
                    "solved|1000-10000": 8487
                }
            ]
        }
    })
})