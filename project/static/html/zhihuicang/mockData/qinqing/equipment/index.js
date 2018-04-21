/**
 * 设备视频信息
 * @param  {[type]}
 * @return {[type]}                                                                                                          [description]
 */
define(function(require){
	/**
	 * 地区分布
	 */
	require('./areaSpread')
	/**
	 * 卡口接口
	 */
	require('./bayonet')
	/**
	 * 视频来源
	 */
	require('./tvSource')
	/**
	 * 视频访问量
	 */
	require('./tvVisitNum')
})