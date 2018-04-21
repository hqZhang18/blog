define(function (require) {
    require('mock')
    var util = require('common/util')

    //mock数据
    Mock.mock(util.urlReg('regPerDistribution'), {
        'code': 1,
        'msg': 'success',
        'result': {
            'regPerDistribution|10': [
                {
                    'name|+1': ['渝中区', '渝北区', '沙坪坝区', '南岸区', '万州区', '江北区', '九龙坡区', '涪陵区', '梁平区', '永川区'],   //行政区名称
                    'value|1000-10000': 1  //人员数量
                }
            ]
        }
    })
})