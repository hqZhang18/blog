/**
 * @Author:      zhq
 * @DateTime:    2017-01-18 11:30:27
 * @Description: 弹窗
 * @Last Modified By:   zhq
 * @Last Modified Time:    2017-01-18 11:30:27
 */

define(function(require) {
  require('./lib/d3.js')
  var errorTpl = require('../components/errorDialog.tpl')
  var totals = [] //总条数
  var names = []
  //分页
  var totalCounts=0 ; //分页总数
  var page = 0;
  var nowPage = 0; //当前页
  var listNum = 4; //每页显示<ul>数
  var PagesLen; //总页数
  var PageNum = 4; //分页链接接数(5个)
  var currentPage = 0;
  var num = 0; 
  var len5 ;//当前页显示条数，每页最多5
  var baseUrl = window.global.BaseUrl+window.global.details
  var words =''
 
  var popup = {

    //获取短语数据
    getPhraseData: function(phraseUrl){
      var self = this
      $('.loading').show() 
      $.ajax({
        url: phraseUrl,
        type: 'GET',
        success: function(data){
          $('.loading').hide()
          var status = data.status
          if(!status){
            self.errorTooltip(data.message)
            return 
          }
          
          var data = data.data
          console.log(data)
          //短语空数据
          if(data == undefined || data.length==0 || data==null ){
            self.drawLine() //画线，显示弹窗
            self.bindEvent(data)
            $('.detailsBox').html('<div class="nodata" id="boxNoData">暂无数据</div>')
            $('#phrase').html('')
            $('#boxNoData').show()
            return
          }
          console.log(window.clickHot)
          if(window.clickHot){
            num = 0
            currentPage = 0
            window.clickHot = false
          } 


          $('#boxNoData').hide()
          
          var total = data[0].value
          var word = encodeURI(data[0].name)
          //window.word = data[0].name
          words = word
          //var word = '手机被盗'
          //详情列表 地址
          var detailsUrl = baseUrl+'?word='+''+word+'&timeType='+window.timeType+'&tabFlag='+window.type+'&size='+PageNum+'&pageNo='+(num+1)+''
          console.log(detailsUrl)
          var detailsUrl = './data/phase2.json'
          self.renderData(data)
          
          //调用弹窗的短语
          self.getDetailData(detailsUrl)
          self.drawLine() //画线，显示弹窗
          
        }
      })

    },

    //获取短语详情列表数据
    getDetailData: function(detailsUrl){
      var self = this
      $('.loading').show()
      $.ajax({
        url: detailsUrl,
        type: 'GET',
        success: function(data){
          $('.loading').hide()
          var state = data.status
          if(!state){
            self.errorTooltip(data.message)
            return 
          }

          var data = data.data
          totalCounts = data.totalRecord
          console.log('totalCounts', totalCounts)
          self.bindEvent(data.results)
          self.phaseList(data.results)
        }
      })
    },
    
    //渲染数据(短语)  数据由点击热词后传过来
    renderData: function(data){
      var str = ''
      totals.length = 0
      names.length = 0
      for(var i=0, len=data.length; i<len; i++){
        //总条数
        totals.push(data[i].value)
        names.push(data[i].name)
        var txt = data[i].name
        if(txt.length>4){
          txt = txt.substring(0, 4)+'...'
        }
        str += '<li>'+txt+'</li>'
      }
      if(totals.length>4){
        $('.detailsBox').css('top','180px')
      }
      $('#phrase').html(str)
      $('#phrase li').eq(0).addClass('cur')

    },
    
     //渲染短语详情列表
    phaseList: function(data){
      console.log('详情列表', data)
      var self = this
      var countPage = Math.ceil(totalCounts / listNum)
      //超出4条分页
      if(totalCounts>listNum){
        self.page(currentPage)
      }else{
        $("#changpage").html('')
       
      }
      //空数据处理
      if(data.length==0 || data==null){
        $('.detailsBox').html('<div class="nodata" id="boxNoData">暂无数据</div>')
        $('#boxNoData').show()
        return
      }
      $('#boxNoData').hide()
      
      var str = ''
      for(var i=0, len = data.length; i<len; i++){
        var ajNum = data[i].id
        var types = data[i].ssbFlag
        var type = ''
        var url =  '#'
        var href = ''
        var sourceTime = data[i].sj
        var sourceDetail = data[i].detail
        //接处警 动态警情
        console.log('type', window.type)
        if(window.type==2){
          type = '动态'
          url = 'javascript:void(0);'
          
          var href = '<a href='+url+' >'+sourceDetail+'</a>'
        }else{
          url = 'http://10.154.215.121/dswebcxtj/WebDetail/JCFInfolist.aspx?BH=' + ajNum + '&Type=jjzhd'
          type = '接处警'
          var href = '<a href='+url+' target="_blank">'+sourceDetail+'</a>'
        }
        
        //var ajSource = ''+type+'-'+data[i].aymc+''
       
        str += '<ul class="detailsList">'
              +'<li class="ajNum">'+ajNum+'</li>'
              +'<li class="ajSource"><span>'+type+'</span><span class="sourceTime">'+sourceTime+'</span></li>'
              +'<li class="sourceDetail">'+href+'</li>'
              +'</ul>'
      }
      $('.detailsBox').html(str)

    },
    //画线
    drawLine: function(){
      //显示当前点击热词
      $('.text').hide()
      $('.text').fadeIn('slow').html(window.word)

      var svg = d3.select('.drawLine')
       svg.html('')
       var line =  svg.append('svg')
          .attr('class', 'line')

       line.append('path')
        .attr('stroke', '#f4d317')
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('d', 'M5 5 L5 0 0 0')
        .transition()
        .duration(2000)
        .attr('d', 'M5 5 L75 213 L295 213')

        // 显示弹窗
        $('.popup').fadeOut(200);
        setTimeout(function(){
          $('.popup').fadeIn("slow")
        },1500)

    },
    // 点击事件
    bindEvent: function(data){
      var self = this
      
       //鼠标离开隐藏全部短语
      $('#phrase').on('mouseout', 'li', function(e){
        $('.overstep').hide()
      })
      //鼠标移上去显示全部短语
      $('#phrase').on('mouseover', 'li', function(e){
          var index = $(this).index()
          var text = $(this).text()
          var len = names[index].length
          $('.overstep').hide()
          var left = (30+index*100+index)+'px'
          var topValue = Math.floor(index/5)+1
          var top = 72*topValue+'px'
          if(index>4){
            left = (30+(index-5)*100+(index-5))+'px'
          }

          if(index>10){
            left = (30+(index%5)*100)+'px'
            if(topValue%2==0){
              top = '104px'
            }else{
              top = '52px'
            } 
          }
     
          if(len>4){
            $('.overstep').html([names[index]]).fadeIn(300)
              .css({'left':''+left+'', 'top':''+top+''})
          }
        })
     
      //点击短语
      $('#phrase').off('click', 'li')
      $('#phrase').on('click', 'li', function(e){
        //$('.popup').off('mouseleave')
        e.preventDefault()
        $('.detailsBox').html('')
        $(this).addClass('cur').siblings().removeClass('cur')
        var index = $(this).index()
        words = encodeURI(names[index])
        currentPage = 0
        var detailsUrl = baseUrl+'?word='+''+words+'&timeType='+window.timeType+'&tabFlag='+window.type+'&size='+PageNum+'&pageNo='+(currentPage+1)+''
        console.log(detailsUrl)
        if(index==1){
          var detailsUrl = './data/phase2.json'
        }else{
          var detailsUrl = './data/phase3.json'
        }
        self.getDetailData(detailsUrl)
      })



      //鼠标放到短语详情上
      $(document).on('mouseenter', '.sourceDetail', function(e){
        //$('.popup').off('mouseleave')
        e.preventDefault()
        var html = $.trim($(this).find('a').html())
        if(html.length>32){
          $(this).css('cursor', 'pointer')
          $('.phraseTooltip').html(html)
          var height = $('.phraseTooltip').height()
          var top = e.screenY-height-68
          //console.log(top)
          $('.phraseTooltip').css({'top': top+'px'}).show()
        }
      })

      $(document).on('mouseleave', '.sourceDetail', function(e){
        $('.phraseTooltip').html('').hide()
      })

     
      //点击分页
      $('#changpage').off('click', 'a')
      $('#changpage').on('click', 'a', function(e){
        //$('.popup').off('mouseleave')
        var isHas = $(this).hasClass('invalid')

         if(isHas){
           return
          }
        $(this).addClass('cur').siblings().removeClass('cur')
        num = parseInt($(this).attr("target"))
        currentPage = num 

        var detailsUrl = baseUrl+'?word='+''+words+'&timeType='+window.timeType+'&tabFlag='+window.type+'&size='+PageNum+'&pageNo='+(currentPage+1)+''
        console.log(detailsUrl)
        var detailsUrl = './data/phase2.json'
        self.getDetailData(detailsUrl)
      })
      


      //点击到多少页
      $(document).on('click', '.gotoBtn', function(e){
        var val = $('.gotoInput').val()
        num = parseInt($.trim(val)) - 1
         console.log('num', num )
        var PagesLen = Math.ceil(totalCounts / listNum) //总页数
        if(num !== num || (num+1) > PagesLen || num == -1){
          $('.gotoInput').val('')
          return 
        }
        currentPage = num
       
        var detailsUrl = baseUrl+'?word='+''+words+'&timeType='+window.timeType+'&tabFlag='+window.type+'&size='+PageNum+'&pageNo='+(currentPage+1)+''
        
        var detailsUrl = './data/phase2.json'
       // if(num==''){
       //   return
       // }
       console.log(detailsUrl)
        self.getDetailData(detailsUrl)
      })

      //点击关闭按钮
      $('.close').off('click')
      $('.close').on('click', function(e){
        e.preventDefault()
        clickPopup()
      })


      //鼠标离开弹窗
      // $('.popup').on('mouseleave', function(e){
      //   e.preventDefault()
      //   e.stopPropagation()
      //   clickPopup()
      // })
      
      //关闭弹窗
     function clickPopup(){
        $('.popup').fadeOut("slow")
        $('.line').fadeOut("slow")
        $('.text').fadeOut("slow")
        $('#tags').val('')
        $('.overstep').hide()
     }

    },

    //分页
    page: function(num){
      console.log('num', num)
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
      console.log(PagesLen)
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
      var strE2 = ' <div class="total">  ' + (nowPage + 1) + '/ ' + PagesLen + '页   共  ' + totalCounts + ' 条 </div> '
      var strE3 = '<span class="goto">到 <input type="text" maxlength='+maxlength+' class="gotoInput" />' 
                  +'页 <input type="button" value="确定" class="gotoBtn" /></span>'
      $("#changpage").html(strS + strC + strE + strE3 + strE2)
       
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
      $(document).on('click', '.close', function(e){
        $('.show-modal-dialog').html('')
      })
    },

    init: function(phraseUrl){
      
      this.getPhraseData(phraseUrl)
      
    }
  }

  return popup
})