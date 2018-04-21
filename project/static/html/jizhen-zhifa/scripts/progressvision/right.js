/**
 * @Author:      lee
 * @DateTime:    2017-05-23
 * @Description: 过程监督页面右半部分JS
 */
define(function(require) {

    var request = require('../util/request.js')
    var apiURL = require('../api.config.js')
    var util = require('../util/util.js')

    var centerDetailTpl = require('../../components/progressvision/prgvCenterModule.tpl')
    var center = require('./center')

    var moduleTotal = require('../../components/progressvision/moduleTotal.tpl');
    var moduleList = require('../../components/progressvision/moduleList.tpl');

    var progressVisionRight = {
 

        renderAlzModel:function(data) {
            var saveData = data
            var data = data.zffxmx
            var stateTarget = $(".state-value span");
            stateTarget.eq(0).find("em").html(data.processed);
            stateTarget.eq(1).find("em").html(data.pending);
            var gjTotal = parseInt(data.gjTotal, 10);
            var mxTotal = parseInt(data.mxTotal, 10);

            var maxTotal = (gjTotal > mxTotal) ? gjTotal : mxTotal;

            var gjTotalBar = Math.round((gjTotal / maxTotal) * 100);
            var mxTotalBar = Math.round((mxTotal / maxTotal) * 100);
            var min = 5
            if(mxTotalBar==0) {
                mxTotalBar = min
            }

            var moduleTotalData = [
                {
                    name:"模型总数",
                    barWidth:mxTotalBar,
                    total:mxTotal   
                },
                {
                    name:"告警总数",
                    barWidth:gjTotalBar,
                    total:gjTotal   
                },
            ];

            var moduleListData = [];
            var listData = data.group;

            listData.map(function(item,index) {
                moduleListData.push({
                    index:index + 1,
                    type:item.type,
                    name:item.name,
                    pending: item.pending,
                    total: item.total
                })
            })


            var moduleTotalHmlt = Handlebars.compile(moduleTotal);
            $(".module-total").html(moduleTotalHmlt(moduleTotalData));

            var moduleListHmlt = Handlebars.compile(moduleList);
            $(".module-list").html(moduleListHmlt(moduleListData.concat(moduleListData)));

            var temFlag = parseInt($('.center').children().attr('template'), 10)
            if(temFlag==1){
                $('#moduleList').find('li').eq(0).addClass('cur')
            }
            
           

             /**
             * 右侧执法分析模型点击事件
             * 点击后 依据对应的type 渲染 centerDetailTpl 模版
             */
            $(".module-list").off("click", "li").on("click", "li",function() {
                $(this).addClass('cur').siblings().removeClass('cur')
                var centerDetailHmlt = Handlebars.compile(centerDetailTpl);
                $(".center").html(centerDetailHmlt());
                //利用name属性进行传参--拼接在url后面
                var name = $(this).attr("data-name");
                $('#modelName').html('['+name+'] 统计图')
                // 获取开始时间
                var startTime = util.getChooseTime()[0]
                //获取结束时间
                var endTime = util.getChooseTime()[1]
                var url = apiURL.modelAnalysis2 + '/' + name + '/' + startTime + '/' + endTime
                var url = '../data/progressvision/mxfx.json'
                request.sendAjax(url,function(data) {
                  center.renderNumberCount(data.moduleCount);
                  center.renderCaseTop(saveData.caseNumTop10);
                  center.renderDepartmentTop(saveData.departmentNumTop10);
                })
            })
        }   
    }
    return progressVisionRight;
})