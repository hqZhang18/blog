/**
 * @Author:      name
 * @DateTime:    2017-03-20 13:36:18
 * @Description: Description
 * @Last Modified By:   name
 * @Last Modified Time:    2017-03-20 13:36:18
 */
define(function(require, exports) {


  // //全局的ajax访问，处理ajax清求时sesion超时  
  //   $.ajaxSetup({  
  //       complete:function(XMLHttpRequest,textStatus){  
  //           //通过XMLHttpRequest取得响应头，sessionstatus，  
  //           var sessionstatus=XMLHttpRequest.getResponseHeader('sessionstatus');   
  //          // console.log('sessionstatus', sessionstatus)
  //           if(sessionstatus=='timeout'){  
  //             window.status = sessionstatus
  //             //如果超时就处理 ，指定要跳转的页面  
  //             window.location = 'index2.html';  
  //           }  
  //       }  
  //   }); 
  //   console.log('window.status', window.status)
  var right = require('./right.js')
  var category = require('./category.js')  //左边分类
  var _request = require('./request.js')

  var _drawMap = require('./drawMap.js') //绘制地图
  var _victoryAnimation = require('./victoryAnimation.js')
  var allMergeData = [] //所有支队数据
  var victoryIndex = 0 //快报战果推送次数
  var projection 
  //地图数据 
  var MAP_ROOT 
  var toporoots
  
  // var mapPath = 'http://12.68.0.170:8083/jizhenpc/data'
  var mapPath = window.global.mapPath
      //快报战果支队名字坐标位置
  var victoryCoordinates = [
    [380, 1170],  //二十八支队
    [968, 1100], //二十九支队
    [428, 785], //二十七支队
    [320, 970], //二十四支队
    [1018, 900], //二十五，北部新区
    [720, 1230], //二十一支队
    [870, 940], //涪陵支队 
    [1300, 1100], //黔江支队
    [1318, 318], //三十一支队
    [1018, 788], //三十支队
    [610, 1000], //主城区
    [1218, 558]  //万州支队
  ]

  //注册一个比较大小的Helper,判断v1是否大于v2
   Handlebars.registerHelper('compare',function(v1,v2,options){
     if(v1 == v2){
       //满足添加继续执行
       return options.fn(this);
     }else{
       //不满足条件执行{{else}}部分
       return options.inverse(this);
     }
   })

  var commons = { 

      /**
       *  @describe [案件类型]
       *  @param    {[type]}   thisIndex [哪个模块调用的该方法]
       *  @param    {[type]}   dataUrl [description]
       */ 
      getCaseType: function(thisIndex, dataUrl, mapUrl, caseNumberUrl){

        var _self = this
        _request.sendAjax(dataUrl, function(res){
          var categoryData = res.result
          category.init(thisIndex, categoryData, mapUrl, caseNumberUrl)
        })
      },

       /**
       *  @describe [快报战果]
       *  @param    {[string]}   dataUrl [description]
       *  @param    {[object]}   map [地图配置]
       */
      getVictory: function(dataUrl, map){
        var _self = this
        var t = 0
        window.setTimer = setInterval(function(){
        _request.sendWebSocket(dataUrl, function(res){
           // var victoryData = JSON.parse(res)
          
          var victoryData = res.result[t]
          if(!!victoryData && window.isMapInit){
            map.victory(victoryData)
          }
          // 测试代码
          t++
          if(t==4){
            t = 0
          }
        })
        }, 30000)

      },

      /**
       *  @describe [右边模块]
       *  @param    {[string]}   dataUrl [description]
       */
      getRight: function(dataUrl){
        var _self = this
        _request.sendAjax(dataUrl, function(res){
          var policeData = res.result.policeOrders  //警令发布
          var importantData = res.result.importantInfo  //要情发布
          var dailyOnDuty = res.result.dailyOnDuty  //每日值班
          var rightData = {
            policeOrders: policeData,
            importantInfo: importantData,
            dailyOnDuty: dailyOnDuty
          }
          right.init(rightData)

        })
      },


    /**
     *  @describe [地图初始化调用]
     *  @param    {[object]}   masterFile [主文件(哪个模块调用的地图，二级钻取要用)]
     *  @param    {[object]}   data       [地图上的数据]
     *  @param    {[object]}   config     [配置项]
     */
    mapInit: function(masterFile, data, config, type, container, mapUrl, caseNumberUrl, tooltipName){

      var width = config.width
      var height = config.height
      //判断地图svg是否已经创建
      var isMapWrap = $(".map").find('.map-svg').length
      var svg = null
      // if(isMapWrap>0){
      //   svg = d3.select('.map').selectAll('svg')
      // }else{
      //   svg = d3.select('.map')
      //     .append("svg")
      //     .attr("width", width)
      //     .attr("height", height)
      //     .attr('class', 'map-svg')
      //     //.style("transform","rotateX(45deg) scale(1.2, 1.4) translateZ(0px)")
      // }
      var svg = '' 
      config.state = window.flagInit  
      _drawMap.init(container, data, config, masterFile, type, mapUrl, caseNumberUrl, tooltipName)    
    },

    /**
     *  @describe [推送快报战果]
     *  @param    {[object]}   data [快报战果数据]
     *  @param    {[object]}   config [配置项]
     */
    victory: function(data, config, id, victoryId, type){
      var _self = this
     
      var drawType = type ? type : 0
      var areaData = []
      areaData.push(data)
      var width = config.width
      var height = config.height
      
      var mapUrl = mapPath+'/map/chongqing.json'
      d3.json(mapUrl, function(error, toporoot){
        
        var root = topojson.feature(toporoot, toporoot.objects.chongqing)
        var features = root.features
        var scale = _drawMap.getZoomScale(features, width, height),
          center = _drawMap.getCenters(features);
        var projection = d3.geo.mercator()  //球形墨卡托投影
           .scale(scale * 50)
           .center(center)
           .translate([width / 2, (height/2 )])
    
        var mergeUrl = mapPath+'/map/mergeMap.json'
        _request.sendAjax(mergeUrl, function(res){
          var mergeData = res.result
          mergeMap(mergeData)
        })
 
        function mergeMap(mapData){
          
          //按行政区域还是支队绘制地图，0表示支队，1表示行政区域
          
          //获取各个支队及所管辖的行政区域
          if(drawType == 0) {
            var allTroops = []
            var mergePolygons = []
            var troopList = []
            var markData = {} //地图上的标记点数据
            var mergeDatas = []
            for(var i = 0, len = mapData.length; i < len; i++) {
                var data = mapData[i]
                var troopsName = data.troopsName
                var troopsList = data.dists
                //需要合并的行踪区域
                var areas = []
                for(k = 0, listLen = troopsList.length; k < listLen; k++) {
                    areas.push(troopsList[k].value)
                }
                troopList.push(areas)

                /*调用topjson.merge将TopJSON格式的对象(topojson)转
                换成GeoJSON格式的对象(reoroot)*/

                //各支队名称集合  
                var mergeArea = d3.set(areas)
                allTroops.push(mergeArea)
                //合并各支队
                /*
                  toporoot.objects.chongqing.geometries 是一个数组，每一项保存一个支队的几何信息
                  然后数组对象的filter函数，使只有存在于集合mergeArea中的地区才能保留下来
                  合并后的几何体对象保存在变量mergePolygon中
                  mergeArea.ha检查传入的字符串（地区名）是否存在于集合中
               */
                var mergePolygon = topojson.merge(toporoot, toporoot.objects.chongqing.geometries.filter(function(d) {
                    return mergeArea.has(d.properties.name)
                }))
                
                mergePolygon.name = troopsName
                mergePolygon.value = data.value
                mergePolygon.mergeArea = mergeArea
                mergePolygon.dists = data.dists
                mergePolygon.troopsId = data.troopsId
                mergePolygons.push(mergePolygon)
           }
    
           //重组支队数据 
            for (var i = 0; i < mergePolygons.length; i++) {
                var flag = true
                var mergeData ={}
                for (var j = 0; j < root.features.length; j++) {
                    if (troopList[i].indexOf(root.features[j].properties.name) > -1) {
                        if(flag) {
                            flag = false
                            mergeData.value = mergePolygons[i].value
                            mergeData.name = mergePolygons[i].name
                            mergeData.geoCoord = root.features[j].properties.cp
                            mergeData.troopsId= mergePolygons[i].troopsId
                            mergeDatas.push(mergeData)
                        }
                    }
                }
            }

            //对有数据的支队添加支队经纬度 areaData 是从后端获取到传过来的
             var newAareaDatas = []
             for(var x = 0, len2 = areaData.length; x<len2; x++){
               var troopsId = areaData[x].troopsId
			   var areaId = areaData[x].areaId
			   if(areaId=='500112'){
				  troopsId = '5865dfa4-a16a-4bd3-9bae-6c115a5d6eee'
			   }
			  
               // 地图合并的所有支队
               for(var k = 0, len3 = mergeDatas.length; k<len3; k++){
                 var troopsId2 = mergeDatas[k].troopsId
                 var newAreaData = {}
                 if(troopsId==troopsId2){
                    var geoCoord = mergeDatas[k].geoCoord
                    newAreaData.geoCoord = geoCoord
                    newAreaData.name = areaData[x].troopsName
                    newAreaData.content = areaData[x].content
                    //newAreaData.content = texts //测试使用
                    newAareaDatas.push(newAreaData)
                 }
               }
           }
            _victoryAnimation.drawPoint(config, projection, newAareaDatas, id, victoryId)  
          }else{
            var newAreaDatas = []
            //按行政区处理地图坐标点
            for (var i = 0, len = areaData.length;  i < len; i++) {
              var newAreaData = {}
                for (var j = 0, len2 = root.features.length; j < len2 ; j++) {
                    if (root.features[j].properties.id == areaData[i].areaId) {
                        newAreaData.geoCoord = root.features[j].properties.cp
                        newAreaData.name = areaData[i].troopsName
                        newAreaData.content = areaData[i].content
                        newAreaDatas.push(newAreaData)
                    }
                }
            }
            
            _victoryAnimation.drawPoint(config, projection, newAreaDatas, id, victoryId)
          }
          
       }

       })  
   
    },
     /**
       *  @describe [加载时间选项]
       *  @return   {[type]}   [description]
       */
      timeControl: function(){
        var _self = this
        var date = new Date()
        var currYear = date.getFullYear()
        var currMonth = date.getMonth() + 1
        var currDay =  date.getDate()

        var config = {
          startYear: 2012,
          endYear: 2020
        }

        //年
        var yearLen = config.endYear - config.startYear + 1
        
        var common = {
          /**
           *  @describe [添加年]
           *  @param    {[type]}   length [时间维度]
           *  @param    {[type]}   type   [0为开始时间，1为结束时间]
           */
          addYear: function(length, type, year){
			
            var yli = ''
            for(var i=0; i<length; i++){
              yli += '<li>'+(year++)+'</li>'
            }
            if(type==0){
              $('.start-year').find('.boxs').html(yli)
            }else{
              $('.end-year').find('.boxs').html(yli)
            }
          },

          /**
           *  @describe [添加月]
           *  @param    {[type]}   length [时间维度]
           *  @param    {[type]}   type   [0为开始时间，1为结束时间]
           */
          addMonth: function(length, type, type2){
      			if(type2==0){
      				var mli = ''
      				var month = 0
      				for(var i=0; i < length; i++){
      				  month++
      				  if(month<10){
      					month = '0'+month
      				  }
      				  mli += '<li>'+month+'</li>'
      				}
      				if(type==0){
      					$('.start-month').find('.boxs').html(mli)
      				}else{
      				  $('.end-month').find('.boxs').html(mli)
      				}
      			}else{
      				var month2 = 0
      				var mli2 = ''
      				for(var j=0; j < length; j++){
      				  month2++
      				  if(month2<10){
      					month2 = '0'+month2
      				  }
      				  mli2 += '<li>'+month2+'</li>'
      				}
      				
      				if(type==0){
      				  $('#victoryMonth').find('.boxs').html(mli2)
      				}else{
      				  $('.end-month').find('.boxs').html(mli2)
      				}
      			}
            
			
			
          },

          /**
           *  @describe [添加月]
           *  @param    {[type]}   length [时间维度]
           *  @param    {[type]}   type   [0为开始时间，1为结束时间]
           */
          addDay: function(length, type){
            var dli = ''
            var startDay = 0
            for(var i=0; i < length; i++){
              startDay++
              if(startDay<10){
                startDay = '0'+startDay
              }
              dli += '<li>'+startDay+'</li>'
            }
            if(type==0){
              $('.start-day').find('.boxs').html(dli)
            }else{
              $('.end-day').find('.boxs').html(dli)
            }
            
          }
        }

        //调用年的方法
        common.addYear(yearLen, 0, config.startYear)
        common.addYear(yearLen, 1, config.startYear)

        //调用月的方法
        common.addMonth(12, 0, 0)
        common.addMonth(12, 1, 0)
		    common.addMonth(12, 0, 1)
        common.addMonth(12, 1, 1)
		 

        //调用日的方法
        common.addDay(31, 0)
        common.addDay(31, 1)
 

        //快报战果开始时间
        var startTime1 = $('#start-time')
        startTime(startTime1, 1)
        //导出开始时间
        var startTime2 = $('#start-time2')
        startTime(startTime2, 2)

        var startTime2 = $('#start-time3')
        startTime(startTime2, 1)

       
        /**
         *  @describe [选择开始时间]
         *  @param    {[type]}   elem [description]
         *  @return   {[type]}   [description]
         */
        function startTime(elem, type){
            elem.on('click', 'p', function(evt){
              var index = $(this).index()
              $('.boxs').hide()
              switch(index){
                case 0:
                  if(type==2){
                    $('.select-export-time').find('.start-year').find('ul').fadeIn(200)
                  }else{
                    $('.start-year').find('ul').fadeIn(200)
                  }
                break; 
                case 1:
                  if(type==2){
                    $('.select-export-time').find('.start-month').find('ul').fadeIn(200)
                  }else{
                    $('.start-month').find('ul').fadeIn(200)
                  }
                break; 
                case 2:
                  $('.start-day').find('ul').fadeIn(200);
                break; 
              }
          })
        }

       //快报战果结束时间
        var startTime1 = $('#end-time')
        endTime(startTime1, 1)
        //导出结束时间
        var startTime2 = $('#end-time2')
        endTime(startTime2, 2)
  
        /**
         *  @describe [选择开始时间]
         *  @param    {[type]}   elem [description]
         *  @return   {[type]}   [description]
         */
      function endTime(elem, type){
        elem.on('click', 'p', function(evt){
          var index = $(this).index()
          $('.boxs').hide()
          switch(index){
            case 0:
              if(type==2){
                $('.select-export-time').find('.end-year').find('ul').fadeIn(200)
              }else{
                $('.end-year').find('ul').fadeIn(200)
              }
            break; 
            case 1:
              if(type==2){
                $('.select-export-time').find('.end-month').find('ul').fadeIn(200)
              }else{
                $('.end-month').find('ul').fadeIn(200)
              }
            break; 
            case 2:
              $('.end-day').find('ul').fadeIn(200);
            break; 
          }
        })
       }


        //选择下拉列表的日期
        $('.boxs').on('click', 'li', function(evt){
          var id = parseInt($(this).parent().attr('id'), 10)
          
          var num = $.trim($(this).html())
          switch(id){
            case 1:
              //快报战果
              $('#select-syear').html(num)
              $('#select-smonth').html('01')
              $('#select-sday').html('01')
              //导出
              $('#select-syear2').html(num)
              $('#select-smonth2').html('01')
              $('#select-sday2').html('01')
              //年
              var thisYear = parseInt(num, 10)
              if( thisYear != currYear ){
                common.addMonth(12, 0, 0)
              }else{
                common.addMonth(currMonth, 0, 0)
              }
              
              var reEndyear = currYear - thisYear

              common.addYear(reEndyear+1, 1, thisYear)
              $('#select-eyear2').html(thisYear)
              $('#select-eyear').html(thisYear)
              
            break;
            case 2:
              //快报战果
              $('#select-smonth').html(num)
              $('#select-sday').html('01')
              //导出
              $('#select-smonth2').html(num)
              $('#select-sday2').html('01')
            break;
            case 3:
              $('#select-sday').html(num)
              $('#select-sday2').html(num)
            break;
            case 4:
              //快报战果
              $('#select-eyear').html(num)
              $('#select-emonth').html('01')
              $('#select-eday').html('01')
              //导出
              $('#select-eyear2').html(num)
              $('#select-emonth2').html('01')
              $('#select-eday2').html('01')
              if( num!=currYear ){
                common.addMonth(12, 1, 1)
              }else{
                common.addMonth(currMonth, 1, 1)
              }
            break;
            case 5:
              $('#select-emonth').html(num)
              $('#select-eday').html('01')

              $('#select-emonth2').html(num)
              $('#select-eday2').html('01')
              var endyear2 = parseInt($('#select-eyear2').html(), 10)

              if( num!=currMonth || endyear2!=currYear ){
                common.addDay(31, 1)
              }else{
                common.addDay(currDay, 1)
              }
            break;
            case 6:
              $('#select-eday').html(num)
              $('#select-eday2').html(num)
            break;
          }
          $(this).parent().fadeOut(200)
        })
        
         //点击空白处关闭
        $(document).mouseup(function(e){
          var _con = $('#start-time') ||  $('#start-time2')   // 设置目标区域
          if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
            $('.boxs').hide()
          }
        })

        //离开隐藏
        $('.boxs').hover(function () {
          $(this).show()
        }, function () {
          $('.boxs').hide()
        })

      },

      /**
       *  @describe [时间判断]
       *  @param    {[type]}   sDate1 [开始时间]
       *  @param    {[type]}   sDate2 [结束时间]
       *  @return   {[type]}   [相差的天数]
       */
      dateDiff: function(sDate1,  sDate2){
        var  aDate,  oDate1,  oDate2,  iDays  
        aDate  =  sDate1.split("-")  
        oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])    //转换为12-18-2002格式  
        aDate  =  sDate2.split("-")  
        oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0])  
        iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数  
        return  iDays  
      },

      /**
       *  @describe [时间验证]
       *  @param    {[type]}   startTime [开始时间]
       *  @param    {[type]}   endTime   [结束时间]
       *  @return   {[type]}   [开始是否大于结束]
       */
      checkTime: function(startTime,endTime){              
        if(startTime.length>0 && endTime.length>0){     
            var startTmp=startTime.split("-");  
            var endTmp=endTime.split("-");  
            var sd=new Date(startTmp[0],startTmp[1],startTmp[2]);  
            var ed=new Date(endTmp[0],endTmp[1],endTmp[2]);  
            if(sd.getTime()>ed.getTime()){   
                return false;     
            }     
        }     
        return true;     
      } ,   
	
	   /**
     *  @describe [时间轴]
     *  @return   {[type]}   [description]
     */
      timeSlider: function(container, config, callback) {
		  
        var tpl = require('../../components/selectDate.tpl')
        var myTemplate = Handlebars.compile(tpl)
  		  var policeTimeUrl = window.BASEURL + 'server/policeTime'
       // var policeTimeUrl = '../../data/policeTime.json'
  		  _request.sendAjax(policeTimeUrl, function(res){
  			  var initDate = []
  			  var start  = res.result.startTime
  			  var end = res.result.endTime
  			  var startYear = parseInt(start.slice(0, 4), 10)
  			  var initMonth = parseInt(start.slice(4, 6), 10)
  			  var initDay = parseInt(start.slice(6), 10)
  			  var initYear = startYear - 1
  			  
  			  var endYear = parseInt(end.slice(0, 4), 10) + 1
  			  var month = parseInt(end.slice(4, 6), 10)
  			  var day = parseInt(end.slice(6), 10)
  			  var initDateStr = ''
  			  for(var i = initYear; i < endYear; i++) {
  				for(var j = 1; j < 13; j++) {
  				  for(var k = 1; k < 32; k++) {
  					  if(i == (endYear - 1) && (j > month || (j == month && k > day))) {
  						continue
  					  }
  					  if(j == 2 && k > 28) {
  						  continue
  					  }
  					  if([4, 6, 9, 11].indexOf(j) !== -1 && k > 30) {
  						  continue
  					  }
  					  var selected = ''
  					  if(month == j && day == k) {
  						  selected = 'selected'
  					  }
  					  var value = i + '.' + (j > 9 ? j : '0' + j) + '.' + (k > 9 ? k : '0' + k)
  					  if(i == startYear && j == 12 && k == 21) {
  						  initDateStr = value
  						  selected = 'selected'
  					  }
  					  
  				
  					  initDate.push({
  						  key: value,
  						  value: value,
  						  selected: selected,
  						  lastDate: initDateStr == value ? 0 : 1
  					  })
  				  }
  				}
  			  }
  			  
  			  //注册一个比较大小的Helper,判断v1是否大于v2
  			   Handlebars.registerHelper('compare',function(v1,v2,options){
  				 if(v1 == v2){
  				   //满足添加继续执行
  				   return options.fn(this);
  				 }else{
  				   //不满足条件执行{{else}}部分
  				   return options.inverse(this);
  				 }
  			   })
  			   
  			  $('.' + container).html(myTemplate(initDate))
          
  			  $('select').selectToUISlider({
  				  labels: 12, //设置标签的显示个数  
  				  sliderOptions: {
  					  change: function(e, ui) { //定义change事件  
  						  //获取时间范围
  						  var start = $('#handle_startDate').attr('aria-valuetext')
  						  var end = $('#handle_endDate').attr('aria-valuetext')
  						  callback && callback(start, end)
  					  }
  				  }
  			  });
		    })
          
        //本日
        $('.current-day').on('click', function(evt){
          var start = '00'
          var end = '00'
          callback && callback(start, end)
        })

        //本周
        $('.current-week').on('click', function(evt){
          var start = '000'
          var end = '000'
          callback && callback(start, end)
        })

        //本月
        $('.current-month').on('click', function(evt){
          var start = '0000'
          var end = '0000'
          callback && callback(start, end)
        })
      },


     /**
      *  @describe [获取时间]
      *  @param    {[object]}   masterFile [主文件]
      *  @param    {[type]}   mapUrl        [description]
      *  @param    {[type]}   caseNumberUrl [description]
      */
     getTime: function(masterFile, urls, index){
      
        var _self = this
        var _index = index
         //加载时间轴
        var yearConfig = {
          start: 2016,
          end: 2018
        }
        _self.timeSlider('select-date', yearConfig, function(start, end) {
          window.startTime = $.trim(start.replace(/\./g, ""))
          window.endTime = $.trim(end.replace(/\./g, ""))
          var commonTimeUrl = '/startTime/'+window.startTime+'/endTime/'+window.endTime
          var commonUrl = '/type/'+window.oneType+'/childType/'+window.childType +'/'+window.areaIds+'/'+window.troopsId + commonTimeUrl 
         
          var dataUrls = [
            {
              url: urls[0] + commonTimeUrl 
            },{
              url: urls[1] + commonUrl
            },{
              url: urls[2] + commonUrl
            }
          ]

          _self.getCaseType(masterFile, dataUrls[0].url, dataUrls[1].url, dataUrls[2].url)
          _index.getMap(dataUrls[1].url) 
          _index.getCaseNumber(dataUrls[2].url)
		
		  //移出href
          $(document, 'a.ui-corner-all').removeAttr('href')
        })
		
		
		
       // $(document, '#handle_endDate').removeAttr('href')
     },
	 
	 errorTooltip: function(data){
        var errorTpl = require('../../components/dialog/errorDialog.tpl')
        var template = Handlebars.compile(errorTpl)
        var html = template({
          data: data
        }) 
        $('.error-dialog').html(html)
        $('#errorDialog').fadeIn(50)
        //关闭错误提示
        $('#errorDialog').on('click', '.close-model', function(evt){
           evt.stopPropagation()
           evt.preventDefault()
          $('#errorDialog').fadeOut(50)
          $('.error-dialog').html('')
        })
        return
      }

    
  }
 
  //exports.sis = commons
  return commons
})  