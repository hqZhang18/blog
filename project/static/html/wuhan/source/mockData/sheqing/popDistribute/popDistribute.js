define(function(require) {
  var util = require('util')
  require('mock')
  Mock.mock(util.urlReg('popDistribute'), {
    'code': 1,
    'msg': 'success',
    'result': {
      'all': {
        'areaCity': [
          {
            'name': '酉阳土家族苗族自治县',
            'value|1-100': 1
          }, {
            'name': '奉节县',
            'value|1-100': 1
          },{
            'name': '巫溪县',
            'value|1-100': 1
          },{
            'name': '开县',
            'value|1-100': 1
          },{
            'name': '彭水苗族土家族自治县',
            'value|1-100': 1
          },{
            'name': '云阳县',
            'value|1-100': 1
          },{
            'name': '万州区',
            'value|1-100': 1
          },{
            'name': '城口县',
            'value|1-100': 1
          },{
            'name': '江津区',
            'value|1-100': 1
          },{
            'name': '石柱土家族自治县',
            'value|1-100': 1
          },{
            'name':'巫山县',
            'value|1-100':1
          },{
            'name':'涪陵区',
            'value|1-100':1
          },{
            'name':'丰都县',
            'value|1-100':1
          },{
            'name':'武隆区',
            'value|1-100':1
          },{
            'name':'南川区',
            'value|1-100':1
          },{
            'name':'秀山土家族苗族自治县',
            'value|1-100':1
          },{
            'name':'綦江县',
            'value|1-100':1
          },{
            'name':'忠县',
            'value|1-100':1
          },{
            'name':'梁平县',
            'value|1-100':1
          },{
            'name':'巴南区',
            'value|1-100':1
          },{
            'name':'潼南县',
            'value|1-100':1
          },{
            'name':'永川区',
            'value|1-100':1
          },{
            'name':'垫江县',
            'value|1-100':1
          },{
            'name':'长寿区',
            'value|1-100':1
          },{
            'name':'大足区',
            'value|1-100':1
          },{
            'name':'铜梁区',
            'value|1-100':1
          },{
            'name':'荣昌县',
            'value|1-100':1
          },{
            'name':'璧山区',
            'value|1-100':1
          },{
            'name':'万盛区',
            'value|1-100':1
          },{
            'name':'双桥区',
            'value|1-100':1
          }
        ],
        'mainCity': [
          {
            'name': '渝北区',
            'value|1-100': 1
          }, {
            'name': '北碚区',
            'value|1-100': 1
          },{
            'name': '九龙坡区',
            'value|1-100': 1
          },{
            'name': '沙坪坝区',
            'value|1-100': 1
          },{
            'name': '南岸区',
            'value|1-100': 1
          },{
            'name': '江北区',
            'value|1-100': 1
          },{
            'name': '大渡口区',
            'value|1-100': 1
          },{
            'name': '渝中区',
            'value|1-100': 1
          },{
            'name':'巴南区',
            'value|1-100':1
          }
        ]
      },
      'permanent': {
        'areaCity': [
          {
            'name': '酉阳土家族苗族自治县',
            'value|1-100': 1
          }, {
            'name': '奉节县',
            'value|1-100': 1
          },{
            'name': '巫溪县',
            'value|1-100': 1
          },{
            'name': '开县',
            'value|1-100': 1
          },{
            'name': '彭水苗族土家族自治县',
            'value|1-100': 1
          },{
            'name': '云阳县',
            'value|1-100': 1
          },{
            'name': '万州区',
            'value|1-100': 1
          },{
            'name': '城口县',
            'value|1-100': 1
          },{
            'name': '江津区',
            'value|1-100': 1
          },{
            'name': '石柱土家族自治县',
            'value|1-100': 1
          },{
            'name':'巫山县',
            'value|1-100':1
          },{
            'name':'涪陵区',
            'value|1-100':1
          },{
            'name':'丰都县',
            'value|1-100':1
          },{
            'name':'武隆区',
            'value|1-100':1
          },{
            'name':'南川区',
            'value|1-100':1
          },{
            'name':'秀山土家族苗族自治县',
            'value|1-100':1
          },{
            'name':'綦江县',
            'value|1-100':1
          },{
            'name':'忠县',
            'value|1-100':1
          },{
            'name':'梁平县',
            'value|1-100':1
          },{
            'name':'巴南区',
            'value|1-100':1
          },{
            'name':'潼南县',
            'value|1-100':1
          },{
            'name':'永川区',
            'value|1-100':1
          },{
            'name':'垫江县',
            'value|1-100':1
          },{
            'name':'长寿区',
            'value|1-100':1
          },{
            'name':'大足区',
            'value|1-100':1
          },{
            'name':'铜梁区',
            'value|1-100':1
          },{
            'name':'荣昌县',
            'value|1-100':1
          },{
            'name':'璧山区',
            'value|1-100':1
          },{
            'name':'万盛区',
            'value|1-100':1
          },{
            'name':'双桥区',
            'value|1-100':1
          },{
            'name':'璧山区',
            'value|1-100':1
          },{
            'name':'璧山区',
            'value|1-100':1
          },{
            'name':'璧山区',
            'value|1-100':1
          }
        ],
        'mainCity': [
          {
            'name': '渝北区',
            'value|1-100': 1
          }, {
            'name': '北碚区',
            'value|1-100': 1
          },{
            'name': '九龙坡区',
            'value|1-100': 1
          },{
            'name': '沙坪坝区',
            'value|1-100': 1
          },{
            'name': '南岸区',
            'value|1-100': 1
          },{
            'name': '江北区',
            'value|1-100': 1
          },{
            'name': '大渡口区',
            'value|1-100': 1
          },{
            'name': '渝中区',
            'value|1-100': 1
          },{
            'name':'巴南区',
            'value|1-100':1
          }
        ]
      },
      'temporary': {
        'areaCity': [
          {
            'name': '酉阳土家族苗族自治县',
            'value|1-100': 1
          }, {
            'name': '奉节县',
            'value|1-100': 1
          },{
            'name': '巫溪县',
            'value|1-100': 1
          },{
            'name': '开县',
            'value|1-100': 1
          },{
            'name': '彭水苗族土家族自治县',
            'value|1-100': 1
          },{
            'name': '云阳县',
            'value|1-100': 1
          },{
            'name': '万州区',
            'value|1-100': 1
          },{
            'name': '城口县',
            'value|1-100': 1
          },{
            'name': '江津区',
            'value|1-100': 1
          },{
            'name': '石柱土家族自治县',
            'value|1-100': 1
          },{
            'name':'巫山县',
            'value|1-100':1
          },{
            'name':'涪陵区',
            'value|1-100':1
          },{
            'name':'丰都县',
            'value|1-100':1
          },{
            'name':'武隆区',
            'value|1-100':1
          },{
            'name':'南川区',
            'value|1-100':1
          },{
            'name':'秀山土家族苗族自治县',
            'value|1-100':1
          },{
            'name':'綦江县',
            'value|1-100':1
          },{
            'name':'忠县',
            'value|1-100':1
          },{
            'name':'梁平县',
            'value|1-100':1
          },{
            'name':'巴南区',
            'value|1-100':1
          },{
            'name':'潼南县',
            'value|1-100':1
          },{
            'name':'永川区',
            'value|1-100':1
          },{
            'name':'垫江县',
            'value|1-100':1
          },{
            'name':'长寿区',
            'value|1-100':1
          },{
            'name':'大足区',
            'value|1-100':1
          },{
            'name':'铜梁区',
            'value|1-100':1
          },{
            'name':'荣昌县',
            'value|1-100':1
          },{
            'name':'璧山区',
            'value|1-100':1
          },{
            'name':'万盛区',
            'value|1-100':1
          },{
            'name':'双桥区',
            'value|1-100':1
          },{
            'name':'璧山区',
            'value|1-100':1
          },{
            'name':'璧山区',
            'value|1-100':1
          },{
            'name':'璧山区',
            'value|1-100':1
          }
        ],
        'mainCity': [
          {
            'name': '渝北区',
            'value|1-100': 1
          }, {
            'name': '北碚区',
            'value|1-100': 1
          },{
            'name': '九龙坡区',
            'value|1-100': 1
          },{
            'name': '沙坪坝区',
            'value|1-100': 1
          },{
            'name': '南岸区',
            'value|1-100': 1
          },{
            'name': '江北区',
            'value|1-100': 1
          },{
            'name': '大渡口区',
            'value|1-100': 1
          },{
            'name': '渝中区',
            'value|1-100': 1
          },{
            'name':'巴南区',
            'value|1-100':1
          }
        ]
      }
    }
  })
})