/**
 * @Author:      baizn
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 技侦在侦案件
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */
define(function(require) {

  var headerNav = require('../data/headerNav.json')
    
    var casing = {

        init: function(centerTpl, isInit) {
            var self = this

            if(isInit){
              var myTemplate = Handlebars.compile(centerTpl)
              $('.content').html(myTemplate()); 

              //首页header部分
              var header = require('../components/header2.tpl')
              var headerTemplate = Handlebars.compile(header)
              var systemLen = headerNav.operationSystem.length
              let moreApp = []
              // 新增一个更多应用
              headerNav.moreApp = moreApp
              // 实现一个深拷贝
              var operSystem = headerNav.operationSystem.slice(0)
              if(systemLen>9){
                // 大于9个，截取显示
                headerNav.operSystem =  operSystem.slice(0, 9)
                moreApp = headerNav.operationSystem.slice(10)
                headerNav.moreApp = moreApp
              }
              $('.header').html(headerTemplate(headerNav))
              $('.xtgj-nav').append('<a>--</a><a>--</a>')
              // 新增一个更多应用
              if(systemLen > 9){
                $('.ywxt-nav').append('<a class="more-app">更多应用</a>')
                $('.more-app').on('click', function(e){

                  if($('.all-application').css('display') == 'none') {　　　　　　　　　　
                      $('.all-application').show();　　　
                      　　　　　$(this).addClass('cur')
                      } else {　　　　　　　　　　
                          $('.all-application').hide();　
                          $(this).removeClass('cur')　　　　　　　
                      }　　　　　　　　
                      e = e || event;
                     self.stopFunc(e)
                     
                  // var isClass = $(this).hasClass('cur')
                  // if(isClass){
                  //   $(this).removeClass('cur')
                  //   $('.all-application').hide()
                  // }else{
                  //   $(this).addClass('cur')
                  //   $('.all-application').show()
                  // }
                })

                document.onclick = function(e) {　　　　　　　　
                  $('.all-application').hide();
                  $('.more-app').removeClass('cur')　　
                }
              }

              // 大于12条分页
              if(moreApp.length > 12) {
                var navPage = require('navPage')
                navPage.init(moreApp)
              }
              //right部分
              var right = require('../components/right2.tpl')
              var rightTemplate = Handlebars.compile(right)
              $('.page-right').html(rightTemplate()); 
              //this.timeSlider()
              
              var typeDialog = require('../components/dialog/typeDialog.tpl')
              //var typeDialog = require('../components/dialog/showAllDialog.tpl')
              var typeDialogTemplate = Handlebars.compile(typeDialog)
              var data = [
                {
                  title: '标题标题标题111',
                  deital: '内容内容内容111'
                },{
                  title: '标题标题标题222',
                  deital: '内容内容内容111'
                },{
                  title: '标题标题标题222',
                  deital: '内容内容内容111'
                }
              ]

              var html = typeDialogTemplate({
                title: '技侦侦破案件',
                total: 245,
                data: data
              })

              $('.slider-modal-dialog').html(typeDialogTemplate)
            }else{
              var myTemplate = Handlebars.compile(centerTpl)
              $('.content').html(myTemplate()); 

            }
            
        },
        stopFunc: function(e) {　　　　　　
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;　　　　
        }
    }
    return casing
})