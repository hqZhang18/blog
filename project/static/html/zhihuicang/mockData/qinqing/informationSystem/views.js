define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('views'), {
        "code": 1,
        "msg": "success",
        "result": {
            "policeFitVisit": {
                "total|0-9999999": 0,
                "unit|4-5": [
                    {
                        "name": "@province",
                        "value|0-99999": 0
                    }
                ]
            },
            "policePlatformAccess": {
                "total|0-99999999": 0,
                "unit|4-5": [
                    {
                        "name": "@province",
                        "value|0-999999": 0
                    }
                ]
            }
        }
    })
})