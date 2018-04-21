define(function (require) {


    var util = require('util')

    // 总览页评估数据
    Mock.mock(util.urlReg('main/civilPoliceQualification'), {
        "code": 1,
        "msg": "success",
        "result": {
            "accumulate|1-5000": 5000,
            "cpqLine|8": [
                {
                    "date|+1": ["2011.3", "2011.8","2012.3", "2012.8", "2013.3", "2013.8", "2014.3", "2014.8"],
                    "value": function () {
                        return Math.random() * (0.7 - 1) + 1
                    }
                }
            ],
            "cpqRadar|4": [
                {
                    "name|+1": ["理论笔试", "信息化", "射 击", "体能测试"],
                    "value": function () {
                        return Math.random() * (0.5 - 1) + 1
                    }
                }
            ]
        }
    })
})