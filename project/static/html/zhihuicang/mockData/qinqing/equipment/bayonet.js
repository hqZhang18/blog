/**
 * 设备卡口总数
 * time 2017-09-08
 * edit tanjun
 */
define(function(require){
	require('mock');
	var util = require('common/util');

	Mock.mock(util.urlReg('equipment/bayonet'),{
		code: 1,
		msg: 'success',
		result: {
			'bayonet|2': [
				{
					'name|+1': ['卡口总数','视频总数'],
					'value|100000-500000': 334658
				}
			]
		}
	})
})