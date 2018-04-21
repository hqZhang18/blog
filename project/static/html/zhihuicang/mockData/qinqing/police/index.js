define(function (require) {

    require('mock')

    // 警力分类
    require('./policeStrength')
    // 警车类型
    require('./policeCar')
    // 警员年龄段分布
    require('./policeAge')
    // 各区县辖区公安单位数量统计
    require('./districtStatistics')
    
 
   

})
