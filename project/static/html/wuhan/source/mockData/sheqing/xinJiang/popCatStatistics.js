define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('popCatStatistics'), {
        'code': 1,
        'msg': 'success',
        'result': {
            'popCatStatistics|5': [
                {
                    'name|+1': ['外国人', '学生', '涉疆', '涉藏', '吸毒人员'],   //人群
                    'value|10000-100000': 0   //人数
                }
            ]
        }
    })
})