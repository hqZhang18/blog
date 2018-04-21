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
              "value|100-2000": 1,
            }
          ],
          "personIngoingLand|5":  [
            {
              "name": "@province",
              "value|100-2000": 1,
            }
          ],
          "personOutLand|5":  [
            {
              "name": "@province",
              "value|10-200": 1,
            }
          ]     
        }
    })
})