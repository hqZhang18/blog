/**
 * @Author:      baizn
 * @DateTime:    2017-05-18 20:37:26
 * @Description: 可视化页面左半部分JS
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-05-14 20:37:26
 */
//           渲染center需要 参数：   swiperCode   和    window.caseId

// 自动轮播事件                    swiperOrder++          不变               需要判断选中选项 => 需要参数：各项总数和swiperOrder
// 点击li事件                      获取自身               不变               需要判断选中选项 => 需要参数：各项总数和swiperOrder
//搜索                            重置为0                重新赋值
define(function(require) {
    /**
     * 引入公用的文件
     */
    require('jquery')
    require('handlebars')
    var request = require('../util/request.js')
    var center = require('./center')
    var util = require('../util/util')
    var apiURL = require('../api.config.js')
    var constants = require('../util/constants')
    var associationTpl = require('../../components/analysis/association-list.tpl')
    var layerListTpl = require('../../components/analysis/layer-list.tpl')
    var swiperTimer = null
    var swiperDelay = 5000
    var swiperOrder = 0
    var swiperCode; //初始赋值为电信标识码第一个,以后是轮播切换改变和点击li事件改变
    //初始化四组数据个数都为0
    var telecomDataLen = 0;
    var networkDataLen = 0;
    var carDataLen = 0;
    var cardDataLen = 0;
    var count2 = 0;
    var count3 = 0;
    var count4 = 0;
    //计时Timer，监听15s
    var countTimer = null;
    var countTime = 0;
    var restartTime = 15;//鼠标移入，轮播停止，restartTime秒后重新启动

    //存放四组数据所有的code，有顺序要求
    var codeList = []; //[{code:'xxxx1',order:0},{code:'xxxx2',order:1}]

    //加载标识码模板
    var numberList = require('../../components/analysis/number-list.tpl')

    var AnalysisLeft = {

        /**
         * 模块
         * @param {string} container
         * @param {array} data
         * 
         * example：
         * 
         * [
         *  {
         *    "code": "13800138000",
              "date": "04.22",
              "time": "13:13"
         *   }
         *]
         */
        renderNumberLibrary: function(container, data) {
            var numberHTML = Handlebars.compile(numberList)
            $(container + ' ul').html('')
            $(container + ' ul').html(numberHTML(data))
        },

        /**
         * 渲染页面左半部分
         * 
         * @params {object} data
         * 
         * example：
         * 
         * {
         *  caseAcceptance: {},
         *  objTar: []
         * }
         */

        render: function(data) { //caseNum.json
            //按照案件搜索以后，所有渲染和swiper切换，从头开始，如果是按照标识码搜索就需要指定顺序
            if(!window.isSearchCode) {
                swiperOrder = 0
            }
            clearInterval(swiperTimer)//解决搜索以后，定时器叠加
            var self = this;
            //获取四组数据,初始赋值swiperCode为电信标识码第一个
            var telecomData = []
            var networkData = []
            var carData = []
            var cardData = []

            telecomData = data.allCode.telecomCode
            networkData = data.allCode.networkCode;
            carData = data.allCode.carCode;
            cardData = data.allCode.cardCode;

            //把四组数据备份一份
            var newTelecomData = [];
            var newNetworkData = [];
            var newCarData = [];
            var newCardData = [];

            newTelecomData = telecomData;
            newNetworkData = networkData;
            newCarData = carData;
            newCardData = cardData;

            //四组数据各自的个数
            telecomDataLen = 0;
            networkDataLen = 0;
            carDataLen = 0;
            cardDataLen = 0;

            telecomDataLen = data.allCode.telecomCode.length;
            networkDataLen = data.allCode.networkCode.length;
            carDataLen = data.allCode.carCode.length;
            cardDataLen = data.allCode.cardCode.length;

            //给四组数据都加上一个order属性，绑定在html标签的data-order属性上
            count2 = 0;
            count3 = 0;
            count4 = 0;

            count2 = telecomDataLen + networkDataLen;
            count3 = telecomDataLen + networkDataLen + carDataLen
            count4 = telecomDataLen + networkDataLen + carDataLen + cardDataLen

            codeList = [];
            telecomData.map(function(item, index) {
                self.confirmSwiperOrder(item.code,index,0)

                codeList.push({
                    code: item.code,
                    order: index
                })
                newTelecomData[index].order = index
            })
            networkData.map(function(item, index) {
                self.confirmSwiperOrder(item.code,index,telecomDataLen)
                codeList.push({
                    code: item.code,
                    order: index + telecomDataLen
                })
                newNetworkData[index].order = index + telecomDataLen
            })
            carData.map(function(item, index) {
                self.confirmSwiperOrder(item.code,index,count2)
                codeList.push({
                    code: item.code,
                    order: index + count2
                })
                newCarData[index].order = index + count2
            })
            cardData.map(function(item, index) {
                self.confirmSwiperOrder(item.code,index,count3)
                codeList.push({
                    code: item.code,
                    order: index + count3
                })
                newCardData[index].order = index + count3
            })
            if(codeList.length == 0) {
                return;
            }
            //将四组数据各自重复一份拿去渲染左边列表
            var dobTeleData = newTelecomData.concat(newTelecomData)
            var dobNetData = newNetworkData.concat(newNetworkData)
            var dobCarData = newCarData.concat(newCarData)
            var dobCardData = newCardData.concat(newCardData)
            
            //电信标识码
            this.renderNumberLibrary('.tele-number-library', dobTeleData)

            //网络标识码
            this.renderNumberLibrary('.internet-number-library', dobNetData)

            //车牌标识码
            this.renderNumberLibrary('.plate-number-library', dobCarData)

            //身份标识码
            this.renderNumberLibrary('.card-number-library', dobCardData)
            $("#telList").scrollTop(0)
            //左边渲染好了，进入轮播滚动和轮播请求渲染中心图表的数据
            this.swiperRenderCenter();
            //点击标识码
            $('.common-number-library').on('click', 'li', function(evt) {
                //业务层
                if($(this).hasClass('active')) {
                    return;
                }
                swiperOrder = $(this).attr('data-order')
                swiperCode = codeList[swiperOrder].code;
                window.numberOperation = swiperCode;
                //样式逻辑层
                var activeListOrder = $("li[data-order=" + swiperOrder + "]").eq(0).index();
                $(this).parent("ul").scrollTop(activeListOrder * 43)

                clearInterval(swiperTimer) //不清除定时器有误差
                self.swiperRenderCenter();
            })
            //鼠标移入停止轮播，15s未动继续轮播
            $(".page-left").mouseover(function() {
                //1.移入清除轮播，并开始15s计时
               // console.log("触发mouseover")
                clearInterval(countTimer)
                clearInterval(swiperTimer);
                countTimer = setInterval(function() {
                    countTime++;
                    //console.log("over计时"+countTime)
                },1000)
                //2.鼠标移动触发计时清零，并重新计时
                $(".page-left").mousemove(function() {
                    //console.log("触发move事件")
                    clearInterval(countTimer)
                    countTime = 0;
                    countTimer = setInterval(function() {
                        countTime++;
                        //console.log("move--inner"+countTime)
                        if(countTime == restartTime) { //restartTime 为设置的重新启动时间
                            //console.log(countTimer)
                            clearInterval(countTimer)
                            self.startSwiper()
                        }
                    },1000)
                });
            })
            //3.鼠标移出，清除计时定时器，重新启动轮播
            $(".page-left").mouseleave(function(event) { //不能用mouseout事件
                event.stopPropagation()
                //console.log("触发out")
                clearInterval(countTimer)
                countTime = 0
                self.startSwiper()
            });

            // 鼠标点击各类标识码显示全部
            var allCodeTpl = require('../../components/analysis/allCode.tpl')
            $('.common-number-library span:nth-child(2)').on('click', function(event) {
              var codeType = ['电信标识码', '网络标识码', '车牌标识码', '身份标识码']
              var name = $.trim($(this).html())
              var index = codeType.indexOf(name)
              var template = Handlebars.compile(allCodeTpl)
              var data = []
              switch(index) {
                case 0:
                  data = telecomData
                  break
                case 1:
                  data = networkData
                  break
                case 2:
                  data = carData
                  break
                case 3:
                  data = cardData
                  break
                default:
                  break  
              }
     
              var html = template({
                title: name,
                data: data
              })
               $('.all-code-box').html(html)
               // 处理空数据
               var noData = '<div class="no-data" style="display:block;">暂无数据</div>'
               if(data.length==0){
                $('.all-enforceLaw').html(noData)
               }
               // 关闭弹窗
              $('.close-model').on('click', function(event) {
                $('.all-code-box').html('')
              })
            })
        },
        //当按照标识码搜索的时候，根绝搜索的标识码确定swiperOrder
        confirmSwiperOrder:function(matchCode,index,count) {
            var codeStarte = matchCode.toString().substring(0,2)
            var targetCode;
            if(codeStarte == '86') {
                targetCode = matchCode.toString().substring(2)
            } else {
                targetCode = matchCode.toString()
            }
            if(window.isSearchCode && window.searchCode == targetCode) {
                swiperOrder = index + count
            }
        },
        swiperRenderCenter: function() {
            //先执行一次再添加动画执行队列，避免点击事件触发后有swiperDelay长的间隔空白
            this.toRenderCenter();
            this.startSwiper()
        },
        toRenderCenter: function() {
            window.numberOperation = codeList[swiperOrder].code;//用于中间页面顶部显示
            $(".common-number-library li").removeClass("active")
            $("li[data-order=" + swiperOrder + "]").eq(0).addClass('active');
            //根据swiperCode和window.caseId去渲染页面中心的图表
            swiperCode = codeList[swiperOrder].code;
            var url1 = apiURL.visuzlizedAnalysis3 + '/' + swiperCode;
            var url2 = apiURL.visuzlizedAnalysis2 + '/' + window.caseCode + '/' + swiperCode;
            var url1 = apiURL.visuzlizedAnalysis3; //本地测试
            var url2 = apiURL.visuzlizedAnalysis2; //本地测试
            var url2 = constants.SVG_IMG_PATH + '/data/analysis/hmzst.json'; //本地测试

            var urls = [url1, url2];
            this.loadCenterData(urls);
        },
        startSwiper:function() {
            var self = this;
            clearInterval(swiperTimer)
            swiperTimer = setInterval(function() {
                swiperOrder++;
                swiperOrder = (swiperOrder >= codeList.length) ? 0 : swiperOrder;
                //定时器中同时执行轮播渲染中心图表和向上滚动
                self.toRenderCenter()
                self.codeListScrollUp()
            }, swiperDelay)
        },
        codeListScrollUp: function() {
            this.scrollUp('telList', 43, 20)
            this.scrollUp('internetList', 43, 20)
            this.scrollUp('plateList', 43, 20)
            this.scrollUp('cardList', 43, 20)
        },
        scrollUp: function(id, iListHeight, speed) {
            if (swiperOrder == 0) {
                $("#telList").scrollTop(0)
                return; //不许再动了，不然选中样式和渲染的项对应不起来
            } else if (swiperOrder == telecomDataLen) {
                $("#internetList").scrollTop(0)
                return; //不许再动了，不然选中样式和渲染的项对应不起来
            } else if (swiperOrder == count2) {
                $("#plateList").scrollTop(0)
                return; //不许再动了，不然选中样式和渲染的项对应不起来
            } else if (swiperOrder == count3) {
                $("#cardList").scrollTop(0)
                return; //不许*/再动了，不然选中样式和渲染的项对应不起来
            }
            var target = document.getElementById(id);
            target.scrollTop++;
            setTimeout(function() {
                if (target.scrollTop % iListHeight == 0) {
                    return false;
                } else {
                    target.scrollTop++;
                    if (target.scrollTop >= target.scrollHeight / 2) {
                        target.scrollTop = 0;
                    }
                }
                setTimeout(arguments.callee, speed)
            }, speed)
        },
        //渲染页面中心的图表
        loadCenterData:function(url) {
            var self = this;
            //历程&触及模型&关联案件
            request.sendAjax(url[0], function(data) {
                //整合中间部分数据，并渲染图表
                center.renderNumberOperation(data.numOperationChart) //号码操作历程图
                center.renderModelCount(data.numModelCount) //号码触及模型统计
                self.renderAssociation(data.numRelationCase) //号码关联案件
            })
            //号码溯源图
            request.sendAjax(url[1], function(data) {
                self.numberSyt(data) //溯源图
            })
        },
        //号码关联案件
        renderAssociation: function(data) {
            var self = this;
            var associationRenderData = []; //存放所有数据
            var partRenderData = []; //只存放前两组数据
            data.map(function(item, index) {
                    var partArr = [] //过滤只展示六个
                    var name = item.name
                    associationRenderData.push({
                        id: item.id,
                        name: name,
                        value: item.value.join("、")
                    })
                    if (index == 0) {
                        item.value.map(function(list, order) {
                            if (order < 6) { //默认展示的第一组最大只展示六个具体的操作数据
                                partArr.push({
                                    "msg": list
                                })
                            }
                        })
                        partRenderData.push({
                            id: item.id,
                            name: name,
                            value: partArr
                        })
                    }
                    if (index == 1) {
                        item.value.map(function(list, order) {
                            if (order < 7) { //默认展示的第二组最大只展示七个具体的操作数据
                                partArr.push({
                                    "msg": list
                                })
                            }
                        })
                        if(name.length>18) {
                        name = name.substring(0, 18) + '...'
                    }
                        partRenderData.push({
                            id: item.id,
                            name: name,
                            value: partArr
                        })
                    }
                })

                //只渲染组装好的数据的前两组，其他数据在点击显示全部的时候再展示
            var associationHTML = Handlebars.compile(associationTpl)
            $("#associationCharts").html(associationHTML(partRenderData))
            if(partRenderData.length==0){
                $('#associationCharts .no-data').show()
            }
            //弹窗操作
            $(".number-association").on("click", ".operation-btn", function() {
                clearInterval(swiperTimer) //弹窗操作，禁止轮播
                $('#hmajModel').show()
                $(".association-layer").show();
                var layerListHTML = Handlebars.compile(layerListTpl)
                $("#layerList").html(layerListHTML(associationRenderData))
            })
            //关闭弹窗
            $(".association-layer").on("click", ".layer-close", function() {
                $('#hmajModel').hide()
                $(".association-layer").hide();
                self.startSwiper();
            })
        },
        //溯源图
        numberSyt: function(data) {
            var data = data.numOrigin;
            var self = this;
            //if(data.sourceNode) { //有才显示，免得老是提示我说undefind
                $(".number-traceability .number").html(data.sourceNode);
            //}
            var traceabilityCharts = echarts.init(document.getElementById('traceabilityCharts'));
            
            //后端数据data遵循原则：
            //1.curNode的关系图中心节点；
            //2.nodes数据是所有节点的集合
            //前端对数据处理有两个注意点：
            //1.由于初始只展示10条数据，避免出现前10条edges数据的节点未包含在前10条nodes里面；
            //2.要考虑关系图节点连线层次会出现3级及以上的连线关系
            //故对后端data做如下处理：
            //edges和nodes全从data的edges里面取，即抛弃对data中nodes的处理
            //Now,let's go

            var partNodes = [data.curNode]
            var partEdges = []
            var renderPartNodes = []

            var allNodes = [data.curNode]
            var allEdges = []
            var renderAllNodes = []

            data.edges.map(function(item,index) {
                //处理初始渲染的10条数据
                if(index < 10) {
                    if($.inArray(item.source,partNodes) == -1) {
                        partNodes.push(item.source)
                    }
                    if($.inArray(item.target,partNodes) == -1) {
                        partNodes.push(item.target)
                    }
                    partEdges.push({
                        source: item.source,
                        target: item.target,
                        lineStyle: {
                            normal: {
                                type: 'dashed',
                                curveness: 0.3,
                                width: 2,
                                color: '#158ddc',
                                shadowColor: '#1b82fe',
                                shadowBlur: 10
                            }
                        }
                    })
                }
                //处理全部数据
                if($.inArray(item.source,allNodes) == -1) {
                    allNodes.push(item.source)
                }
                if($.inArray(item.target,allNodes) == -1) {
                    allNodes.push(item.target)
                }
                allEdges.push({
                    source: item.source,
                    target: item.target,
                    lineStyle: {
                        normal: {
                            type: 'dashed',
                            curveness: 0.3,
                            width: 2,
                            color: '#158ddc',
                            shadowColor: '#1b82fe',
                            shadowBlur: 10
                        }
                    }
                })
            })
            partNodes.map(function(item,index) {
                if(index == 0) {
                    renderPartNodes.push({
                        name: item,
                        symbol: "image://" + constants.SVG_IMG_PATH + "/images/analysis/source.png",
                        symbolSize: [98, 98],
                        label: {
                            normal: {
                                position: 'left',
                                textStyle: {
                                    color: "#fed64b",
                                    fontSize: 24
                                }
                            }
                        }
                    })
                } else {
                    renderPartNodes.push({
                        name: item,
                        symbol: "image://" + constants.SVG_IMG_PATH + "/images/analysis/source-down.png",
                        symbolSize: [33, 33],
                        label: {
                            normal: {
                                position: 'right',
                                textStyle: {
                                    color: "#2984ee",
                                    fontSize: 22
                                }
                            }
                        }
                    })
                }
            })
            allNodes.map(function(item,index) {
                if(index == 0) {
                    renderAllNodes.push({
                        name: item,
                        symbol: "image://" + constants.SVG_IMG_PATH + "/images/analysis/source.png",
                        symbolSize: [98, 98],
                        label: {
                            normal: {
                                position: 'left',
                                textStyle: {
                                    color: "#fed64b",
                                    fontSize: 24
                                }
                            }
                        }
                    })
                } else {
                    renderAllNodes.push({
                        name: item,
                        symbol: "image://" + constants.SVG_IMG_PATH + "/images/analysis/source-down.png",
                        symbolSize: [33, 33],
                        label: {
                            normal: {
                                position: 'right',
                                textStyle: {
                                    color: "#2984ee",
                                    fontSize: 22
                                }
                            }
                        }
                    })
                }
            })
           //console.log(partNodes,allNodes)
            traceabilityCharts.setOption(self.getOption(partEdges,renderPartNodes))
            //详情操作
            $(".number-traceability").on("click", ".operation-btn", function() {
                clearInterval(swiperTimer) //弹窗操作，禁止轮播
                $('.traceability-layer').show();
                $('#sytModelBg').show()
                var traceabilityAllCharts = echarts.init(document.getElementById('traceabilityAllCharts'));
                traceabilityAllCharts.setOption(self.getOption(allEdges,renderAllNodes))
            })
            $(".traceability-layer").on("click", ".traceability-close", function() {
                $('.traceability-layer').hide();
                $('#sytModelBg').hide()
                self.startSwiper();
            })

            // 鼠标移到图上停止动画
            $('.number-traceability-charts').on('mouseover', function(event) {
              clearInterval(countTimer)
              clearInterval(swiperTimer);
            })

            $('.number-traceability-charts').on('mouseout', function(event) {
              event.stopPropagation()
              //console.log("触发out")
              clearInterval(countTimer)
              countTime = 0
              self.startSwiper()
            })
        },
        getOption:function(edges,nodes) {
            var option = {
                tooltip: {
                    show: false
                },
                animation: false,
                // silent: true,
                series: [{
                    type: 'graph',
                    layout: 'force',
                    roam: true,
                    draggable: true,    // 是否可以拖拽
                    hoverAnimation: false,
                    focusNodeAdjacency: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            textStyle: {
                                color: "#2984ee",
                                fontSize: 22
                            }
                        }
                    },
                    force: {
                        repulsion: 1000,
                        layoutAnimation: false //禁止动画，当节点大于100时，官方建议开启动画，不然会造成浏览器假死
                    },
                    nodes: nodes,
                    edges: edges
                }]
            };
            return option
        }
    }

    return AnalysisLeft
})