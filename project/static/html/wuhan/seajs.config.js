/**
 * @Author:      baizn
 * @DateTime:    2017-01-17 09:24:27
 * @Description: seajs配置文件
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */

seajs.config({
    paths: {
        //modules: 'sea-modules',
        app: '../scripts',
        common: '../../scripts/common',
        charts: '../../charts',
        data: '../../mockData'
    },
    alias: {
        // 发送请求
        request: 'common/request.js',

        // util文件
        util: 'common/util.js',

        //基本配置项
        baseConfig: 'common/base.config.js',

        //图表组件文件
        areaCharts: 'charts/areaCharts1',
        barCharts: 'charts/barCharts',
		pieCharts: 'charts/pieCharts',
		radarCharts: 'charts/radarCharts',
		planetCharts: 'charts/planet',
		lineAreaCharts: 'charts/lineAreaCharts',
        barCharts1: 'charts/barCharts1',
        meterBarCharts: 'charts/meterBarCharts',

        //mock数据
        mockData: 'data/index.js',
        
        //第三方库文件
        handlebars: 'handlebars.js',
        jquery: 'jquery.min.js',
        d3: 'd3.v3.min.js',
        echarts: 'echarts.js'
    }
})