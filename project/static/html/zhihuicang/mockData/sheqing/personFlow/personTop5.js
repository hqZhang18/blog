define(function(require) {

    
    var util = require('util')
    
    // 人员各类TOP5
    Mock.mock(util.urlReg('sheqing/personFlow/personTop5'), {
        'code': 1,
        'msg': 'success',
        'result': {
          "personIngoingReason|5":  [
            {
              "name|+1": ['A类别', 'B类别', 'C类别', 'D类别', 'E类别', 'F类别'],
              "value|+1": [94217, 32399, 30749, 5501, 4911]
            }
          ],
          "personIngoingLand|5":  [
            {
              "name": "@province",
              "value|+1": [40274, 5893, 5383, 3738, 3730]
            }
          ],
          "personOutLand|5":  [
            {
              "name|+1": ['重庆市万州区', '重庆市江津区', '重庆市开县', '重庆市涪陵区', '重庆市'],
              "value|+1": [10506, 10355, 10312, 9906, 9631]
            }
          ]     
        }
    })
})