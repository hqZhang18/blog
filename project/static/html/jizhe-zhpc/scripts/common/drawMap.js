/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-10 16:04:27
 * @Description: 绘制地图JS文件
 * @Last Modified By:   zhanghongq
 * @Last Modified Time:    2017-03-10 16:04:27
 */

define(function(require) {

  /**
   * 引入公用的文件
   */

  require('topojson')
  var _request = require('./request.js')  
  var thisIndex = ''
  var mapPath = window.global.mapPath
  var mapPath = '../data'
 
  //配置项
  var svg = null
  var width = 0
  var height = 0
  var cfg = {}
  var mapTooltip = ''
  var container = ''
  var svg = ''
  var projection = {}
  var _index = {}
  window.secondMap = false //行政区二级地图
  window.zdSecondMap = false  //支队二级地图
  window.isMainCity = false  //支队主城区
  var threeMap = false  //支队三级地图
  var zdMainMap = false
  var cityAreaId //存放区域id 对奉节钻取后做处理
  //地图缩放比例
  var zdX = 0
  var zdY = 0
  var zdScale = 1
  var areaData = [] //有数据的支队
  var caseNumberUrl = ''  //案件类型url
  var commonMapUrl = ''   //地图url
  var mainValue = 0 //主城区总数
  var mainXjValue = 0 //人员在勤主城区休假
  var mainZqValue = 0 //人员在勤主城区在勤
  var mergeUrl = mapPath+'/map/mergeMap0.json'
  var backsecondMap = false //返回二级地图
  var secondData = []   //二级地图数据（某支队）
  window.citySecondMap = false //行政区
  window.cityMainMap = false  //行政区主城标记
  var cityMainThree = false //行政区三级标记
  var tooltipType = '在侦案件' //提示框提示类型
  var areaIdFlag = -1  //支队地图标记
  var zhiduiName = ''  //支队名字
  var isPerson = false  //是否是人员在勤模块
  var allTroopsId = []
  var permiss = false //权限
  var permissId = 1
  var navIndex = 4
 
  var mapType = 0
  var zhiduiMergeData 
  var cityMainValue = 0
  var mapIndex = 0 //只能钻取二级
  var mainMapCode = ['500103000000','500104000000','500105000000','500106000000',
'500107000000','500108000000','500109000000','500112000000','500113000000','500199000000']

  var mainCityName = [
      '渝北区', '巴南区', '北碚区', '九龙坡区', '南岸区', 
      '江北区', '沙坪坝区', '大渡口区', '渝中区', '两江新区'
  ] 
  
  //支队名字坐标位置
  var coordinates = [
    [200, 980],  //二十八支队
    [725, 930], //二十九支队
    [228, 728], //二十七支队
    [120, 840], //二十四支队
    // [1018, 900], //二十五支队，两江新区
    [420, 1030], //二十一支队
    [540, 820], //涪陵支队 
    [880, 900], //黔江支队
    [940, 350], //三十一支队
    [660, 700], //三十支队
    [395, 895], //主城区
    [795, 530]  //万州支队
  ]

    //快报战果支队名字坐标位置
  var victoryCoordinates = [
    [380, 1170],  //二十八支队
    [968, 1100], //二十九支队
    [428, 785], //二十七支队
    [320, 970], //二十四支队
    [720, 1230], //二十一支队
    [870, 940], //涪陵支队 
    [1300, 1100], //黔江支队
    [1318, 318], //三十一支队
    [1018, 788], //三十支队
    [610, 1000], //主城区
    [1218, 558]  //万州支队
  ]

  //主城区支队位置
  var mainCoordinates = [
    [790, 350],  //二十二支队
    [670, 980], //二十三支队
    [460, 400], //二十支队
    [320, 820], //十八支队
    [680, 720], //十九支队
    [730, 600], //十六支队
    [350, 620], //十七支队
    [500, 710], //十四支队
    [460, 848], //十五支队
    [500, 560]
  ]

  var coordinates2 = [
    [318, 991],  //二十八支队
    [966, 1026.], //二十九支队
    [203, 813], //二十七支队
    [120, 820], //二十四支队
    [490, 1007], //二十一支队
    [597, 794], //涪陵支队 
    [941, 854], //黔江支队
    [984, 434], //三十一支队
    [832, 672], //三十支队
    [447, 868], //主城区
    [859, 501]  //万州支队
  ]

   //主城区id
 var mainCityID = [
  'da36006e-9731-4167-95b7-76aed71d654d',  //渝北区
  '4c600fc6-4b6f-413f-a114-d4ace7089840', //巴南区
  '6488728a-468e-4971-9758-1e15149c5b47', //北碚区
  '3adec8e4-8129-4014-a48d-d1418f8af040', //九龙坡区
  '9b6b0759-ae5e-4b20-a3e3-549291e8bc58', //南岸区
  '96c51c7e-4e84-4294-aca6-ad86238c5edf', //江北区
  '935e2a7b-0d63-478e-9a1c-3726ccfb4349', //沙坪坝区
  '5865dfa4-a16a-4bd3-9bae-6c115a5d6eee', //渝中区
  '7069680e-3236-43cc-a2f6-b62006a6a293', //大渡口区
  'e9231a82-ea51-4948-a762-867f9744adfc' //两江新区
  ]
  
  var zhiduiFristCoor = [
  [300, 700], 
  [720, 670], 
  [490, 1009], 
  [270, 950], 
  [800, 900],  
  [940, 870], 
  [595, 790], 
  [860, 500], 
  [185, 800], 
  [1010, 320],  
  [447, 868], 
  [300, 700], 
  [720, 670]
]

 var saveMainId = [] //权限使用的

 
 var saveAllDatas = []
 

function indexOf(arr, str){
  // 如果可以的话，调用原生方法
  if(arr && arr.indexOf){
      return arr.indexOf(str);
  }
   
  var len = arr.length;
  for(var i = 0; i < len; i++){
      // 定位该元素位置
      if(arr[i] == str){
          return i;
      }
  }
  // 数组中不存在该元素
  return -1;
}
  
  var drawMap = {
    /**
     * 地图默认配置项
     */
    defaultSetting: function(){
      var width = 1360
      var height = 1168
      return {
        width: width,
        height: height,
        id: 'map',
        area: 'chongqing',
        itemStyle: {
          fill: '#41abfb',
          stroke: '#eee',
          strokeWidth: 1,
          emphasis: {
            fill: '#349efa',
            stroke: '#76c7ff',
            strokeWidth: 1
          },
          filters: {
            opacity: 0.4,
            fill: ['#023ac0', '#0232af'],
            stroke: '#011a53',
            strokeWidth: 2
          }
        },
        carouselPoint: {   
          symbol: 'image', //circle, image
          fill: '#76c7ff',
          imgUrl: '../images/icon2.png',
          imgUrl2: '../images/icon1.png',
          width: 22,
          height: 22,
          radius: 10
        },
        line: {
          stroke: '#fcb800',
          strokeWidth: 3
        },
        popup: {
          left: 300,
          top: 160
        },
        tooltip: {
          className: 'tooltip'
        }
      }
 
    },

    /**
     *  @describe [地图初始化]
     *  @param    {[object]}   containers [svg对象]
     *  @param    {[object]}   data       [数据]
     *  @param    {[object]}   opt        [图表配置项]
     *  @param    {[object]}   masterFile [主文件，哪个模块调用]
     *  @param    {[number]}   type       [地图类型(支队，行政区)]
     *  @param    {[object]}   masterFile [主文件，哪个模块调用]
     *  @param    {[number]}   type       [地图类型(支队，行政区)]
     */
    
    init: function(containers, data, opt, masterFile, type, mapUrls, caseNumberUrls, tooltipName){
      var _self = this     
      container = containers    
      commonMapUrl = mapUrls
      caseNumberUrl = caseNumberUrls
      tooltipType = tooltipName //提示框里面的模块提示类型
      isPerson = window.thisNavs=='personnelFrequently'
      mapType = type

      thisIndex = masterFile 
      _index = require(masterFile) //来自哪个模块的调用

      cfg = _.assign({}, this.defaultSetting(), opt)
	  
      mapTooltip = cfg.tooltip.className
      d3.selectAll('.'+mapTooltip).remove()
      areaData = data.map  // 有数据的支队(这个数据是从后端拿的)
      // 保存所有支队的值,拉通比较
      // 主城钻取返回不清空
      if(!backsecondMap) {
        saveAllDatas = []
      }
      // saveAllDatas = []
      areaData.forEach(function(item) {
        var saveAllData = {}
        var value = item.value
        if(isPerson) {
          value = item.zqValue
        }
        saveAllData.value = value
        saveAllData.name = item.troopsName
        saveAllData.geoCoord = [-100, -100]
        saveAllData.flag = 0
        saveAllDatas.push(saveAllData)
      })  

      //设备资源和人员在勤权限的时候用
      navIndex = _self.isNavIndex()
      if(!window.dataIndex) {
        navIndex = 2
      } 
      allTroopsId = []
      if(navIndex==5 || navIndex==6){
        for(var i=0, len = areaData.length; i<len; i++){
          allTroopsId.push(areaData[i].troopsId)
        }
      }
     // console.log('地图初始化', window.isMapInit)
      //地图如果是初始化加载调用所有支队数据mergeMap0.json
      if(type==0){
        window.mapUrl = mapPath+'/map/'+cfg.area+'.json' 
      }
      if(window.isMapInit){
         areaIdFlag = -1
         threeMap = false
         backsecondMap = false
        //如果切换了模块要把地图缩放及位置还原
        if(window.clickNav){
          zdX = 0
          zdY = 0
          zdScale = 1
          mergeUrl = mapPath+'/map/mergeMap0.json'
        }
        
        //这里是请求本地的所有支队数据
         _request.sendAjax(mergeUrl, function(res){
          var mergeData = res.result
          _self.renderMap(mergeData, type)
        })
      }else{
          if(zdMainMap){
            window.isMainCity = true
          }
         //如果不是初始化就传某一个支队的数据
         _self.renderMap(secondData, type)
      }
    },


    /**
     *  @describe [绘制地图]
     *  @param    {[object]}   container [存放地图的容器]
     *  @param    {[object]}   config    [地图配置]
     *  @param    {[array]}   features  [description]
     */
        
      drawMap: function(config, features) {
         
          var _self = this
          var width = config.width
          var height = config.height
          if(window.secondMap ){
            height = 1080
          }
          var scale = _self.getZoomScale(features, width, height),
              center = _self.getCenters(features);

          var tooltips = d3.selectAll('.tooltip')
          if(tooltips.length) {
            tooltips.remove()
          }

          //地图投影
		  var scaleSize
      //有些二级地图显示不全，处理缩放倍数
      var cityAreaIds = ['500237', '500236', '500234']
		  if(navIndex==8){
			  scaleSize = 49
		  }else{
			  scaleSize = 50
		  }
      if(cityAreaIds.indexOf(cityAreaId) > -1){
        scaleSize = 48
      }
          projection = d3.geo.mercator()
              .scale(scale * scaleSize)
              .center(center)
              .translate([width / 2, (height/2 )])

          var path = d3.geo.path()
              .projection(projection)
   
          if(d3.select(container).selectAll('svg')[0].length > 0) {
              svg = d3.select(container).selectAll('svg').select('g')
          } else {
            svg = d3.select(container)
                .append('svg')
                .attr('id', 'mapWrap')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .classed('mainMap', true) 
                .classed('map-animation', false)
          }

          //调用滤镜
         // _self.filter(svg, features, path)

            //地图
            var mapController = {
                //行政区地图
                showmap: function(name, data, mainData) {
   
                    if(svg.selectAll('.draw-zhidui-map')) {
                        svg.selectAll('.draw-zhidui-map').remove()
                    }

                    if(svg.selectAll('.zhidui-area')) {
                        svg.selectAll('.zhidui-area').remove()
                    }
                    //地图配置项
                    var itemStyle = cfg.itemStyle  
                    var tooltipCfg  = cfg.tooltip
                    var emphasis = itemStyle.emphasis
                    //获取update部分
                    var update = svg.selectAll('.draw-' + name)
                        .data(data)

                    //获取enter部分
                    var enter = update.enter()

                    //获取exit部分
                    var exit = update.exit()

                    //处理update部分
                    update.attr('stroke', '#55b5f6')
                        .attr('class', 'draw-' + name)
                        .attr("stroke-width", 2)
                        .attr('fill',  function(d,i){
                          // if(i%2==0){
                          //   return itemStyle.fill[0]
                          // }else{
                          //   return itemStyle.fill[1]
                          // }
                          return '#0892ef'
                        })
                        .attr("d", path)
                        //添加过度动画
                        .style('opacity', function(){
                           d3.select(this)
                              .transition()
                              .duration(500)
                              .style('opacity', 1)
                           return  0.6
                        })
                    //处理enter部分
                    enter.append("path")
                        .attr('class', 'draw-' + name)
                        .attr('stroke', '#55b5f6')
                        .attr("stroke-width", 2)
                        .attr('fill',  function(d,i){
                          // if(i%2==0){
                          //   return itemStyle.fill[0]
                          // }else{
                          //   return itemStyle.fill[1]
                          // }

                          return '#0892ef'
                        })
                        .attr("d", path)
                        
                        .attr('cursor', 'pointer')
                        //添加过度动画
                        .style('opacity', function(){
                           d3.select(this)
                              .transition()
                              .duration(500)
                              .style('opacity', 1)
                           return  0.6
                        })
                        .on('mouseover', function(d, i){
                           var areaId = d.properties.ZZJGDM
							
                          d3.select(this)
                          .attr('fill', '#0578c6')
                          .attr('stroke', emphasis.stroke)
                          .attr('stroke-width', emphasis.strokeWidth)
 
                          //提示框位置及数据
                          var posi = path.centroid(d)
                          if(areaId=='500229000000'){
                            var posi = [posi[0], posi[1] + 60]
                          }

                          var data = {}
                          data.name = d.properties.name
                          data.value = 0
                          for(var i=0, len = areaData.length; i<len; i++){
                            var id = d.properties.id
                            if(id==areaData[i].troopsId){
                              data.value = areaData[i].value
                            }
                          }

                          // 添加提示框
                          if(window.thisNavs!='victory'){
                            _self.tooltip(posi, data)
                          }
                        })
                        .on('mouseout', function(d, i){
                        //当前区域改变颜色
                        d3.select(this)
                          .attr('fill',  function(){
                            return '#0892ef'
                          })
                          .attr('stroke', itemStyle.stroke)
                          .attr('stroke-width', itemStyle.strokeWidth)
                        //移出提示框
                         d3.selectAll('.'+mapTooltip).remove()
                        })
                        //地图点击事件
                        .on('click', function(d, i){
                          //移除快报战果
                          cityAreaId = d.properties.id

                          console.log(cityAreaId)
                          _self.removeVictory()
                           //不能钻取到三级(主城区除外) 
                          if(window.citySecondMap && !cityMainMap || cityMainThree){
                            mapIndex = 2
                            return
                          }
                          window.citySecondMap = true
                          //mainMapCode
                          window.secondMap = true
                         // $('.mainMap').css('animation-play-state', 'running')
                          //移出提示框
                          d3.selectAll('.'+mapTooltip).remove() 
                          //获取地区编码，通过id获取到相应的json数据
                          window.troopsId = d.properties.id 
                          var areaId = d.properties.ZZJGDM  
                          if(mainMapCode.indexOf(areaId)!=-1){
                            cityMainThree = true
                            $('.back').attr('id', 'cityMainBack')
                          }
                          window.mapUrl = mapPath+'/map/fenju/'+areaId+'.json' 
                          //请求地址
                          var dataUrl =  _self.commonUrl()
   
                          _index.getMap(dataUrl[0])
                          _index.getCaseNumber(dataUrl[1])
                          //钻取之后改变文字
                          switch(navIndex){
                            case 0:
                               $('.type-name').html('发案数')
                            break;
                            case 1:
                               $('.type-name').html('破案数')
                            break;
                          }
                          //显示返回按钮
                          $('.back').fadeIn()  
                          //调用返回按钮点击事件
                          _self.cityMapBack(svg, 1)    
                          
                        })

                        //合并主城
                        d3.selectAll('.mergeMainMap').remove()
                        if(mainData.length!=0){
                          svg.append("path")
                          .data(mainData)
                          .attr("d", path)  
                          .attr('fill', '#046bb1')
                          .attr('class', 'mergeMainMap')
                          .attr('cursor', 'pointer')
                          .on('mouseover', function(d){
                            d3.select(this)
                              .attr('fill', '#0578c6')
                            var posi = path.centroid(d)
                            var data = {
                              name: "主城区",
                              value: cityMainValue
                            }
                            _self.tooltip(posi, data)
                          })
                          .on('mouseout', function(d){
                            //移出提示框
                            d3.selectAll('.'+mapTooltip).remove()
                            d3.select(this)
                              .attr('fill', '#046bb1')
                          })
                          .on('click', function(d){
                           
                            window.citySecondMap = true
                            window.secondMap = true
                            cityMainMap = true
                            window.mapUrl = mapPath+'/map/fenju/222222.json' 
                            //主城区用mina标记
                            window.troopsId = 'main'

                             //钻取之后改变文字
                              switch(navIndex){
                                case 0:
                                   $('.type-name').html('发案数')
                                break;
                                case 1:
                                   $('.type-name').html('破案数')
                                break;
                              }

                            //请求地址
                           var dataUrl =  _self.commonUrl()

                          _index.getMap(dataUrl[0])
                          _index.getCaseNumber(dataUrl[1])
                            
                            //显示返回按钮
                            $('.back').fadeIn()  
                            //调用返回按钮点击事件
                            _self.cityMapBack(svg, 1) 
                            _self.removeVictory()
                          })
                        }
                        //处理exit部分
                        exit.remove()
                },

                /**
                 *  @describe [支队地图]
                 *  @param    {[type]}   name    [className]
                 *  @param    {[type]}   polygon [数据]
                 *  @param    {[type]}   x       [transform x]
                 *  @param    {[type]}   y       [transform y]
                 *  @param    {[type]}   scale   [transform scale]
                 */
                showmapByTroop: function(name,  polygon) {
                    var self = this
                    
                    d3.selectAll('.area-group').remove()

                    svg.selectAll('.area-group')
                          .data(polygon) 
                          .enter()
                          .append('g')
                          .attr('class', 'area-group')
                           .append('path')
                            .attr('class', function(d) {
                              if(d.troopsId=='main') {
                                return 'zhidui-main-area'
                              }
                              return 'zhidui-area'
                            })
                            .attr('d', path)
                            .attr('stroke', '#55b5f6')
                            .attr("stroke-width", function(){
                              if(window.isMapInit){
                                return 2
                              }else{
                                return 1
                              }
                            })
                            .attr('fill', function(d) {
                               if(d.name=='主城区') {
                                  return '#046bb1'
                                }
                                return '#0892ef'
                            })
                            .attr('id', function(d, i){
                              return 'path'+i
                            })
                            .attr('transform', 'translate(' + zdX + ',' + zdY + ')scale('+zdScale+')')
                            //添加过度动画
                            .style('opacity', function(){
                               d3.select(this)
                                  .transition()
                                  .duration(500)
                                  .style('opacity', 1)
                               return  0.5
                            })
                            .on('mouseover', function(d, x){
                              var areaIdFlags = parseInt(d.areaId, 10)
                              d3.select(this)
                                  .style('cursor', 'pointer')
                                  .attr('fill', '#0578c6')
                                  var data = {
                                    name: d.name,
                                    value: 0,
                                    value2: 0,
                                    value3: 0,
                                  }
                                  var troopsId = d.troopsId

                                  for(var i=0, len = areaData.length; i<len; i++){
                                    var troopsId2 = areaData[i].troopsId
                                    if(troopsId==troopsId2){
                                      //判断是否是人员在勤
                                      if(isPerson){
                                        data.name = areaData[i].troopsName
                                        data.value = areaData[i].zqValue
                                        data.value2 = areaData[i].xjValue
                                        data.value3 = areaData[i].zql
                                      }else{
                                        data.name = areaData[i].troopsName
                                        data.value = areaData[i].value
                                      }
                                    }
                                  }

                                  if(troopsId=='main'){
                                    data.name = '主城区'
                                    data.value = mainValue
                                    data.value2 = mainXjValue
                                    data.value3 = mainZqValue
                                  }

                                  // if(threeMap){
                                  //    window.isMainCity = false 
                                  // }
                                  //坐标点
                                  if(areaIdFlags>11){
                                    var posi = mainCoordinates[x]
                                    //三级地图取中心点
                                    if(threeMap){
                                      var posi = path.centroid(d)
                                      var posi = [posi[0]+50, posi[1]-220]
                                    }
                                  }else{
                                    var posi = coordinates2[x]
                                    var posi = [posi[0], posi[1] - 40]
                                  }

                                if(window.thisNavs!='victory'  ){
                                  _self.tooltip(posi, data)
                                }
                            })
                            .on('mouseout', function(d){
                                
                                  d3.select(this)
                                    .attr('fill', function(d) {
                                      if(d.troopsId === 'main') {
                                        return '#046bb1'
                                      }else {
                                        return '#0892ef'
                                      }
                                        
                                    })
                                  //移出提示框
                                  d3.selectAll('.'+mapTooltip).remove()
                            })
                            .on('click', function(d){
								 //如果 到了三级不能钻取，到的二级但非主城也不能钻取
                              if(window.thisNavs=='victory' || threeMap){
                                 return
                              }
                               _self.removeVictory() //移出快报战果
                              permiss = false  //权限(如果permiss为true，有权限控制，有些区域不可点击)
                              var troopsId = d.troopsId
                              //权限限制，设备资源，人员在勤没有权限不可点击
                              if( navIndex == 5 || navIndex == 6 ){
                                //当前点击的支队troopsId是否存在在返回的数据中，如果存在可点击，不存在没有权限点击
                                for(var i=0, len = allTroopsId.length; i<len; i++){
                                  var istroopsId = allTroopsId[i]
								 
                                  if(troopsId==istroopsId){
                                    permiss = true
                                  }
                                   //主城区 (如果有)
                                  if(troopsId=='main'){
                                     if(mainCityID.indexOf(istroopsId)>-1){
                                      var sIndex = mainCityID.indexOf(istroopsId)
                                       saveMainId.push(mainCityID[sIndex])
                                       permiss = true
                                     } 
                                  }
                                }
                								if(window.troopsId2==0){
                									permiss = true
                									permissId = 0 //返回人时候用
                								}
                                if(!permiss){
                                  return
                                }
                              }
                              
                              zhiduiName = d.name
                              areaIdFlag = parseInt(d.areaId, 10)
                            
                              if(window.isMainCity || backsecondMap){
                                window.isMainCity = false 
                              }
                              window.isMapInit = false
                              window.clickNav = false                             
                              d3.select('.mainMap').classed('map-animation', true)
                              var name = d.name
                              var polygon = []
                              polygon.push(d)
                             
                              //三级地图
                              if(areaIdFlag<11){
                                 zdMainMap = false
                                 window.zdSecondMap = true //主城以外的二级
                              }
                              if(areaIdFlag>11){
                                threeMap = true
                                zdMainMap = false
                                zdThreeMap2 = true
                                d3.selectAll('.back').attr('id', 'twoMap')
                              }
                               //console.log(navIndex, areaIdFlag)
                              switch(areaIdFlag){
                                case 0:        //二十八支队（永川片区）
                                  if( navIndex==3 || navIndex==2){  //技侦接办/侦破
                                    zdX = -80
                                  }else{
                                    zdX = -180
                                  }
                                  zdY = -2600
                                  zdScale = 3.3
                                  break;
                                case 1:      //二十九支队(南川片区)
                                  if(navIndex==7){
                                    zdX = -560  //设备资源的位置
                                  }else{
                                    zdX = -480
                                  }
                                  zdY = -1000
                                  zdScale = 1.6
                                  break; 
                                case 2:
                                  zdX = -250
                                  zdY = -1900
                                  zdScale = 3.3
                                  break;
                                case 3:
                                  zdX = -750
                                  zdY = -5300
                                  zdScale = 7.3
                                  break;  
                                case 4:  //4为两江新区，地图上没有
                                  zdX = 0
                                  zdY = 0
                                  zdScale = 0
                                  break;    
                                case 5:
                                  zdX = -4900
                                  zdY = -10800
                                  zdScale = 11.3
                                  break;   
                                case 6:
                                  zdX = -2600
                                  zdY = -3800
                                  zdScale = 5.5
                                  break; 
                                case 7:
                                  zdX = -4000
                                  zdY = -3700
                                  zdScale = 5
                                  break; 
                                case 8:
                                  if(navIndex==7 || navIndex==5 || navIndex==6 ){
                                    zdX = -1435
                                  }else{
                                    zdX = -1350
                                  }
                                  zdY = 0
                                  zdScale = 2
                                  break;
                                case 9:
                                  zdX = -1000
                                  zdY = -1000
                                  zdScale = 2.5
                                  break;
                                case 10:
                                  zdX = -1000
                                  zdY = -2660
                                  zdScale = 4
                                  zdMainMap = true
                                  window.isMainCity = true
                                  break;  
                                case 11:  //万州区支队
                                  //技侦接办/侦破/人员在勤
                                  if(navIndex == 3 || navIndex == 2 || navIndex==6 ){
                                    zdScale = 4.6
                                    zdX = -3300
                                    zdY = -1700
                                  }else if(navIndex==5){ //设备资源
                                    zdScale = 4.6
                                    zdX = -3350
                                    zdY = -1700
                                  }else{
                                    zdScale = 5
                                    zdX = -3600
                                    zdY = -1900
                                  }
                                  break;
                                //以下是主城区的支队  
                                case 12:   
                                  zdX = -2000
                                  zdY = -3850
                                  zdScale = 6
                                  break;
                                case 13:   
                                  zdX = -2100
                                  zdY = -4600
                                  zdScale = 6
                                  break;
                                case 14:
                                  zdX = -2900
                                  zdY = -6309
                                  zdScale = 9.3
                                  break;  
                                case 15:  //十八支队
                                  zdX = -3600
                                  zdY = -9909
                                  zdScale = 12
                                  break;  
                                case 16:
                                  zdX = -5300
                                  zdY = -11109
                                  zdScale = 14
                                  break;
                                case 17:
                                  zdX = -4700
                                  zdY = -9609
                                  zdScale = 12.5
                                  break;  
                                case 18:  //十七支队 
                                  zdX = -3700
                                  zdY = -9609
                                  zdScale = 12.5
                                  break;  
                                 case 19:  //十七支队 
                                  zdX = -10600
                                  zdY = -23111
                                  zdScale = 28.5
                                  break;  
                                case 20:  //十五支队 
                                  zdX = -6000
                                  zdY = -14609
                                  zdScale = 17.5
                                  break;  
                                case 21:  //二十五支队 两江新区
                                  zdX = -7000
                                  zdY = -15009
                                  zdScale = 19.5
                                  break;    
                              }
                              //重新供绘制地图
                              secondData = polygon
                              _self.renderMap(polygon, 0)
                              //如果是人员在勤和设备资源主城的troopsId要拼接
                              if( navIndex == 5 || navIndex == 6 ){
              								  if(areaIdFlag==10){
              									  window.troopsId2 = saveMainId.join('&')
              								  }else{
              									  window.troopsId2 = d.troopsId
              								  }
                              }else{
                                window.troopsId = d.troopsId
                              }
                             //请求地址       
                             var dataUrl =  _self.commonUrl()
                            //改变圆圈的值
                            _request.sendAjax(dataUrl[0], function(res){
                              var data = res.result
                              _self.renderTotal(data)
                            })
                            //底部案件类型
                            _index.getCaseNumber(dataUrl[1])
                              //显示返回按钮
                              $('.back').fadeIn()  
                              //调用返回按钮点击事件
                              _self.bindEvent(svg, 0)
                              if(window.thisNavs=='equipmentResource'){
                                var category = require('../equipmentResource/category.js')
                              }else{
                                var category = require('./category.js')
                              }
                              category.bindEvent(thisIndex, commonMapUrl, caseNumberUrl)   
                            })
                            .append("text")
                            .text(function (d, i) {
                              return d.name
                            })
                    }
                //}
            }

            return mapController
      },
      
      /**
       *  @describe [移出快报战果]
       *  @return   {[type]}   [description]
       */
      removeVictory: function(){
        d3.selectAll('.vicoryTooltip').remove()
        d3.selectAll('.carouselPoint').remove()
      },

      renderMap: function(mapData, type) {
		  
          var _self = this
		      if(window.isMainCity){
            zhiduiMergeData = mapData[0].dists
          }else{
            zhiduiMergeData = mapData
          }
          //按行政区域还是支队绘制地图，0表示支队，1表示行政区域
          var drawType = type ? type : 0
          //数据加载  

          d3.json(window.mapUrl, function (error, toporoot) {
            if (error) {
                return console.error(error);
            }
            //判断是一级地图还是二级地图
            if(window.secondMap){
              var root = toporoot
            }else{
               //将TopJSON对象转换成GeoJSON，保存在root中
              var root = topojson.feature(toporoot, toporoot.objects.chongqing)
            }
            
            var MAP_JSON_DATA = root.features
           
            //首先把地图画出来
            var mapController = _self.drawMap(cfg, MAP_JSON_DATA)

             //合并地图的数据
             //window.isMainCity 判断主城
             //console.log('是否主城区', window.isMainCity)
             if(window.isMainCity){
                var mergeUrl = mapPath+'/map/mergeMap1.json'
                _request.sendAjax(mergeUrl, function(res){
                  var mainData = res.result
                  mergeData(mainData)
                })
             }else{
                mergeData(mapData)
             }

             function mergeData(mapData){
                // console.log('mapData', mapData)
                //获取返回值中的最大值
              var maxValue = d3.max(mapData, function(d, i) {
                  return parseInt(d.value, 10)
              })
              //这几个是用来干嘛的，不懂
              var areaUnit = maxValue/6
              var unit = maxValue/300
              unit = unit.toFixed(2)
              //按支队绘制地图
              if(drawType == 0) {
                  //获取各个支队及所管辖的行政区域
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
                      mergePolygon.areaId = data.areaId
               
                      //下面这个不知道干嘛用的
                      mergePolygon.leve = Math.round(data.value/areaUnit)
                      mergePolygons.push(mergePolygon)
                  }

                  //显示支队地图
                  mapController.showmapByTroop("zhidui-map", mergePolygons);
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
                   var newMainAreaData  = [] // 主城各区域
                  
                    //主城区的值
                    var mainData = {}
                     mainValue = 0
                     mainXjValue = 0
                     mainZqValue = '100%'
                   for(var x = 0, len2 = areaData.length; x<len2; x++){
                     var troopsId = areaData[x].troopsId
                     var mainAllData = {} // 保存主城区区域数据
                     //主城区
                     for(var y = 0, len4 = mainCityID.length; y<len4; y++){
                      if(troopsId==mainCityID[y]){
                        if(isPerson){
                          mainValue += parseInt(areaData[x].zqValue, 10)
                          mainXjValue += parseInt(areaData[x].xjValue, 10)
                        }else{
                          // 后期维护修改所有值拉通比(20170810)
                          // 把主城区各支队保存起来
                          // if(!window.isMainCity){
                          //   mainAllData.value = areaData[x].value
                          //   mainAllData.name = areaData[x].troopsName
                          //   mainAllData.geoCoord = [-20, -20]
                          //   mainAllData.flag = 0
                          //   newMainAreaData.push(mainAllData)
                          // }
                          mainValue += parseInt(areaData[x].value, 10)
                        }
                        
                      }
                     }
                     // 地图合并的所有支队
                     for(var k = 0, len3 = mergeDatas.length; k<len3; k++){
                       var troopsId2 = mergeDatas[k].troopsId
                       var newAreaData = {}
                       //主城区
                       if(troopsId==troopsId2){
                          if(window.isMainCity || backsecondMap){
                            var geoCoord = mainCoordinates[k]
                            var geoCoord =  _self.flagPosition(geoCoord)
                          
                            if(navIndex == 5 || navIndex == 7){
                              var geoCoord = [geoCoord[0] + 70, geoCoord[1] - 55]
                            }else{
                              var geoCoord =  _self.flagPosition(geoCoord)
                            }

                          }else{
                            var geoCoord = projection(mergeDatas[k].geoCoord)
                            //console.log(geoCoord, k, mergeDatas[k].name)
                            //初始化一级地图
                            switch(k){
                              case 0:
                                geoCoord = [270, 950] //二十八支队
                              break;
                              case 1:
                                geoCoord = [800, 900] //二十九支队
                              break;
                              case 2:
                                geoCoord = [300, 700] //二十七支队
                              break;
                              case 3:
                                geoCoord = [185, 800] //二十四支队
                              break;
                              case 6:
                                geoCoord = [940, 870] //黔江支队
                              break;
                              case 7:
                                geoCoord = [1010, 320]
                              break;
                              case 8:
                                geoCoord = [720, 670]
                              break;
                              case 10:  
                                geoCoord = [860, 500] //万州支队
                              break;
                            }
                            //二级的点对齐
                             geoCoord =  _self.flagPosition(geoCoord)
                          }

                          newAreaData.geoCoord = geoCoord
                          newAreaData.name = areaData[x].troopsName
                          //在勤人员有两个值
                          if(isPerson){
                              newAreaData.value =  areaData[x].zqValue
                              newAreaData.value2 = areaData[x].xjValue
                              newAreaData.value3 = areaData[x].zql
                          }else{
                              newAreaData.value = areaData[x].value
                              
                          } 
                          newAareaDatas.push(newAreaData)
                       }
                     }
                   }  
                  // 合并主城区各区域数据(20170809)
                  //newAareaDatas = newAareaDatas.concat(newMainAreaData)
                  newAareaDatas = newAareaDatas.concat(saveAllDatas)
                  // mainData.value = mainValue
                  mainData.value = 0
                  mainData.value2 = 0
                  mainData.value3 = '100%'
                  mainData.name = '主城区'
                  mainData.geoCoord = [447.17799249883683, 868.1200368731916]
				          //areaIdFlag!=11是后面添加背景数据新加的
                  if(!window.zdSecondMap && window.thisNavs!='victory' && !window.isMainCity && !backsecondMap && areaIdFlag!=11){
                    newAareaDatas.push(mainData)
                  }
				
        					//有三个模块没数据要加柱子(技侦接办、技侦侦破、技侦在侦)
        					 //主城区
        					 var bgPosition = []
        					 if(navIndex == 2 || navIndex == 3 || navIndex ==4){
        						 if(window.isMainCity){
        							var bgPosition = mainCoordinates
        						  }else{
        							//其他二级
        							if(window.zdSecondMap || threeMap){
        							  var geoCoord = [100, 100]
        							  var bgPosition = _self.flagPosition()
        							}else{
        							  //一级
        							  var bgPosition = zhiduiFristCoor
        							}
        						} 
        					 }
                  _self.markPoint(projection, newAareaDatas, '#mapWrap', bgPosition) 
                  _self.addText(mergePolygons)
                 
              } else {
                  //显示行政区地图
                  var mergedPolygons = []

                  if(!window.citySecondMap){
                    //合并主城区
                    var southeast = d3.set(['渝北区', '巴南区', '北碚区', '九龙坡区', '南岸区', 
                      '江北区', '沙坪坝区', '大渡口区', '渝中区', '两江新区'
                    ])
                    var mergedPolygon = topojson.merge(toporoot, toporoot.objects.chongqing.geometries.filter(function(d){
                      return southeast.has(d.properties.name)
                    }))
                    
                    mergedPolygons.push(mergedPolygon)
                  }
                  //按行政区域绘制地图
                  mapController.showmap("map", root.features, mergedPolygons);
                  

                  var newAreaDatas = []
                  var cityMainData = {}
                  cityMainValue = 0

                  // 保存主城各区域的数据
                  var cityMainAreaDatas = []

                  for (var i = 0, len = areaData.length;  i < len; i++) {
                      var newAreaData = {}
                      var cityMainAreaData = {}
                      var areaName = areaData[i].name
                      //主城区value相加
                       for(var y = 0, len4 = mainCityName.length; y<len4; y++){

                        if(areaName==mainCityName[y]){
                          // 保存主城区区域的值
                          if(!window.cityMainMap) {
                            cityMainAreaData.name = areaData[i].name
                            cityMainAreaData.value = areaData[i].value
                            cityMainAreaData.flag = 0 // 首页不显示图标
                            cityMainAreaData.geoCoord = projection([106.5944, 29.5477]) 
                            cityMainAreaDatas.push(cityMainAreaData)
                          }
                          cityMainValue += parseInt(areaData[i].value, 10)
                        }
                       }
                  
                       //其他地区打点
                      for (var j = 0, len2 = root.features.length; j < len2 ; j++) {
                          var name = root.features[j].properties.name
                          if (root.features[j].properties.id == areaData[i].troopsId && mainCityName.indexOf(name) == -1) {
                            var geoCoord = root.features[j].properties.cp
                              //这里很搞笑，主城的时候cp竟然变字符串了，要处理下
                              if(typeof  geoCoord == 'string') {
                               var coor1 =  parseFloat(geoCoord.substr(1, 8))
                               var coor2 =  parseFloat(geoCoord.substr(10, 8))
                               var geoCoord = [coor1, coor2]
                              }
                              newAreaData.geoCoord = projection(geoCoord) 
                              newAreaData.name = areaData[i].name
                              newAreaData.value = areaData[i].value
                              newAreaDatas.push(newAreaData)
                          }
                      }
                  }

                  newAreaDatas = newAreaDatas.concat(cityMainAreaDatas)
                  cityMainData.geoCoord = projection([106.5944, 29.5477]) 
                  cityMainData.name = '主城区'
                  cityMainData.value = 0
                  if(!cityMainMap){
                    newAreaDatas.push(cityMainData)
                  }
                  _self.markPoint(projection, newAreaDatas, '#mapWrap') 
				          _self.cityAddText(projection, newAreaDatas, '#mapWrap')
              }
             }
             
            //})  
            
          })
      },

      /**
       *  @describe [坐标点]
       *  @param    {[type]}   areaIdFlag [description]
       *  @return   {[type]}   [description]
       */
      flagPosition: function(geoCoord){
        switch(areaIdFlag){
          case 0:
            geoCoord = [800, 500]  
          break; 
          case 1:
            geoCoord = [756, 500]  
          break; 
          case 2:
            geoCoord = [700, 450]  
          break; 
          case 3:
            geoCoord = [700, 600]  
          break; 
          case 5:
            geoCoord = [700, 600]
          break;
          case 6:
            geoCoord = [600, 600]
          break;
          case 7:
            geoCoord = [750, 600]
          break;  
          case 8:
            geoCoord = [808, 600]
          break;
          case 9:
            geoCoord = [800, 600]
          break;
          // case 10:
          //   geoCoord = [860, 500] //万州支队
          break;
          case 11:
            geoCoord = [750, 500]
          break;
          //以上是除主城外的所有支队
          case 12:
            geoCoord = [700, 600]
          break;
          case 13:
            geoCoord = [650, 600]
          break;
          case 14:
            geoCoord = [750, 550] //二十支队
          break;
          case 15:
            geoCoord = [650, 300]
          break;
           case 16:
            geoCoord = [600, 600]
           break;
          case 17:
            geoCoord = [700, 600]
          break;
          case 18:
            geoCoord = [800, 500]
          break;
          case 19:
            geoCoord = [700, 680]
          break;
          case 20:
            geoCoord = [700, 650]
          break;
          case 21:
            geoCoord = [700, 650]
          break;
        }

        return geoCoord
      },

    /**
     *  @describe [地图提示框]
     *  @param    {[type]}   posi [提示位置]
     *  @param    {[type]}   d    [显示数据]
     *  @return   {[type]}   [description]
     */
     tooltip: function(posi, data){

        var tooltipCfg = cfg.tooltip
        var dataType = typeof(data)
        var html = ''
        if(dataType=='string'){
          html = data
        }else{
          var tooltipCfg  = cfg.tooltip
          var name = data.name
          if(name==undefined){
            name = zhiduiName
          }
          var incidence = data.incidence
          var value = data.value
          var valueStr = ''
          var total = 0
          //value2为休假人数
          var value2 = data.value2
          var total = value+value2
          var rate0 = value/total
          var rate = rate0.toFixed(2) * 100 + '%'
          //在勤率
          var rate = data.value3
          //var rate = Math.floor(value/total*100)+'%'
          if(rate=='NaN%'){
            rate = 0
          }
 
          //判断是否为人员在勤
          if(isPerson){
            html = '<div class="area-name">'+name+'</div>'
              + '<div class="area-total ">在勤人数：<span>'+value+'</span></div>'
              + '<div class="area-total">休假人数：<span>'+value2+'</span></div>'
              + '<div class="area-total">在勤率：<span>'+rate+'</span></div>'
              + '<div class="area-type-num">'+valueStr+'</div>'
          }else{
            html = '<div class="area-name">'+name+'</div>'
              + '<div class="area-total">'+tooltipType+'：<span>'+value+'</span></div>'
              + '<div class="area-type-num">'+valueStr+'</div>'
          }
        }
       
        if(mapType==1){
          var left = posi[0]
          var top = posi[1] - 210
           //主城区的不好捕获，对top处理
            if(cityMainMap){
              top = top - 100
            }
        }else{
          if(isPerson){
            var left = d3.event.pageX/window.X - 1000
            var top = d3.event.pageY/window.Y - 600
          }else{
            var left = d3.event.pageX/window.X - 1000
            var top = d3.event.pageY/window.Y - 400
          }
        }
        if(top < -50){
			   top = -10
		  }
        //添加提示框
        var tooltip = d3.select('#'+cfg.id)
              .append('div')
              .attr('class', function(){
                if(isPerson){
                  return tooltipCfg.className + ' person-tooltip'
                }else{
                 return tooltipCfg.className
                }
              })
              // .style('left', ''+(posi[0])+'px')
              // .style('top', ''+(posi[1]-360)+'px')
              .style('left', ''+left+'px')
              .style('top', ''+top+'px')
              .style('display', 'none')
              .html(html)

        $('.'+tooltipCfg.className+'').fadeIn()  

        // $('.tooltip').on('mouseover', function(evt){
        //   d3.selectAll('path').attr('fill', '#0892ef')
        //   $(this).remove()
        // })   
    },

    addText: function(polygon){
       var _self = this
       var index  = _self.isNavIndex()
        d3.selectAll('.zhidui-text-group').remove()
        d3.select('#mapWrap')
          .insert('g', '#mapWrap')
          .attr('class', 'zhidui-text-group')
          .selectAll('.zhidui-text')
          .data(polygon)
          .enter()
          .append('text')

          .attr('x', function(d, i){
          if(window.isMainCity || backsecondMap){
            var posi = mainCoordinates[i][0]
          }else if(window.thisNavs=='victory'){
            var posi = victoryCoordinates[i][0] 
          }else{
            var posi = coordinates[i][0]
          }
          return posi 
        })
        .attr('y', function(d, i){
          if(window.isMainCity || backsecondMap){
            //电信资源、设备资源
            var posi = mainCoordinates[i][1]
          }else if(window.thisNavs=='victory'){
            var posi = victoryCoordinates[i][1] 
          }else{
            //地图添加的饼图要重新调位置
            if(index == 5 || index == 7){
              var posi = coordinates[i][1] + 27
            }else{
              var posi = coordinates[i][1]
            }
          }
          return posi
        })
        .text(function(d, i){
          var areaId = parseInt(d.areaId, 10)
          //4为两江新区，地图上没有
          var name = d.name
          if(name==undefined){
            return
          }
          var j = name.indexOf('（')
          var j2 = name.indexOf('区')
          
          if( j2>0 && j2<5 ){
            var name = d.name
          }else{
            var name = name.substr(0, j)
          }
          if(areaId==4){  
            return ''
          }else{
            return name
          }
        })
        .attr('font-size', 29)
        .attr('fill', '#fff')
    },

	
	cityAddText: function(projection, textData, id){
		d3.selectAll('.city-text-group').remove()
		var markPoint = d3.select(id)
        .insert('g', id)
        .attr('class', 'city-text-group')
		
		markPoint.selectAll('.city-text')
			.data(textData)
			.enter()
			.append('text')
			.text(function(d, i){
				var name = d.name
				if(cityMainMap){
					if(d.name=='两江新区'){
						name = name.substr(0, 4)
					}else{
						name = name.substr(0, 3)
					}
				}else{
					name = name.substr(0, 2)
				}
				return name
			})
			.attr('x', function(d, i){
				if(cityMainMap){
					var x = d.geoCoord[0] - 45
				}else{
					var x = d.geoCoord[0] - 25
				}
				return x
			})
			.attr('y', function(d, i){
				// if(d.name=='主城区'){
					// var y = d.geoCoord[1] + 20
				// }else{
					// var y = d.geoCoord[1] + 50
				// }
				return d.geoCoord[1] + 50
			})
			.attr('fill', function(d) {
        if(d.flag==0){
          return 'none'
        }
        return '#fff'
      })
			.attr('font-size', '24px')
			
	},

    /**
     * @describe [地图添加柱子数据]
     * @param {function} projection 计算点位置的一个算法
     * @param {Object} markData 点的经纬度数据
     * @param {Object} markData 容器id
     */ 
    markPoint: function(projection, areaData, id, bgPosition){
     
      var _self = this

      //标注点配置
      d3.selectAll('.markPoint').remove()
      var markCfg = cfg.markPoint
      var symbol = markCfg.symbol

      //标注点
      var markPoint = d3.select(id)
        .insert('g', id)
        .attr('class', 'markPoint')

      var dataset = []
      for(var i=0, len = areaData.length; i<len; i++){
        dataset.push(areaData[i].value)
      } 

      if(symbol=='bar'){ //柱子
        //背景及数据配置项
        var BgX =   markCfg.width/2
        var BgY = markCfg.height
        var bgimgUrl = markCfg.bgimgUrl
        var dataimgUrl = markCfg.dataimgUrl
        
        //定义比例尺
        var dataLinear = d3.scale.linear()
              .domain([0, d3.max(dataset)])
              .range([0, markCfg.height])
     
  		 if(navIndex == 2 || navIndex == 3 || navIndex ==4){
  			 //没有数据的柱子背景
  				var bgCfg = {
  				  x: BgX,
  				  y: BgY,
  				  width: markCfg.width,
  				  height: markCfg.height,
  				  isBg: 'bg',
  				  imgUrl: bgimgUrl
  				}
  				addPoint2(bgCfg, bgPosition) 
  		}
       
        //柱子背景
        var bgCfg = {
          x: BgX,
          y: BgY,
          width: markCfg.width,
          height: markCfg.height,
          isBg: 'bg',
          imgUrl: bgimgUrl
        }
        addPoint(bgCfg, '', [])   
        //数据
        var dataCfg = {
          x: BgX,
          y: BgY,
          width: markCfg.width,
          height: markCfg.height,
          isBg: 'data',
          imgUrl: dataimgUrl
        }

        addPoint(dataCfg, dataLinear, dataset)
     }else if(symbol=='pie'){  //六边形
        var hexagonCfg = markCfg.hexagon
        var linear = d3.scale.linear()
              .domain([0, d3.max(dataset)])
              .range([0.04, 1])

       var pointLength = areaData.length
       for(var i=0; i<pointLength; i++){
          var per = linear(areaData[i].value)
          if(per>1){
            per = 1
          }
       
          var coor = areaData[i].geoCoord
          var polygonX=  coor[0]
          var polygonY= coor[1]

          hexagonCfg.sideLength = hexagonCfg.polygon.sideLength
          hexagonCfg.polygonX = polygonX,
          hexagonCfg.polygonY = polygonY,
          hexagonCfg.per = per
          //value不为0才添加数据标注点
    		  var name =  areaData[i].name
    		  if(name=='主城区' && mainValue!=0){
    			  if(mapType==0){
    				  areaData[i].value = mainValue
    			  }else{
    				  areaData[i].value = cityMainValue
    			  }
    			   
    			  // 主城不显示(20170810)
            hexagonCfg.per = 0
    			  //hexagonCfg.polygonY = polygonY - 50
    			  _self.drawPercentChart(markPoint, hexagonCfg, areaData[i])
    		  }
            if(dataset[i]!=0){
              _self.drawPercentChart(markPoint, hexagonCfg, areaData[i])
            }
      }
     }
	 
	 /**
      *  @describe [没有数据的背景柱子]
      *  @param    {[type]}   cfg [description]
      */
     function addPoint2(cfg, posi){
      var allBarbg = markPoint.selectAll('.image2')
        .data(zhiduiMergeData)
        .enter()
        .append('image')
        .attr('x', function(d, i){
         
          if(window.isMainCity){
            var geoCoord = posi[i]
            var coor = geoCoord[0] + 57.5
          }else{
             
              if(window.zdSecondMap || threeMap){
                var coor = posi[0] - 12.5
              }else{
                var geoCoord = posi[i]
                var coor = geoCoord[0] - 12
              }
          }
          // 涪陵柱子对不齐
          if(d.areaId=='7') {
            coor = coor + 1
          }
          return coor
        })
        .attr('y', function(d, i){
          if(window.isMainCity){
             var geoCoord = posi[i]
            var coor = geoCoord[1]  - 145
          }else{
            if(window.zdSecondMap || threeMap){
                var coor = posi[0] - 308
            }else{
             var geoCoord = posi[i]
             var coor = geoCoord[1] - 105
            }
            
          }
          return coor
        })
        .attr('width', 25)
        .attr('height', 105)
        .attr('xlink:href', cfg.imgUrl)
        .attr({
          'xlink:href': function(d) {
            var href = '' 
            if(d.troopsName =='万州区支队' || d.name =='万州区支队'){
              d3.select(this).style('display', 'none')
            }else{
              href = cfg.imgUrl
            }
             //var href = cfg.imgUrl
            return href
          }
        })
        .attr('class', 'bg-bar')
     }
     if(window.zdSecondMap || threeMap){
        d3.selectAll('.bg-bar').remove()
     }
 
     /**
        *  @describe [添加地图上的柱子]
        *  @param    {[object]}   cfg           [配置项]
        *  @param    {[object]}   linear      [比例尺]
        *  @param    {[data]}   data          [柱子数据]
        */
       function addPoint(cfg, linear, data){
        var tooltipCfg  = cfg.tooltip
         //获取update部分
        var update = markPoint.selectAll('.image')
          .data(areaData)

        renderData(update)  

        //获取enter部分
        var enter = update.enter()

        //获取exit部分
        var exit = update.exit() 

        //处理enter部分
        var enters = update.enter().append('image')
        renderData(enters)
        /**
         *  @describe [渲染数据]
         *  @param    {[type]}   $this [update, enters]
         */
        function renderData($this){
          $this
            .attr("x", function(d, i){
              var geoCoord = d.geoCoord
              if(window.isMainCity){
                var coor = geoCoord[0] + 70
              }else{
                var coor = geoCoord[0] 
              }
              var isBg = cfg.isBg
              // 柱子对不齐微调
              var zhiduiName = ['涪陵区支队', '二十八支队（永川片区）', '二十九支队（南川片区）', '黔江区支队', '三十一支队（云阳片区）', '二十一支队（万盛区）']
              var name = zhiduiName.indexOf(d.name)
              // 技侦在侦

              if(navIndex==4) {
                if(isBg!='bg' && name > -1) {
                  coor = coor + 0.3
                }
                if(isBg!='bg' && name > 1) {
                  coor = coor + 0.5
                }
                if(isBg!='bg' && name == 5) {
                  coor = coor - 0.8
                }
              }
              if(navIndex==2 || navIndex==3) {
                if(isBg!='bg' && name == 0 || isBg!='bg' && name == 5) {
                  coor = coor - 0.3
                }
              }
              return coor  - cfg.x 
            })
          .attr("y",function(d, i){
            //var coor = d.geoCoord[1]
            var geoCoord = d.geoCoord
            if(window.isMainCity){
              var coor = geoCoord[1] - 30
            }else{
              var coor = geoCoord[1] 
            }
            var isBg = cfg.isBg
            if(isBg=='bg' || isBg == 'line'){
              return coor  - cfg.y
            }else{
              var y = coor  - linear(data[i]) 
              if(y < coor - cfg.y){
                y = coor - cfg.y
              }
      			  if(d.name=='主城区'){
                y = coor - 105
              }
              return y
            }
            
          })
          .attr('width',function(){
            return  cfg.width 
          })
          .attr('height', function(d, i){
            var isBg = cfg.isBg
            if(isBg=='bg' || isBg == 'line'){
      				if(mainValue == 0){
      					return 0
      				}else{
      					return cfg.height
      				}
              
            }else{
              var height = linear(data[i])
              if(height>cfg.height){
                height = cfg.height
              }
              if(height<5 && height>0){
                height = 10
              }
      			  if(d.name=='主城区'){
                height = 105
      				if(mainValue==0){
      					height = 0
      				}else{
      					height = 105
      				}
            }
              return height
            }
        
          })
          .attr('xlink:href', function(d, i){
            var href = '' 
            if(d.value==0){
              d3.select(this).style('display', 'none')
            }else{
              href = cfg.imgUrl
            }
			       //var href = cfg.imgUrl
            return href
          })
          .attr('preserveAspectRatio', 'none')
          .attr('Response.ContType', 'image/Jpeg')
          .attr('class', 'mapData-img')
          .attr('id', function(d, i){
            return 'path'+i
          })
          .on('mouseover', function(d, i){
            // var $thisId = $('.mainMap').find('.area-group').eq(i).html()
            // console.log($thisId)
            if(d.name=='主城区'){
               d.value = mainValue
             }
             _self.tooltip(d.geoCoord, d)
          })
          .on('mouseout', function(){
             d3.selectAll('.zhidui-main-area').attr({
              'fill':'#046bb1'
             })
             d3.selectAll('.zhidui-area').attr({
              'fill':'#0892ef'
             })
             //移出提示框
             d3.selectAll('.'+mapTooltip).remove()
          })  
        }
        //处理exit部分
        exit.remove()
       }
		
		//人员在勤主城莫名其妙多根柱子，把他处理掉
	   if(navIndex == 5 || navIndex == 6){
		   if(allTroopsId.length==0){
		     d3.selectAll('.mapData-img').remove()
		   }
	   }

    // 二级地图十二支队有根背景柱子(去掉)
    if(backsecondMap) {
      d3.selectAll('.bg-bar').remove()
      console.log(zdMainMap)
    }

    },

     /**
     *  @describe [绘制六边形]
     *  @param    {[type]}   markPoint [g元素]
     *  @param    {[type]}   config    [配置项]
     *  @return   {[type]}   [description]
     */

    drawPercentChart: function(markPoint, cfg, data){
      var _self = this
      //构造绘制六边形的数据
        var points=[];
        points.push([cfg.polygonX,cfg.polygonY-cfg.sideLength])
        points.push([cfg.polygonX+Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY-cfg.sideLength/2])
        points.push([cfg.polygonX+Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY+cfg.sideLength/2])
        points.push([cfg.polygonX,cfg.polygonY+cfg.sideLength])
        points.push([cfg.polygonX-Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY+cfg.sideLength/2])
        points.push([cfg.polygonX-Math.sqrt(3)*cfg.sideLength/2,cfg.polygonY-cfg.sideLength/2])
        //创建多边形组
        var hexagon = markPoint.append('g')
          .attr('class', 'hexagonG-group')
          .on('mouseover', function(){
            d3.select(this)
              .style('cursor', 'pointer')
              var name = data.name
              var geoCoord = data.geoCoord
              if(name=='城口县'){
                var geoCoord = [geoCoord[0], 166]
              }

              _self.tooltip(geoCoord, data)
          })
          .on('mouseout', function(){
            //移出提示框
             d3.selectAll('.'+mapTooltip).remove()
          })
          //绘制圆  
          hexagon
            .append('circle')
            .attr('cx',  cfg.polygonX)
            .attr('cy', cfg.polygonY)
            .attr('r', 35 )
            .attr('fill', function() {
              if(data.name=='主城区' || data.flag==0) {
                return 'none'
              }
              return cfg.circle.fill
            })
            .attr('stroke-width', cfg.circle.strokeWidth)
            .attr('stroke', function() {
              if(data.name=='主城区' || data.flag==0) {
                return 'none'
              }
              return cfg.circle.stroke
            })
          //绘制六边形    
        hexagon
          .append('polygon')
          .attr('points',points.toString())
          .attr('fill', function() {
            if(data.name=='主城区' || data.flag==0) {
              return 'none'
            }
            return cfg.polygon.fill
          })
          .attr('stroke-width', cfg.polygon.strokeWidth)
          .attr('stroke', function() {
            if(data.name=='主城区' || data.flag==0) {
              return 'none'
            }
            return cfg.polygon.stroke
          })

        var polylineArr=[];//存放绘制动态多边形的数据
        var angle=cfg.per*2*Math.PI;//百分比对应的弧度
        //条件判断，不同的弧度范围对应不同的计算方式
        if(angle>=0 && angle<=Math.PI/3){
            polylineArr=points.slice(0,1);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0]+Math.sin(angle)*cfg.sideLength*Math.sin(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-angle))
            tempArr.push(polylineArr[polylineArr.length-1][1]+Math.sin(angle)*cfg.sideLength*Math.cos(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-angle))
            polylineArr.push(tempArr);
        }else if(angle>Math.PI/3 && angle<=2*Math.PI/3){
            polylineArr=points.slice(0,2);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0])
            tempArr.push(polylineArr[polylineArr.length-1][1]+Math.sin(angle-Math.PI/3)*cfg.sideLength/Math.sin(Math.PI-Math.PI/3-(angle-Math.PI/3)))
            polylineArr.push(tempArr);
        }else if(angle>2*Math.PI/3 && angle<=Math.PI){
            polylineArr=points.slice(0,3);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0]-Math.sin(angle-2*Math.PI/3)*cfg.sideLength*Math.sin(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-2*Math.PI/3)))
            tempArr.push(polylineArr[polylineArr.length-1][1]+Math.sin(angle-2*Math.PI/3)*cfg.sideLength*Math.cos(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-2*Math.PI/3)))
            polylineArr.push(tempArr);
        }else if(angle>Math.PI && angle<=4*Math.PI/3){
            polylineArr=points.slice(0,4);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0]-Math.sin(angle-Math.PI)*cfg.sideLength*Math.sin(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-Math.PI)))
            tempArr.push(polylineArr[polylineArr.length-1][1]-Math.sin(angle-Math.PI)*cfg.sideLength*Math.cos(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-Math.PI)))
            polylineArr.push(tempArr);
        }else if(angle>4*Math.PI/3 && angle<=5*Math.PI/3){
            polylineArr=points.slice(0,5);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0])
            tempArr.push(polylineArr[polylineArr.length-1][1]-Math.sin(angle-4*Math.PI/3)*cfg.sideLength/Math.sin(Math.PI-Math.PI/3-(angle-4*Math.PI/3)))
            polylineArr.push(tempArr);
        }else{
            polylineArr=points.slice(0,6);
            var tempArr=[];
            tempArr.push(polylineArr[polylineArr.length-1][0]+Math.sin(angle-5*Math.PI/3)*cfg.sideLength*Math.sin(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-5*Math.PI/3)))
            tempArr.push(polylineArr[polylineArr.length-1][1]-Math.sin(angle-5*Math.PI/3)*cfg.sideLength*Math.cos(Math.PI/3)/Math.sin(Math.PI-Math.PI/3-(angle-5*Math.PI/3)))
            polylineArr.push(tempArr);
        }
        //把正六边形的中心点加进去
        polylineArr.push([cfg.polygonX,cfg.polygonY]);
        //绘制动态图形
        var linePath=d3.svg.line();
        hexagon
          .append('path')
          .attr("d",linePath(polylineArr))
          .attr('fill', function() {
              if(data.name=='主城区' || data.flag==0) {
                return 'none'
              }
              return cfg.path.fill
          })
    },


    /**
     *  @describe [判断导航的index]
     *  @return   {Boolean}  [description]
     */
    isNavIndex: function(){
      var ALLNAVS = ['cityIncidence', 'cityDetection', 'takeCase', 'detectiveCase', 'index', 'equipmentResource', 'personnelFrequently', 'telecomResources', 'victory']
      var thisNav = window.thisNavs
      var index = indexOf(ALLNAVS, thisNav)
      return index
    },

    /**
     *  @describe [行政区地图返回]
     *  @return   {[type]}   [description]
     */
    cityMapBack: function(){
      var _self = this
      // 全市返回
      $(document).on('click', '#cityBack', function(evt){
        window.citySecondMap = false
         d3.select('.map').selectAll('path').style('opacity', 0.1)
        cityMainMap = false
        window.secondMap = false
        window.troopsId = 0
        if(cityMainMap){
          window.mapUrl = mapPath+'/map/fenju/222222.json'  
        }else{
          window.mapUrl = mapPath+'/map/'+cfg.area+'.json'  
          $(this).hide()
        }
      window.troopsId = 0
      //回到主城还原显示名称
       switch(navIndex){
        case 0:
           $('.type-name').html('全市发案数')
        break;
        case 1:
           $('.type-name').html('全市破案数')
        break;
      }
       //请求地址
        var dataUrl =  _self.commonUrl()
         _index.getMap(dataUrl[0])
         _index.getCaseNumber(dataUrl[1])
      })

      $(document).on('click', '#cityMainBack', function(evt){
        $(this).attr('id', 'cityBack')
         d3.select('.map').selectAll('path').style('opacity', 0.1)
        cityMainThree = false
        window.troopsId = 'main'
        window.mapUrl = mapPath+'/map/fenju/222222.json'  
        //请求地址
        var dataUrl =  _self.commonUrl()
        _index.getMap(dataUrl[0])
        _index.getCaseNumber(dataUrl[1])
      })
    },


    /**
     *  @describe [支队点击返回]
     *  @param    {[object]}   svg [svg容器]
     */
    bindEvent: function(svg, type){

      var _self = this
       //返回二级地图(主城区)
      $(document).off('click', '#twoMap').on('click', '#twoMap', function(evt){
        zdMainMap = true
        backsecondMap = true    
        window.isMainCity = true
        backMap()
        $(this).attr('id', 'firstMap')
      })
      //返回一级地图
      $(document).off('click', '#firstMap').on('click', '#firstMap', function(evt){
        backsecondMap = false    
        window.isMainCity = false
        window.isMapInit = true
        backMap()
      })

      /**
       *  @describe [地图返回]
       */
      function backMap(){
        //防止返回时抖动
        d3.select('.map').selectAll('path').style('opacity', 0.1)
        areaIdFlag = -1
        window.secondMap = false
        window.zdSecondMap = false
        //返回主城的troopsId赋值
       
        if(backsecondMap){
          if( navIndex==5 || navIndex==6){
            window.troopsId2  = saveMainId.join('&')  //人员在勤要返回对应可访问的主城id 
          }else{
            window.troopsId = 'main'   //其他模块点击主城区返回main参数
          }
        }else{
    		   if(navIndex==5 || navIndex==6){
				   
				   if(window.saverroopsId==0){
					   window.troopsId2 = 0
				   }else{
					   window.troopsId2 = window.saverroopsId
				   }
    		   }else{
    			   window.troopsId = 0   //返回一级地图赋值为0
    		   }
      }
        
        //返回一级地图
        if(!type){
          zdX = 0
          zdY = 0
          zdScale = 1
        }else{
          window.mapUrl = mapPath+'/map/'+cfg.area+'.json' 
        }
        
        //三级地图
        if(threeMap){
          threeMap = false
          mergeUrl = mapPath+'/map/mergeMap1.json'
          zdX = -1000
          zdY = -2650
          zdScale = 4
        }else{
          mergeUrl = mapPath+'/map/mergeMap0.json'
          d3.select('.back').style('display', 'none')
        }

        //请求地址
         var dataUrl =  _self.commonUrl()
        
        //测试数据
         var map = mapPath+'/mergeMap.json'
         var caseNumber = mapPath+'/caseNumber.json'
         var dataUrl = [map, caseNumber]

        _index.getMap(dataUrl[0])
        _index.getCaseNumber(dataUrl[1])

      }

      //关闭弹窗
      $(document).on('click', '.close-model', function(evt){
        $('.model-bg').fadeOut(500)
        $('.show-modal-dialog').html('')
      })
    },

    /**
     *  @describe [地图旁边的总数]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    renderTotal: function(data){
      var _self = this
      var total = data.total
      // var duibuTotal = data.duibuTotal
      // $('.duibu-total')  .html(duibuTotal)
       $('.count-num').html(total)
      switch(navIndex){
        case 2:
          total = Math.floor(total * 100) + '%'
		      $('.count-num').html(total)
        break;
        case 3:
          total = Math.floor(total * 100) + '%'
		  $('.count-num').html(total)
        break;
        case 4:
          total = total 
		  $('.count-num').html(total)
        break;
        case 6:
          var attendance = data.attendance  //在勤
          var vacation = data.vacation  //休假
          //在勤率 = 在勤人数/总人数
          var totals = attendance+vacation
          var rate0 = attendance/totals
          var rate = rate0.toFixed(2) * 100 + '%'
          
		  if(rate=='NaN%'){
			  rate = 0
		  }
          $('.count1').find('.count-num').html(attendance)
          $('.count2').find('.count-num').html(vacation)
          $('.count3').find('.count-num').html(rate)
        break;
		case 7:
          var  total = data.total
          var  perCapita = data.perCapita
			
          $('.count1').find('.count-num').html(perCapita)
          $('.count2').find('.count-num').html(total)
		
		break;
      }
      if(window.xzIndex=='index2') {
        // total = Math.floor(total * 100) + '%'
        $('.count-num').html(total)
      }

    },

    /**
     *  @describe [共用的地址]
     *  @return   {[type]}   [description]
     */
    commonUrl: function(){

      //其他几个模块共用url
      var commonUrl = '/type/'+window.oneType+'/childType/'+window.childType+'/'+window.areaIds+'/'+window.troopsId
      var commonTimeUrl = '/startTime/'+window.startTime+'/endTime/'+window.endTime
       if(!window.isTime){
          var MAPURL = commonMapUrl + commonUrl
          var CASENUMBERURL = caseNumberUrl + commonUrl
          
       }else{
          var MAPURL = commonMapUrl + commonUrl + commonTimeUrl
          var CASENUMBERURL = caseNumberUrl + commonUrl + commonTimeUrl
       }

      var navs = ['equipmentResource', 'personnelFrequently', 'telecomResources', 'victory']
      var thisNav = window.thisNavs
      var index = indexOf(navs, thisNav)
      //0设备资源, 1人员在勤， 2电信资源
      switch(index){
        case 0:  
          var commonUrl = '/type/'+window.oneType+'/deviceState/'+window.deviceState+'/troopsId/' + window.troopsId2
          var MAPURL = window.BASEURL + 'equipmentResource/map' + commonUrl 
          var CASENUMBERURL = window.BASEURL + 'equipmentResource/deviceNumber' + commonUrl 
        break;
        case 1:
          var commonUrl = '/troopsId/' + window.troopsId2
          var MAPURL = window.BASEURL + 'personnelFrequently/map' + commonUrl
          var CASENUMBERURL = window.BASEURL + 'personnelFrequently/attendanceNumber' + commonUrl
          var MAPURL = mapPath +'/person-mergeMap2.json'
          var CASENUMBERURL = mapPath +'/person-caseNumber2.json'
        break;
        case 2:
          var commonUrl = '/troopsId/' + window.troopsId
          var MAPURL = window.BASEURL + 'telecomResources/map' + commonUrl
          var CASENUMBERURL = window.BASEURL + 'telecomResources/controlNumber' + commonUrl
      }

      var MAPURL = mapPath +'/map2.json'
      var CASENUMBERURL = mapPath +'/city-caseNumber.json'
		
      var dataUrls = [MAPURL, CASENUMBERURL]
      
      return  dataUrls
    },

    /**
     * @describe [给地图添加滤镜效果]
     * @param {Object} mapSvg 存放地图的svg容器
     * @param {Object} features 地图各区域块的数据
     * @param {function} path 取得或设置地理投影,D3的一个方法函数
     */
    filter: function(mapSvg, features, path){
      d3.selectAll('.filterG2').remove()
      //滤镜配置项
      var fCfg = cfg.itemStyle.filters
      //添加一个滤镜效果
      var filter = mapSvg.append("defs").append("filter")
          .attr("id", "gaussinaBlur")
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', '100%')
          .attr('height', '100%')
  
      filter.append("feGaussianBlur")
          .attr("result", "blurOut")
          .attr("in", "offOut")
          .attr("stdDeviation", "10")
            
      //底部添加一个地图并加阴影效果
      // mapSvg.insert('g', '.mainMap')
      //    .classed('filterG2', true)
      //    .selectAll('path')
      //    .data(features)  
      //    .enter().append('path')
      //    .attr('d', path)
      //    .attr('transform','translate(0,24)')
      //    .attr('filter', 'url(#gaussinaBlur)')
      //    .attr('fill', fCfg.fill[0])  
      //    .attr('opacity', fCfg.opacity)
             
     // var filterG = mapSvg.insert('g', '.mainMap')
     //     .classed('filterG', true)
     //     .selectAll('path')
     //     .data(features)  
     //     .enter()
     //     .append('path')
     //     .attr('d', path)
     //     .attr('transform', 'translate(0,12)')
     //     .attr('fill', fCfg.fill[1])
     //     .attr('stroke', fCfg.stroke)  
     //     .attr('stroke-width', fCfg.strokeWidth)      
            
    },

    /**
     *  @getZoomScale  [地图缩放]
     *  @param     {[object]}    features [地图数据]
     *  @param     {[number]}    width    [容器width]
     *  @param     {[number]}    height   [容器height]
     */
    getZoomScale: function(features, width, height) {
      var longitudeMin = 100000; //最小经度
      var latitudeMin = 100000; //最小维度
      var longitudeMax = 0; //最大经度
      var latitudeMax = 0; //最大纬度
      features.forEach(function(e) {
        var a = d3.geo.bounds(e); //[[最小经度，最小维度][最大经度，最大纬度]]
        if (a[0][0] < longitudeMin) {
          longitudeMin = a[0][0];
        }
        if (a[0][1] < latitudeMin) {
          latitudeMin = a[0][1];
        }
        if (a[1][0] > longitudeMax) {
          longitudeMax = a[1][0];
        }
        if (a[1][1] > latitudeMax) {
          latitudeMax = a[1][1];
        }
      });

      var a = longitudeMax - longitudeMin;
      var b = latitudeMax - latitudeMin;
      /*if(a > b) {//按照宽度进行缩放
        return width/a;
      } else {
        return height/b;
      }*/

      return Math.min(width / a, height / b)
    },

    /**
     *  @getZoomScale  [获取中心点]
     *  @param     {[object]}    features [地图数据]
     */
    getCenters: function(features) {
      var longitudeMin = 100000;
      var latitudeMin = 100000;
      var longitudeMax = 0;
      var latitudeMax = 0;
      features.forEach(function(e) {
        var a = d3.geo.bounds(e);
        if (a[0][0] < longitudeMin) {
          longitudeMin = a[0][0];
        }
        if (a[0][1] < latitudeMin) {
          latitudeMin = a[0][1];
        }
        if (a[1][0] > longitudeMax) {
          longitudeMax = a[1][0];
        }
        if (a[1][1] > latitudeMax) {
          latitudeMax = a[1][1];
        }
      });
      var a = (longitudeMax + longitudeMin) / 2;
      var b = (latitudeMax + latitudeMin) / 2;
      return [a, b];
    }

  }

  return drawMap
})