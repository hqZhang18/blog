define(function (require) {

    require('mock')
    /*
     * 总览页
    */

    // 民警任职（晋升）资格考试合格率
    require('./index/civilPoliceQualification')
    // 警种专业训练中心考试合格率
    require('./index/policeProfessionalTraining')
    // 评估
    require('./index/assessment')
    // 教官教材
    require('./index/instructorMaterials')
    // 中间培训总量
    require('./index/trainingTotal')
    // 中间星球(训练中心，分局)数据
    require('./index/allSubBureau')

})
