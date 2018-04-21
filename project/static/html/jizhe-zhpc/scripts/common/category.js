/**
 * @Author:      zhanghq
 * @DateTime:    2017-03-13 16:08:27
 * @Description: 右边模块JS文件
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-03-13 16:08:27
 */

define(function(require){


  //var ICONTYPE = ['a', '8', 'u', 'd', 'e', 's', 'o'] 
  var ICONTYPE = ['icon-all', 'icon-balei', 'icon-qincai', 'icon-drug', 'icon-economic', 'icon-guobao', 'icon-other']
  var childTypes = []   //二级导航
  var childTypes2 = [] 
  var childLength = 0
  window.oneType = 0    //一级导航类型
  window.childType = 0  //二级导航类型
  window.troopsId = 0   //地图区域
  var _index = ''
  var masterFiles = ''
  var childDatas = []
  var index = 0
  var caseNumbers = []

  var ALLTYPE = [] //所有类型
  var oldIndex = 0
  var allTotal = []
  var dataWidth = []
  var indexs = []
  var linear
  var curPage = 0
  var pageSize = 9
  var isSet = false

  var category = {

    /**
     *  @describe [渲染数据]
     *  @param    {[arry]}   data [数据]
     */
    renderData: function(data){
      var _self = this
      var len = data.length
      var dataset = []
      for(var j=0; j<len; j++){
        dataset.push(data[j].value)
      }
      allTotal = dataset
      var max = d3.max(dataset)
      var min = 0
      var width = 280 
      //定义比例尺
      linear = d3.scale.linear()
            .domain([0, max])
            .range([0, width])
      var str = ''
      //导航margin-left的位置
      var ml = [-15, 6, 20, 26, 25, 16, 0, -25, -45]
      //导航旋转角度
      var deg = [-10, -7, -4, -1, 3, 4, 8, 10, 12] 
      var isChild = false
	  var thiscLen = 0
      for(var i=0; i<len; i++){
        dataWidth.push(style) //数据的宽，先保存，后面取消的时候要用
        //取bar的宽度
        var style = Math.floor(linear(data[i].value))
        if(style<5 && style>0){
          style = 5
        }
        var child = data[i].child
        var childData = []
        var setUp = ''
        var primaryNav = {
          name: data[i].name,
          value: data[i].value,
          barWidth: style,
          icon: ICONTYPE[i]
        } 
        primaryNav = JSON.stringify(primaryNav)
	
        var childType = []
        if(child){
			thiscLen = child.length
           for(var j=0, len2 = child.length; j<len2; j++ ){
            childData.push(child[j]) //二级数据
            childType.push(child[j].type) //二级的类型标识
           }
		   isChild = true
           childData = JSON.stringify(childData)
           childType = childType.join('&')
           setUp = '<div class="set-up" childData='+childData+' primaryNav='+primaryNav+'></div>'
        }else{
			isChild = false
			thiscLen = 0
		}
        
        if(style<=0){
          style = min
        }
        var name = data[i].name
        var allname = data[i].name
        if(name.length>4){
          name = name.substr(0, 4) + '...'
        }
		
        //添加各类型
        str += '<div class="row" selectChild='+isChild+' childType = '+childType+' >'
            + '<div class="slider-nav-list" length='+thiscLen+' type='+data[i].type+' index = '+i+' child='+!isChild+'>'
            + '<i class="icon '+ICONTYPE[i]+'" style="margin-left:'+ (ml[i]+28) +'px"></i> '
            + '<i class="border" style="transform: rotate('+deg[i]+'deg)"></i>'
            + '<p><span class="caseName" name='+allname+'>'+name+'</span> <span class="value" id="typeTotal'+i+'">'+data[i].value+'</span></p>'
            + '<div class="bar">'
            + '<div class="bar-data" style="width: '+style+'px"></div>' 
            + '</div>'
            + '</div>'+setUp+'</div>'
      }
      $('.slider-nav-content').html(str) 
      $('.slider-nav-content').find('.row').eq(0).addClass('cur') 
      //$(document).find('#typeTotal').html(0)
    },

    /**
     *  @describe [加载二级导航]
     *  @param    {[type]}   data      [一级导航数据]
     *  @param    {[type]}   childData [当前一级导航的二级子导航数据]
     */
    loadSubNav: function(data, childData, selectType){
 
      //childDatas = []
      childDatas = childData

      var _self = this
      var str = ''
      var html = ''
      var left = [2, 19, 30, 38, 40, 38, 30, 19, 2] //每个点离左边的距离
      //底部提交按钮
      var operation = '<div class="footer-operation">'
                    + '<div class="btn btn-save"></div>'
                    + '<div class="btn btn-cancel"></div>'
                    + '</div>'
      //分页              
      var paging = '<div class="paging"><span id="pgUp" class="invalid"> < </span> <span  id="pgDn"> > </span></div>'              
      //添加一级导航    
      var topStr = '<div class="row cur">'
                 + '<i class="icon '+data.icon+'" ></i> '
                 + '<i class="border" ></i>'
                 + '<p> '+data.name+' <span>'+data.value+'</span></p>'
                 + '<div class="bar"><div class="bar-data" style="width:'+data.barWidth+'px"></div></div>'
                 + '</div>'

      //二级分类
      childLength = childData.length
      for(var i=0, len = childData.length; i<len; i++){
        var type = childData[i].type
        //判断之前已选种的checkbox
        var checked  = ''
        var disabled = ''  //此保变先保留，判断取消了
        // 判断是否之前选择二级类型
        if(selectType!=''){
          //之前有选择二级类型的判断
          var types = selectType.split("&")
          for(var j=0, len2 = types.length; j<len2; j++){
            if(type==types[j]){
              checked = 'checked="checked"'
            }
          }
        }else{
          //第一次选择
          for(var j=0, len2 = childTypes.length; j<len2; j++){
            if(type==childTypes[j]){
              checked = 'checked="checked"'
            }
          }
        }
        var value = childData[i].value
        //演示之后需求变动0可选
        //为0禁止选种
        // if(value==0){
        //   disabled = 'disabled="true"'
        // }
         
       
        str += '<li class="select-nav" style="margin-left: '+left[i]+'px">'
            + '<input type="checkbox" '+checked+' '+disabled+'  id="checkbox_sel'+i+'" class="selectBetting" typeFlag='+type+' />'
            + '<label for="checkbox_sel'+i+'" >'
            + '<div class="value">'+childData[i].name+'<span>'+value+'</span></div>'
            + '</label>'
            + '</li>'
      }
      html = topStr + '<ul class="sub-nav-list">'+str+'</ul>' + paging + operation

      $('.sub-nav-content').html(html)
      if(childData.length>9){
        $('.paging').show()
      }

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
 
      
      //鼠标放到案件类型文字上显示全部名称
      $(document).on('mouseover', '.caseName', function(evt){
        var name = $(this).attr('name')
 
        if(name.length>4){
          var top = evt.pageY /window.Y - 80 //比例还原要除以缩放比例的值
          var left = evt.pageX /window.X - 80
          var elem = '<div class="title-tooltip" style="top: '+top+'px; left: '+left+'px">'+name+'</div>'
          $('body').append(elem)
        }
      })
       $(document).on('mouseout', '.caseName', function(evt){
          $('.title-tooltip').remove()
       })
      //点击一级导航
      $('.slider-nav-content').off('click', '.slider-nav-list').on('click', '.slider-nav-list', function(evt){
        window.flagInit = false
        curPage = 0 //如果有分页的要变为0

        //判断是否选择了二级
        var isChild = $(this).parent().attr('selectChild')
	
		if(isChild=='false' || isChild==''){
			window.childType = 0
			window.oneType = $(this).attr('type')
        }else{
			 var childType = $(this).parent().attr('childType')
			 var thisCLen = childType.split('&')
			 var thisLen = parseInt($(this).attr('length'), 10)
			
        	if(thisLen == thisCLen.length){       		
                window.childType = 0
        		window.oneType = $(this).attr('type')  //一级导航 
        	}else{
        		
				window.childType = childType
                window.oneType = 0
        	}
		   window.oneType = $(this).attr('type')  //一级导航 
          
        }
		//console.log(window.oneType)
        // window.childType = 0
        var value = $(this).find('.value').text()
        index = parseInt($(this).attr('index'), 10)
        // if(value=='0'){
        //   return
        // }
        $('.set-up').hide()
        
        if(window.oneType=='0000'){
          window.oneType = 0
        }
        var child = $(this).attr('child')

        //调用url
        var dataUrls = [
          {
            url: loadUrl()[0]  //地图
          },{
            url: loadUrl()[1]  //案件数
          }
        ]
		

        if(child=='false'){
          $(this).parent().find('.set-up').fadeIn()
        }
     
        _index.getMap(dataUrls[0].url) 
        _index.getCaseNumber(dataUrls[1].url)
        
        $(this).parent().addClass('cur').siblings().removeClass('cur')
      })

      //点击导航设置(加载二级导航)
      $(document).off('.set-up').on('click', '.set-up', function(evt){
        evt.stopPropagation()
        var primaryNav = JSON.parse($(this).attr('primaryNav')) 
        var childData = JSON.parse($(this).attr('childData')) 
        var isChild = $(this).parent().attr('selectChild')
        var selectType = ''
        if(isChild=='true'){
          selectType = $(this).parent().attr('childType')
        }
       
        _self.loadSubNav(primaryNav, childData, selectType)
        
        //导航滑动动画
        $(".slider-nav-content").slideUp(600)
        setTimeout(function(){
          $(".slider-nav").fadeOut()
          $('#caseType').fadeIn(800)
          $('.sub-nav-content').slideDown(800)
          $('.footer-operation').fadeIn(2000)
        },500)
        
      })

      /**
       *  @describe [找到所有勾选的checkbox]
       */
 
      //点击取消
      $(document).off('click', '.btn-cancel').on('click', '.btn-cancel', function(evt){
        _self.selectCheck() //调用已勾选的checkbox _
        _self.closeDialog()
      })

      //点击二级导航的确定
      $(document).off('click', '.btn-save').on('click', '.btn-save', function(evt){
        _self.selectCheck() //调用已勾选的checkbox
        var type = $('.slider-nav-content').find('.row').eq(index).find('.slider-nav-list').attr('type')
        //没有选择任何子类型
        if(!childTypes.length){
          $('.slider-nav-content').find('.row').eq(index).attr('selectChild', false).attr('childType', '')
          
          // if(childLength==1){
          //   $('#typeTotal'+index).html(allTotal[index])
          //   $('.slider-nav-content').find('.slider-nav-list').eq(index).find('.bar-data').css('width', dataWidth[index]+'px')
          // }else{
          //   $('#typeTotal'+index).html(0)
          //   $('.slider-nav-content').find('.slider-nav-list').eq(index).find('.bar-data').css('width', '0px')
          // }
          $('#typeTotal'+index).html(0)
          $('.slider-nav-content').find('.slider-nav-list').eq(index).find('.bar-data').css('width', '0px')
          
          window.childType = 0
          window.oneType = type
          _self.closeDialog()
        }else{
          
          var caseNumber = 0
          //给当前添加二级导航类型
          var addChildType  = '' 
          //如果有多页添加type2
          if(childLength > pageSize){
            addChildType = childTypes2.join('&')
          }else{
            addChildType = childTypes.join('&')
          }
          $('.slider-nav-content').find('.row').eq(index).attr('selectChild', true).attr('childType', addChildType)
          //显示选择的二级导航总数
          for(var i=0, len = caseNumbers.length; i<len; i++){
             caseNumber += caseNumbers[i]
          }

          //数据的宽
          var width = Math.floor(linear(caseNumber))
          if(width<5 && width>0){
            width = 5
          }

          //由于总数和所有二级之和不对应，如果是全选就显示原来的总数，如果不是全选就相加

          if( childLength == caseNumbers.length){
            $('#typeTotal'+index).html(allTotal[index])
			window.childType = 0
			window.oneType = type
          }else{
            $('#typeTotal'+index).html(caseNumber)
			window.childType = childTypes.join('&')
			window.oneType = 0
          }
          
           $('.slider-nav-content').find('.slider-nav-list').eq(index).find('.bar-data').css('width', width+'px')
        }

        //调用url
        loadUrl()
        var dataUrls = [
          {
            url: loadUrl()[0]  //地图
          },{
            url: loadUrl()[1]  //案件数
          }
        ]
        
        _index.getMap(dataUrls[0].url) 
        _index.getCaseNumber(dataUrls[1].url)
        _self.closeDialog()
      })

      // 点击下一页
 
      $(document).off('click', '.paging span').on('click', '.paging span', function(evt){
        _self.selectCheck() //调用已勾选的checkbox
        $(this).siblings().removeClass('invalid')
        
        var countPage = Math.ceil(childDatas.length /pageSize)
       
        var id = $(this).attr('id')
        if(id=='pgDn'){
          curPage ++
          var isClass = $(this).hasClass('invalid')
          if(isClass){
            curPage -= 1
            return
          }
        }else{
          var isClass = $(this).hasClass('invalid')
          if(isClass){
            curPage = 0
            return
          }
          curPage --
        }

        
        
        console.log('curPage',curPage, 'countPage', countPage)
        console.log(pageSize*curPage, pageSize*curPage+pageSize)
        var string = ''

        //加载下一页
        var newChildData = childDatas.slice(pageSize*curPage, pageSize*curPage+pageSize)
        for(var i=0, len = newChildData.length; i<len; i++){
          var type = newChildData[i].type
          //判断之前已选种的checkbox
          var checked = ''
          for(var j=0, len2 = childTypes2.length; j<len2; j++){

            if(type==childTypes2[j]){
              checked = 'checked="checked"'
            }
          }

        var left = [2, 19, 30, 38, 40, 38, 30, 19, 2] //每个点离左边的距离

        string += '<li class="select-nav" style="margin-left: '+left[i]+'px">'
            + '<input type="checkbox" '+checked+'  id="checkbox_sel'+i+'" class="selectBetting" typeFlag='+type+' />'
            + '<label for="checkbox_sel'+i+'" >'
            + '<div class="value">'+newChildData[i].name+'<span>'+newChildData[i].value+'</span></div>'
            + '</label>'
            + '</li>'
       }

        
        $('.sub-nav-list').html(string)

        if( (curPage+1) == countPage){
           curPage = countPage - 1 
          $(this).addClass('invalid')
          return
        }

        if(curPage == 0){
          curPage = 1
          $(this).addClass('invalid')
          return
        }
      })


      function loadUrl(){
        //url共公部分
        var commonUrl = '/type/'+window.oneType+'/childType/'+window.childType+'/'+window.areaIds+'/'+window.troopsId
        var commonTimeUrl = '/startTime/'+window.startTime+'/endTime/'+window.endTime
        //判断是否有时间轴
        //请注意此处
        if(window.isTime){
          //地图url
          var MAPURL = mapUrl + commonUrl + commonTimeUrl
          //案件数量URL 一级childType为0，二级oneType为0
          var CASENUMBERURL = caseNumberUrl + commonUrl + commonTimeUrl
        }else{
          //地图url
          var MAPURL = mapUrl +  commonUrl 
          //案件数量URL 一级childType为0，二级oneType为0
          var CASENUMBERURL = caseNumberUrl + commonUrl 
        }
        

        var MAPURL = '../../data/mergeMap2.json'
        var CASENUMBERURL = '../../data/caseNumber2.json'
        var dataUrls = [MAPURL, CASENUMBERURL]

        return dataUrls
      }


    },     

    /**
     *  @describe [查找所有勾选的chick]
     *  @return   {[type]}   [description]
     */
    selectCheck: function(){
        var len = $('.sub-nav-list').find('li').length
        childTypes = []
        caseNumbers = []
        for(var i=0; i<childLength; i++){
           var thisCheck = $('#checkbox_sel'+i+'')
           var isCheck = thisCheck.is(':checked')
           if(isCheck){
            var type = thisCheck.attr('typeFlag')
            var value = parseInt(thisCheck.siblings().find('span').html(), 10)
            if(childTypes.indexOf(type) == -1){
              childTypes.push(type)
            }
            if(childTypes2.indexOf(type) == -1){
              childTypes2.push(type)
            }
            caseNumbers.push(value)
           }
        }
    },

    /**
     *  @describe [关闭弹窗]
     */
    closeDialog: function(){
      $(".slider-nav").fadeIn()
      $('.sub-nav-content').slideUp(800)
        setTimeout(function(){
          $('.footer-operation').hide()
          $(".slider-nav-content").slideDown(800)
          $('#caseType').fadeOut(800)
      },500)
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
      if(window.clickNav){
          childTypes = [] //点击一级导航清空二级子类
       }
      _self.renderData(data)

     
    }

  }

  return category
})