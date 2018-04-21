/**
 * @Author:      技侦在侦案件底部案件数量
 * @DateTime:    2017-03-24 15:10:47
 * @Description: Description
 * @Last Modified By:   name
 * @Last Modified Time:    2017-03-24 15:10:47
 */

define(function(require) {

  var gauge = require('../common/gauge.js')  //案件数
  var showAll = require('../common/caseNumber.js')
  

  var caseNumber = {

    /**
     *  @describe [事件绑定]
     */
    bindEvent: function(){
      //各支队在侦案件数
      var investigationNumber = $('#investigationNumber').find('.all')
      var dataUrl = window.BASEURL + 'investigation/caseNumber'
      
      //案件数top5查看全部
      var investigationTop5 = $('#investigationTop5').find('.all')
     
      var showAlls = [
        {
          elem: investigationNumber,
          type: 1,
          title: '各支队在侦案件数排行榜',
          ratio: false
        },{
          elem: investigationTop5,
          type: 2,
          title: '各类在侦案件数排行榜',
          ratio: false
        }
      ]
      
       showAll.init(showAlls, dataUrl)
    },

    /**
     *  @describe [案件数量初始化]
     *  @param    {[type]}   data          [案件数量数据]
     */
    init: function(data){
      var _self = this
      _self.bindEvent()
      var detachment = data.detachment  //支队数
      var categoryTop5 =  data.category  //支队数
      //底部图表配置
      var cfg = {
        id: 'kindsCase',
        color: ['rgb(59, 40, 185)', 'rgb(14, 206, 212)'],
        radius: 60,
        barWidth: 25,
        series: {
          center: ["50%", "67%"]
        }
        
      }
      var cfg2 = {
        id: 'DetachmentCase',
        color: ['rgb(130, 34,183)', 'rgb(14, 127, 214)'],
        radius: 60,
        barWidth: 25,
        series: {
          center: ["50%", "67%"]
        }
      }

      gauge.init(categoryTop5, cfg)
      gauge.init(detachment, cfg2)  
    }

  }

  return caseNumber

})

