/*
* @Author: baizn
* @Date:   2017-05-20 13:35:16
* @Description: 接口API配置文件
 * @Last Modified by: zhanghongqiao@hiynn.com
 * @Last Modified time: 2018-04-21 11:44:17
*/

define(function(require){

    // true表示联调部署模式，false表示本地调试模式，
    var isOnline = false;
    // 本地调试地址、后端http接口地址、后端WebSocket地址
    var localApiHost = '/static/html/jizhen-zhifa/';
    var onlineApiHost = 'http://12.4.0.170:8081/jizhen-zhifa';
    
    var onlineWsHost= 'ws://12.4.0.170:8081/jizhen-zhifa';
    var timeWsHost = 'ws://12.4.3.220:8081/timewebsocket';
    
    var HOST = isOnline ? onlineApiHost : localApiHost;
    
    // 本地联调接口列表
    var localApi = {

        //常量图片路径配置统一使用地址
        apiHost: HOST,
        /**
         * 通用时间接口
         */
        // 获取当前日期的年季月周
        sourceControl1: HOST + '/data/sourceControl1.json',
	    sourceControl2: HOST + '/data/sourceControl2.json',
        //主页面
        mainURL: HOST + '/data/main/zl.json',
        mainWsURL: HOST + '/data/main/maincenter.json',
        mainURL2: HOST + '/data/main/main2.json',

        // 源头控制
        ytkzWsURL: onlineWsHost + '/data/sourceControl1.json',

        //模型分析
        modelAnalysis1: HOST + '/data/progressvision/right.json',
        modelAnalysis2: HOST + '/data/progressvision/center.json',

        //过程监督页面
        progressvision1: HOST + '/data/progressvision/center.json',
        progressvision2: HOST + '/data/progressvision.json',

        //事后监督
        postSupervision1: HOST + '/data/postSupervision/left.json',
        postSupervision2: HOST + '/data/postSupervision/left.json',
        zhifaWsURL: HOST + '/data/checkgress.json',

        //可视化分析
        analysisURL: HOST + '/data/analysis/analysis.json',
        analysisLeftURL: HOST + '/data/analysis/left.json',

        //可视化分析
        //案件关联标识码
        visuzlizedAnalysis0: HOST + '/data/analysis/search.json',
        visuzlizedAnalysis1: HOST + '/data/analysis/caseNum.json',
        visuzlizedAnalysis2: HOST + '/data/analysis/hmzst.json',
        visuzlizedAnalysis3: HOST + '/data/analysis/center.json',
        visuzlizedAnalysis4: HOST + '/data/analysis/right.json',
    };

    // 接口联调接口列表
    var onlineApi = {
        //常量图片路径配置统一使用地址
        apiHost: HOST,
        /**
         * 通用时间接口
         */
        // 获取当前日期的年季月周
        getTime:  timeWsHost + '/time',
        //主页面
        mainURL: HOST + '/zonglan',
		mainWsURL: onlineWsHost + '/zonglan',
        zhifaWsURL: onlineWsHost + '/zhifa',
        //源头控制
        ytkzWsURL: onlineWsHost + '/ytkz',

		//源头控制
		sourceControl1: HOST + '/yuantoukongzhi1',
		sourceControl2: HOST + '/yuantoukongzhi2',
        sourceControl3: HOST + '/yuantoukongzhi3',

        //模型分析
        modelAnalysis1: HOST + '/mxfx/top',
        modelAnalysis2: HOST + '/mxfx/bmgj',
        
        //过程监督
        progressvision1: HOST + '/guochengjiandu1',
        progressvision2: HOST + '/guochengjiandu2',

        //可视化分析模块接口
        //搜索案件(案件名)
        visuzlizedAnalysis0: HOST + '/kshfx/searchCase',
        //搜索案件(标识码)
        visuzlizedAnalysis5: HOST + '/kshfx/searchByCode',
        //案件关联标识码
        visuzlizedAnalysis1: HOST + '/kshfx/ajglbsm',
        //号码溯源
        visuzlizedAnalysis2: HOST + '/kshfx/hmzst',
        //历程&触及模型&关联案件
        visuzlizedAnalysis3: HOST + '/kshfx/ajglOther',
        //右边排行及总数
        visuzlizedAnalysis4: HOST + '/kshfx/top',
        // 用户权限
        userRights: HOST + '/login',

        //事后监督
        postSupervision1: HOST + '/shihoujiandu1',
        postSupervision2: HOST + '/shihoujiandu2'
       

    }

    return isOnline ? onlineApi : localApi
})