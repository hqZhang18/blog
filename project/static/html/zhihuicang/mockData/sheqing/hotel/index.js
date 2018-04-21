define(function (require) {
    var util = require('util')
    require('mock')

    Mock.mock(util.urlReg('cabin/hotel'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "hotelTotal|1-100000": 1,
            "internetAccessCount|1-100000": 1,
            "stayArea|5": [
                {
                    "name": "@county",
                    "value|1-100000": 1
                }
            ],
            "staySource|6-10": [
                {
                    "name": "@county",
                    "value|1-100000": 1
                }
            ],
            "activityList|6-15": [
                {
                    "id": "@id",
                    "name": "@cparagraph"
                }
            ]
        }
    })
})