/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-13 16:08:27
 * @Description: 右边模块JS文件
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-03-13 16:08:27
 */

define(function(require){


  
  window.oneType = 0    //一级导航类型
  window.troopsId = 0   //地图区域
  var _index = ''
  var masterFiles = ''
  var childDatas = []
  window.deviceState = 0  //设备状态
  var stateIndex =  0
  var troopsId = ''

  var category = {

    /**
     *  @describe [渲染设备类型数据]
     *  @param    {[arry]}   data [数据]
     */
    renderDeviceType: function(data, troopsIds){
      var _self = this
      troopsId = troopsIds
      window.troopsId2 = troopsIds
      var width = 390 
      var icontype = ['icon-all', 'icon-shebei1', 'icon-shebei2', 'icon-shebei3', 'icon-shebei4', 'icon-shebei5', 'icon-shebei6']
      //导航margin-left的位置
      var ml = [3, 25, 40, 46, 46, 39, 20]
      //导航旋转角度
      var deg = [-10, -7, -4, -1, 1, 4, 8] 
      var element = '.slider-nav-content'
      var navClass = 'slider-nav-list'
      _self.renderData(data, width, ml, deg, element, navClass, icontype, 0)
       
    },

    /**
     *  @describe [渲染设备状态数据]
     *  @param    {[array]}   data [设备状态数据]
     */
    renderDeviceState: function(data){
      var _self = this
      var width = 280 
      var icontype = ['icon-all', 'icon-normal', 'icon-damage', 'icon-repair']
      //导航margin-left的位置
      var ml = [13, 4, 1, 10]
      //导航旋转角度
      var deg = [5, 4, -2, -6] 
      var element = '.device-state-content'
      var navClass = 'slider-nav-list2'
      var ICONTYPE = ['a', '8', 'u', 'd', 'e', 's', 'o'] 
      _self.renderData(data, width, ml, deg, element, navClass, icontype, 1)
    },


    /**
     *  @describe [渲染数据共公方法]
     *  @param    {[type]}   data    [description]
     *  @param    {[type]}   width   [description]
     *  @param    {[type]}   ml      [description]
     *  @param    {[type]}   deg     [description]
     *  @param    {[type]}   element [description]
     *  @return   {[type]}   [description]
     */
    renderData: function(data, width, ml, deg, element, navClass, icontype, type){

      var len = data.length
      var dataset = []
      for(var j=0; j<len; j++){
        dataset.push(data[j].value)
      }
      var max = d3.max(dataset)
      var min = 8
      //定义比例尺
      var linear = d3.scale.linear()
            .domain([0, max])
            .range([0, width])
      var str = ''
	  var className = ''
      for(var i=0; i<len; i++){
        //取bar的宽度
        var style = Math.floor(linear(data[i].value))
        var child = data[i].child
        var childData = []
        var setUp = ''
        var primaryNav = {
          name: data[i].name,
          value: data[i].value,
          barWidth: style,
          icon: icontype[i]
        } 
        primaryNav = JSON.stringify(primaryNav)
        if(child){
           for(var j=0, len2 = child.length; j<len2; j++ ){
            childData.push(child[j])
           }
           childData = JSON.stringify(childData)
           setUp = '<div class="set-up" childData='+childData+' primaryNav='+primaryNav+'></div>'
        }

       if(style<8 && style>=0){
          style = 8
        }

        var name = data[i].name
        var allname = data[i].name
        if(name.length>6){
          name = name.substr(0, 6) + '...'
        }
		//设备状态添加不同的背景
        if( type == 1 ){
          switch(i){
            case 2:
              className = 'repair-bg'
            break;
            case 3:
              className = 'damage-bg'
            break;
          }
        }
        //添加各类型
        str += '<div class="row">'
            + '<div class='+navClass+' type='+data[i].type+' child='+!child+'>'
            + '<i class="icon '+icontype[i]+'" style="margin-left:'+( ml[i]+28) +'px"></i> '
            + '<i class="border" style="transform: rotate('+deg[i]+'deg)"></i>'
            + '<p><span class="caseName" name='+allname+'>'+name+'</span> <span class="value">'+data[i].value+'</span></p>'
            + '<div class="bar '+className+'">'
            + '<div class="bar-data" style="width: '+style+'px"></div>' 
            + '</div>'
            + '</div>'+setUp+'</div>'
      }
      $(element).html(str) 
      $(element).find('.row').eq(0).addClass('cur')
      //$('.device-state-content').find('.row').eq(stateIndex).addClass('cur').siblings().removeClass('cur')
    },


    /**
     *  @describe [事件绑定]
     *  @param    {[object]}   masterFile    [主文件(哪个模块调用的),参数变化时重新发送请求]
     *  @param    {[string]}   mapUrl        [地图的url]
     *  @param    {[string]}   caseNumberUrl [底部案件数量url]
     */
    bindEvent: function(masterFile, mapUrl, caseNumberUrl){
      var _self = this

      var _index = require(masterFile)
      // 点击设备类型一级导航
      // $(document).on('mouseover', '.slider-nav-list', function(evt){
        // var value = $(this).find('.value').text()
        // if(value=='0'){
          // $(this).parent().css('cursor', 'default')
        // } 
      // })
      //点击设备类型一级导航
      $(document).off('click', '.equipment-slider .slider-nav-list')
      $(document).on('click', '.equipment-slider .slider-nav-list', function(evt){
        window.flagInit = false
        // var value = $(this).find('.value').text()
        // if(value=='0'){
          // return
        // }
        $('.set-up').hide()

        window.oneType = $(this).attr('type')  //一级导航 
        deviceState = 0
        // if(window.oneType=='0000'){
        //   window.oneType = 0
        // }
        //
        //调用url
		
        var commonUrl = '/type/'+window.oneType+'/deviceState/'+deviceState+'/troopsId/' + window.troopsId2
        var dataUrls = [
          {
            url: window.BASEURL + 'equipmentResource/deviceState' + '/type/' + window.oneType + '/troopsId/' + window.troopsId2 
          },{
            url: window.BASEURL + 'equipmentResource/map' + commonUrl
          },{
            url: window.BASEURL + 'equipmentResource/deviceNumber' + commonUrl
          }
        ]
        //测试代码
        //技侦在侦数据
        // var dataUrls = [
        //     { 
        //       url: '../data/deviceState2.json'
        //     },{
        //       url: '../data/mergeMap2.json'
        //     },{
        //       url: '../data/city-caseNumber2.json'
        //     }
        //   ]

        _index.getDeviceState(dataUrls[0].url)
        _index.getMap(dataUrls[1].url) 
        _index.getCaseNumber(dataUrls[2].url)
        $(this).parent().addClass('cur').siblings().removeClass('cur')
      })

 
      // 点击设备状态导航
      $(document).off('click', '.slider-nav-list2')
      $(document).on('click', '.slider-nav-list2', function(evt){
        stateIndex =  $(this).parent().index()

        window.deviceState = $(this).attr('type')
        //调用url
        var commonUrl = '/type/'+window.oneType+'/deviceState/'+window.deviceState+'/troopsId/' + window.troopsId2
        var dataUrls = [
          {
            url: window.BASEURL + 'equipmentResource/map' + commonUrl
          },{
            url: window.BASEURL + 'equipmentResource/deviceNumber' + commonUrl
          }
        ]
     
        //测试代码

        //技侦在侦数据
        // var dataUrls = [
        //     {
        //       url: '../data/mergeMap.json'
        //     },{
        //       url: '../data/city-caseNumber.json'
        //     }
        //   ]
          _index.getMap(dataUrls[0].url) 
          _index.getCaseNumber(dataUrls[1].url)

          $('.device-state-content').find('.row').eq(stateIndex).addClass('cur').siblings().removeClass('cur')
      })

      //鼠标放到案件类型文字上显示全部名称
      $(document).on('mouseover', '.caseName', function(evt){
        var name = $(this).attr('name')
        //$(this).attr('title', name)
       // console.log(evt)
        if(name.length>6){
          var top = evt.pageY /window.Y - 80 //比例还原要除以缩放比例的值
          var left = evt.pageX /window.X - 80
          var elem = '<div class="title-tooltip" style="top: '+top+'px; left: '+left+'px">'+name+'</div>'
          $('body').append(elem)
        }
      })
       $(document).on('mouseout', '.caseName', function(evt){
          $('.title-tooltip').remove()
       })

    },     


    /**
     *  @describe [初始化]
     *  @param    {[object]}   masterFile [主文件,参数变化时重新发送请求]
     *  @param    {[object]}   data       [类型数据]
     */
    init: function(masterFile, data, mapUrl, caseNumberUrl){
      var _self = this
      childDatas = data
      masterFiles = masterFile
      // var typeData = data.deviceType
      // var stateData = data.deviceState
      // _self.renderDeviceType(typeData)
      // _self.renderDeviceState(stateData)
     
    }

  }

  return category
})