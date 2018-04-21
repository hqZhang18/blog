define(function(require) {

    
    var util = require('util')
    
    // 人员各类TOP5
    Mock.mock(util.urlReg('server/totalStatistics' ), {
        'code': 1,
        'msg': 'success',
        'result': {
          "transactNum": {
            "service|100-1000": 1,
             "licensePlate|100-1000": 1,
             "driversLicense|100-1000": 1,
             "identityCard|100-1000": 1,
          },
          "passCheck|5":  [
            {             
              "name|+1": ['港澳通行证', '通行证2', '通行证3', '通行证4', '通行证5'],
              "value|100-1000": 1
            }
          ]
        }
    })
})