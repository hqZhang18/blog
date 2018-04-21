define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('caseNature'), {
        'code': 1,
        'msg': 'success',
        'result': {
            'caseNature|5': [
                {
                    'name|+1': ['发案总量', '立案数量', '破案数量', '刑事案件', '治安案件'], //案件性质
                    'value|10000-100000': 1  //案件值
                }
            ]
        }
    })
})