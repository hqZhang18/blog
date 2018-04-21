/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-08-31 18:37:47
 * @Description:  由数据渲染人地区排行列表
 */
define(function(require) {
  require('d3')
  var maxValue
  var timer = null
  var timeOut = null
  var changeTime = 30000 //列表切换的时间，定为30s，最小值为cssTime * 2，即保证列表的CSS进场和退场过渡能进行完整
  var cssTime = 2000 //列表出场或者退场所需的时间，由popDistribute.css中所设置的属性（transition-duration + transition-delay）计算得到,计算得1.36s，此处设2s
  var topList = {
    render: function(data) {
      /**
       *  获取value值的最大值用于计算百分比
       */
      maxValue = d3.max(data, function(d) {
          return d.value
        })
        /**
         *  利用d3嵌套结构对数据进行排序
         *  真实数据其实可以不用排序，要求后端对数据进行排好序
         *  此处利用JS对象的原型属性valueOf作为key，然后对value值来进行排序
         *  走过的两个坑：
         *  1.不能将value作为key，因为当value出现相同值的时候，得不到我们想要的数据结构
         *  2.也不能用name属性作为key，因为十组数据的name都不一样，不能实现排序
         *  3.总结：只能利用数组元素（即JS对象）共有的一个属性且各自的此属性是一样的（原型属性）
         */
      var renderData = []
      renderData = d3.nest()
        .key(function(d) {
          return d.valueOf
        })
        .sortValues(function(a, b) {
          return d3.descending(a.value, b.value)
        })
        .entries(data)
      this.fileData(renderData[0].values)
    },
    fileData: function(data) {
      var self = this
      var dataLen = data.length
      var pages = Math.ceil(dataLen / 10) //38  -   4
      var page = 0
      this.renderList(data.slice(0, 10), page)
      clearInterval(timer)
      timer = setInterval(function() { //为了保证列表保持原样撤回去，才嵌套了一个定时器
        d3.select('#popTopList').classed('active', true)
        setTimeout(function() {
            page = page + 1 >= pages ? 0 : page + 1
            var partData = data.slice(page * 10 + 1, (page + 1) * 10 + 1)
            self.renderList(partData, page)
          }, cssTime) //这个时间为CSS过渡所需的时间
      }, changeTime)
    },
    renderList: function(partData, page) {
      /**
       *  由数据渲染列表
       */
      var stage = d3.select('#popTopList').classed('active', true)
      var liUpdate = stage.selectAll('li').data(partData).attr('data-top', function(d, i) {
        return (page * 10 + i + 1)
      })
      var liEnter = liUpdate.enter().append('li').attr('data-top', function(d, i) {
        return (page * 10 + i + 1)
      })
      liUpdate.exit().remove()
      liEnter.append('span').attr('class', 'area-name')
      liEnter.append('span').attr('class', 'progress')
      var liRender = stage.selectAll('li').data(partData)
      liRender.select('.area-name').html(function(d, i) {
          return 'NO.' + (page * 10 + i + 1) + ' ' + partData[i].name
        })
        /**
         *  触发CSS3动画
         */
      clearTimeout(timeOut)
      timeOut = setTimeout(function() {
          d3.select('#popTopList').classed('active', false)
        }, 1000)
        /**
         *  对宽度添加过度
         */
      liRender.select('.progress').style({
          'width': 0
        })
        .transition()
        .delay(cssTime) //这个时间为CSS过渡所需的时间
        .duration(2000)
        .style('width', function(d, i) {
          return parseFloat(partData[i].value * 100 / maxValue).toFixed(2) + '%'
        })
    }
  }
  return topList
})