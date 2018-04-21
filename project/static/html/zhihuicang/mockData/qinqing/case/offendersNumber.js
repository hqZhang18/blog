define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('offendersNumber'), {
        'code': 1,
        'msg': 'success',
        'result': {
            'offendersNumber': {
                'supervisorsNumber|10000-100000': 1,
                'imprisonedNumber|10000-100000': 1,
                'releaseNumber|10000-100000': 1
            },
            'sex': {
                'female|10000-100000': 1,
                'male|10000-100000': 1
            }
        }
    })
})