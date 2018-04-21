define(function (require) {

    require('mock')

    // 各类办理数及各类通行证办理数
    require('./totalStatistics')

    // 服务数量（同比/环比）
    require('./serverNumber')
    // 服务数量地区分布情况
    require('./regionDistribution')
})
