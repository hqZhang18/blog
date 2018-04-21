define(function(require) {
  var util = require('util')
  require('mock')
  Mock.mock(util.urlReg('qinqing/policeDistribution'), {
    'code': 1,
    'msg': 'success',
    'result': {
      'policeDistribution': {
        'total|10-1000': 1,
        "mainCity": [
                {
                    "name": "渝中区",
                    "value": 2322
                },
                {
                    "name": "九龙坡区",
                    "value": 2317
                },
                {
                    "name": "沙坪坝区",
                    "value": 2115
                },
                {
                    "name": "江北区",
                    "value": 1817
                },
                {
                    "name": "渝北区",
                    "value": 1774
                },
                {
                    "name": "南岸区",
                    "value": 1700
                },
                {
                    "name": "巴南区",
                    "value": 1365
                },
                {
                    "name": "北碚区",
                    "value": 1181
                },
                {
                    "name": "大渡口区",
                    "value": 920
                },
                {
                    "name": "两江新区",
                    "value": 834
                }
            ],
            "areaCity": [
                {
                    "name": "万州区",
                    "value": 1450
                },
                {
                    "name": "涪陵区",
                    "value": 1099
                },
                {
                    "name": "江津区",
                    "value": 989
                },
                {
                    "name": "合川区",
                    "value": 959
                },
                {
                    "name": "开县",
                    "value": 838
                },
                {
                    "name": "永川区",
                    "value": 787
                },
                {
                    "name": "长寿区",
                    "value": 748
                },
                {
                    "name": "云阳县",
                    "value": 629
                },
                {
                    "name": "綦江县",
                    "value": 618
                },
                {
                    "name": "奉节县",
                    "value": 616
                },
                {
                    "name": "大足县",
                    "value": 599
                },
                {
                    "name": "南川区",
                    "value": 577
                },
                {
                    "name": "荣昌县",
                    "value": 563
                },
                {
                    "name": "璧山县",
                    "value": 559
                },
                {
                    "name": "黔江区",
                    "value": 550
                },
                {
                    "name": "潼南县",
                    "value": 541
                },
                {
                    "name": "铜梁县",
                    "value": 531
                },
                {
                    "name": "忠县",
                    "value": 516
                },
                {
                    "name": "梁平县",
                    "value": 516
                },
                {
                    "name": "垫江县",
                    "value": 507
                },
                {
                    "name": "丰都县",
                    "value": 502
                },
                {
                    "name": "酉阳土家族苗族自治县",
                    "value": 473
                },
                {
                    "name": "彭水苗族土家族自治县",
                    "value": 465
                },
                {
                    "name": "秀山土家族苗族自治县",
                    "value": 446
                },
                {
                    "name": "石柱土家族自治县",
                    "value": 435
                },
                {
                    "name": "万盛区",
                    "value": 433
                },
                {
                    "name": "武隆县",
                    "value": 417
                },
                {
                    "name": "巫山县",
                    "value": 416
                },
                {
                    "name": "巫溪县",
                    "value": 361
                },
                {
                    "name": "城口县",
                    "value": 265
                },
                {
                    "name": "双桥区",
                    "value": 158
                }
            ]
      }
    }
  })
})