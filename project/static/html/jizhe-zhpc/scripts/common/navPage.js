/*
 * @Author: zhanghongqiao@hiynn.com 
 * @Date: 2018-01-22 16:43:59 
 * @Description: 首页二级导航分页
 * @Last Modified by: zhanghongqiao@hiynn.com
 * @Last Modified time: 2018-01-22 18:25:06
 */

define(function(require){
  //分页
  var totalCounts=0  //分页总数
  var page = 0
  var nowPage = 0 //当前页
  var listNum = 4 //每页显示个数
  var pagesLen //总页数
  var PageNum = 4 //分页链接接数(5个)

  var num = 0 
  var len5 //当前页显示条数，每页最多5
  var navPage = {
    
    bindEvent: function(data) {
      var self = this
      totalCounts = data.length
      self.pageing(num)
      $('.all-application .pageing').show()
      $('.all-application .pageing').on('click', 'a', function(e){
        
        num = parseInt($(this).attr("target")) // 当前页数
        var plen = Math.ceil(totalCounts / listNum) //总页数
        var text = $(this).text()
        // 首页末页移除无效样式
        if(text != '首页'){
          $('.pageing a').eq(0).removeClass('invalid')
        }
        if(text != '末页') {
          $('.pageing a').eq(plen + 1).removeClass('invalid')
        }
        // 首页末页添加无效样式
        switch(text){
           case '1':
            $('.pageing a').eq(0).addClass('invalid') 
            break
           case  String(plen):
            $('.pageing a').eq(plen + 1).addClass('invalid')
            break 
           default:
            break 
         }         
        var isHas = $(this).hasClass('invalid')
        if(isHas){
          return false
        }
        
        $(this).addClass('cur').siblings().removeClass('cur')
        // 重新渲染数据 
        var currendData = data.slice(num * listNum, num * listNum + listNum)
        self.renderData(currendData)
        
      })
    },

    renderData: function(data) {
      var html = ''
      data.forEach(function(d) {
        html += '<a href='+d.url+' target="_blank">'+d.name+'</a>'
      })
      $('.more-nav').html(html)
    },

    init: function(data) {
      navPage.bindEvent(data)
    },

    pageing: function(num){
      console.log('num', num)
      var strS = '' //首页
      var strE = '' //末页
      var pagesLen = Math.ceil(totalCounts / listNum) //总页数
      if(num==0){
        strS = '<a target="0" class="invalid">首页</a> '
      }else{
        strS = '<a target="0" >首页</a> '
      }
      if(num==pagesLen-1){
        strE = ' <a target="' + (pagesLen - 1) + '" class="invalid">末页</a>  '
      }else{
        strE = ' <a target="' + (pagesLen - 1) + '">末页</a>  '
      }
      console.log(pagesLen)
      var nowPage = num
      var PageNum_2 = PageNum % 2 == 0 ? Math.ceil(PageNum / 2) + 1 : Math.ceil(PageNum / 2)
      var PageNum_3 = PageNum % 2 == 0 ? Math.ceil(PageNum / 2) : Math.ceil(PageNum / 2) + 1
      var strC = "",
        startPage, endPage;
      if(PageNum >= pagesLen) {
        startPage = 0;
        endPage = pagesLen - 1
      } else if(nowPage < PageNum_2) {
        startPage = 0;
        endPage = pagesLen - 1 > PageNum ? PageNum : pagesLen - 1 //首页
      } else {
        startPage = nowPage + PageNum_3 >= pagesLen ? pagesLen - PageNum - 1 : nowPage - PageNum_2 + 1;
        var t = startPage + PageNum;
        endPage = t > pagesLen ? pagesLen - 1 : t
      }
      for(var i = startPage; i <= endPage; i++) {
        if(i == nowPage) {
          strC += '<a class="cur" target=" ' + i + ' ">' + (i + 1) + '</a> '
        } else {
          strC += '<a target=" ' + i + ' ">' + (i + 1) + '</a> '
        }
      }
      var maxlength = String(pagesLen).length
      $(".pageing").html(strS + strC + strE)
       
    }
  }
  return navPage
})
