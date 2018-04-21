define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('detaineesNumber'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "detaineesNumber|8": [
                {
                    "name|+1": ["二月", "三月", "四月", "五月", "六月", "七月", "八月"],
                    "tongbi": function () {
                        var d = Math.round(Math.random()) === 0 ? -1 : 1
                        return Math.random() * 100 * d
                    },
                    "huanbi": function () {
                        var d = Math.round(Math.random()) === 0 ? -1 : 1
                        return Math.random() * 100 * d
                    },
                    "value": function () {
                        return Math.random() * 90000
                    }
                }
            ]
        }
    })
})