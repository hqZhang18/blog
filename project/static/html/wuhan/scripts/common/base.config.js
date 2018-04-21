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
    var onlineApiHost = isOnline ? 'http://192.168.43.251:8081/wuhang/'
        : 'http://cqHyCommonTestUrl.com/'

    // websokcet host
    var onlineWsHost = isOnline ? 'ws://192.168.43.251:8081/wuhang/'
        : 'http://cqHyCommonTestUrl.com/'

    return {
        PAGE_WIDTH: 1920,
        PAGE_HEIGHT: 1080,

        /*
         * 总览页接口
         */
        // 民警任职（晋升）资格考试合格率
        civilPoliceQualification: onlineApiHost + 'main/civilPoliceQualification',
        // 警种专业训练中心考试合格率接口
        policeProfessionalTraining: onlineApiHost + 'main/policeProfessionalTraining',
        // 评估接口
        assessment: onlineApiHost + 'main/assessment',
        // 教官教材
        instructorMaterials: onlineApiHost + 'main/instructorMaterials',
        // 培训总量
        trainingTotal: onlineApiHost + 'main/trainingTotal',
        // 中间星球(分局)
        allSubBureau: onlineApiHost + 'main/allSubBureau'
    }
})
