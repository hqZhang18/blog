/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 14:30:00
 * @Description:  左上角总量统计
 */
define(function (require) {
    var util = require('util')
    require('mock')
    Mock.mock(util.urlReg('total'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "totalCount": {
                "motorVehicle": "1222558",
                "networkCar": "3211",
                "keyCar": "99",
                "truck": "811",
                "cargoShip": "123",
                "passengerShip": "129"
            }
        }
    })
})