define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('areaDistribution'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "areaDistribution|9": [
                {
                    "name": "@province",
                    "value|1000-10000": 6487
                }
            ]
        }
    })
})