/**
 * 视频设备地区分布
 * time 2017-09-08
 * edit tanjun
 */
define(function(require){
	require('mock');
	var util = require('common/util');

	Mock.mock(util.urlReg('equipment/areaspread'),{
		code: 1,
		msg: 'success',
		result: {
			'areaspread|10': [
				{
					'name|+1': ['江北区','渝中区','南岸区','江津区','巴南区','沙坪坝区','忠县','万州区','渝北区','九龙坡区'],
					'value|100-600': 1
				}
			]
		}
	})
})