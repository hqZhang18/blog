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
    var onlineApiHost = isOnline ? 'http://192.168.43.251:8081/command-cabin/'
        : 'http://cqHyCommonTestUrl.com/'

    // websokcet host
    var onlineWsHost = isOnline ? 'ws://192.168.43.251:8081/command-cabin/'
        : 'ws://cqHyCommonTestUrl.com/'

    // 社情主题    
    var sq = 'sheqing/'

    return {
        PAGE_WIDTH: 3456,
        PAGE_HEIGHT: 1944,
        TIME: 2, // 初始化时间参数

        // 人员流动-总数统计
        totalStatistics: onlineApiHost + sq + 'personFlow/totalStatistics/',

        // 人员流动-进出方式
        enterOutWay: onlineApiHost + sq + 'personFlow/enterOutWay/',

        // 人员流动-各类TOP5
        personTop5: onlineApiHost + sq + 'personFlow/personTop5/',

        // 人员迁徙-地图
        popuMigration: onlineApiHost + sq + 'popuMigration/map/',

        //地区人口分布
        popDistribute: onlineApiHost + sq + 'popDistribute/',

        // 旅店和网吧人员
        hotelCount: onlineApiHost + sq + 'cabin/hotel/',

        // 全市交通违规数（同比/环比）
        trafficViolation: onlineApiHost + sq + 'cabin/trafficViolation/',

        /**
         * 涉疆页面
         */
        // 人群类别统计
        popCatStatistics: onlineApiHost + sq + 'xinJiang/popCatStatistics/',
        // 涉疆人员类型比例
        perTypeRatio: onlineApiHost + sq + 'xinJiang/perTypeRatio/',
        // 涉疆人员车辆车牌分布
        // vehDistribution: onlineApiHost + sq + 'xinJiang/vehDistribution/',
        //涉疆车辆经过次数最多的路口名称
        junctionName: onlineApiHost + sq + 'xinJiang/junctionName/',
        //涉疆人员数量地区分布情况
        regPerDistribution: onlineApiHost + sq + 'xinJiang/regPerDistribution/',

        /**
         * 案件页面
         */
        //案件性质总览
        caseNature: onlineApiHost + 'qinqing/case/caseNature',
        //重点关注案件数量
        focusOnCases: onlineApiHost + 'qinqing/case/focusOnCases',
        //案件数量（同比/环比）
        caseNumber: onlineApiHost + 'qinqing/case/caseNumber',
        //案件数量趋势
        caseNumTendency: onlineApiHost + 'qinqing/case/caseNumTendency',
        //案件地图分布情况
        areaDistribution: onlineApiHost + 'qinqing/case/areaDistribution',

        /**
         * 车辆情况页面
         */
        countNum:onlineApiHost + sq + 'cabin/countNum/',
        driverData:onlineApiHost + sq + 'cabin/driverData/',
        highSpeed:onlineApiHost + sq + 'cabin/highSpeed/',

        /**
         * 车船-汽车品牌分布
          */
        carBrand: onlineApiHost + sq + 'cabin/carBrand/',

        /**
         * 获取服务器时间
         */
        timewebsocket: onlineWsHost + sq + 'timewebsocket/time'
    }

})
