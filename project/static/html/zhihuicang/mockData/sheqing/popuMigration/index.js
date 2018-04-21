define(function(require) {

    require('mock')
    var util = require('util')
    
    // // 人员迁徙
    Mock.mock(util.urlReg('popuMigration'), {
        'code': 1,
        'msg': 'success',
        'result': {
          'map': {
            'qianru': [
              {
                'name': '江苏省',
                'value|1188-4627': 1
              }, {
                'name': '四川省',
                'value': 32205
              },{
                'name': '北京市',
                'value|1188-4627': 1
              },{
                'name': '江西省',
                'value|1188-4627': 1
              },{
                'name': '广东省',
                'value|1188-4627': 1
              },{
                'name': '湖南省',
                'value|1188-4627': 1
              },{
                'name': '云南省',
                'value|1188-4627': 1
              },{
                'name': '湖北省',
                'value|1188-4627': 1
              },{
                'name': '贵州省',
                'value|1188-4627': 1
              }, {
                'name': '河南省',
                'value|1188-4627': 1
              }, {
                'name': '广西',
                'value|1188-4627': 1
              }
            ],
            "qianchu": [
              {
                'name': '江苏省',
                'value|1188-8627': 1
              }, {
                'name': '四川省',
                'value': 22205
              },{
                'name': '北京市',
                'value|1188-8627': 1
              },{
                'name': '江西省',
                'value|1188-8627': 1
              },{
                'name': '广东省',
                'value|1188-8627': 1
              },{
                'name': '湖南省',
                'value|1188-8627': 1
              },{
                'name': '云南省',
                'value|1188-8627': 1
              },{
                'name': '湖北省',
                'value|1188-8627': 1
              },{
                'name': '贵州省',
                'value|1188-8627': 1
              }, {
                'name': '河南省',
                'value|1188-8627': 1
              }, {
                'name': '新疆维吾尔自治区',
                'value|118-2627': 1
              }
            ]
          },
          'map2': {
            'qianru': [
              {
                'name': '宁夏回族自治区',
                'value|1188-4627': 1
              }, {
                'name': '黑龙江省',
                'value': 3205
              }
            ],
            "qianchu": [
              {
                'name': '江苏省',
                'value|1188-8627': 1
              }, {
                'name': '四川省',
                'value': 52205
              },{
                'name': '贵州省',
                'value|1188-8627': 1
              }, {
                'name': '河南省',
                'value|1188-8627': 1
              }, {
                'name': '新疆维吾尔自治区',
                'value|118-2627': 1
                
              }
            ]
          }
        }
    })
})