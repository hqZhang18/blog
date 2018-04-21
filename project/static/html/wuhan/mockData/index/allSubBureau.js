 /**
 * @Author:      zhanghq
 * @DateTime:    2017-08-23 11:19:36
 * @Description: 中间训练中心及所有分局数据
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-23 11:19:36
 */

define(function(require) {

    var util = require('util')
    
    // 总览页教官教材
    Mock.mock(util.urlReg('main/allSubBureau'), {
        'code': 1,
        'msg': 'success',
        'result': {
            "main|1": [
              {
                 "name": ['市警察实战训练基地'],
                "value|1000-2000": 1
              }
            ],
            "trainingCenter|4": [
              {
                 "name|+1": ['基层训练站室', '基础技能训练中心', '警种专业训练中心', '分局实战训练中心'],
                "value|1000-2000": 1,
                "allFenju|8-15": [
                  {
                    "name|+1": ['化工分局', '东湖分局', '黄陂分局', '江夏分局', '蔡甸分局', '东西湖分局', '洪山分局', '青山分局', '武昌分局', '汉阳分局', '硚口分局', '江汉分局', '江岸分局', '开发区分局', '新洲区分局'],
                    "value|1000-2000": 1
                  }
                ]
              }
            ],
            "subBureau|8-15": [
              {
                 "name|+1": ['化工分局', '东湖分局', '黄陂分局', '江夏分局', '蔡甸分局', '东西湖分局', '洪山分局', '青山分局', '武昌分局', '汉阳分局', '硚口分局', '江汉分局', '江岸分局', '开发区分局', '新江分局'],
                // "name": "@id",
                "value|1000-2000": 1
              }
            ]
      }
    })
})