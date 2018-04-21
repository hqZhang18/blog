/**
 * @Author: xieyang
 * @DateTime: 2017-09-10
 * @Description: 渐变柱状图
 * @LastModifiedBy: xieyang
 * @LastModifiedTime: 2017-01-18
 */

define(function (require) {
  /**
   * 引入公用的文件
   */
  require('d3')
  require('lodash')
  
  var chart = {
    /**
     * 数据长度
     */
    dataLength: 0,
    
    /**
     * 柱状图默认配置项
     */
    defaultSetting: function () {
      return {
        /**
         * 渲染图形到哪一个轴上
         *      默认X轴，可选 'y'
         *      如果数据是 {name:xxx,value:xxx} 格式的，强制设置此属性对应的轴为文本轴
         *      如果数据是 {value:xxx,value:xxx} 格式的，将根据此属性设置图形所在轴
         *
         * @type {string}
         */
        sharpOrient: 'x',
        /**
         * 图表的宽度
         *
         * @type {number}
         */
        width: 500,
        /**
         * 图表的高度
         *
         * @type {number}
         */
        height: 300,
        /**
         * 动画选项
         *
         * @type {Object}
         */
        animation: {
          /**
           * 启用加载时动画
           *      true: 启用 默认
           *      false: 禁用
           *
           * @type {boolean}
           */
          enable: true,
          /**
           * 动画的持续时间
           *      默认 500ms
           *      单位 ms（毫秒）
           *
           * @type {number}
           */
          duration: 500,
          /**
           * 动画的缓动方式
           *      默认 'linear'
           *
           * @type {string}
           */
          ease: 'linear'
        },
        /**
         * 图表的padding值
         *      设置图表盒子模型的padding
         *      默认 30
         *
         * @type {Object}
         */
        padding: {
          top: 30,
          right: 30,
          bottom: 30,
          left: 30
        },
        /**
         * 柱状图配置项
         *
         * @type {Object}
         */
        itemStyle: {
          /**
           * 图形的高度/宽度
           *      当柱子位于 X 轴时，此值设置柱子的宽度
           *      当柱子位于 Y 轴时，此值设置柱子的高度
           *
           *      默认 50
           *
           * @type {number}
           */
          size: 50,
          /**
           * 自定义附加元素集合
           *      内置两个固定 SVG 元素（rect 和 text）,不可修改
           *      rect：用于展示可视化数据的矩形
           *      text：用于标注可视化数据的具体值
           *
           *      默认 一个长度为 0 的空数组
           *
           *      可自定义附加 SVG 元素，如image、circle、path等
           *
           *      结构示例：
           *          {{
                     *              image: {
                     *                  attr: {
                     *                      'href': 'xxx/xxx.png',
                     *                      'width': 100,
                     *                      'height': 100
                     *                  },
                     *                  sort: 1
                     *              }
                     *          }}
           *
           *      image: 附加的元素标签名称
           *      attr: 附加元素的属性集合和css样式集合，如 width、fill、url、'font-size'等
           *      sort: 附加元素的位置。
           *            此属性设置元素的绘画序列，初始化图形时将根据这个绘画序列依次绘制可视化元素
           *            缺省此属性将默认在已有的标签之后添加
           *            设置重复的序列会将当前元素的序列值设置为该值，序列中原位置的元素以及其后的元素自动往后面移动一个单位
           *            默认的绘画顺序是
           *              1 rect
           *              2 text
           *            此例中将 sort 设置为 1 后，绘画顺序变为
           *              1 image
           *              2 rect
           *              3 text
           *
           * @type {Object}
           */
          components: {},
          /**
           * 柱子背景色
           *      默认 '#3c31ec' 蓝色
           *
           * @type {string}
           */
          color: '#3c31ec',
          /**
           * 渐变配置
           *
           * @type {Object}
           */
          gradient: {
            /**
             * 启用柱状条渐变
             *      默认 true
             *      如果禁用此属性，将使用 itemStyle.color
             *
             * @type {boolean}
             */
            enable: true,
            /**
             * 渐变的id属性值
             *      强制：如果开启图表的柱状条渐变模式，每一张图表都应该设置独立的id
             *      以免与其他图表产生 id 重合
             *
             * @type string
             */
            id: 'gradientColor',
            /**
             * 渐变色域
             *      默认 '#a60a54' 到 '#a60a54' 的渐变
             *
             * @type {Object}
             */
            color: {
              start: '#a60a54',
              end: '#3c31ed'
            },
            /**
             * 渐变偏移量配置
             *      默认 0 到 100%
             *
             * @type Object
             */
            offset: {
              start: '0%',
              end: '100%'
            },
            /**
             * 渐变透明度配置
             *      默认 1
             *
             * @type Object
             */
            opacity: {
              start: 1,
              end: 1
            }
          },
          /**
           * 柱子角半径（圆角大小）
           *      默认0
           *
           * @type {number}
           */
          radius: 0,
          /**
           * 图形文本样式配置项
           *
           * @type {Object}
           */
          textStyle: {
            /**
             * 是否在柱状条上显示文本
             *      默认 false
             *
             * @type {boolean}
             */
            show: false,
            /**
             * 显示位置
             *      当柱状条文本可见时
             *      true: 在柱状条外部 默认
             *      false: 在柱状条内部
             *
             * @type {boolean}
             */
            outer: true,
            /**
             *  文字距离柱状条顶部的距离
             *      默认 10
             *
             *  @type {number}
             */
            spacing: 10,
            /**
             * 文本颜色
             *      默认 '#a60a54'
             *
             * @type {string}
             */
            color: '#a60a54',
            /**
             * 文本大小
             *      默认 14
             *
             * @type {number}
             */
            fontSize: 14
          }
        },
        /**
         * X轴配置
         *
         * @type {Object}
         */
        xAxis: {
          /**
           * 轴方向
           *      可选'top', 'bottom'
           *      默认 'bottom'
           *
           * @type {string}
           */
          orient: 'bottom',
          /**
           * 轴上需要显示的第一个刻度偏离0刻度的倍率
           *      在很多时候，比如 X 轴的第一个刻度（通常为0刻度）需要显示文本，但是为了图表的美观，
           *      我们往往需要将文本的显示位置往 X 轴的正方向移动一段距离，使第一个文本刻度与 X 轴的
           *      0刻度分离开。zero 属性就是用来设置这个偏移距离的。
           *
           *      该属性值为倍率，即设置前0刻度距离下一个刻度的距离值的倍率
           *      该属性仅在文本轴生效
           *
           *      默认 0
           *
           * @type {number}
           */
          zero: 0,
          /**
           * 同zero属性，但是这个属性是设置最后一个刻度偏移坐标轴末端的倍率
           *      默认 0
           *
           * @type {number}
           */
          end: 0,
          /**
           * 内刻度尺寸
           *      坐标轴起始位置刻度和终止位置刻度以外的其他刻度
           *
           *      默认 6
           *
           * @type {number}
           */
          innerTickSize: 6,
          /**
           * 内刻度尺寸
           *      坐标轴起始位置刻度和终止位置刻度
           *
           *      默认 6
           *
           * @type {number}
           */
          outerTickSize: 6,
          /**
           * 比例尺类型 （'linear'||'pow'||'sqrt'||'log'） 线性比例尺，指数比例尺，平方根比例尺，对数比例尺
           *
           *      默认 'linear' 线性比例尺 y = m * x + b
           *
           *      d3.scale.pow().domain([0,100]).range([0,700]).exponent(2);
           *      指数比例尺使用数学公式 y = m * x^k + b 映射 domain 与 range 之间的关系，k 用 exponent() 函数来设定
           *      默认指数为1，所以默认情况下也是数值 1:1 的缩放，等同于 linear 。
           *
           *      d3.scale.sqrt().domain([0,100]).range([0,700])
           *      平方根比例尺是 pow 比例尺的特殊类型，相当于 k = 0.5 的指数比例尺
           *      如 d3.scale.pow().exponent(0.5)
           *
           *      d3.scale.log().domain([10,100]).range([0,700])
           *      对数比例尺使用数学公式 y = m * log(x) + b 映射 domain 与 range 之间的关系
           *      使用这个比例尺有一个比较苛刻的要求，定义域的开始值（x）必须大于0开始，因为对数的底数不许为小于等于 0 的数
           *
           * @type {string}
           */
          scale: 'linear',
          /**
           * 指数
           *      在scale为 pow 时生效
           *      默认 2
           *
           * @type {number}
           */
          exponent: 2,
          /**
           * 轴单位：当数字达到一定范围时自动格式化为带单位的浮点数或整型
           *      false | 可以转换成false的其他值：不带单位 默认
           *      'en'：‘K,M,B’等
           *      'cn': ‘千，百万，十亿’等
           *      '%': 百分数
           *
           * @type {boolean || string}
           */
          unit: false,
          /**
           * 轴基准线
           *
           * @type {Object}
           */
          axisLine: {
            /**
             * 是否显示X轴
             *      默认 true
             *
             * @type {boolean}
             */
            show: true,
            /**
             * 轴样式
             *      以键值对的形式
             *      根据图表自行配置css样式
             *
             *      默认白色
             *
             * @type {Object}
             */
            style: {
              'fill': 'white',
              'text-anchor': 'middle'
            },
            /**
             * 轴文字样式
             *      以键值对的形式
             *      根据图表自行配置css样式
             *
             *      默认白色，居中
             *
             * @type {Object}
             */
            textStyle: {
              'fill': 'white',
              'text-anchor': 'middle'
            },
            /**
             * 由于图表的特性，当 X 轴的刻度文本宽度过低以致于影响到相邻的刻度文本显示时
             * 自动使用这个值来倾斜 X 轴的刻度文本
             *
             * 默认 -45 度
             */
            textRotate: -45
          },
          /**
           * X轴上的网格线
           *
           * @type {Object}
           */
          gridLine: {
            /**
             * 是否显示X轴网格线
             *      默认 true
             *
             * @type {boolean}
             */
            show: true,
            /**
             * 网格线样式
             *      可自行配置css键值对
             *      默认灰色，宽1像素
             *
             * @type {Object}
             */
            style: {
              'stroke': 'gray',
              'stroke-width': 1
            }
          },
          /**
           * 刻度数
           *      只对数字轴生效
           *      d3默认10
           *
           * @type {number}
           */
          ticks: 10,
          /**
           * 刻度与文本的距离
           *      默认 30
           *
           * @type {number}
           */
          tickPadding: 30,
          /**
           * 设置轴定义域的起始值
           *      false：从0开始，默认
           *      true：从传入数组的最小值开始
           *      如果数组的最小值为负数，则坐标轴启用负数轴
           *
           * @type {boolean}
           */
          domainStart: false,
          /**
           * 是否在轴上刻度的最小值之前缓冲一段距离
           *      如果图表内的各柱状条的起始值与终止值均大于轴上的某一个值（刻度N），
           *      或者起始值与终止值差值很小但值很大，均超过了刻度N，
           *      为了图表的美观，可以将刻度N之前的轴压缩一定的倍率，使得各柱状条的
           *      比例更为明显
           *
           *      该属性仅在 domainStart 属性为 true 时且该轴为数字轴时生效，默认false
           *
           * @type {boolean}
           */
          bufferAxis: false
        },
        /**
         * Y轴配置
         * 注释同 X轴
         */
        yAxis: {
          orient: 'left',
          zero: 0.5,
          end: 0.5,
          innerTickSize: 1,
          outerTickSize: 1,
          scale: 'linear',
          exponent: 2,
          unit: false,
          axisLine: {
            show: true,
            style: {
              'fill': 'white',
              'text-anchor': 'middle'
            },
            textStyle: {
              'fill': 'white',
              'text-anchor': 'end'
            }
          },
          gridLine: {
            show: true,
            style: {
              'stroke': 'gray',
              'stroke-width': 1
            }
          },
          ticks: 10,
          tickPadding: 30,
          domainStart: false,
          bufferAxis: false
        }
      }
    },
    
    /**
     * 渲染图表
     * @param {string} id 图表所在的外层容器的唯一标识
     * @param {Object} data 渲染图表所需数据
     *             example:
     *              [
     *                  {
         *                      name: "江北区",
         *                      value: 234
         *                  },
     *                  {...}
     *              ]
     * @param {Object} option 图表配置项
     */
    render: function (id, data, option) {
      //处理数据
      var config = _.merge({}, this.defaultSetting(), option)
      
      //如果传入的宽高值是一个百分数，则转化为适应当前 DOM 的数字值
      if (typeof config.width !== 'number') {
        config.width = document.getElementsByClassName(id)[0].clientWidth || 200
      }
      if (typeof config.height !== 'number') {
        config.height = document.getElementsByClassName(id)[0].clientHeight || 200
      }
      
      var yAxisData = []
      var xAxisData = []
      this.dataLength = data.length
      
      for (var i = 0; i < this.dataLength; i++) {
        if (config.sharpOrient !== 'x') {
          yAxisData.push(data[i].name)
          xAxisData.push(data[i].value)
        } else {
          yAxisData.push(data[i].value)
          xAxisData.push(data[i].name)
        }
      }
      
      // 创建比例尺
      var xScale = this.getXScale(config, xAxisData)
      var yScale = this.getYScale(config, yAxisData)
      
      // 初始化图表结构以及建立图表与数据的联系
      var chart = this.initChart(id, data, config, [xScale, yScale])
      
      // 生成X, Y轴及网格线
      this.drawYAxis(chart, config, yAxisData, yScale)
      this.drawXAxis(chart, config, xAxisData, xScale)
      
      // 初始化数据可视化图形（图标主体内容）
      data = [yAxisData, xAxisData]
      this.drawSharp(chart, data, config, [xScale, yScale])
    },
    
    /**
     * 创建图表所需的结构以及建立图形与数据的联系
     * @param {string} id 图表唯一标识
     * @param {Object} data 数据
     * @param {Object} config 配置项
     * @param {Array} scales 包含X轴和Y轴的比例尺
     * @returns {*} 图表对象
     */
    initChart: function (id, data, config, scales) {
      var chart
      var padding = config.padding
      
      var width = config.width - padding.right - padding.left
      var height = config.height - padding.top - padding.bottom
      
      if (d3.select('.' + id).select('svg.cont-' + id).node()) {
        chart = d3.select('.' + id).select('svg.cont-' + id)
      } else {
        chart = d3.select('.' + id).append('svg')
        chart.append('g').attr('class', 'axes')
        chart.append('g').attr('class', 'chart-body')
      }
      
      chart
        .attr({
          width: width,
          height: height
        })
        .attr('class', 'cont-' + id)
        .style('padding', function () {
          return padding.top + 'px '
            + padding.right + 'px '
            + padding.bottom + 'px '
            + padding.left + 'px'
        })
      
      // 绑定数据与图形
      var shapeData = chart.select('.chart-body')
        .selectAll('.group')
        .data(data)
      
      // 删除未关联数据的图形
      shapeData.exit().remove()
      
      // enter
      shapeData
        .enter()
        .append('g')
        .attr('class', 'group')
        .each(function () {
          /**
           * 使用SVG标签来绘制图形
           * 渐变图
           */
          var componentsArray = ['rect', 'text'] // 内置的默认排序序列
          var components = config.itemStyle.components
          
          // 重新排列排序序列
          var obj
          for (obj in components) {
            componentsArray.splice(components[obj].sort - 1, 0, obj)
          }
          
          //根据新的序列初始化结构
          for (obj in componentsArray) {
            d3.select(this).append(componentsArray[obj])
          }
        })
      
      // update
      shapeData
        .attr('transform', function (d, i) {
          var p1, p2, rotate
          var bodyHeight = config.height - config.padding.top - config.padding.bottom
          
          if (config.sharpOrient === 'x') {
            p1 = scales[0](i + config.xAxis.zero * 2) + config.itemStyle.size / 2
            p2 = 0
            rotate = ', rotate(180 ' + p2 + ',' + bodyHeight / 2 + ')'
            
          } else {
            p1 = 0
            p2 = bodyHeight - scales[1](i + config.xAxis.zero * 2) - config.itemStyle.size / 2
            rotate = ''
          }
          return 'translate(' + p1 + ',' + p2 + ')' + rotate
        })
      
      return chart
    },
    
    /**
     * 定义轴比例尺类型，可在配置项配置比例尺类型
     * @param {string} axis 坐标轴标识, 'x' or 'y', default 'x'
     * @param {Object} config 配置项
     * @returns {*} 返回坐标轴对象
     */
    axesScale: function (axis, config) {
      axis = axis && axis === 'y' ? 'yAxis' : 'xAxis'
      switch (config[axis].scale) {
        case 'pow':
          return d3.scale.pow().exponent(config[axis].exponent)
        case 'sqrt':
          return d3.scale.sqrt()
        case 'log':
          return d3.scale.log()
        default://linear or other scale
          return d3.scale.linear()
      }
    },
    
    /**
     * 获取X轴比例尺
     * @param {Object} config 配置项
     * @param {Array} data 数据
     * @returns {d3.scale} xScale X轴比例尺
     */
    getXScale: function (config, data) {
      var domain //定义域
      var isNumberAxis = !isNaN(data[0]) //是否是数字轴，false为文本轴
      var gridWidth = config.width - config.padding.left - config.padding.right
      var xScale = chart.axesScale('x', config) //定义轴比例尺类型，可在配置项配置比例尺类型
        .range([0, gridWidth]) //定义比例尺值域
      
      if (isNumberAxis) {//数字轴
        var domainStart = config.xAxis.domainStart
        if (domainStart) {//根据配置设置定义域
          var min = d3.min(data)
          var max = d3.max(data)
          
          if (min > 0 && config.xAxis.bufferAxis) {
            domain = [min / 2, max]
          } else {
            domain = [min, max]
          }
        } else {
          domain = [0, d3.max(data)]
        }
      } else {//文本轴
        var length = data.length
        var zeroGra = config.xAxis.zero / length // 倍率 ÷ 刻度总数 = 平均偏移倍率
        var endGra = config.xAxis.end / length
        domain = [length * zeroGra, length * (1 + endGra)]
      }
      
      xScale.domain(domain)
      
      return xScale
    },
    
    /**
     * 渲染X轴及其网格线
     * @param chart d3图表对象
     * @param {Object} config 配置项
     * @param {Array} data 数据
     * @param xScale X轴比例尺
     */
    drawXAxis: function (chart, config, data, xScale) {
      var isNumberAxis = !isNaN(data[0])
      //设置轴刻度数，只对数字轴生效
      this.setAxesTicks(isNumberAxis, data.length, config.xAxis)
      
      // 设置轴并初始化轴样式
      var xAxis = d3.svg.axis()
        .scale(xScale)      // 指定比例尺
        .orient(config.xAxis.orient)   // 指定刻度的方向
        /**
         * 指定刻度，可以设置为大于0的整数，默认为数据数组的长度，但最大为10
         */
        .ticks(config.xAxis.ticks)
        .tickPadding(config.xAxis.tickPadding) //指定刻度与刻度文本的距离
        .innerTickSize(config.xAxis.innerTickSize)//内刻度大小
        .outerTickSize(config.xAxis.outerTickSize)//外刻度大小
        .tickFormat(function (d, i) {
          if (isNumberAxis) {
            if (config.yAxis.unit === 'en') {
              if (d >= 1000000) {
                return d / 1000000 + 'M'
              } else if (d >= 10000) {
                return d / 10000 + 'W'
              }
            } else if (config.yAxis.unit === 'cn') {
              if (d >= 1000000) {
                return d / 1000000 + '百万'
              } else if (d >= 10000) {
                return d / 10000 + '万'
              }
            } else if (config.yAxis.unit === '%') {
              return d != 0 ? d + '%' : d
            } else {
              return d
            }
          } else {
            return data[i]
          }
        })
      
      // 初始化轴或更新轴
      if (config.xAxis.gridLine.show || config.xAxis.axisLine.show) {
        if (!chart.select('.axes .axis-x').node()) {
          chart.select('.axes')
            .append('g')
            .attr('class', 'axis-x')
        }
        chart.select('.axes .axis-x')
          .attr('transform', function () {
            return 'translate(0,' + (config.height - config.padding.top - config.padding.bottom) + ')'
          })
          .attr(config.xAxis.axisLine.style)
          .call(xAxis)
        
        if (!config.xAxis.axisLine.show) {
          chart.select('.axes').select('.axis-x .domain').attr('opacity', 0)
        }
      }
      
      //网格线
      if (config.xAxis.gridLine.show) {
        chart.select('.axes .axis-x')
          .selectAll("g.tick")
          .select("line.grid-line")
          .remove();
        
        chart.select('.axes .axis-x')
          .selectAll("g.tick")
          .append('line')
          .attr("class", 'grid-line')
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 0)
          .attr("y2", -(config.height - config.padding.top - config.padding.bottom))
          .attr(config.xAxis.gridLine.style)
      }
      
      // 设置轴文本样式
      var textWidth = 0 // 轴刻度文本元素的宽度总和
      var text = chart
        .select('.axes .axis-x')
        .selectAll('text')
        .attr(config.xAxis.axisLine.textStyle)
        .each(function () {
          textWidth += this.getBBox().width
        })
        .attr('opacity', function () {
          if (config.xAxis.axisLine.show) {
            return config.xAxis.axisLine.textStyle.opacity || 1
          } else {
            return 0
          }
        })
      
      // 当刻度的当前可视长度大于该刻度的最大长度（根据X轴的长度及刻度数自动计算）时，设置轴文本倾斜显示
      if (textWidth > xScale.range()[1]) {
        text
          .transition()
          .duration(500)
          .attr('transform', function () {
            return 'rotate(' + config.xAxis.axisLine.textRotate + '),translate(-10, 5)'
          })
          .attr('y', 6)
          .attr('x', 10)
          .style('text-anchor', 'end')
      }
    },
    
    /**
     * 获取Y轴比例尺
     * @param {Object} config 配置项
     * @param {Array} data 数据
     * @returns {d3.scale} yScale y轴比例尺
     */
    getYScale: function (config, data) {
      var domain
      var isNumberAxis = !isNaN(data[0]) // 是否是数字轴，false为文本轴
      var gridHeight = config.height - config.padding.top - config.padding.bottom
      var yScale = chart.axesScale('y', config)
        .range([gridHeight, 0])
      
      if (isNumberAxis) {//数字轴
        var domainStart = config.yAxis.domainStart
        if (domainStart) {
          var min = d3.min(data)
          var max = d3.max(data)
          
          if (min > 0 && config.yAxis.bufferAxis) {
            domain = [min / 2, max]
          } else {
            domain = [min, max]
          }
        } else {
          domain = [0, d3.max(data)]
        }
      } else {//文本轴
        var length = data.length
        var zeroGra = config.yAxis.zero / length // 倍率 ÷ 刻度总数 = 平均偏移倍率
        var endGra = config.yAxis.end / length
        domain = [length * zeroGra, length * (1 + endGra)]
      }
      
      yScale.domain(domain)
      
      return yScale
    },
    
    /**
     * 渲染Y轴及其网格线
     * @param chart d3图表对象
     * @param {Object} config 配置项
     * @param {Array} data 数据
     * @param yScale Y轴比例尺
     */
    drawYAxis: function (chart, config, data, yScale) {
      var isNumberAxis = !isNaN(data[0])
      var dataLength = this.dataLength
      
      this.setAxesTicks(isNumberAxis, data.length, config.yAxis)
      
      // 定义y轴样式
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient(config.yAxis.orient)
        .ticks(config.yAxis.ticks)
        .tickPadding(config.yAxis.tickPadding)
        .innerTickSize(config.yAxis.innerTickSize)//内刻度大小
        .outerTickSize(config.yAxis.outerTickSize)//外刻度大小
        .tickFormat(function (d, i) {
          if (isNumberAxis) {
            if (config.yAxis.unit === 'en') {
              if (d >= 1000000) {
                return d / 1000000 + 'M'
              } else if (d >= 10000) {
                return d / 10000 + 'W'
              }
            } else if (config.yAxis.unit === 'cn') {
              if (d >= 1000000) {
                return d / 1000000 + '百万'
              } else if (d >= 10000) {
                return d / 10000 + '万'
              }
            } else if (config.yAxis.unit === '%') {
              return d != 0 ? d + '%' : d
            } else {
              return d
            }
          } else {
            return data[dataLength - 1 - i]
          }
        })
      
      if (config.yAxis.gridLine.show || config.yAxis.axisLine.show) {
        if (!chart.select('.axes .axis-y').node()) {
          chart.select('.axes')
            .append('g')
            .attr('class', 'axis-y')
        }
        chart.select('.axes').select('.axis-y')
          .attr({
            transform: function () {
              return 'translate(' + 0 + ', ' + 0 + ')'
            }
          })
          .attr(config.yAxis.axisLine.style)
          .call(yAxis)
        
        if (!config.yAxis.axisLine.show) {
          chart.select('.axes').select('.axis-y .domain').attr('opacity', 0)
        }
      }
      
      // 网格线
      if (config.yAxis.gridLine.show) {
        chart.select('.axes .axis-y')
          .selectAll("g.tick")
          .select("line.grid-line")
          .remove();
        
        chart.select('.axes .axis-y')
          .selectAll("g.tick")
          .append('line')
          .attr("class", 'grid-line')
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", config.width - config.padding.left - config.padding.right)
          .attr("y2", 0)
          .attr(config.yAxis.gridLine.style)
      }
      
      // 设置轴文本样式
      chart.select('.axis-y')
        .selectAll('text')
        .attr(config.yAxis.axisLine.textStyle)
    },
    
    /**
     * 获取轴刻度数（近似值，具体请参考官方 axis.ticks() 的注释）
     * @param {boolean} isNumberAxis 是否是数字轴
     * @param {number} dataLength 轴数据的长度
     * @param {Object} config 轴配置文件
     */
    setAxesTicks: function (isNumberAxis, dataLength, config) {
      if (isNumberAxis) {
        config.ticks = config.ticks ? config.ticks : dataLength > 10 ? 9 : dataLength
      } else {
        config.ticks = dataLength - 1
      }
    },
    
    /**
     * 绘制图形主体及内部元素
     * @param {*} chart d3图表对象
     * @param {Array} data 数据集
     * @param {Object} config 配置项
     * @param {Array} scales 轴比例尺
     */
    drawSharp: function (chart, data, config, scales) {
      var itemStyle = config.itemStyle
      
      if (itemStyle.gradient.enable) {
        // 调用渐变
        this.getGradient(chart, itemStyle.gradient, config.sharpOrient)
      }
      
      // 初始化图形
      chart.select('.chart-body')
        .selectAll('.group')
        .each(function (d) {
          var group = this
          
          // 柱状条内各元素的属性设置
          var componentsAttr = {
            rect: function () {
              d3.select(group)
                .select('rect')
                .attr('width', function () {
                  if (config.sharpOrient === 'x') {
                    return itemStyle.size
                  } else {
                    return 0
                  }
                })
                .attr('height', function () {
                  if (config.sharpOrient === 'x') {
                    return 0
                  } else {
                    return itemStyle.size
                  }
                })
                .attr({
                  x: 0,
                  y: 0,
                  rx: itemStyle.radius,
                  ry: itemStyle.radius
                })
                .transition()
                .duration(function () {
                  if (config.animation.enable) {
                    return config.animation.duration
                  } else {
                    return 0
                  }
                })
                .ease(config.animation.ease)
                .attr('width', function () {
                  if (config.sharpOrient === 'x') {
                    return itemStyle.size
                  } else {
                    return scales[0](d.value)
                  }
                })
                .attr('height', function () {
                  if (config.sharpOrient === 'x') {
                    return scales[1](scales[1].domain()[1] - d.value)
                  } else {
                    return itemStyle.size
                  }
                })
                .style('fill', function () {
                  if (itemStyle.gradient.enable) {
                    return 'url(#' + itemStyle.gradient.id + ')'
                  } else {
                    return itemStyle.color
                  }
                })
            },
            text: function () {
              d3.select(group)
                .select('text')
                .text(d.value)
                .attr('opacity', 0)
                .attr('x', function () {
                  if (config.sharpOrient === 'x') {
                    return -itemStyle.size / 2
                  } else {
                    var x = 0
                    var textWidth = this.getBBox().width
                    var spacing = itemStyle.textStyle.spacing
                    
                    if (itemStyle.textStyle.outer) {
                      return x + spacing
                    } else {
                      return x - textWidth - spacing
                    }
                  }
                })
                .attr('y', function () {
                  var textHeight = this.getBBox().height
                  
                  if (config.sharpOrient === 'x') {
                    var y = -scales[1](scales[1].domain()[1])
                    var spacing = itemStyle.textStyle.spacing
                    
                    if (itemStyle.textStyle.outer) {
                      return y - spacing
                    } else {
                      return y + textHeight + spacing
                    }
                  } else {
                    return (itemStyle.size + textHeight / 2) / 2
                  }
                })
                .style('fill', itemStyle.textStyle.color)
                .style('font-size', itemStyle.textStyle.fontSize)
                .style('text-anchor', 'middle')
                .attr('transform', function () {
                  if (config.sharpOrient === 'x') {
                    return 'rotate(180)'
                  }
                })
                .transition()
                .duration(function () {
                  if (config.animation.enable) {
                    return config.animation.duration
                  } else {
                    return 0
                  }
                })
                .ease(config.animation.ease)
                .attr('x', function () {
                  if (config.sharpOrient === 'x') {
                    return -itemStyle.size / 2
                  } else {
                    var x = scales[0](d.value)
                    var textWidth = this.getBBox().width
                    var spacing = itemStyle.textStyle.spacing
                    
                    if (itemStyle.textStyle.outer) {
                      return x + textWidth / 2 + spacing
                    } else {
                      return x - textWidth - spacing
                    }
                  }
                })
                .attr('y', function () {
                  var textHeight = this.getBBox().height
                  
                  if (config.sharpOrient === 'x') {
                    var y = -scales[1](scales[1].domain()[1] - d.value)
                    var spacing = itemStyle.textStyle.spacing
                    
                    if (itemStyle.textStyle.outer) {
                      return y - spacing
                    } else {
                      return y + textHeight + spacing
                    }
                  } else {
                    return (itemStyle.size + textHeight / 2) / 2
                  }
                })
                .attr('opacity', function () {
                  if (itemStyle.textStyle.show) {
                    return 1
                  }
                  return 0
                })
            }
          }
          
          var components = config.itemStyle.components
          // 设置柱状条内置的元素的属性
          componentsAttr['rect']()
          componentsAttr['text']()
          
          // 设置柱状条自定义附加的元素的属性
          for (var i in components) {
            componentsAttr[i] = function () {
              d3.select(group)
                .select(i)
                .attr(components[i].attr)
            }
            
            componentsAttr[i]()
          }
        })
    },
    
    /**
     * 初始化滤镜结构及属性
     * @param {*} chart d3图表对象
     * @param {Object} config 渐变配置项
     */
    getGradient: function (chart, config, sharpOrient) {
      var defs = null
      if (chart.selectAll('defs').node()) {
        defs = chart.select('defs')
      } else {
        defs = chart.append('defs')
      }
      
      //检查是否存在该滤镜
      if (chart.selectAll('#' + config.id)[0].length > 0) {
        return
      }
      
      //滤镜颜色处理
      var startColor = d3.hcl(config.color.end)
      var endColor = d3.hcl(config.color.start)
      
      // 添加defs
      var gradient
      if (sharpOrient === 'x') {
        gradient = defs.append('linearGradient')
          .attr({
            'id': config.id,
            'x1': 0,
            'y1': 0,
            'x2': 0,
            'y2': '100%'
          })
      } else {
        gradient = defs.append('linearGradient')
          .attr({
            'id': config.id,
            'x1': 0,
            'y1': 0,
            'x2': '100%',
            'y2': 0
          })
      }
      
      // 滤镜开始属性
      gradient.append('stop')
        .attr('offset', config.offset.start)
        .style({
          'stop-color': startColor.toString(),
          'stop-opacity': config.opacity.start
        })
      
      // 滤镜结束属性
      gradient.append('stop')
        .attr('offset', config.offset.end)
        .style({
          'stop-color': endColor.toString(),
          'stop-opacity': config.opacity.end
        })
    }
  }
  
  return chart
})
