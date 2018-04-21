/**
 * @Author:      lee
 * @DateTime:    2017-05-24
 * @Description: 过程监督页面中间部分JS
 */
define(function(require) {
    var caseTop = require('../components/caseTop.js')

    var gradientBar = require('../components/gradientBar.js')
    var skillDetailTpl = require('../../components/progressvision/skillDetail.tpl');
    var behaviorCount = require('./behaviorCount.js')
    var circleData = require('../components/circleData.js')
    //号码统计图
    var numberCoun = require('../components/gradientAreaChart.js')

    var pathTimer = null;
    var sixTimer = null;
    var circleInTimer = null;
    var circleOutTimer = null;
    var progressVisionCenter = {

       /**
        *  @describe [号码统计]
        *  @param    {[type]}   data [description]
        *  @return   {[type]}   [description]
        */
        renderNumberCount: function(data) {
            var config = {
              width: 1350,
              height: 400,
              grid:{
                x: 50,
                y: 60,
                y2: 90
              }
            }
            numberCoun.drawCharts('#statistics', data, config)

        },

        /**
         *  @describe [案件触及模型数量TOP10]
         *  @param    {[type]}   data [description]
         *  @return   {[type]}   [description]
         */
        renderCaseTop: function(data) {
            var config = {
                width: 600,
                height: 380,
                id: '#caseTop',
                padding: {
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 80
                },
                itemStyle: {
                    width: 4,
                    color: '#282f36',
                    gradientColor: ['#00d2ff', '#0048ff'],
                    margin: {
                        left: 20,
                        right: 40
                    }
                },
                yAxis: {
                    axisLine: {
                        show: true
                    },
                    gridLine: {
                        show: true
                    },
                    ticks: 6
                },
                grid: {
                    x: 0,
                    y: 200,
                    y2: 20
                }
            }
            caseTop.drawCharts("#caseTop", data, config)
        },
        /**
         *  @describe [部门触及模型数量TOP10]
         *  @param    {[type]}   data [description]
         *  @return   {[type]}   [description]
         */
        renderDepartmentTop: function(data) {
            var config = {
                width: 600,
                height: 360,
                fontFamily: '微软雅黑',
                min: 1,
                padding: {
                    top: 20,
                    bottom: 10,
                    right: 0,
                    left: 80
                },
                itemStyle: {
                    width: 4,
                    color: '#282f36',
                    gradientColor: ['#00d2ff', '#0048ff'],
                    radius: 0,
                    topMark: {
                        width: 8,
                        height: 4,
                        fill: '#fff',
                        stroke: '#00d2ff',
                        strokeWidth: 1
                    },
                    margin: {
                        left: 10,
                        right: 40
                    }
                },
                isxAxis: false,
                yAxis: {
                    axisLine: {
                        show: true
                    },
                    gridLine: {
                        show: true
                    },
                    ticks: 6
                },
                xText: {
                  slice: true
                },
                grid: { //文字离左右两边的距离
                    x: 0,
                    x2: 20,
                    y: 200,
                    y2: 0
                }
            }
            gradientBar.drawCharts("#departmentTop", data, config)
        },
        renderTotalList: function(data) {
          var names = ['通用类', '手段类', '提请量']
          var target = $(".total-list li");
          data.forEach(function(item, index){
            //toLocaleString() 超过三位加逗号
            var value = parseInt(item.value).toLocaleString() 
            var index = names.indexOf(item.name)
            switch(index){
              case 0:
                target.eq(0).find('span').eq(0).html(item.name)
                target.eq(0).find('span').eq(1).html(item.value)
              break;
              case 1:
                target.eq(1).find('span').eq(0).html(item.name)
                target.eq(1).find('span').eq(1).html(item.value)
              break;
              case 2:
                target.eq(2).find('span').eq(0).html(item.name)
                target.eq(2).find('span').eq(1).html(item.value)
              break;
             
            }
          }) 
        },
        /**
         *  @describe [各手段提请量统计]
         *  @param    {[type]}   data [description]
         *  @return   {[type]}   [description]
         */
        renderSkillDetail: function(data) {
            // var data = [
            //     {"name":"933、7、8手段","value":18647},
            //     {"name":"931手段","value":9511},
            //     {"name":"936手段","value":122},
            //     {"name":"939手段","value":27},
            //     {"name":"935手段","value":560},
            //     {"name":"932、4手段","value":125},
            //     {"name":"通用类","value":90115},
            //     {"name":"加一类","value":7115}
            //     ]

             var maxObj = {}
             var minObj = {}
             var values = []
             data.forEach(function(item) {
                values.push(item.value)
             })

             var max = Math.max.apply(null, values)
             var min = Math.min.apply(null, values)
             var maxIndex = 0
             var minIndex = 0
             data.forEach(function(item, index) {
                if(item.value == max) {
                    maxIndex = index
                    maxObj = item
                }
                if(item.value == min) {
                    minIndex = index
                    minObj = item
                }
             })

            data.splice(maxIndex, 1)
            data.splice(minIndex, 1)
            data.sort(function(a, b) {
                return parseInt(a.value, 10) > parseInt(b.value, 10)
            })
            data.splice(2, 0, maxObj)
            data.splice(3, 0, minObj)
            
            $('.skill-detail ul').html('')
            var skillDetailHmlt = Handlebars.compile(skillDetailTpl);

            $(".skill-detail ul").html(skillDetailHmlt(data));

            this.renderAnimate();
            this.renderMovePath();
        },
        /**
         *  @describe [操作行为统计]
         *  @param    {[type]}   data [description]
         *  @return   {[type]}   [description]
         */
        renderCzxwCount: function(data) {
            var config = {
                
            }
            behaviorCount.drawCharts('#czxwCount', data, config)
        },
        //背景小六边形若隐若现
        renderAnimate: function() {
            clearInterval(sixTimer)
            var limitWidth = 780;
            var limitHeight = 400;

            var cfgImg = [{
                w: 34,
                h: 36
            }, {
                w: 48,
                h: 44
            }, {
                w: 66,
                h: 58
            }, {
                w: 39,
                h: 44
            }, {
                w: 33,
                h: 38
            }, {
                w: 19,
                h: 22
            }, {
                w: 36,
                h: 32
            }]
            function draw() {
                var animateHtml = "";
                cfgImg.map(function(item, index) {
                    var randX = Math.round(Math.random() * limitWidth);
                    var randY = Math.round(Math.random() * limitHeight);
                    var w = cfgImg[index].w;
                    var h = cfgImg[index].h;
                    animateHtml += '<span class="six-animate" style="width:' + w + 'px;height:' + h + 'px;left: ' + randX + 'px;top: ' + randY + 'px;background: url(../images/six-animate' + (index + 1) + '.png);background-size: cover;"></span>'

                })
                $(".animateWrap").html(animateHtml)
                $(".six-animate").animate({
                    opacity:0
                },4000)
            }
            sixTimer = setInterval(function() {
                draw();
            }, 4000)

        },
        //七个六边形的动画
        renderMovePath:function() {
            var self = this;
            var animateList = [
                {id:"movePath1"},
                {id:"movePath2"},
                {id:"movePath3"},
                {id:"movePath4"},
                {id:"movePath5"},
                {id:"movePath6"},
                {id:"movePath7"}
               // {id:"movePath8"}
            ]
            animateList.map(function(item,index) {
                var path = document.getElementById(item.id);
                var length = path.getTotalLength();
                // 清除之前的动作
                path.style.transition = path.style.WebkitTransition = 'none';
                // 设置起始点
                path.style.strokeDasharray = length + ' ' + length;
                path.style.strokeDashoffset = length;
                // 获取一个区域，获取相关的样式，让浏览器寻找一个起始点。
                path.getBoundingClientRect();
                self.animate(path,length)
                // 定义动作
                //path.style.transition = path.style.WebkitTransition =  'stroke-dashoffset 3s ease-in-out';
                // Go!
                //path.style.strokeDashoffset = '0';
            })
        
        },
        animate:function(path,len) {
            // clearInterval(pathTimer)
            var offset = len;
            pathTimer = setInterval(function() {
                offset = (offset - 10 > 0) ? offset - 10: len
                path.style.strokeDashoffset = offset
            },100)
        },
        renderCircle: function(data) {
            clearInterval(circleInTimer)
            clearInterval(circleOutTimer)
            var config = {
            }
            circleData.drawCharts('#circleChart', data, config)
            var tIn = 0;
            var tOut = 0;
            circleInTimer = setInterval(function(){
              tIn++
              $('.circle-chart-inbg').css({
                transform: 'rotate(' + 18 * tIn + 'deg)'
              })
              if(tIn == 20){
                tIn = 0
              }
            }, 350)
            circleOutTimer = setInterval(function(){
              tOut++
              $('.circle-chart-outbg').css({
                transform: 'rotate(' + 18 * tOut + 'deg)'
              })
              if(tOut == 20){
                tOut = 0
              }
            }, 800)
        }
    }
    return progressVisionCenter;
})