/**
 * @Author:      baizn
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 公用常量
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */

define(function (require) {
    var isOnline = false
    // http host
    var onlineApiHost = isOnline ? 'http://10.154.13.116:18080/zhihuicang/'
        : 'http://cqHyCommonTestUrl.com/'

    // websokcet host
    var onlineWsHost = isOnline ? 'ws://10.154.13.116:18080/'
        : 'ws://cqHyCommonTestUrl.com/'

    // 社情主题    
    var sq = 'sheqing/'
    // 勤情主题
    var qq = 'qinqing/'

    return {
        PAGE_WIDTH: 3456,
        PAGE_HEIGHT: 1944,
        TIME: 2, // 初始化时间参数
        //常量图片路径配置统一使用地址
        setTime: 300000, // 定时请求
        apiHost: onlineApiHost,

        // 人员流动-总数统计
        totalStatistics: onlineApiHost + sq + 'personFlow/totalStatistics/',

        // 人员流动-进出方式
        enterOutWay: onlineApiHost + sq + 'personFlow/enterOutWay/',

        // 人员流动-各类TOP5
        personTop5: onlineApiHost + sq + 'personFlow/personTop5/',

        // 人员迁徙-地图
        popuMigration: onlineApiHost + sq + 'popuMigration/',

        //地区人口分布
        popDistribute: onlineApiHost + sq + 'personArea/',

        // 旅店和网吧人员
        hotelCount: onlineApiHost + sq + 'cabin/hotel/',


        /**
         * 涉疆页面
         */
        // 人群类别统计
        popCatStatistics: onlineApiHost + sq + 'xinJiang/popCatStatistics/',
        // 涉疆人员类型比例
        perTypeRatio: onlineApiHost + sq + 'xinJiang/perTypeRatio/',
        //涉疆车辆经过次数最多的路口名称
        junctionName: onlineApiHost + sq + 'xinJiang/junctionName/',
        //涉疆人员数量地区分布情况
        regPerDistribution: onlineApiHost + sq + 'xinJiang/regPerDistribution/',


        /**
         * 信息系统页面
         */
        // 警务云数据资源采集量、渝警飞度访问量和警综平台访问量共3个模块
        polCloDataCollection: onlineApiHost + 'qinqing/informationSystem/polCloDataCollection/',
        //资源采集量、渝警飞度搜索量和警综待办量共3个模块
        views: onlineApiHost + 'qinqing/informationSystem/views/',

        /**
         * 车辆情况页面
         */
        total: onlineApiHost + sq + 'cabin/total/',
        // 车船-高速路口流量
        highSpeed: onlineApiHost + sq + 'cabin/highSpeed/',
        // 车船-驾驶人交通违规数
        trafficViolation: onlineApiHost + sq + 'cabin/trafficViolation/',
        // 全市交通违规数（同比/环比）
        trafficAttribute: onlineApiHost + sq + 'cabin/trafficAttribute/',

        /**
         * 车船-汽车品牌分布
         */
        carBrand: onlineApiHost + sq + 'cabin/carBrand/',

        /**
         *  勤情主题模块
         */
        
        /**
         * 办案情况页面
         */
        // 人数总览
        offendersNumber: onlineApiHost + qq + 'case/offendersNumber/',
        // 监所投放人员比例
        prisonPersonnel: onlineApiHost + qq + 'case/prisonPersonnel/',
        // 在押人员户籍分布情况
        areaDistribution: onlineApiHost + qq + 'case/areaDistribution/',
        // 在押人员数量（同比/环比）
        detaineesNumber: onlineApiHost + qq + 'case/detaineesNumber/',
        // 案件数量趋势
        caseNumTendency: onlineApiHost + qq + 'case/caseNumTendency/',

        // -----------公安类
        // 警力分类
        policeStrength: onlineApiHost + qq + 'police/policeStrength/',
        // 警车类型
        policeCar: onlineApiHost + qq + 'police/policeCar/',
        // 警员年龄段分布
        policeAge: onlineApiHost + qq + 'police/policeAge/',
        // 各区县辖区公安单位数量统计
        districtStatistics: onlineApiHost + qq + 'police/districtStatistics/',

        // -----------服务类
        // 服务数量（同比/环比）
        serverNumber: onlineApiHost + qq + 'server/serverNumber/',
        // 服务数量地区分布情况
        regionDistribution: onlineApiHost + qq + 'server/regionDistribution/',
        // 各类办理数及各类通行证办理数
        statistics: onlineApiHost + qq + 'server/totalStatistics/',

        // 警力分布情况
        policeDistribution: onlineApiHost + qq + 'policeDistribution/',

        /**
         * 设备视频情况页面
         */
        //卡口数量
        bayonet: onlineApiHost + qq + 'equipment/bayonet/',
        //地区分布
        areaSpread: onlineApiHost + qq + 'equipment/areaspread/',
        //视频来源
        tvSource: onlineApiHost + qq + 'equipment/tvsource/',
        //访问量
        tvVisitNum: onlineApiHost + qq + 'equipment/tvvisitnum/',
        

        /**
         * 获取服务器时间
         */
        timewebsocket: onlineWsHost + 'timewebsocket/time'
    }

})
