define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('polCloDataCollection'), {
        "code": 1,
        "msg": "success",
        "result": {
            "polCloDataCollection": {
                "total|0-999999": 0,
                "unit|4-5": [
                    {
                        "name": "@region",
                        "value|0-29999": 0
                    }
                ]
            }
        }
    })
})