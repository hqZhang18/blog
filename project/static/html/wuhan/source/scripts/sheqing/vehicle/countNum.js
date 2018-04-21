/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 12:49:26
 * @Description:  车辆分布左上角总数统计
 */
define(function(require) {
  require('handlebars')
  var countNum = function(data) {
    var log = console.log.bind(console)
    /**
     *  处理数据的value值
     *  左边列表需要将value值拆成九位，且用三分为节点法表示
     *  右边的列表只拆开，不用三分节点法
     */
    var renderData = []
    data.map(function(d,i) {
      if(i < 4) {
        var valueStr = d.value.toLocaleString()
        var valueArr = []
        for(var j = 0;j < valueStr.length;j++) {
          valueArr.push(valueStr.charAt(j))
        }
        if(valueArr.length < 9) {
          /**
           *  此处犯了个错
           *  for(var k = 0;k < 9 - valueArr.length;k++) {
           *    valueArr.unshift('')
            * }
           */
          var addLength = parseInt(9 - valueArr.length,10)
          for(var k = 0;k < addLength;k++) {
            valueArr.unshift('')
          }
        }

        renderData.push({
          name:d.name,
          valueArr:valueArr
        })
      } else {
        var valueStr = d.value.toString()
        var valueArr = []
        for(var j = 0;j < valueStr.length;j++) {
          valueArr.push(valueStr.charAt(j))
        }
        renderData.push({
          name:d.name,
          valueArr:valueArr
        })

      }
    })
 
    var tpl = require('../../../templates/sheqing/vehicle/countList.tpl')
    var countListHtml = Handlebars.compile(tpl)

    $('.count-list').html(countListHtml(renderData))
  }
  return countNum
})