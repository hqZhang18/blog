/**
 * @Author:      zhanghq
 * @DateTime:    2017-06-16 15:15:47
 * @Description: 饼图组件
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-06-16 15:15:47
 */

define(function (require) {
    /**
     * 引入公用的文件
     */
    require('d3')
    require('lodash')
    // 引入公用的组件
    var commonUnit = require('../commonUnit')

    var splitPie = {

        /**
         * 饼图默认配置项
         */
        defaultSetting: function () {
            var width = 600
            var height = 600
            return {
                width: width,
                height: height,
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                },
                max: 90, //限制平分最多个数
                outerRadius: width/4,
                innerRadius: width/3,
                color: ['#c00cee', '#5478ff']
            }
        },

        /**
         *  默认数据源
         */
        defaultDataSource: function () {
        },

        /**
         *  绘制图表
         *  @param    {string} id   容器id
         *  @param    {array}  data 图表数据
         *  @param    {object} opt  图表配置项
         *
         *  example:
         *  [
         *    {
         *      name: "江北区",
         *      value: 234
         *    }
         *  ]
         */
        drawCharts: function (id, data1, opt) {
          var config = _.merge({}, this.defaultSetting(), opt)
          config.id = id
          var data = data1 || this.defaultDataSource()
          var svg = commonUnit.addSvg(id, config)
          var nums = []
          var dataset = []
          var name = []
          var total = 0
          data.map(function(d) {
            total += d.value
            dataset.push(d.value)
            name.push(d.name)
          })
          var dataSum = 0
          var w = config.width
          var h = config.height
          var max = config.max
          var min = config.min
          var scale = config.scale

          var pie = d3.layout.pie().sort(null) // 饼图布局
          var pieData = []
          var sum = 0
 

          for (var i = 0, len = dataset.length; i < len; i++) {
            // 根据比例得到每个值平分多少份
            /* n * (n1 / n1 + n2 + n3) 
             * n = 最多平分个数
             * n1 = 当前值
             * (n1 + n2 + n3) = 总数 
            */
            var num = Math.ceil(max * (dataset[i] / total))
            for (var j = 1; j < num + 1; j++) {
                pieData.push(1)
            }
            //计算总值
            dataSum += dataset[i]
            // 保存平分多少份的值用于后面填充颜色
            nums.push(num)
            sum += num
          }
          // 调用滤镜 path使用
          commonUnit.addFilter(id, config)

          var outerRadius = config.outerRadius  // 外半径
          var innerRadius = config.innerRadius - 25 // 内半径

          // 创建弧生成器
          var arc = d3.svg.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius)

          var arcGroup = svg.selectAll('.arc-group') 
          if(arcGroup.node()) {
            arcGroup = svg.select('.arc-group')
              .attr('transform', 'translate('+w/2+', '+(h/2)+')')   
          }else {
            arcGroup = svg.append('g')
              .attr('class', 'arc-group')  
              .attr('transform', 'translate('+w/2+', '+(h/2)+')')   
          }     


          // 获取update部分
          var update = arcGroup.selectAll('g')
              .data(pie(pieData))
              .call(this.setGAttribute, arc, sum)

          // 获取enter部分
          var enter = update.enter()

          // 获取exit部分
          var exit = update.exit()

          // 处理enter部分
          var appendG = enter.append('g')
              .call(this.setGAttribute, arc, sum)
          // 添加path元素    
          var path = appendG.append('path')
          this.setPathAttribute(path, nums, config)

          // 处理update部分
          var selectG = update
            .call(this.setGAttribute, arc, sum)
          // 选择path元素      
          path = selectG.select('path')
          this.setPathAttribute(path, nums, config)

          // 处理exit部分
          exit.remove()

          this.addNameGroup(svg, dataset, name, sum, nums, config)
        },

      /**
       *  添加文字及线条
       *  @param    {array}   svg        svg元素
       *  @param    {array}   dataset    数据
       *  @param    {array}   name       名字
       *  @param    {number}  sum        path总数
       *  @param    {array}   nums       每一类型的总数组
       *  @param    {object}  config    配置项
       */
      addNameGroup: function(svg, dataset, name, sum, nums, config) {
        
        // 选择update部分    
        var update = svg.selectAll('.name-group')
          .data(name)

        // 选择enter部分  
        var enter = update.enter()
            .append('g')
            .attr('class', function(d, i) {
              return 'name-group name-group-' + i
            })
        
        // 添加文字
        enter.append('text')
          .call(this.setNameAttribute, dataset, name, nums, sum, config)
        
        // 选择文字
        update.select('text')
          .call(this.setNameAttribute, dataset, name, nums, sum, config)  
   
        // 处理exit部分  
        update.exit().remove()  
  
      },

      /**
       *  设备polyline样式
       *  @param    {array}  polyline polyline元素
       *  @param    {array}  points   points属性(成生好之后传过来)
       *  @param    {object}  config  配置项
       */
      setPolylineAttr: function(polyline, points, config) {
        polyline
          .attr('points', points)
          .style('fill', 'none')
          .style('stroke', function (d, i) {
              return config.color[config.lineIndex]
          })
          .attr('transform', 'translate(' + config.width / 2 + ', ' + (config.height / 2) + ')')
          .attr('stroke-width', 2)
      },

      /**
       *  设置text属性及样式----添加polyline元素
       *  @param    {array}  text    text元素
       *  @param    {array}  dataset value数据
       *  @param    {array}  name    name数据
       *  @param    {number}  sum        path总数
       *  @param    {array}   nums       每一类型的总数组 
       *  @param    {object}  config  配置项
       */
      setNameAttribute: function(text, dataset, name, nums, sum, config) {
        var self = splitPie
        var w = config.width
        var h = config.height
        var attr = {}
        var angle = Math.PI * 2 / sum
        var midAngel 
        
        // 线条弧度
        var lineArc = d3.svg.arc()
            .innerRadius(1.1 * 120)
            .outerRadius(1.1 * 180)

        // 文字弧度
        var lEndArc = d3.svg.arc()
            .innerRadius(1.4 * 120)
            .outerRadius(1.4 * 180)

        text.each(function (d, i) {
          var count = 0
          var last = 0
          var c = 0
          for (var k = 0; k <= i; k++) {
              count += nums[k]
              last = nums[k]
          }
          attr.startAngle = angle * (count - last)
          attr.endAngle = angle * count

          midAngel = attr.startAngle + (attr.endAngle - attr.startAngle) / 2
          var pos = lEndArc.centroid(attr)
          // 改变文字标识的x坐标
          var radius = 300
          var points = [lineArc.centroid(attr), lEndArc.centroid(attr), pos]
          pos[0] = radius * (midAngel < Math.PI ? 1.1 : -1.1)
          // 保存i的下标用于polyline设置颜色
          config.lineIndex = i
          // 选择g元素下面的polyline元素
          var polyline = d3.select(config.id).select('.name-group-'+i)
          if(polyline.select('polyline').node()){
             polyline
              .select('polyline')
              .call(self.setPolylineAttr, points, config)
          }else {
            polyline 
              .append('polyline')
              .call(self.setPolylineAttr, points, config)
          }
                 
          //设置文字属性
          var texts = d3.select(this)
            .attr('x', pos[0])
            .attr('y', pos[1])
            .style('fill', config.color[i])
            .attr('font-size', 36)
            .style('text-anchor', midAngel < Math.PI ? 'end' : 'start')
            .attr('transform', 'translate(' + w / 2 + ', ' + (h / 2) + ')')

          // 选择tspan update部分  
          var update = texts.selectAll('tspan')
            .data([dataset[i], name[i]])
            .call(self.setTspanAttribute, pos)

          // 处理enter部分  
          update.enter()
          .append('tspan')
          .call(self.setTspanAttribute, pos)

          // 处理exit部分
          update.exit().remove()  
 
        })
      },

      /**
       *  tspan属性设置
       *  @param    {array}  tspan tspan元素
       *  @param    {array}  pos   位置坐标点
       */
      setTspanAttribute: function(tspan, pos) {
        tspan
          .attr('x', pos[0])
          .attr('y', function(d, i) {
            if(i===0) {
              return pos[1] + 30
            }
            return pos[1] - 10
          })
          .text(function(d, i) {
            return d
          })
      },

       /**
        *  设置path 的g元素样式
        *  @param    {array}  g   g元素
        *  @param    {function}   arc  弧生成器
        *  @param    {number}  sum  总数
        */
      setGAttribute: function(g, arc, sum) {
          g.attr('class', function(d, i) {
              return 'arc-g' + i
            })
            .attr('transform', function(d, i ) {
              var x = arc.centroid(d)[0]  
              var y = arc.centroid(d)[1]  
              var rotate = 360 / sum * i 
              return ' translate(' + x + ' ' + y + ') rotate(' + rotate + ' )'
            })
        },

      /**
       *  设置path样式
       *  @param    {array}  path        path元素
       *  @param    {array}   nums       每一类型的总数组
       *  @param    {object}  config      配置项
       */
      setPathAttribute: function (path, nums, config) {
          var n = 0
          var num = nums[0]
          // 填充颜色
          var color = config.color
          path.attr('fill', function(d, i) {
            if(i==num){
              n++
              num += nums[n]
            }
            return color[n]
          }) 
          .attr('d', 'M15.851,35.997 L11.531,38.877 L0.011,14.397 L20.171,-0.003 L23.051,4.317 L7.211,15.837 L15.851,35.997 Z')
          .attr('filter', 'url(#filter1)') 
      }
    }
    return splitPie
})
