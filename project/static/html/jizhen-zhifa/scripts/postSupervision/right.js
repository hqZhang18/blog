/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-24 13:45:13
 * @Description: Description
 * @Last Modified By:   name
 * @Last Modified Time:    2017-05-24 13:45:13
 */

define(function(require) {
  var util = require('../util/util')
	var right = {

    /**
     *  @describe [执法通报]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    enforceLaw: function(data) {
      var tpl = require('../../components/postSupervision/enforceLaw.tpl')
      var template = Handlebars.compile(tpl)
      var html = template({
        data: data
      }) 
      $('#enforceLaw').html(html)
      this.bindEvent(data, 1)

    },

    /**
     *  @describe [非规范操作行为]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    nonstandard: function(data){
      this.bindEvent(data, 2)
      //统计总数
      var total = data.total
      $('.nonstandard-total').html(total)
      //获取数据，绘制图表
      var data = data.group
      var violation = require('../components/violation.js')
      var config = {}
      var valueArr = [];
      data.map(function(item) {
        valueArr.push(item.value);
      })
      var maxValue = Math.max.apply(null, valueArr);
      //console.log(maxValue)
      var newData = [];
      data.map(function(item,index) {
        var barWidth = Math.round((item.value / maxValue) * 100)
        newData.push({
          name:item.name,
          barWidth:barWidth,
          value:item.value
        })
      })
      newData = newData.concat(newData)
      var listTpl = require('../../components/postSupervision/violationList.tpl')
      var template = Handlebars.compile(listTpl)
      var html = template({
        data: newData
      }) 
      $('.nonstandard').html(html)
      
    },

    bindEvent: function(data, type) {
        if(type==1){
          zftbMore(data)
        }else{
          czxwMore(data)
        }
        /**
         *  @describe [执法操作查看更多]
         *  @param    {[type]}   data [description]
         */
        function zftbMore(data) {

          var newData = []

          data.forEach(function(item){
            var url = encodeURI(item.url)
            newData.push({
              name: item.name,
              url: url
            })
          })
      
          $('#zftbMore').on('click', function(evt) {
            var tpl = require('../../components/postSupervision/showAll.tpl')
            var template = Handlebars.compile(tpl)
            var html = template({
              title: '执法通报详情',
              data: newData
            }) 
            $('.all-model-dialog').html(html)
          })
        }

        /**
         *  @describe [非规范操作行为查看更多]
         *  @param    {[type]}   data [description]
         */
        function czxwMore(data) {
          $('#czxwMore').on('click', function(evt) {
            var tpl = require('../../components/postSupervision/czxw-showAll.tpl')
            var template = Handlebars.compile(tpl)
            var html = template({
              title: '非规范操作行为详情',
              total: data.total,
              left: data.group.slice(0, 12),
              right: data.group.slice(12)
            }) 
            $('.all-model-dialog').html(html)
          })
        }
    
      $(document).on('click', '.close-model', function(evt) {
        $('.all-model-dialog').html('')
      })
      
    }

    
  }
  return right
})