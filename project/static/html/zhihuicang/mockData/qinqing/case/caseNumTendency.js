define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('caseNumTendency'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "caseNumTendency|5": [
                {
                    "name|+1": ["看守所1", "看守所2", "看守所3", "看守所4", "看守所5"],
                    "value|1000-3000": 1347
                }
            ]
        }
    })
})