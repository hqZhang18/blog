/**
 * @Author:      baizn
 * @DateTime:    2017-05-18 20:37:26
 * @Description: 右上角页面JS文件
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-05-14 20:37:26
 */

define(function(require) {

    /**
     * 引入公用的文件
     */
    require('echarts')
    var util = require('util')
    var constants = require('constants')
    var searchName = 'searchinit'
    var curPage = 0
    var pageSize = 0

    window.isSearchCode = false;

    /*
     * 引入依赖组件
     */
    var request = require('request')
    var apiURL = require('apiURL')
    var caseId = 0 //案件id

    /**
     * 引入业务组件
     */
    var left = require('./analysis/left')
    var center = require('./analysis/center')
    var right = require('./analysis/right')
        //选择时间
    var selectTime = require('./components/selectTime.js')
    // 时间控件(到日)
    var datePicker = require('datePicker')
    var self = this

    var Analysis = {
        /**
         *  @describe [左边]
         *  @param    {[type]}   url [description]
         *  @return   {[type]}   [description]
         */
        loadNumberData: function(url) {
            var self = this
            request.sendAjax(url, function(data) {
                left.render(data)
            })
        },

        /**
         *  @describe [加载右边top排行数据]
         *  @param    {[type]}   url [description]
         *  @return   {[type]}   [description]
         */
        loadRightData: function(url) {
            request.sendAjax(url, function(data) {
                var total = data.codeTotal
                $('#codeTotal').html(total)
                right.render(data)
            })
        },
        /**
         * 加载数据，渲染页面
         * 
         * @param {string} url 请求接口URL
         * 
         */
        loadCenterData: function(url) {
            //历程&触及模型&关联案件
            request.sendAjax(url[0], function(data) {
                //整合中间部分数据，并渲染图表
                var centerData = {
                    numOperationChart: data.numOperationChart,
                    numModelCount: data.numModelCount,
                    numRelationCase: data.numRelationCase
                }
                center.render(centerData)
            })

            //号码溯源图
            request.sendAjax(url[1], function(data) {
                center.numberSyt(data)
            })
        },


        /**
         *  @describe [渲染搜索]
         *  @param    {[type]}   url [description]
         *  @return   {[type]}   [description]
         */
        loadSearchData: function(url) {
            var self = this
            request.sendAjax(url, function(data) {
                var data = data.cases
                var html = ''
                if (data.length == 0) {
                    html = '<li data-caseid="none">无匹配结果</li>'
                } else {
                    data.forEach(function(item) {
                        html += '<li data-caseId = ' + item.caseId + ' data-caseCode='+item.caseCode +'> ' + item.caseName + ' </li>'
                    })
                }

                $('.search-lists').show().html(html)

            })
        },

        bindEvent: function() {
            var self = this
            //显示时间
            // util.showTime()

            //点击案件
            $('.search-lists').on('click', 'li', function(evt) {
                var caseName = $(this).html()
                if (caseName == '无匹配结果') {
                    return
                }
                window.caseId = $(this).attr('data-caseid')
                window.caseCode = $(this).attr('data-caseCode')
                $('.search-input').val(caseName)
                    //$('.search-input').attr('placeholder', caseName)
                var url = apiURL.visuzlizedAnalysis1 + '/' + window.caseId

                self.loadNumberData(url)
                $('.search-lists').hide()
            })

            //搜索框获取光标
            $('.search-input').on('focus', function(evt) {
                $(this).val('')
            })

            //离开隐藏
            $('.search-lists').hover(function() {
                $(this).show()
            }, function() {
                $('.search-lists').hide()
            })

            //点击查询按钮(只控制右边TOP5的数据)
            // util.queryBtn(function(res) {
            //     // 获取开始时间
            //     var startTime = res[0]
            //         //获取结束时间
            //     var endTime = res[1]
            //     var url = apiURL.visuzlizedAnalysis4 + '/' + startTime + '/' + endTime
           
            //     self.loadRightData(url)
            // })

            //点击查询的下拉选项
            $('#caseQuery').on('click', 'li', function(evt) {
                //搜索列表框隐藏
                $('.search-lists').hide()

                //获取一些值
                var index = $(this).index()
                var thisname = $(this).find('span').html()
                var name = ''
                    //type = 1案件名  2 为标识码
                if (thisname == '案件名称') {
                    name = '标识码'
                    $('#caseQuery').find('li').eq(0).attr('type', '1')
                    window.isSearchCode = false//按案件搜索
                } else {
                    name = '案件名称'
                    $('#caseQuery').find('li').eq(0).attr('type', '2')
                    $('.search-input').val('')
                    window.isSearchCode = true //按标识码搜索
                }

                switch (index) {
                    case 0:
                        $('#caseQuery').find('li').eq(1).show()
                        break;
                    case 1:
                        var html = $(this).html()
                        $('#caseQuery span').html(html)
                        $('#caseQuery').find('li').eq(1).find('span').html(name)
                        $('#caseQuery').find('li').eq(1).hide()

                        break;
                }
            })

            //离开隐藏
            $('#codeQuery').hover(function() {
                $(this).show()
            }, function() {
                $('#codeQuery').hide()
            })
        },

        /**
         *  @describe [搜索]
         *  @return   {[type]}   [description]
         */
        sendSearch: function() {
            var self = this
            $('.search-input').on('keypress', function(evt) {
                var flag = parseInt($('#caseQuery').find('li').eq(0).attr('type'), 10)
                if (flag == 1) {
                    sendRequest()
                }
            })
                //点击查询
            $('.search-btn').on('click', function(evt) {
                sendRequest()
                if(window.isSearchCode) {
                    window.searchCode = $('.search-input').val()
                } else {
                    window.searchCode = ""
                }
            })

            /**
             *  @describe [发送搜索的请求]
             *  @param    {[type]}   text [description]
             */
            function sendRequest() {
                var text = $('.search-input').val()
                var placeholder = $('.search-input').attr('placeholder')
                if (text == '') {
                    $('.search-input').attr('placeholder', '搜索内容不可为空')
                    return
                }
                var flag = parseInt($('#caseQuery').find('li').eq(0).attr('type'), 10)
                var curPage = 1
                var pageSize = 10
                var url = ''
                if (flag == 1) {
                    url = apiURL.visuzlizedAnalysis0 + '/' + text + '/' + curPage + '/' + pageSize
                } else {
                    //apiURL.visuzlizedAnalysis5
                    url = apiURL.visuzlizedAnalysis5 + '/' + text + '/' + curPage + '/' + pageSize
                }

                self.loadSearchData(url)
            }
        },

        /**
         *  @describe [初始化渲染]
         *  @param    {[type]}   startTime [开始时间]
         *  @param    {[type]}   endTime   [结束时间]
         */
        renderData: function(startTime, endTime) {
            var self = this
            var url0 = apiURL.visuzlizedAnalysis0 + '/' + searchName + '/' + curPage + '/' + pageSize
                //right 排行
            var url1 = apiURL.visuzlizedAnalysis4 + '/' + startTime + '/' + endTime
                //right 排行
                var url1 = apiURL.visuzlizedAnalysis4 
                var url0 = '../data/analysis/search.json'

            //首先拿到默认默认id
            request.sendAjax(url0, function(data) {
                // window.caseId = data[0].caseId
                // window.caseId = data[0].caseId
                // window.caseCode = data[0].caseCode
                //console.log(data)
                data = data.cases
                caseId = 'd9f99c0f-2c40-4c0e-a7c4-431d5c1fa429'
                var url = apiURL.visuzlizedAnalysis1 + '/' + caseId
                var caseName = data[0].caseName
                // var caseName = data[0].caseName

                $('.search-input').val(caseName)
                var url1 = apiURL.visuzlizedAnalysis1
                var url = apiURL.visuzlizedAnalysis1
                self.loadNumberData(url)
            })
            self.loadRightData(url1)
        },

        animation: function() {
            var t2 = 0
                //小圆转动
            setInterval(function() {
                t2++
                $('.charts-bg').css({
                    transform: 'rotate(' + 18 * t2 + 'deg)'
                })
                $('.radar-bg').css({
                    transform: 'rotate(' + 18 * t2 + 'deg)'
                })
                if (t2 == 20) {
                    t2 = 0
                }
            }, 350)
        },
        /**
         *  @describe 时间控件回调
         *  @param    {string}   startTime 开始时间
         *  @param    {string}   endTime   结束时间
         */
        datePicker: function(startTime, endTime) {
          var url = apiURL.visuzlizedAnalysis4 + '/' + startTime + '/' + endTime
          self.loadRightData(url)
        },

        init: function() {
          self = this

          /**
           * 当缩放页面后，进行相应的缩放
           */
          window.addEventListener('resize', function() {
              util.zoom(constants.PAGE_WIDTH, constants.PAGE_HEIGHT)
          })
          console.log(constants.PAGE_WIDTH, constants.PAGE_HEIGHT)
          util.zoom(constants.PAGE_WIDTH, constants.PAGE_HEIGHT)

          // 权限控制
          //var url = apiURL.userRights  
          //var url = '../data/user.json'
          //request.sendAjax(url, function(res) { 
            // 0无权限, 1开放权限
            //if(!res) {
            //  $('.user-right').show()
            //  return
            //}
            //$('.user-right').hide()
            /**
             *  以下是开放权限的内空
             */
            // 获取开始时间
            var startTime = selectTime.init()[0]
           //获取结束时间
            var endTime = selectTime.init()[1]

            self.renderData(startTime, endTime)

            self.bindEvent()

            self.sendSearch()

            self.animation()

            // 加载时间轴内容
            var datePickerTpl = require('../components/dialog/datePicker.tpl')
            $('.datePicker-container').html(datePickerTpl)
            // 调用时间轴并回调
            datePicker.initPicker('date', '.show-time', 'mouseover',  this.datePicker)


            // 页面容易死掉，3小时刷新一次
            setTimeout(function() {
                window.location.reload()
            },10800000)


          //})


            


        }
    }

    return Analysis
})