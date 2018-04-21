define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('focusOnCases'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "focusOnCases|4": [
                {
                    "name|+1": ["七类侵财", "两抢一盗", "电信诈骗", "八大暴力"],
                    "value|1000-5000": 1347
                }
            ]
        }
    })
})