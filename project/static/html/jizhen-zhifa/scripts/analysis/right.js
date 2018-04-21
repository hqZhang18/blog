/**
 * @Author:      baizn
 * @DateTime:    2017-05-18 20:37:26
 * @Description: 可视化页面右边部分功能JS文件
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-05-14 20:37:26
 */

define(function(require) {
    /*
     * 引入依赖组件
     */
    var splitBar = require('../components/splitBar.js')
    var triangleBar = require('../components/triangleBar2.js')
    var specificChange = require('../components/caseTotal.js')
    
    var objChangeCfg = {
        width: 508,
        height: 219,
        itemStyle: {
            fillId: 'cxxcFill2'
        }
    }
    //分析TOP5的配置项和对象变更一样，因此省略
      var specialChangeCfg = {
         width: 508,
         height: 219,
         yAxis: {
          show: false
        },
        
        itemStyle: {
          margin: {
            left:0,
            right:40
          },
          //fillId: 'cxxcFill'
        },
        leftText: {
          color: '#7ed2ff',
          left: 0,
          textAnchor: 'start',
        },
        rightText: {
          right: 80
        },
        grid: {  //文字离左右两边的距离
          x: 140,
          x2: 60
        },
        tooltip: {
          show: true
        }
      }
    var rightTimerDelay = 5000;//右边图表轮播时间间隔
    var timer = null;
    //计时Timer，监听15s
    var countTimer = null;
    var countTime = 0;
    var restartTime = 15;//鼠标移入，轮播停止，restartTime秒后重新启动

    var renderOrder = 0;

    var AnalysisRight = {
        //显示切换 
        renderChange:function() {
            var changeInfo = [
                {
                    container:'.object-change',
                    title:'对象变更TOP5'
                },
                {
                    container:'.object-change',
                    title:'对象变更TOP5'
                },
                {
                    container:'.object-change',
                    title:'目标变更TOP5'
                },
                {
                    container:'.object-change',
                    title:'目标变更TOP5'
                },
                {
                    container:'.object-change',
                    title:'延长对象TOP5'
                },
                {
                    container:'.object-change',
                    title:'延长对象TOP5'
                },
                {
                    container:'.specific-change',
                    title:'特定对象TOP5'
                },
                {
                    container:'.specific-change',
                    title:'特定对象TOP5'
                },
                {
                    container:'.specific-change',
                    title:'查询协查TOP5'
                },
                {
                    container:'.specific-change',
                    title:'查询协查TOP5'
                },
                {
                    container:'.analysis-change',
                    title:'分析设计TOP5'
                },
                {
                    container:'.analysis-change',
                    title:'分析设计TOP5'
                }
            ]
            var container = changeInfo[renderOrder].container
            var title = changeInfo[renderOrder].title

            if(renderOrder % 2  == 0) {//案件
                $(container).find(".name").html(title).siblings('.case-btn').addClass('active').siblings('.dept-btn').removeClass('active')
            } else {//部门
                $(container).find(".name").html(title).siblings('.case-btn').removeClass('active').siblings('.dept-btn').addClass('active')
            }
            $(".object-change-chart").eq(renderOrder).show().siblings('.object-change-chart').hide()
        },
        //轮播切换
        swiperChange: function() {
            var self = this;
            self.renderChange();
            clearInterval(timer);
            timer = setInterval(function() {
                renderOrder++;
                renderOrder = (renderOrder > 11) ? 0 : renderOrder;
                self.renderChange();
            }, rightTimerDelay)

            //鼠标移入停止轮播，15s未动继续轮播
            $(".page-right").mouseover(function() {
                //1.移入清除轮播，并开始15s计时
                //console.log("触发mouseover")
                clearInterval(countTimer)
                clearInterval(timer);
                countTimer = setInterval(function() {
                    countTime++;
                    //console.log("over计时"+countTime)
                },1000)
                //2.鼠标移动触发计时清零，并重新计时
                $(document).mousemove(function() {
                    //console.log("触发move事件")
                    clearInterval(countTimer)
                    countTime = 0;
                    countTimer = setInterval(function() {
                        countTime++;
                        //console.log("move--inner"+countTime)
                        if(countTime == restartTime) { //restartTime 为设置的重新启动时间
                           // console.log(countTimer)
                            clearInterval(countTimer)
                            clearInterval(timer)
                            timer = setInterval(function() {
                                renderOrder++;
                                renderOrder = (renderOrder > 11) ? 0 : renderOrder;
                                self.renderChange();;
                            }, rightTimerDelay)
                        }
                    },1000)
                });
            })
            //3.鼠标移出，清除计时定时器，重新启动轮播
            $(".page-right").mouseleave(function() {
                //console.log("触发out")
                clearInterval(countTimer)
                clearInterval(timer)
                countTime = 0
                timer = setInterval(function() {
                    renderOrder++;
                    renderOrder = (renderOrder > 11) ? 0 : renderOrder;
                    self.renderChange();;
                }, rightTimerDelay)
            });
        },
        bindEvent: function(data) {
            var self = this;
            //下拉列表展示
            $(".module-title .btn-icon").off('click').on("click", function(event) {
                event.stopPropagation()
                event.preventDefault()
                $(this).siblings(".drop-down").slideToggle();
            })
            $("body").on("click", function(event) {
                //event.stopPropagation();
                $(".drop-down").slideUp();
            })
            $('.drop-down li').on("click", function(event) {
                event.stopPropagation()
                clearInterval(timer)
                var num = $(this).attr("data-order");
                $(this).parent(".drop-down").slideUp().parent(".module-title").attr("data-type", num)
                renderOrder = (2 * num - 1 == 1) ? 0 : 2 * num - 1;
                self.swiperChange();
            })
            $(".render-btn").on("click", function() {
                clearInterval(timer)
                $(this).addClass("active").siblings(".render-btn").removeClass("active");
                //匹配关系
                //parentType:     1   2    3   4   5    6
                //changeType:0 => 0   2    4   6   8    10
                //changeType:1 => 1   3    5   7   9    11
                var parentType = $(this).parent(".module-title").attr("data-type");
                var changeType = $(this).attr("data-order");
                if (changeType == 0) {
                    renderOrder = parentType * 2 - 2;
                } else { // == 1
                    renderOrder = parentType * 2 - 1;
                }
                self.swiperChange();
            })

            var caseName = ['对象变更TOP5', '目标变更TOP5',  '延长对象TOP5',  '特定对象TOP5',  '查询协查TOP5', '分析设计TOP5']
            $('.page-right .module-title').on('click', '.name', function(event) {
                var name = $.trim($(this).html())
                console.log(name)
                var index = caseName.indexOf(name)
                var saveData = []
                var title = ''
                switch(index) {
                  case 0:
                    saveData = data.objectChange
                    title = '对象变更'
                    break
                  case 1:
                    saveData = data.targetChange
                    title = '目标变更'
                    break
                  case 2:
                    saveData = data.yanchang
                    title = '延长对象'
                    break
                  case 3:
                    saveData = data.special
                    title = '特定对象'
                    break
                  case 4:
                    saveData = data.xiecha
                    title = '查询协查'
                    break
                  case 5:
                    saveData = data.fenxi
                    title = '分析设计'
                    break 
                }
                console.log(saveData)
                var tpl = require('../../components/analysis/topAll.tpl')
                var template = Handlebars.compile(tpl)
                var html = template({
                    title: title,
                    case: saveData.case,
                    department: saveData.department
                })
                $('.all-top5-box').html(html)
            })
            // 点击部门/案件切换
            $(document).on('click', '.two-type span', function(event) {
               $(this).addClass('cur').siblings().removeClass('cur')
              var index = $(this).index()
              if(!index){
                $('.all-department').show()
                $('.all-case').hide()
              } else {
                
                $('.all-case').show()
                $('.all-department').hide()
              }
            })
          // 点击关闭  
          $(document).on('click', '.close-model', function(event) {
            $('.all-top5-box').html('')
          })
        },

        /**
         * 渲染页面右半部分
         * 
         * @param {object} data
         * 
         * example:
         * 
         * {
         *    artificialControl: {},
         *    identifierLibrary: [],
         *    caseQuery: {}
         *  }
         */
        render: function(data) {
            //console.log(data)
            var dataArr = [];
            var objectChangeCase = data.objectChange.case;
            var objectChangeDep = data.objectChange.department;
            var targetChangeCase = data.targetChange.case;
            var targetChangeDep = data.targetChange.department;
            var yanchangCase = data.yanchang.case;
            var yanchangDep = data.yanchang.department;
            var specialCase = data.special.case;
            var specialDep = data.special.department;
            var xiechaCase = data.xiecha.case;
            var xiechaDep = data.xiecha.department;
            var fenxiCase = data.fenxi.case;
            var fenxiDep = data.fenxi.department;
         
            dataArr = [
                {
                    listData:objectChangeCase.slice(0, 5)
                },
                {
                    listData:objectChangeDep.slice(0, 5)
                },
                {
                    listData:targetChangeCase.slice(0, 5),
                    config:objChangeCfg
                },
                {
                    listData:targetChangeDep.slice(0, 5)
                },
                {
                    listData:yanchangCase.slice(0, 5)
                },
                {
                    listData:yanchangDep.slice(0, 5)
                },
                {
                    listData:specialCase.slice(0, 5)
                },
                {
                    listData:specialDep.slice(0, 5)
                },
                {
                    listData:xiechaCase.slice(0, 5)
                },
                {
                    listData:xiechaDep.slice(0, 5)
                },
                {
                    listData:fenxiCase.slice(0, 5)
                },
                {
                    listData:fenxiDep.slice(0, 5)
                }
            ]
            //console.log(dataArr)
            dataArr.map(function(item,index) {
                var target = document.querySelectorAll('.object-change-chart')[index]
                if(index >=0 && index < 6) {
                    triangleBar.drawCharts(target, item.listData, objChangeCfg)
                } else if(index >=6 && index < 10) {
                    specialChangeCfg.itemStyle.fillId = 'analysis' + index
                    specificChange.drawCharts(target, item.listData, specialChangeCfg)
                }else {
                    splitBar.drawSplitBar(target, item.listData, objChangeCfg)
                }
            })
            this.swiperChange();

            this.bindEvent(data)
        }
    }

    return AnalysisRight
})

