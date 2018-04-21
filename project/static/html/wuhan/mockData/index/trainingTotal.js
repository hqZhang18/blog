/**
 * @Author:      zhanghq
 * @DateTime:    2017-08-22 10:10:38
 * @Description: 培训总量接口数据，包括培训总量、民警训练总量、辅警训练总量
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-22 10:10:38
 */

define(function(require) {

    var util = require('util')
    
    // 总览页教官教材
    Mock.mock(util.urlReg('main/trainingTotal'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "total|1000-5000": 1,
            "police1Count|4": [
              {
                "name|+1": ["入警训练", "晋升训练", "专业训练", "发展训练"],
                "value|1000-2000": 1
              }
            ],
            "auxiliaryPoliceCount|2": [
              {
                "name|+1": ["岗前培训", "年度培训"],
                "value|1000-2000": 1
              }
            ]
      }
    })
})