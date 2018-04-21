define(function (require) {


    var util = require('util')

    // 总览页评估数据
    Mock.mock(util.urlReg('main/policeProfessionalTraining'), {
        "code": 1,
        "msg": "success",
        "result": {
            "accumulate|1-5000": 5000,
            "ptBar|7": [
                {
                    "name|+1": ["治安", "刑侦", "交管", "网安", "监管", "法制", "消防"],
                    "value": function () {
                        return Math.random() * (0.5 - 1) + 1
                    }
                }
            ]
        }
    })
})