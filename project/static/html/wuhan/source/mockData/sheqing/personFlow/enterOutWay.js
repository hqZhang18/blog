define(function(require) {

    
    var util = require('util')
    
    // 两个饼图(进出方式和常住人口/暂住人口)
    Mock.mock(util.urlReg('sheqing/personFlow/enterOutWay'), {
        'code': 1,
        'msg': 'success',
        'result': {
          "enterOutWay": {
            "ruyu|2": [
              {
                "name|+1": ['火车', '飞机'],
                "value|0.1-1": 1,
              }
            ],
            "chuyu|2": [
              {
                "name|+1": ['火车', '飞机'],
                "value|0.1-1": 1,
              }
            ]
          },
          "personType|2":  [
            {
              "name|+1": ['常住人口', '暂住人口'],
              "value|0.1-1": 1,
            }
          ]   
        }
    })
})