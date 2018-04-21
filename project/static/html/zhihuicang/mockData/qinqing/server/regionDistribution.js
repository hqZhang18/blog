define(function(require) {

    
    var util = require('util')
    
    // 服务数量地区分布情况
    Mock.mock(util.urlReg('server/regionDistribution'), {
        'code': 1,
        'msg': 'success',
        'result': {
          "regionDistribution|9": [
            {
              "name|+1": ['江北区', '渝北区', '渝中区', '沙坪坝', '九龙坡区', '大渡口区 ', '北碚区', '南岸区', '巴南区', '北部新区', '万州区', '开州区', '涪陵区'],
              "total|100-1000": 1,
              "driversLicense|10-500": 1,
              "identityCard|1-100": 1,
            }
          ]
          
        }
    })
})