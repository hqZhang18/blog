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
    theAmazingPie: 'charts/pie.js', // 未使用
    // 涉疆图表
    popCatStaChart: 'charts/xinJiang/popCatStatistics.js',
    regPerDistributionChart: 'charts/xinJiang/regPerDistribution.js',
    junctionNameChart: 'charts/xinJiang/junctionName.js',
    perTypeRatioChart: 'charts/xinJiang/perTypeRatio.js',
    
    // 办案情况
    // 监所投放人员比例
    prisonPersonnelChart: 'charts/case/prisonPersonnel.js',
    // 在押人员户籍分布情况
    areaDistributionChart: 'charts/case/areaDistribution.js',
    //在押人员数量（同比/环比）
    detaineesNumberChart: 'charts/case/detaineesNumber.js',
    //案件数量趋势
    caseNumTendencyChart: 'charts/case/caseNumTendency.js',
    
    // 信息系统
    fillBarChart: 'charts/informationSystem/fillBar.js',
    
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
    // 各区县辖区公安单位数量统计
    triangleCharts2: 'charts/triangleCharts2.js',
    popuMigration: 'charts/map/drawMap.js',
    iconBar: 'charts/iconBar.js',
    // 汽车品牌
    carBrandPie: 'charts/vehicle/carBrandPie.js',
    // 高速路口流量
    doubleArea: 'charts/vehicle/doubleArea.js',
    // 全市交通违规数
    lineCharts: 'charts/vehicle/lineCharts.js',
    cqMap: 'charts/popDistribute/map.js',
    barCharts2: 'charts/barCharts2.js',
    //设备视频信息
    gradientAcross: 'charts/equipment/gradientAcross.js',
    gradientVertical: 'charts/equipment/gradientVertical.js',
    splitPie: 'charts/equipment/splitPie.js',
    
    /**
     * mock数据
     */
    vehicleData: 'sqData/vehicle/vehicle.js',
    
    personMockData: 'sqData/personFlow/index.js',
    hotelMockData: 'sqData/hotel/index.js',
    
    // 涉疆页面
    xinJiangData: 'sqData/xinJiang/xinJiang.js',
    
    // 办案情况
    caseData: 'qqData/case/case.js',
    
    // 信息系统
    polCloDataCollection: 'qqData/informationSystem/polCloDataCollection.js',
    views: 'qqData/informationSystem/views.js',
    
    popDistribute: 'sqData/popDistribute/popDistribute.js',
    
    // 中国地图
    popuMigrationData: 'sqData/popuMigration/index.js',
    
    // 警力相关
    policeMockData: 'qqData/police/index.js',
    
    // 服务类
    serverMockData: 'qqData/server/index.js',
    
    // 警力分布情况
    policeDistribution: 'qqData/policeDistribution/index.js',
    // 设备
    equipMockData: 'qqData/equipment/index.js',
    
    
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