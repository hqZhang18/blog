/**
 * @Author:      Eric Ouyang
 * @DateTime:    2017-06-01 19:52
 * @Description: 时间控件
 * @Last Modified By:   Eric Ouyang
 * @Last Modified Time:    2017-06-01 19:52
 */
define(function(require) {
    var focusDom;
    /**
     * 构造日历的li元素集，粒度到天
     */
    function createCalender() {
        var oneDay = 1000 * 24 * 60 * 60
        var currDate = Date.prototype.currDate
        var minDate = Date.prototype.minDate
        var maxDate = Date.prototype.maxDate

        //获取当月第一天
        var currMonthFirstDay = new Date(currDate)
        currMonthFirstDay.setDate(1)

        //获取当月最后一天
        var currMonthLastDay = new Date(currDate)
        var currMonth = currMonthLastDay.getMonth()
        var nextMonth = ++currMonth
        var nextMonthFirstDay = new Date(currMonthLastDay.getFullYear(), nextMonth, 1)
        currMonthLastDay = new Date(nextMonthFirstDay - oneDay)

        //获取第一天和最后一天对应星期几
        var currMonthFirstDayWeekday = currMonthFirstDay.getDay()
        var currMonthLastDayWeekday = currMonthLastDay.getDay()

        //当前日历表的第一天和最后一天
        var firstDay = currMonthFirstDay.getTime() - currMonthFirstDayWeekday * oneDay
        var lastDay = currMonthLastDay.getTime() + (7 - currMonthLastDayWeekday) * oneDay

        //构造html结构
        var allDays = (lastDay - firstDay) / oneDay
        var dateHTML = '<div class="date-select">'
        dateHTML += '       <div class="select-year">'
        dateHTML += '            <div class="value"></div>'
        dateHTML += '            <div class="prev"></div>'
        dateHTML += '            <div class="next"></div>'
        dateHTML += '        </div>'
        dateHTML += '        <div class="select-month">'
        dateHTML += '            <div class="value"></div>'
        dateHTML += '            <div class="prev"></div>'
        dateHTML += '            <div class="next"></div>'
        dateHTML += '        </div>'
        dateHTML += '   </div>'
        dateHTML += '   <ul class="date-picker">'
        dateHTML += '       <li class="date-day">日</li>'
        dateHTML += '       <li class="date-day">一</li>'
        dateHTML += '       <li class="date-day">二</li>'
        dateHTML += '       <li class="date-day">三</li>'
        dateHTML += '       <li class="date-day">四</li>'
        dateHTML += '       <li class="date-day">五</li>'
        dateHTML += '       <li class="date-day">六</li>'
        for (i = 0; i < allDays; i++) {
            if (i % 7 == 0) {
                dateHTML += '<br>'
            }
            var date = firstDay + i * oneDay
            var day = new Date(date).getDate()
            if (date < currMonthFirstDay.getTime() || date >= nextMonthFirstDay.getTime() || (minDate && date < new Date(minDate).getTime()) || (maxDate && date > new Date(maxDate).getTime())) {
                dateHTML += '<li class="unusable-date">' + day + '</li>'
            } else {
                dateHTML += '<li class="usable-date ' + (date == new Date(currDate).getTime() ? 'currDay' : '') + '">' + day + '</li>'
            }

        }
        dateHTML += '</ul>'
        $('.date-container').empty().append(dateHTML)
        $('.date-container .select-year').find('.value').text(new Date(currDate).getFullYear() + '年')
        $('.date-container .select-month').find('.value').text((new Date(currDate).getMonth() + 1) + '月')
        $('.date-picker').off().on('mouseover', 'li.usable-date', function(e) {
            $(this).css({ 'background': '#82b7ff', 'color': '#0a1546' })
            $(this).siblings('li.usable-date').not('.currDay').css({ 'background': '#0a1546', 'color': '#82b7ff' })
        })
        $('.date-picker').on('mouseout', 'li.usable-date', function(e) {
            $('.date-picker').find('li.usable-date').not('.currDay').css({ 'background': '#0a1546', 'color': '#82b7ff' })
        })
        $('.date-picker').on('click', 'li.usable-date', function(e) {
            $(this).addClass('currDay')
            $(this).siblings('li.usable-date').removeClass('currDay')
            $(this).siblings('li.usable-date').css({ 'background': '#0a1546', 'color': '#82b7ff' })
            var day = $(this).text()
            day = parseInt(day) < 10 ? '0' + day : day
            var year_month = Date.prototype.currDate.substring(0, Date.prototype.currDate.lastIndexOf('-') + 1)
            focusDom.val(year_month + day)
            $('.date-container').hide()
        })
        bindDateClick()
    }
    /**
     * 绑定前进、后退等点击事件，粒度到天
     */
    function bindDateClick() {
        $('.date-container .select-year .prev').off().on('click', function(e) {
            var currDate = Date.prototype.currDate
            var newTime = new Date(currDate)
            newTime.setFullYear(new Date(currDate).getFullYear() - 1)
            var newYear = newTime.getFullYear()
            var newMonth = newTime.getMonth() + 1
            var newDay = newTime.getDate()
            newMonth = parseInt(newMonth) < 10 ? '0' + newMonth : newMonth
            newDay = parseInt(newDay) < 10 ? '0' + newDay : newDay
            Date.prototype.currDate = newYear + '-' + newMonth + '-' + newDay
            createCalender()
        })
        $('.date-container .select-year .next').off().on('click', function(e) {
            var currDate = Date.prototype.currDate
            var newTime = new Date(currDate)
            newTime.setFullYear(new Date(currDate).getFullYear() + 1)
            var newYear = newTime.getFullYear()
            var newMonth = newTime.getMonth() + 1
            var newDay = newTime.getDate()
            newMonth = parseInt(newMonth) < 10 ? '0' + newMonth : newMonth
            newDay = parseInt(newDay) < 10 ? '0' + newDay : newDay
            Date.prototype.currDate = newYear + '-' + newMonth + '-' + newDay
            createCalender()
        })
        $('.date-container .select-month .prev').off().on('click', function(e) {
            var currDate = Date.prototype.currDate
            var newTime = new Date(currDate)
            newTime.setMonth(new Date(currDate).getMonth() - 1)
            var newYear = newTime.getFullYear()
            var newMonth = newTime.getMonth() + 1
            var newDay = newTime.getDate()
            newMonth = parseInt(newMonth) < 10 ? '0' + newMonth : newMonth
            newDay = parseInt(newDay) < 10 ? '0' + newDay : newDay
            Date.prototype.currDate = newYear + '-' + newMonth + '-' + newDay
            createCalender()
        })
        $('.date-container .select-month .next').off().on('click', function(e) {
            var currDate = Date.prototype.currDate
            var newTime = new Date(currDate)
            newTime.setMonth(new Date(currDate).getMonth() + 1)
            var newYear = newTime.getFullYear()
            var newMonth = newTime.getMonth() + 1
            var newDay = newTime.getDate()
            newMonth = parseInt(newMonth) < 10 ? '0' + newMonth : newMonth
            newDay = parseInt(newDay) < 10 ? '0' + newDay : newDay
            Date.prototype.currDate = newYear + '-' + newMonth + '-' + newDay
            createCalender()
        })
    }
    /**
     * 初始化时间控件，粒度到天
     * @param {string} date 初始化传入的日期
     * @param {object} targetDom 当选中日历表中某天的时候需要更改的input对象
     * @param {string} min_date 日历选择器可选的最小日期
     */
    function datePicker(date, targetDom, min_date, max_date) {
        focusDom = targetDom
        Date.prototype.currDate = date
        Date.prototype.minDate = min_date
        Date.prototype.maxDate = max_date
        createCalender()
    }

    /**
     * 构造日历的li元素集，粒度到月
     */
    function createMonthCalendar() {
        var currDate = Date.prototype.currMonth
        var minDate = Date.prototype.minMonth
        var maxDate = Date.prototype.maxMonth

        //获取当前年、当前月
        var currDate = new Date(currDate)
        currYear = currDate.getFullYear()
        currMonth = currDate.getMonth() + 1

        //最小年、月
        var minYear, minMonth
        if (minDate) {
            minDate = new Date(minDate)
            minYear = minDate.getFullYear()
            minMonth = minDate.getMonth() + 1
        }

        //最大年、月
        var maxYear, maxMonth
        if (maxDate) {
            maxDate = new Date(maxDate)
            maxYear = maxDate.getFullYear()
            maxMonth = maxDate.getMonth() + 1
        }

        var dateHTML = '<div class="date-select">'
        dateHTML += '       <div class="select-year">'
        dateHTML += '            <div class="value"></div>'
        dateHTML += '            <div class="prev"></div>'
        dateHTML += '            <div class="next"></div>'
        dateHTML += '        </div>'
        dateHTML += '   </div>'
        dateHTML += '   <ul class="month-picker">'
        for (i = 1; i <= 12; i++) {
            if ((minMonth && i < minMonth && minYear == currYear) || (minYear && currYear < minYear) || (maxYear && maxYear == currYear && i > maxMonth) || (maxYear && currYear > maxYear)) {
                dateHTML += '<li class="unusable-date">' + i + '</li>'
            } else {
                dateHTML += '<li class="usable-date ' + (i == currMonth ? 'currDay' : '') + '">' + i + '</li>'
            }
            if (i % 4 == 0) {
                dateHTML += '<br>'
            }
        }
        dateHTML += '</ul>'
        $('.date-container').empty().append(dateHTML)
        $('.date-container .select-year').css({ 'margin': '0 auto', 'float': 'none' })
        $('.date-container .select-year').find('.value').text(new Date(currDate).getFullYear() + '年')
        $('.month-picker').off().on('mouseover', 'li.usable-date', function(e) {
            $(this).css({ 'background': '#82b7ff', 'color': '#0a1546' })
            $(this).siblings('li.usable-date').not('.currDay').css({ 'background': '#0a1546', 'color': '#82b7ff' })
        })
        $('.month-picker').on('mouseout', 'li.usable-date', function(e) {
            $('.month-picker').find('li.usable-date').not('.currDay').css({ 'background': '#0a1546', 'color': '#82b7ff' })
        })
        $('.month-picker').on('click', 'li.usable-date', function(e) {
            $(this).addClass('currDay')
            $(this).siblings('li.usable-date').removeClass('currDay')
            $(this).siblings('li.usable-date').css({ 'background': '#0a1546', 'color': '#82b7ff' })
            var month = $(this).text()
            month = parseInt(month) < 10 ? '0' + month : month
            var year_month = Date.prototype.currMonth.substring(0, Date.prototype.currMonth.indexOf('-') + 1)
            focusDom.val(year_month + month)
            $('.date-container').hide()
        })
        bindMonthClick()

    }
    /**
     * 绑定前进、后退等点击事件，粒度到月
     */
    function bindMonthClick() {
        $('.date-container .select-year .prev').off().on('click', function(e) {
            var currDate = Date.prototype.currMonth
            var newTime = new Date(currDate)
            newTime.setFullYear(new Date(currDate).getFullYear() - 1)
            var newYear = newTime.getFullYear()
            var newMonth = newTime.getMonth() + 1
            newMonth = parseInt(newMonth) < 10 ? '0' + newMonth : newMonth
            Date.prototype.currMonth = newYear + '-' + newMonth
            createMonthCalendar()

        })
        $('.date-container .select-year .next').off().on('click', function(e) {
            var currDate = Date.prototype.currMonth
            var newTime = new Date(currDate)
            newTime.setFullYear(new Date(currDate).getFullYear() + 1)
            var newYear = newTime.getFullYear()
            var newMonth = newTime.getMonth() + 1
            newMonth = parseInt(newMonth) < 10 ? '0' + newMonth : newMonth
            Date.prototype.currMonth = newYear + '-' + newMonth
            createMonthCalendar()
        })
    }
    /**
     * 初始化时间控件，粒度到月
     * @param {string} date 初始化传入的日期
     * @param {object} targetDom 当选中日历表中某天的时候需要更改的input对象
     * @param {string} min_month 日历选择器可选的最小月份
     */
    function monthPicker(date, targetDom, min_month, max_month) {
        focusDom = targetDom
        Date.prototype.currMonth = date
        Date.prototype.minMonth = min_month
        Date.prototype.maxMonth = max_month
        createMonthCalendar()
    }

    function initPicker(timeGrit, dom, type, callback) {
        //时间轴选择界面
        $(dom).on(type, function(e) {
            // var pageX = e.pageX
            // var pageY = e.pageY
            // if (pageY < 50 && pageX > $(window).width() * 0.9) {
                $('.datePicker-container').fadeIn(500)
                $('.layui-form-pane').fadeIn(500)
                $('.start-time').focus()

            //}
        })
        $('.layui-form-pane').find('.close-btn').on('click', function() {
            $("#LAY_demorange_s").val('')
            $("#LAY_demorange_e").val('')
            $('.datePicker-container').fadeOut(500)
            $('.layui-form-pane').fadeOut(500)
            $('.tip').hide()
            $('.date-container').hide()
        })
        $('.layui-input').focus(function(e) {
            var today = new Date()
            var year = today.getFullYear()
            var month = today.getMonth() + 1
            var day = today.getDate()
            month = month < 10 ? '0' + month : month
            day = day < 10 ? '0' + day : day

            var currDate = null
            var minDate = null
            var maxDate = year + '-' + month + '-' + day
            var top, left
            if ($(this).hasClass('start-time')) {
                top = '160px'
                left = '200px'
                maxDate = $('.end-time').val() ? $('.end-time').val() : maxDate
            } else {
                top = '160px'
                left = '430px'
                minDate = $('.start-time').val()
            }
            currDate = $(this).val()

            if (!currDate) {
                currDate = year + '-' + month + '-' + day
            }
            if (timeGrit == 'date') {
                datePicker(currDate, $(this), minDate, maxDate)
            }
            if (timeGrit == 'month') {
                monthPicker(currDate, $(this), minDate, maxDate)
            }

            $('.date-container').css({
                'top': top,
                'left': left
            }).show()

            //点击日期提交按钮，调用回调函数
            $('.layui-form-pane').find('.submit-btn').off().on('click', function(){
                var startTime = $("#LAY_demorange_s").val().replace(/-/g, "")
                var endTime = $("#LAY_demorange_e").val().replace(/-/g, "")
                if (!startTime || !endTime) {
                    $('.tip').show()
                    return
                }

                //关闭日期选择面板
                $('.layui-form-pane').find('.close-btn').trigger('click')

                //回调后续处理
                callback(startTime, endTime)
            })

        })
    }

    return { initPicker: initPicker }
})