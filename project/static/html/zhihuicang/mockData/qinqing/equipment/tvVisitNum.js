/**
 * 设备视屏访问次数
 * time 2017-09-08
 * edit tanjun
 */
define(function(require){
	require('mock');
	var util = require('common/util');

	Mock.mock(util.urlReg('equipment/tvvisitnum'),{
		code: 1,
		msg: 'success',
		result: {
			tvvisitnum: {
				'total|10000-50000': 1,
				'detail|5': [
					{
						name: '@cname',
						'value|4-9': 8
					}
				]
			}
		}
	})
})