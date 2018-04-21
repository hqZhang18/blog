define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('prisonPersonnel'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "prisonPersonnel|4": [
                {
                    "name|+1": ["强制戒毒所", "看守所", "拘留所", "收教所"],
                    "value|1000-5000": 1347
                }
            ]
        }
    })
})