/**
 * @Author:      baizn
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 技侦在侦案件
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */
define(function(require) {

    
    var casing = {

        init: function(centerTpl, isInit) {

            if(isInit){
              var myTemplate = Handlebars.compile(centerTpl)
              $('.content').html(myTemplate()); 

              //header部分
              var header = require('../components/header.tpl')
              var headerTemplate = Handlebars.compile(header)
              $('.header').html(headerTemplate())

              //right部分
              var right = require('../components/right.tpl')
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
            
        }
    }
    return casing
})