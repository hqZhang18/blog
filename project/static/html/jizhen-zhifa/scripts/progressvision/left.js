/**
 * @Author:      lee
 * @DateTime:    2017-05-23
 * @Description: 过程监督页面左半部分JS
 */
define(function(require) {
  /**
   * 引入模版
   */
  var checkgressTpl = require('../../components/progressvision/checkgress.tpl');

  var progressVisionLeft = {

    /**
     *  @describe [渲染执法审核流程]
     *  @param    {[type]}   data [description]
     *  @return   {[type]}   [description]
     */
    renderCheckgress: function(data) {
      $(".checkgress li").eq(0).find("span:last").html(data.daishenhe)
      $(".checkgress li").eq(1).find("span:last").html(data.yishenhe)
      $(".checkgress li").eq(2).find("span:last").html(data.tuihui)
      $(".checkgress li").eq(3).find("span:last").html(data.zhongzhi)
    },

    //渲染执法支队审核流程统计
    renderCountgress:function(data) {
      var valueArr = [];
      data.map(function(item) {
        valueArr.push(item.value);
      })
      var maxValue = Math.max.apply(null, valueArr);
      var checkgressData = [];
      data.map(function(item,index) {
        // var barWidth = Math.round((item.value / maxValue) * 100);
        // var returnRote = (item.returnRote * 100).toFixed(0) + "%";
        var barWidth = Math.round((item.value / maxValue) * 100);
        var returnRote = item.returnRote
        var endRate = item.endRate
        checkgressData.push({
          name:item.name,
          barWidth:barWidth,
          value:item.value,
          returnRote:returnRote,
          endRate:endRate
        })
      })
      
      var countgressHmlt = Handlebars.compile(checkgressTpl);
      $(".countgress-list").html(countgressHmlt(checkgressData.concat(checkgressData)));
      console.log(checkgressData)
    }


  }
  return progressVisionLeft;
})