/**
 * @Author:      zhanghq
 * @DateTime:    2017-08-19 10:09:10
 * @Description: 教官教材
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-19 10:09:10
 */

define(function(require) {

    var util = require('util')
    
    // 总览页教官教材
    Mock.mock(util.urlReg('main/instructorMaterials'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "instructo|2": [
              {
                 "name|+1": ['专职教官', '兼职教官'],
                // "name": "@id",
                "value|1000-2000": 1
              }
            ],
            "materials|4": [
              {
                 "name|+1": ['微课数量', '在线练习量', '题库总量', '在线练习人次'],
                //"name|+1": "@cname",
                "value|1000-2000": 1
              }
            ]
      }
    })
})