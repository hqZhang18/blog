define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('caseNumTendency'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "caseNumTendency|4": [
                {
                    "name|+1": ["2012", "2013", "2014", "2015"],
                    "value|1000-3000": 1347
                }
            ]
        }
    })
})