define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('popCatStatistics'), {
        'code': 1,
        'msg': 'success',
        'result': {
            'popCatStatistics|3': [
                {
                    // 'name|+1': ['外国人', '学生', '涉疆', '涉藏', '吸毒人员', '教师', '农民'],   //人群
                    'name|+1': ['外国人', '学生', '涉疆'],   //人群
                    'value|10000-100000': 0   //人数
                }
            ]
        }
    })
})