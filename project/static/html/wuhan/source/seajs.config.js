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
        common: '../../../scripts/common',
        charts: '../../../charts',
        data: '../../../mockData',
        sqData: '../../../mockData/sheqing',
        qqData: '../../../mockData/qinqing'
    },
    alias: {
        /**
         * request文件
         */
        request: 'common/request.js',
        /**
         * util文件
         */
        util: 'common/util.js',

        /**
         * 基本配置项
         */
        baseConfig: 'common/base.config.js',

        /**
         * 图表文件
         */
        // 涉疆图表
        popCatStaChart: 'charts/xinJiang/popCatStatistics.js',
        regPerDistributionChart: 'charts/xinJiang/regPerDistribution.js',
        // vehDistributionChart: 'charts/xinJiang/vehDistribution.js',
        junctionNameChart: 'charts/xinJiang/junctionName.js',
        perTypeRatioChart: 'charts/xinJiang/perTypeRatio.js',

        // 案件
        focusOnCases: 'charts/case/focusOnCases.js',
        // 住店人员所在地区
        gradientBar: 'charts/hotel/gradientBar.js',
        // 住店人数来源
        gradientBar2: 'charts/hotel/gradientBar2.js',
        // 人员类型饼图
        personTypePie: 'charts/personTypePie.js',
        // 进出方式
        enterOutWayPie: 'charts/enterOutWayPie.js',
        // 人员迁入原因TOP5
        barCharts1: 'charts/barCharts1.js',
        // 人员迁出地TOP5
        triangleCharts: 'charts/triangleCharts.js',
        popuMigration: 'charts/map/drawMap.js',
        iconBar: 'charts/iconBar.js',
        // 汽车品牌
        carBrandPie: 'charts/vehicle/carBrandPie.js',
        // 高速路口流量
        doubleArea: 'charts/vehicle/doubleArea.js',
        // 全市交通违规数
        lineCharts: 'charts/vehicle/lineCharts.js',
        cqMap: 'charts/popDistribute/map.js',

        /**
         * mock数据
         */
        vehicleData: 'sqData/vehicle/vehicle.js',

        personMockData: 'sqData/personFlow/index.js',
        hotelMockData: 'sqData/hotel/index.js',

        // 涉疆
        popCatStaData: 'sqData/xinJiang/popCatStatistics.js',
        regPerDistributionData: 'sqData/xinJiang/regPerDistribution.js',
        // vehDistributionData: 'sqData/xinJiang/vehDistribution.js',
        junctionNameData: 'sqData/xinJiang/junctionName.js',
        perTypeRatioData: 'sqData/xinJiang/perTypeRatio.js',

        // 案件
        caseNatureData: 'qqData/case/caseNature.js',
        focusOnCasesData: 'qqData/case/focusOnCases.js',
        caseNumberData: 'qqData/case/caseNumber.js',
        caseNumTendencyData: 'qqData/case/caseNumTendency.js',
        areaDistributionData: 'qqData/case/areaDistribution.js',

        popDistribute: 'sqData/popDistribute/popDistribute.js',

        // 中国地图
        popuMigrationData: 'sqData/popuMigration/index.js',

        /**
         * 第三方库文件
         */
        handlebars: 'handlebars.js',
        jquery: 'jquery.min.js',
        d3: 'd3.v3.min.js',
        echarts: 'echarts.js',
        topojson: 'topojson.js'
    }
})