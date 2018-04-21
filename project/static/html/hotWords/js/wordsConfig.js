/**
 * @Author:      zhq
 * @DateTime:    2017-01-18 09:44:27
 * @Description: 热词配置
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-18 09:44:27
 */

define(function(require) {

  var modalTpl = require('../components/modalDialog.tpl')
  var updateTpl = require('../components/updatePopup.tpl')
  var updateTpl2 = require('../components/updatePopup2.tpl')
  var infoList = require('../components/infoList.tpl')
  var errorTpl = require('../components/errorDialog.tpl')
  var template = Handlebars.compile(infoList)
  var spageNo = 1 //搜索当前页
  var bpageNo = 1 //后台当前页
  var sNum = 0 //当前页
  var bNum = 0
  var pageSize  = 12
  var bOrderName = 'weight'
  var sOrderName = 'fps'
  var backUrl = window.global.BaseUrl+window.global.back+'?pageNo='+bpageNo+'&size='+pageSize+'&orderName='+bOrderName+''
  var searchUrl = window.global.BaseUrl+window.global.query+'?pageNo='+bpageNo+'&size='+pageSize+'&orderName='+sOrderName+''
  var stateUrl = window.global.BaseUrl+window.global.updateState //更新url
  var updateStatus = ['更新', '未更新', '剩余时间', '上次更新系统']
  //本地测试数据
  var searchUrl = './data/query.json'
  var backUrl = './data/back.json'
  var stateUrl = './data/update.json'
  var clickFlag = true  // 搜索全选标记
  var bClickFlag = true  //后台全先标记
  var rowFlag = false
  var backFlag = false
  var queryClick = false //是否点了查询
  var selectFalg1 = 0 //判断选择了搜索还是后台，删除时用于判断
  var selectFalg2 = 0
  var selectAlls = false //全选标记
  //分页
  var totalCounts=0 ; //分页总数
  var page = 0;
  var nowPage = 0; //当前页
  var listNum = 12; //每页显示<ul>数
  var PagesLen; //总页数
  var PageNum = 4; //分页链接接数(5个)
  var currentPage = 0;
  //查询变量
  var queryHotWord = ''
  var source = ''
  var endTime = ''
  var startTime = ''
  var queryState  = ''
  var cancelUpate = false //取消更新标记
  var updataTimeFlag = false //是否更新
  var updateTime = 0 //定时更新时间
 
  var wordsConfig = {

    //搜索
    searchData: function(searchUrl){
      $('.loading').show()
      var self  = this
      //搜索list数据
      $.get(searchUrl, function(data){
        console.log('搜索', data)
        clickFlag = !clickFlag //搜索全选标识
        console.log(backFlag)
        if(backFlag){
          $('.loading').hide()
        }

        var searchData = data.data.results
        self.renderSearch(searchData)
        var totalCounts = data.data.totalRecord
        //显示暂无数据提示
        if(totalCounts==0){
          $('#searchList').find('.nullData').show()
          $('#searchList').find('table').hide()
        }else{
          $('#searchList').find('.nullData').hide()
          $('#searchList').find('table').show()
        }
        if(totalCounts>12){
          self.page(sNum, totalCounts, '#searchList')
        }

      })
    },
    //后台
    backData: function(backUrl){
      $('.loading').show()
      var self  = this
      backFlag = false
      $.get(backUrl, function(data){
        console.log('后台', data)
        bClickFlag = !bClickFlag //后台全选标识
       
        $('.loading').hide()
        var backData = data.data.results
        self.renderBack(backData)
        var totalCounts = data.data.totalRecord
        if(backData.length==0){
          $('#backstageList').find('.nullData').show()
          $('#backstageList').find('table').hide()
        }else{
          $('#backstageList').find('.nullData').hide()
          $('#backstageList').find('table').show()
        }
        if(totalCounts>12){
          self.page(bNum, totalCounts, '#backstageList')
        }
         backFlag = true //后台数据加载完成标识
      })

    },


    /**
     * [getData 同时请求搜索/后台数据]
     * @param  {[string]} searchUrl [搜索地址]
     * @param  {[string]} backUrl   [后台地址]
     */
    getData: function(searchUrl, backUrl){
      //$('.loading').show()
      var self  = this
       self.searchData(searchUrl)
       self.backData(backUrl)
    },

    // 搜索列表
    renderSearch: function(data){
      var handleHelper = Handlebars.registerHelper("addOne",function(index){
          return index =  sNum*12 +index+1 ;
      });
      var backstageData = []
      for(var i=0,len2=data.length; i<len2;i++){
        var id = i+1
        var name = data[i].name
        var fps = Math.floor(data[i].fps)
        //var ssbFlag = data[i].ssbFlag
        var time = data[i].time
        var stateFlag = data[i].state
        var weight = data[i].weight
        var ssb  = data[i].ssb
        var ssbFlag = data[i].ssbFlag

        if(ssbFlag=='null'){
          ssbFlag = ''
        }
        if(stateFlag==1){
          var state = '有效'
        }else{
          var state = '无效'
          $('#searchList').find('.select').eq(0).addClass('invalid')
        }
        backstageData.push({
          id: id,
          name: name,
          fps: fps,
          ssb: ssb,
          time: time,
          state: state,
          stateFlag: stateFlag,
          weight: weight,
          ssbFlag: ssbFlag,
          flag: 1
        })
      }

      var html2 = template({
        data: backstageData
      })
      $('#searchList').html(html2)

      for(var j=0,len=data.length; j<len; j++){
        var thisState = data[j].state
        if(thisState==0){
          $('#searchList').find('.select').eq(j).find('td').eq(6).addClass('invalid')

        }
      }
    },

    //后台列表
    renderBack: function(data){
      var handleHelper = Handlebars.registerHelper("addOne",function(index){
          return index =  bNum*12 +index+1 ;
      });
      var searchData = []
      for(var i=0,len=data.length; i<len; i++){

        var id = i+1
        var name = data[i].name
        var fps = Math.floor(data[i].fps)
        //var ssbFlag = data[i].ssbFlag
        var time = data[i].time
        var stateFlag = data[i].state
        var weight = data[i].weight
        var ssb  = data[i].ssb
        var ssbFlag = data[i].ssbFlag

        if(stateFlag==1){
          var state = '有效'
        }else{
          var state = '无效'
          $('#backstageList').find('.select').eq(0).addClass('invalid')
        }
        searchData.push({
          id: id,
          name: name,
          fps: fps,
          ssb: ssb,
          time: time,
          state: state,
          stateFlag: stateFlag,
          weight: weight,
          ssbFlag: ssbFlag,
          flag: 2
        })
      }
      var html = template({
        data: searchData
      })
      $('#backstageList').html(html)

      for(var j=0,len=data.length; j<len; j++){
        var thisState = data[j].state
        if(thisState==0){
          $('#backstageList').find('.select').eq(j).find('td').eq(6).addClass('invalid')
        }
      }
      
    },

    //事件绑定
    bindEvent: function() {
      var self = this
      //点击复选框
      $(document).on('click', '.checkbox',  function(e){
        var isCheck =  $(this).is(':checked')
        if(isCheck){
          $(this).prop('checked', false)
        }else{
          $(this).prop('checked', true)
        }
      })

      //点击搜索单选
      $(document).on('click', '#searchList .select', function(e){
        var txt = '后台'
        var $this = $(this)
        oneSelect($this, '#backstageList', txt)
      })

      //点击后台单选
      $(document).on('click', '#backstageList .select', function(e){
        var txt = '搜索'
        var $this = $(this)
        oneSelect($this, '#searchList', txt)
      })

      /**
       * [oneSelect 单选共用方法]
       * @param  {[object]} $this [当前选项]
       * @param  {[string]} id    [类型id]
       * @param  {[string]} txt   [提示文字]
       */
      function oneSelect($this, id, txt){
        if(!selectAlls){
          $(document).find('.selectAll i').removeClass('cur')  //移出全选样式
        }else{
          selectAlls = false
        }        
        selectFalg1 = parseInt($this.attr('flag')) //判断选择了搜索还是后台，删除时用于判断
        var isCheck2 = selectCheck(id)
        //判断另一种类型是否选种
        if(isCheck2){
          var cur = $this.find('.checkbox')
          self.selectTooltip('<p>不能同时操作两种类型</p><p>是否清空'+txt+'所有选项</p>',cur)
          $this.find('.checkbox').prop('checked', false)
          return
        }
        //当前行是否选种
        var isCheck =  $this.find('.checkbox').is(':checked')
        if(isCheck){
          $this.find('.checkbox').prop('checked', false)
        }else{
          $this.find('.checkbox').prop('checked', true)
        }
      }
 
      
      //搜索全选
      $(document).on('click', '#searchList .selectAll', function(e){
        console.log('搜索全选')
        //判断是否全部选种
        var id = ['#searchList', '#backstageList']
        var txt = '后台'
        clickFlag = !clickFlag
        var $this = $(this)
        selectAll($this, clickFlag, id, txt)
      })

      //后台全选
      $(document).on('click', '#backstageList .selectAll', function(e){
        console.log('后台全选')
        var id = ['#backstageList', '#searchList']
        var txt = '搜索'
        bClickFlag = !bClickFlag
        var $this = $(this)
        selectAll($this, bClickFlag, id, txt)
      })

      /**
       * [selectAll 全选共用方法]
       * @param  {[object]} $this [当前选项]
       * @param  {[type]} flag    [description]
       * @param  {[object]} id    [类型id]
       * @param  {[string]} txt   [提示文字]
       */
      function selectAll($this, flag, id, txt){
        selectAlls = true
        //判断另一种类型是否选种
        var isCheck = selectCheck(id[1])
        if(isCheck){
          var cur = $(''+id[0]+' .select :checkbox')
          self.selectTooltip('<p>不能同时操作两种类型</p><p>是否清空'+txt+'所有选项</p>',cur)
          return
        }
        //判断是否全部选种
        var hasCur = $this.find('i').hasClass('cur')
        if(!hasCur){
          $(''+id[0]+' .select :checkbox').prop('checked', true)
          $this.find('i').addClass('cur')
        }else{
          $(''+id[0]+' .select :checkbox').prop('checked', false)
          $this.find('i').removeClass('cur')
        }
      }

      /**
       * [selectCheck checkbox是否选种]
       * @param  {[object]} id [类型id]
       * @return {[object]}    [description]
       */
      function selectCheck(id){
        var isCheck =false
        var len = $(id).find('.select').length
        for(var i=0; i<len; i++){
          isCheck = $(id).find('.checkbox').is(':checked')
          if (isCheck) {
            return true
          }
          return isCheck
        }
      }


      //权重
      $(document).off('dblclick', '.weight')
      $(document).on('dblclick', '.weight', function(){
        var oldWeight = $(this).val()
        $(this).val('')
        $(this).css({'background':'#03144f', 'border':'1px solid #58bfdb'})
        $(document).on('mouseout', '.weight', function(){
          //var index = $(this).parents().parents().index()
          var parent = $(this).parent().parent()
     
          var flag = parent.parent().find('.select').attr('flag')
          var name = parent.find('.name').text()
          var ssbFlag = parent.find('.ssbflag').attr('ssbflag')
          var source = parent.find('.ssbflag').html()
          var state = parent.find('.state').attr('state')
        
          var weight = $(this).val()
          if(weight==''||weight==null){
            $(this).val(oldWeight)
            weight = $(this).val()
          }
          var rs = ''
          var rs2 = ''
          var pattern = new RegExp("[%]")
          for (var i = 0; i < weight.length; i++) {
            rs = rs + weight.substr(i, 1).replace(pattern, '')
          }
          for (var j = 0; j < oldWeight.length; j++) {
            rs2 = rs2 + oldWeight.substr(j, 1).replace(pattern, '')
          }

          weight = rs/100
          oldWeight = rs2/100
          if(weight>1){
             $(this).attr('placeholder','权重不能大于100')
             //self.errorTooltip('权重100')
             $(this).focus()
             return
          }else{
            $(this).blur()
            $(this).css({'background':'none', 'border':'none'})
            var newWeight = weight*100+'%'
            $(this).val(newWeight)
            var datas1 = {}
            var params1 = []
            params1.push({
              name: name,
              ssbFlag: ssbFlag,
              state: state,
              weight: weight,
              ssb: source
            })
            console.log(params1)
            datas1.flag=flag //标识搜索，后台
            datas1.wordWeightVos=JSON.stringify(params1)
            var weightUrl = window.global.BaseUrl+window.global.del
            //修改后的权重!=原来的权重  
            if(oldWeight!=weight){
              console.log(oldWeight, weight)
              $.ajax({
                type: 'POST',
                url: weightUrl,
                data: datas1,
                success: function(res){
                  var state = res.status
                  console.log(res.message)
                  if(state){
                    if(flag==1){
                       sQueryUrl()
                    }else{
                       bQueryUrl()
                    }
                    
                  }else{
                    self.errorTooltip(res.message)
                  }
                }

              })
            }
          }
           //解除绑定
          $(document).off('mouseout', '.weight')
        })
      })

      /**
       * [update 删除，撤销，更新数据共用方法]
       * @param  {[string]} state [删除/撤销状态值]
       */
      function update(state){
        var allCheckbox = $(document).find('.select :checkbox').length
        var checkLen = $('.select :checkbox').is(':checked')
        if(!checkLen){
          self.errorTooltip('无可操作数据')
          return
        }
        var datas = {}
        var params = []
        for(var i=0;i<allCheckbox;i++){
          var boxSel = $(document).find('.select').eq(i).find('td').html()
          var isCheck = $('.select :checkbox').eq(i).is(':checked')
          if(isCheck){
            isCheck = !isCheck
            var name = $('.select').eq(i).find('.name').text()
            
            var flag = $('.select').eq(i).attr('flag')
            var ssbFlag = $('.select').eq(i).find('.ssbflag').attr('ssbflag')
            var source = $('.select').eq(i).find('.ssbflag').html()

            params.push({
              name: name,
              ssbFlag: ssbFlag,
              state: state,
              ssb: source
            })
          }
        }
        console.log('params', params)
        datas.flag=flag
        datas.wordWeightVos=JSON.stringify(params)
        var delUrl = window.global.BaseUrl+window.global.del
        console.log(delUrl)
        var delUrl = './data/del.json'
        $('.loading').show()
        $.ajax({
          type: 'POST',
          url: delUrl,
          data: datas,
          success: function(res){
            var state = res.status
            if(state){
              //是否带有查询条件
              if(queryClick){
                var searchUrl = window.global.BaseUrl+window.global.query+'?pageNo='+spageNo+'&size='+pageSize+'&orderName='+sOrderName+''
                  +'&name='+queryHotWord+'&ssbFlag='+source+'&state='+queryState+'&beginTime='+startTime+'&endTime='+endTime+''
                var backUrl = window.global.BaseUrl+window.global.back+'?pageNo='+bpageNo+'&size='+pageSize+'&orderName='+bOrderName+''
                  +'&name='+queryHotWord+'&ssbFlag='+source+'&state='+queryState+'&beginTime='+startTime+'&endTime='+endTime+''
              }else{
                var backUrl = window.global.BaseUrl+window.global.back+'?pageNo='+bpageNo+'&size='+pageSize+'&orderName='+bOrderName+''
                var searchUrl = window.global.BaseUrl+window.global.query+'?pageNo='+bpageNo+'&size='+pageSize+'&orderName='+sOrderName+''
              }
              var searchUrl = './data/query.json'
              var backUrl = './data/back.json'
              if(selectFalg1==1){
                self.searchData(searchUrl)
              }else{
                self.backData(backUrl) 
              }
            }else{
              self.errorTooltip(res.message)
            }
          }
        })
     
      }

      //点击删除
      $('#delete').off('click')
      $('#delete').on('click', function(e){
        // id, flag (搜索，后台，) state
        update('0')
        selectFalg2 = 0
      })

      //点击撤销
      $('#revoke').off('click')
      $('#revoke').on('click', function(e){
         console.log('撤销')
         update('1')
         selectFalg2 = 0
      })

      //查询
      $('#query').on('click', function(e){
        queryClick = true
        clickFlag = false
        queryHotWord = encodeURI($('#hotWord').val())
        source = $('#source').find('option:selected').attr('type')
        startTime = $.trim($('#startTime').val())
        endTime = $.trim($('#endTime').val())
        queryState  = $('#state').find('option:selected').attr('state')
        sNum = 0
        bNum = 0
        spageNo = 1 //搜索当前页
        bpageNo = 1 //后台当前页
       
        // if(startTime==''){
        //   $('#endTime').attr('placeholder', '开始时间不能为空')
        //   return
        // }
        // if(endTime==''){
        //   $('#endTime').attr('placeholder', '结束时间不能为空')
        //   return
        // }
        
        var searchUrl = window.global.BaseUrl+window.global.query+'?pageNo='+spageNo+'&size='+pageSize+'&orderName='+sOrderName+''
            +'&name='+queryHotWord+'&ssbFlag='+source+'&state='+queryState+'&beginTime='+startTime+'&endTime='+endTime+''
        var backUrl = window.global.BaseUrl+window.global.back+'?pageNo='+bpageNo+'&size='+pageSize+'&orderName='+bOrderName+''
            +'&name='+queryHotWord+'&ssbFlag='+source+'&state='+queryState+'&beginTime='+startTime+'&endTime='+endTime+''
        var searchUrl = './data/query2.json'
        var backUrl = './data/back.json'
        self.getData(searchUrl, backUrl)
        //reset()
        
      })

      //点击重置
      $('#reset').off('click')
      $('#reset').on('click', function(e){
        reset()
      })
      //重置
      function reset(){
        $('#hotWord').val('')
        $('#startTime').val('')
        $('#endTime').val('')
        $('#source').find('option').eq(0).prop('selected', 'selected')
        $('#state').find('option').eq(0).prop('selected', 'selected')
      }

      //点击新增按钮，弹出新增热词对话框
      $('#add').on('click', function(e) {
        var firstData = []
        var firstText = ''
        var parentUrl = window.global.BaseUrl+window.global.parent+'?flag=1'
        var parentUrl = './data/parent.json'
        $('.loading').show()
        $.get(parentUrl, function(data){
           $('.loading').hide()
           var template = Handlebars.compile(modalTpl)
           firstData = data.data
           firstText = firstData[0].ssb
          
           var html = template({
                firstData: firstData,
                lymc: firstData[0].lymc
           })
           
           $('.show-modal-dialog').html(html)
            var parentFlag = $(document).find('.list li').attr('lymc')
           
            var parentSUrl = window.global.BaseUrl+window.global.parentSecond+'='+parentFlag+''   
            console.log(parentSUrl)
            var parentSUrl = './data/parentSecond.json'   
            getSecond(parentSUrl, firstData)
        
        })

        //热词名称获得焦点
        $(document).on('focus', '.hot-input',function(){
          $('.sourceList1').hide()
          $('.sourceList2').hide()
        })

          /**
           * [getSecond 请求二级数据来源]
           * @param  {[string]} parentSUrl [二级来源地址]
           * @param  {[object]} firstData  [一级来源数据]
           */
          
         function getSecond(parentSUrl, firstData){
            $.get(parentSUrl, function(data){
              var secondData = data.data
              var template = Handlebars.compile(modalTpl)
               var html = template({
                    firstData: firstData,
                    lymc: firstData[0].lymc,
                    secondData: secondData,
                    second: secondData[0].ssb_child,
                    ssbId: secondData[0].id
               })
               console.log(firstText)
               $('.show-modal-dialog').html(html)
               $('.firstSource').html(firstText)
               $('.hot-input').val(inputHotWord)

            })   
         }  
        //点击一级来源
        $(document).on('click', '.firstSource', function() {
          $('.sourceList1').show()
        })

         //点击一级来源列表 
         var inputHotWord = ''
        $(document).on('click', '.sourceList1 li', function(e){
          inputHotWord = $('.hot-input').val()

          firstText = $(this).html() 
          var parentFlag = $(this).attr('lymc')
        
          var parentSUrl = window.global.BaseUrl+window.global.parentSecond+'='+parentFlag+''   
          console.log(parentSUrl)
          var parentSUrl = './data/parentSecond2.json'
          getSecond(parentSUrl, firstData)

          $('.firstSource').attr('lymc', parentFlag)
          $('.sourceList1').hide()
         
        })

        //点击二级来源
        $(document).on('click', '.secondSource', function() {
          $('.sourceList2').show()
        })

         $(document).on('click', '.sourceList2 li', function(e){
          var text = $(this).html() 
          var ssbId = $(this).attr('ssbId')
          $('.secondSource').html(text)
          $('.secondSource').attr('ssbId',ssbId)
          $('.sourceList2').hide()

        })
      })

      //保存热词
      $(document).off('click','.btn-save')
      $(document).on('click','.btn-save', function(e){
        var hotWord = encodeURI($('.hot-input').val())
        var weight = $('.weight2').val()
        weight = weight/100
        var ssbId = $('.secondSource').attr('ssbId')
        var flag = 2  //1搜索，2后台
        if(hotWord==''||hotWord==undefined){
          $('.hot-input').attr('placeholder','词名不能为空')
          return 
        }
         if(weight==''||weight==undefined){
          weight = 0
        }

        if(weight>1 || weight<0 || weight!=weight){
          $('.weight2').val('')
          $('.weight2').attr('placeholder','权重值为0-100')
          return
        }
        
        var addUrl = window.global.BaseUrl+window.global.add+'?ssbId='+ssbId+'&flag='+flag+'&name='+hotWord+'&weight='+weight+''
        var addUrl = './data/update.json'
        $('.show-modal-dialog').html('')
        $('.loading').show()
        $.get(addUrl, function(data){
          if(data.status){
            self.getData(searchUrl, backUrl)
          }else{
            self.errorTooltip(data.message)
          }
        })
      })

      //点击搜索分页
      $(document).on('click', '#searchList .pageing a', function(e){
         sNum = parseInt($(this).attr('target'))
         spageNo = sNum+1
         var isHas = $(this).hasClass('invalid')
         if(isHas){
          return
         }
         sQueryUrl()
      })

       //点击后台分页
      $(document).on('click', '#backstageList .pageing a', function(e){
         bNum = parseInt($(this).attr('target'))
         
         bpageNo = bNum+1
         var isHas = $(this).hasClass('invalid')
         if(isHas){
          return
         }
         bQueryUrl()
      })

      //搜索权重排序
      $(document).on('click', '#searchList .weightOrder', function(e){
        sOrderName = 'weight' 
        sQueryUrl()
      })

      //搜索次数排序
      $(document).on('click', '#searchList .frequency', function(e){
        sOrderName = 'fps' 
        sQueryUrl()
      })

      //后台权重排序
      $(document).on('click', '#backstageList .weightOrder', function(e){
        bOrderName = 'weight' 
        bQueryUrl()
      })

      //后台次数排序
      $(document).on('click', '#backstageList .frequency', function(e){
        bOrderName = 'fps' 
        bQueryUrl()
      })

       //点击搜索到多少页
      $(document).on('click', '#searchList .gotoBtn', function(e){
        var val = $('#searchList .gotoInput').val()
        var num = parseInt($.trim(val))
        if(num !== num || num == 0 || num > totalCounts){
          $('#searchList .gotoInput').val('')
          return 
        }
        sNum = num - 1
        spageNo = num
        sQueryUrl()
      })

      //点击后台到多少页
      $(document).on('click', '#backstageList .gotoBtn', function(e){
        var val = $('#backstageList .gotoInput').val()
        var num = parseInt($.trim(val))
        if(num !== num || num == 0 || num > totalCounts){
          $('#backstageList .gotoInput').val('')
          return 
        }
        bNum = num - 1
        bpageNo = num
        bQueryUrl()
      })

      //搜索地址判断
      function sQueryUrl(){
        if(queryClick){
          var searchUrl = window.global.BaseUrl+window.global.query+'?pageNo='+spageNo+'&size='+pageSize+'&orderName='+sOrderName+''
           +'&name='+queryHotWord+'&ssbFlag='+source+'&state='+queryState+'&beginTime='+startTime+'&endTime='+endTime+''
        }else{
          var searchUrl = window.global.BaseUrl+window.global.query+'?pageNo='+spageNo+'&size='+pageSize+'&orderName='+sOrderName+''
        }
        console.log(searchUrl)
        var searchUrl = './data/query.json'
        self.searchData(searchUrl)
      }

      //后台地址判断
      function bQueryUrl(){
        if(queryClick){                
           var backUrl = window.global.BaseUrl+window.global.back+'?pageNo='+bpageNo+'&size='+pageSize+'&orderName='+bOrderName+''
              +'&name='+queryHotWord+'&ssbFlag='+source+'&state='+queryState+'&beginTime='+startTime+'&endTime='+endTime+''
        }else{
          var backUrl = window.global.BaseUrl+window.global.back+'?pageNo='+bpageNo+'&size='+pageSize+'&orderName='+bOrderName+''
        }
        console.log(backUrl)
        var backUrl = './data/back.json'
        self.backData(backUrl)
      }

      /**
       * [updateSource 获取更新来源]
       * @param  {[type]} template [需要更新的模板]
       * @return {[type]}          [description]
       */
      function updateSource(template){
        var sourceUrl = window.global.BaseUrl+window.global.parent+'?flag=1'
        var sourceUrl = './data/parent.json'
        $.get(sourceUrl, function(data){
            var data = data.data
             $('.select-update').hide()
             var html = template({
              data: data
             })
             $('.show-modal-dialog').html(html)
             $('.updateSource').html(data[0].ssb)
             $('.updateSource').attr('lymc', data[0].lymc)
             if(cancelUpate){
              $('.font-name').html('选择来源:')
              $('.btn-sure').attr('id', 'sureCancel')
             }
             //调用当前时间
             self.currentDate()
             //点击下拉框
             $(document).on('click', '.updateSource', function(e){
                $('.all-source').show()
             })
             //点击列表内容
             $(document).on('click', '.all-source li', function(e){
              var ssb = $(this).text()
              var lymc = $(this).attr('lymc')
              $('.updateSource').html(ssb)
              $('.updateSource').attr('lymc', lymc)
              $('.all-source').hide()
             })
          })
      }

      //点击更新
      $('.update-hotword').on('click', function(e) {
        e.stopPropagation()
        cancelUpate = false
        var hasClass = $(this).hasClass('btn-invalid')
        if(!hasClass){
          $('.select-update').show()
        }
         //点击body隐藏更新列表
        $('body').on('click', function(e){
          $('.select-update').hide()
        })
        
      })
      // $('.select-update').on('mouseout', function(e) {
      //   $('.select-update').hide()
      // })
      //立即更新
      $('.update-now').on('click', function(e){
          console.log(updataTimeFlag)
         
          var template = Handlebars.compile(updateTpl)
          console.log(updataTimeFlag)
          if(updataTimeFlag){
            updataTimeFlag = false
            var html = template({})
            $('.show-modal-dialog').html(html)
            $('#sure1').attr('id', 'sure4')
            $('.updataS').html(''+updateTime+'已有定时更新,执行立即更新将清除定时更新，是否立即更新?')
            $('#sure4').on('click', function(e){
              updateSource(template)
            })
          }else{
            updateSource(template)
          }
          
      })

      //点击确定
      $(document).on('click', '#sure1', function(e){
        var ssb = $('.updateSource').attr('lymc')
        var updateUrl = window.global.BaseUrl+window.global.update+'?dateParam=&ssb='+ssb+'&flag=1'
        //发送更新请求
        self.updateSent(updateUrl)
      })


       //取消更新
      $('.update-cancel').on('click', function(e){
          // var template = Handlebars.compile(updateTpl)
          // updateSource(template)
          // cancelUpate = true
          updataTimeFlag = false
          var updateUrl = window.global.BaseUrl+window.global.update+'?dateParam=&ssb=&flag=0'
          //发送更新请求
          self.updateSent(updateUrl)
      })

      //确定取消更新
      // $(document).on('click', '#sureCancel', function(e){
      //   var ssb = $('.updateSource').attr('lymc')
      //   var updateUrl = window.global.BaseUrl+window.global.update+'?dateParam=&ssb='+ssb+'&falg=0'
      //   console.log(updateUrl)
      //   //发送更新请求
      //   self.updateSent(updateUrl)
      // })

      //定时更新
      $('.update-time').on('click', function(e){
        var template = Handlebars.compile(updateTpl2)
        updateSource(template)
        //获取当前时间
      })

      $(document).on('click', '.select-time', function(e){
        var start = {
            elem: '#select-time',
            format: 'YYYY-MM-DD hh:mm:ss ',
            min: laydate.now(), //设定最小日期为当前日期
            max: '2099-06-16 23:59:59', //最大日期
            istime: true,
            istoday: false
        };
     
      //调用时间控件
      laydate(start)
     
      })
      //确定
      $(document).on('click', '#sure2', function(e){
        var time = $.trim($('#select-time').text())
        updateTime = time
        var ssb = $('.updateSource').attr('lymc')
        updataTimeFlag = true
        var updateUrl = window.global.BaseUrl+window.global.update+'?dateParam='+time+'&ssb='+ssb+'&flag=1'
        var updateUrl = './data/update.json'
        console.log(updateUrl)
        //发送更新请求
        self.updateSent(updateUrl)

      })

      //来源显示不完提示
      $(document).on('mouseenter', '.ssbflag', function(e){
        var txt = $(this).text()
        var len = txt.length
        var top = e.screenY-50
        var left = e.screenX
        if(len>9){
          $('.showAll').html(txt)
          var h = $('.showAll').height()
          $('.showAll').css({'top': (top-h*2)+'px', 'left': left+'px'}).show()
        }
      })
      $(document).on('mouseleave', '.ssbflag', function(e){
        $('.showAll').hide()
      })

      //点击关闭图标关闭对话框
      $('.show-modal-dialog').on('click', '.close', function() {
        $('.show-modal-dialog').html('')
      })

      //点击取消按钮关闭对话框
      $('.show-modal-dialog').on('click', '.btn-cancel', function() {
        $('.show-modal-dialog').html('')
      })
    },

    //发送更新状态请求
    updateState: function(){
      var self = this
      $.get(stateUrl, function(data){
        var msg = data.data.msg
        var state = data.data.state
        $('.updateState').html(msg).show()
        //1为正在更新
        // if(msg!='未更新'){
        //   console.log(msg)
        // }

        if(state==1){
          $('.update-hotword').addClass('btn-invalid')
        }else{
          $('.update-hotword').removeClass('btn-invalid')
        }
      })
    },

    //发送更新请求
    updateSent: function(updateUrl){
      console.log(updateUrl)
      var self = this
      $('.show-modal-dialog').html('')
      $('.loading').show()
      $.get(updateUrl, function(data){
        var state = data.status
        $('.loading').hide()
        if(state){
          self.updateState()
        }else{
          self.errorTooltip(data.message)
        }
      })
    },

     //时间控件
    selectTime: function(){
      var start = {
          elem: '#startTime',
          format: 'YYYY-MM-DD hh:mm:ss ',
          //min: laydate.now(), //设定最小日期为当前日期
          max: '2099-06-16 23:59:59', //最大日期
          istime: true,
          istoday: false,
          choose: function(datas){
             end.min = datas; //开始日选好后，重置结束日的最小日期
             end.start = datas //将结束日的初始值设定为开始日
             sTime = datas.replace(/\//g,'').replace(/\:/g,'').replace(/\ /g,'')
             console.log(sTime)
          }
      };
      var end = {
          elem: '#endTime',
          format: 'YYYY-MM-DD hh:mm:ss ',
          min: laydate.now(),
          max: '2099-06-16 23:59:59',
          istime: true,
          istoday: false,
          choose: function(datas){
          start.max = datas; //结束日选好后，重置开始日的最大日期
          eTime = datas.replace(/\//g,'').replace(/\:/g,'').replace(/\ /g,'')
          console.log(eTime)
          }
      };
      //调用时间控件
      laydate(start);
      laydate(end);

    },
     //获取当前时间
    currentDate: function() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var minute = date.getMinutes()
        var seconds = date.getSeconds()
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (minute >= 1 && minute <= 9) {
            minute = "0" + minute;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + minute
                + seperator2 + seconds;
      $('#select-time').html(currentdate)
    },

    /**
     * [page 分页]
     * @param  {[number]} num         [当前页]
     * @param  {[number]} totalCounts [总页数]
     * @param  {[string]} id          [类型id]
     * @return {[object]}             [description]
     */
    
   page: function(num, totalCounts, id){
      var strS = '' //首页
      var strE = '' //尾页
      var PagesLen = Math.ceil(totalCounts / listNum) //总页数
      if(num==0){
        strS = '<a target="0" class="invalid">首页</a> '
      }else{
        strS = '<a target="0" >首页</a> '
      }
      if(num==PagesLen-1){
        strE = ' <a target="' + (PagesLen - 1) + '" class="invalid">尾页</a>  '
      }else{
        strE = ' <a target="' + (PagesLen - 1) + '">尾页</a>  '
      }
     
      var nowPage = num
      
      var PageNum_2 = PageNum % 2 == 0 ? Math.ceil(PageNum / 2) + 1 : Math.ceil(PageNum / 2)
      var PageNum_3 = PageNum % 2 == 0 ? Math.ceil(PageNum / 2) : Math.ceil(PageNum / 2) + 1
      var strC = "",
        startPage, endPage;
      if(PageNum >= PagesLen) {
        startPage = 0;
        endPage = PagesLen - 1
      } else if(nowPage < PageNum_2) {
        startPage = 0;
        endPage = PagesLen - 1 > PageNum ? PageNum : PagesLen - 1 //首页
      } else {
        startPage = nowPage + PageNum_3 >= PagesLen ? PagesLen - PageNum - 1 : nowPage - PageNum_2 + 1;
        var t = startPage + PageNum;
        endPage = t > PagesLen ? PagesLen - 1 : t
      }
      for(var i = startPage; i <= endPage; i++) {
        if(i == nowPage) {
          strC += '<a class="cur" target=" ' + i + ' ">' + (i + 1) + '</a> '
        } else {
          strC += '<a target=" ' + i + ' ">' + (i + 1) + '</a> '
        }
      }
 
      var maxlength = String(PagesLen).length
      var strE2 = ' <span class="total">  ' + (nowPage + 1) + '/ ' + PagesLen + '页   共  ' + totalCounts + ' 条 </span> '
      var strE3 = '<div class="goto">到 <input type="text" maxlength='+maxlength+' class="gotoInput" />' 
                  +'页 <input type="button" value="确定" class="gotoBtn" /></div>'
      $(id).find(".pageing").html(strS + strC + strE + strE3 + strE2 )

      
    },

    //错误提示
    errorTooltip: function(tooltip){
      var template = Handlebars.compile(errorTpl)
      var html = template({})
      $('.show-modal-dialog').html(html)
      $('.model-body').find('.conter').html(tooltip)
      $('#sure1').attr('id','sure')
      $(document).on('click', '#sure', function(e){
        $('.show-modal-dialog').html('')
      })
    },

    /**
     * [selectTooltip 选择清空提示]
     * @param  {[string]} tooltip [提示语]
     * @param  {[object]} cur     [当前选项]
     * @return {[object]}         [description]
     */
    selectTooltip: function(tooltip, cur){
      console.log(cur.attr('flag'))
      var template = Handlebars.compile(errorTpl)
      var html = template({})
      $('.show-modal-dialog').html(html)
      $('.model-body').find('.conter').html(tooltip)
      $('#sure1').attr('id','selSure').css({'left': '45px', 'top': '25px'})
      $('#cancel1').show().css({'top': '25px'})
      $(document).off('click', '#selSure')
      $(document).on('click', '#selSure', function(e){
        bClickFlag = !bClickFlag
        clickFlag = !clickFlag
        $(document).find('.checkbox').prop('checked', false)
        cur.prop('checked', true) //当前为选种
        //添加全选样式
        var flag = cur.attr('flag')

        if(selectAlls){
          $(document).find('.selectAll i').removeClass('cur')
          if(flag==1){
             $('#searchList').find('.selectAll i').addClass('cur') 
          }else{
             $('#backstageList').find('.selectAll i').addClass('cur') 
          }
        }
        
        $('.show-modal-dialog').html('')
      })
      $(document).on('click', '#cancel1', function(e){
        bClickFlag = !bClickFlag
        clickFlag = !clickFlag
        $('.show-modal-dialog').html('')
      })
    },

    init: function(){
      var self = this
      self.getData(searchUrl, backUrl)
      self.bindEvent()
      self.selectTime()
      self.updateState()
      setInterval(function(){
          self.updateState()
      },5000)
    }
  }

  return wordsConfig
})