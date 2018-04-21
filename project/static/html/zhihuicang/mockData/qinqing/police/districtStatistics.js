define(function(require) {

    
    var util = require('util')
    
    // 各区县辖区公安单位数量统计
    Mock.mock(util.urlReg('qinqing/police/districtStatistics'), {
        'code': 1,
        'msg': 'success',
        'result': {
          'districtStatistics': {
            'countyTotal|1-1000': 1,
            'popedomTotal|1-1000': 1,
            'areaDistribution|10': [
              {
                'name|+1': ['江北区', '渝北区', '渝中区', '沙坪坝', '九龙坡区', '大渡口区 ', '北碚区', '南岸区', '巴南区', '北部新区', '万州区', '开州区', '涪陵区'],
                'value|1-1000': 1 
                // 'value|+1': [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100 ]
              }
            ]
          }
        }
    })
})