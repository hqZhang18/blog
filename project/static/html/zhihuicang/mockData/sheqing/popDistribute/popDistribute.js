define(function(require) {
  var util = require('util')
  require('mock')
  Mock.mock(util.urlReg('personArea'), {
    'code': 1,
    'msg': 'success',
    "result": {
        "permanent": {
            "mainCity": [
                {
                    "name": "渝北区",
                    "value": 1058475
                },
                {
                    "name": "九龙坡区",
                    "value": 941207
                },
                {
                    "name": "巴南区",
                    "value": 936376
                },
                {
                    "name": "沙坪坝区",
                    "value": 848130
                },
                {
                    "name": "南岸区",
                    "value": 728022
                },
                {
                    "name": "北碚区",
                    "value": 642285
                },
                {
                    "name": "江北区",
                    "value": 624377
                },
                {
                    "name": "渝中区",
                    "value": 520595
                },
                {
                    "name": "两江新区",
                    "value": 282442
                },
                {
                    "name": "大渡口区",
                    "value": 269849
                },
                {
                    "name": "北部新区",
                    "value": 239353
                }
            ],
            "areaCity": [
                {
                    "name": "万州区",
                    "value": 1761601
                },
                {
                    "name": "开州区",
                    "value": 1696278
                },
                {
                    "name": "合川区",
                    "value": 1541467
                },
                {
                    "name": "江津区",
                    "value": 1505938
                },
                {
                    "name": "云阳县",
                    "value": 1347653
                },
                {
                    "name": "涪陵区",
                    "value": 1168480
                },
                {
                    "name": "永川区",
                    "value": 1157143
                },
                {
                    "name": "奉节县",
                    "value": 1065172
                },
                {
                    "name": "大足区",
                    "value": 1021105
                },
                {
                    "name": "忠县",
                    "value": 1017758
                },
                {
                    "name": "垫江县",
                    "value": 976890
                },
                {
                    "name": "潼南区",
                    "value": 959972
                },
                {
                    "name": "綦江区",
                    "value": 938565
                },
                {
                    "name": "梁平区",
                    "value": 935188
                },
                {
                    "name": "长寿区",
                    "value": 918661
                },
                {
                    "name": "铜梁区",
                    "value": 877169
                },
                {
                    "name": "酉阳县",
                    "value": 857123
                },
                {
                    "name": "荣昌区",
                    "value": 855792
                },
                {
                    "name": "丰都县",
                    "value": 829594
                },
                {
                    "name": "彭水县",
                    "value": 702137
                },
                {
                    "name": "南川区",
                    "value": 689681
                },
                {
                    "name": "秀山县",
                    "value": 669654
                },
                {
                    "name": "璧山区",
                    "value": 650602
                },
                {
                    "name": "巫山县",
                    "value": 640511
                },
                {
                    "name": "黔江区",
                    "value": 558263
                },
                {
                    "name": "石柱县",
                    "value": 550574
                },
                {
                    "name": "巫溪县",
                    "value": 547755
                },
                {
                    "name": "武隆区",
                    "value": 413738
                },
                {
                    "name": "万盛区",
                    "value": 270889
                },
                {
                    "name": "城口县",
                    "value": 251933
                },
                {
                    "name": "双桥区",
                    "value": 53862
                }
            ]
        },
        "temporary": {
            "mainCity": [
                {
                    "name": "九龙坡区",
                    "value": 1397974
                },
                {
                    "name": "沙坪坝区",
                    "value": 1182005
                },
                {
                    "name": "南岸区",
                    "value": 1002937
                },
                {
                    "name": "渝北区",
                    "value": 739974
                },
                {
                    "name": "江北区",
                    "value": 665832
                },
                {
                    "name": "巴南区",
                    "value": 581073
                },
                {
                    "name": "渝中区",
                    "value": 520795
                },
                {
                    "name": "北碚区",
                    "value": 334566
                },
                {
                    "name": "大渡口区",
                    "value": 247717
                },
                {
                    "name": "两江新区",
                    "value": 157522
                },
                {
                    "name": "北部新区",
                    "value": 143257
                }
            ],
            "areaCity": [
                {
                    "name": "长寿区",
                    "value": 309682
                },
                {
                    "name": "涪陵区",
                    "value": 302486
                },
                {
                    "name": "万州区",
                    "value": 287576
                },
                {
                    "name": "璧山区",
                    "value": 255454
                },
                {
                    "name": "永川区",
                    "value": 202168
                },
                {
                    "name": "江津区",
                    "value": 190066
                },
                {
                    "name": "合川区",
                    "value": 183864
                },
                {
                    "name": "开州区",
                    "value": 181659
                },
                {
                    "name": "奉节县",
                    "value": 126287
                },
                {
                    "name": "黔江区",
                    "value": 110679
                },
                {
                    "name": "綦江区",
                    "value": 109483
                },
                {
                    "name": "万盛区",
                    "value": 100731
                },
                {
                    "name": "铜梁区",
                    "value": 96011
                },
                {
                    "name": "忠县",
                    "value": 89408
                },
                {
                    "name": "云阳县",
                    "value": 81915
                },
                {
                    "name": "南川区",
                    "value": 77573
                },
                {
                    "name": "潼南区",
                    "value": 77150
                },
                {
                    "name": "石柱县",
                    "value": 75243
                },
                {
                    "name": "大足区",
                    "value": 74222
                },
                {
                    "name": "秀山县",
                    "value": 72595
                },
                {
                    "name": "梁平区",
                    "value": 70535
                },
                {
                    "name": "酉阳县",
                    "value": 69865
                },
                {
                    "name": "荣昌区",
                    "value": 66234
                },
                {
                    "name": "巫山县",
                    "value": 58631
                },
                {
                    "name": "彭水县",
                    "value": 57790
                },
                {
                    "name": "丰都县",
                    "value": 52660
                },
                {
                    "name": "垫江县",
                    "value": 52080
                },
                {
                    "name": "武隆区",
                    "value": 39318
                },
                {
                    "name": "双桥区",
                    "value": 39112
                },
                {
                    "name": "巫溪县",
                    "value": 26240
                },
                {
                    "name": "城口县",
                    "value": 14347
                },
                {
                    "name": "水上",
                    "value": 1064
                },
                {
                    "name": "民航重庆机场公安局",
                    "value": 786
                },
                {
                    "name": "长航",
                    "value": 584
                }
            ]
        },
        "all": {
            "mainCity": [
                {
                    "name": "渝北区",
                    "value": 1798449
                },
                {
                    "name": "九龙坡区",
                    "value": 2339181
                },
                {
                    "name": "巴南区",
                    "value": 1517449
                },
                {
                    "name": "沙坪坝区",
                    "value": 2030135
                },
                {
                    "name": "南岸区",
                    "value": 1730959
                },
                {
                    "name": "北碚区",
                    "value": 976851
                },
                {
                    "name": "江北区",
                    "value": 1290209
                },
                {
                    "name": "渝中区",
                    "value": 1041390
                },
                {
                    "name": "两江新区",
                    "value": 439964
                },
                {
                    "name": "大渡口区",
                    "value": 517566
                },
                {
                    "name": "北部新区",
                    "value": 382610
                }
            ],
            "areaCity": [
                {
                    "name": "万州区",
                    "value": 2049177
                },
                {
                    "name": "开州区",
                    "value": 1877937
                },
                {
                    "name": "合川区",
                    "value": 1725331
                },
                {
                    "name": "江津区",
                    "value": 1696004
                },
                {
                    "name": "云阳县",
                    "value": 1429568
                },
                {
                    "name": "涪陵区",
                    "value": 1470966
                },
                {
                    "name": "永川区",
                    "value": 1359311
                },
                {
                    "name": "奉节县",
                    "value": 1191459
                },
                {
                    "name": "大足区",
                    "value": 1095327
                },
                {
                    "name": "忠县",
                    "value": 1107166
                },
                {
                    "name": "垫江县",
                    "value": 1028970
                },
                {
                    "name": "潼南区",
                    "value": 1037122
                },
                {
                    "name": "綦江区",
                    "value": 1048048
                },
                {
                    "name": "梁平区",
                    "value": 1005723
                },
                {
                    "name": "长寿区",
                    "value": 1228343
                },
                {
                    "name": "铜梁区",
                    "value": 973180
                },
                {
                    "name": "酉阳县",
                    "value": 926988
                },
                {
                    "name": "荣昌区",
                    "value": 922026
                },
                {
                    "name": "丰都县",
                    "value": 882254
                },
                {
                    "name": "彭水县",
                    "value": 759927
                },
                {
                    "name": "南川区",
                    "value": 767254
                },
                {
                    "name": "秀山县",
                    "value": 742249
                },
                {
                    "name": "璧山区",
                    "value": 906056
                },
                {
                    "name": "巫山县",
                    "value": 699142
                },
                {
                    "name": "黔江区",
                    "value": 668942
                },
                {
                    "name": "石柱县",
                    "value": 625817
                },
                {
                    "name": "巫溪县",
                    "value": 573995
                },
                {
                    "name": "武隆区",
                    "value": 453056
                },
                {
                    "name": "万盛区",
                    "value": 371620
                },
                {
                    "name": "城口县",
                    "value": 266280
                },
                {
                    "name": "双桥区",
                    "value": 92974
                }
            ]
        }
    }
  })
})