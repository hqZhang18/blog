define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('caseNumber'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "caseNumber": {
                "name": ["二月", "三月", "四月", "五月", "六月", "七月", "八月"],
                "tongbi|8": function () {
                    return Math.random() * 90000 * Math.random()
                },
                "huanbi": function () {
                    return Math.random() * 90000 * Math.random()
                }
            }
        }
    })
})