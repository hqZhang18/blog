/**
 * @Author:      zhanghq
 * @DateTime:    2017-08-18 08:43:51
 * @Description: 评估面积图
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-18 08:43:51
 */

define(function(require) {
  /**
  * 引入公用的文件
  */
  require('d3')
  require('lodash')

  // 公用配置项
  var config = {}
  var yScale  // y轴
  var xScale  // x轴
  var areaPath // 区域生成器
  var linePath  // 线段生成器
  var grid
  var height
  var nullData = [] // 动画路径初始化
  var isInit = 0

  var commonUnit = require('./commonUnit.js')
   
  var charts = {
    defaultSetting: function() {
      return {
        // width: 800,
        // height: 500,
        width: 870,
        height: 288,
        id: '#charts',
        padding: {
          top: 10,
          left: 30,
          bottom: 20,
          right: 50,
        },
        gradientCfg: {
          x1: '0%',
          y1: '30%',
          x2: '0%',
          y2: '100%',
          offset1: '0%',
          offset2: '100%',
          opacity1: 0.2,
          opacity2: 0.1
        },
        legendId: 0,
        itemStyle: [
           // 破案率
         {
          areaPath: { 
            fill: ['#4db4ca', '#4db4ca'],
            stroke: 'none',
            strokeWidth: 1,
          },
          linePath: {
            fill: 'none',
            stroke: '#4db4ca',
            strokeWidth: 2,
          },
        }, 
        // 110投诉率
        {
          areaPath: {
            fill: ['#006e4b', '#006e4b'],
            stroke: 'none',
            strokeWidth: 1,
          },
          linePath: {
            fill: 'none',
            stroke: '#006e4b',
            strokeWidth: 2,
          },
        },
        // 受案立案审查达标率
        {
          areaPath: {
            fill: ['#cc30fe', '#cc30fe'],
            stroke: 'none',
            strokeWidth: 1,
          },
          linePath: {
            fill: 'none',
            stroke: '#cc30fe',
            strokeWidth: 2,
          },
        },
        // 破案率高亮
        {
          areaPath: {
            fill: ['#4db4ca', '#4db4ca'],
            stroke: 'none',
            strokeWidth: 1,
          },
          linePath: {
            fill: 'none',
            stroke: '#4db4ca',
            strokeWidth: 2,
          },
        },
        // 110投诉率高亮
        {
          areaPath: {
            fill: ['#109f71', '#109f71'],
            stroke: 'none',
            strokeWidth: 1,
          },
          linePath: {
            fill: 'none',
            stroke: '#109f71',
            strokeWidth: 2,
          },
        },
        // 受案立案审查达标率高亮
        {
          areaPath: {
            fill: ['#7100ff', '#7100ff'],
            stroke: 'none',
            strokeWidth: 1,
          },
          linePath: {
            fill: 'none',
            stroke: '#7100ff',
            strokeWidth: 2,
          },
        },
        // 颜色变灰
        {
          areaPath: {
            fill: ['#4c5a73', '#4c5a73'],
            stroke: 'none',
            strokeWidth: 1,
          },
          linePath: {
            fill: 'none',
            stroke: '#4c5a73',
            strokeWidth: 2,
          }
        }
      ],
        xText: {
          fill: '#fff',
          fontSize: 30,
          textAnchor: 'middle',
          margin: {
            bottom: 0
          }
        },
        yAxis: {
          id: 'areaYaxis',
          ratio: true,
          axisLine: {
            show: true
          },
          gridLine: {
            show: false
          },
          ticks: 5,
          position: 'right'
        },
        grid: {
          x: 50,
          x2: 0,
          y: 125,
          y2: 0
        }
      }
    },

    /**
     *  默认数据源
     */
    defaultDataSource: function() {
      return []
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
     *      name: '江北区',
     *      value1: 1140,
     *      value2: 740
     *    }
     *  ] 
     */
    drawCharts: function(id, data1, opt) {
      // 合并配置项
      config = _.merge({}, this.defaultSetting(), opt)
      // 获取数据
      var data = data1 || this.defaultDataSource()
      //  空数据处理
      var isData = commonUnit.noData(id, data)
      if(isData) { 
        return
      }
      // 创建svg
      var svg = commonUnit.addSvg(id, config)
      var padding = config.padding
      var width = config.width - padding.left - padding.right
      height = config.height
      grid = config.grid

      // 三种类型，生成三个面积图
      var newData = [0, 1]

      // 创建svg
      var svg = commonUnit.addSvg(id, config)
      
      // 初始化执行
      if(!isInit) {
        // 调用滤镜
        commonUnit.addFilter(id, config)
        // 添加一级空数据
        for(var i = 0; i < data.length; i++) {
          nullData.push(0)
        }
        isInit++
      }
      // 分别获取name值  xData用于生成x轴name
      var xData = []
      for(var i = 0; i < data.length; i++) {
        xData.push(data[i].date)
      }
      
 
      // for(var i = 0; i<11; i++) {
      //   dataset.push(i*10)
      // }
      // 用于添加Y轴及网格线
      // 三组数据，所有value值
      var dataset = []
      for(var i = 1; i<4; i++) {
        for(var j = 0, len = data.length; j < len; j++) {
          // console.log(data[j]['value'+i] * 100)
          dataset.push(data[j]['value'+i] * 100)
        }
      } 
      // 生成Y轴及网格线
      config.yAxis.direction  = width - grid.x2
      yScale =  commonUnit.addYAxis(svg, config, dataset)
      // 生成X轴
      commonUnit.addXAxis(svg, config, xData)

      // 旋转文字  
      d3.select(id).selectAll('.axis-x text')
        .attr({
          transform: 'rotate(-35) ',
          x: function(d, i) {
            return -17
          },
          y: function(d, i) {
            return 9 
          },
        })
 
      var itemStyle = config.itemStyle
      // 横坐标轴比例尺
      xScale = d3.scale.linear()
            // .domain([-0.1, xData.length - 0.9]) // 留点间距
            .domain([0, xData.length-1])
            .range([0, width ])   

      // 区域生成器
      areaPath = d3.svg.area()
        .x(function(d, i) {
          return xScale(i)
        })
        .y0(function() {
          return height - grid.y 
        })
        .y1(function(d) {
          return yScale(d) + grid.y2
        })
        // 线条样式 linear/linear-closed/step/... 曲线:basis/cardinal/
         .interpolate('basis')

      // 生成线段
      linePath = d3.svg.line()
        .x(function(d, i) {
          return xScale(i)
        })
        .y(function(d) {
          return yScale(d) + grid.y2
        })
        .interpolate('basis')  
 
  
      // 获取update    
      var update = svg.selectAll('.group')
          .data(newData)

      // 获取enter
      var enter = update.enter()
      // 获取exit
      var exit = update.exit()
      // 处理enter
      enter.append('g')
          .attr('class', function(d, i) {
            return 'group group' + (i + 1)
          })     

      // 处理update部分
      svg.selectAll('.group')     
        .attr('class', function(d, i) {
          return 'group  group' + (i + 1)
        })   
           
      // 处理exit    
      exit.remove() 
      var  legendId = config.legendId
      // 创建渐变填充
      var gradientLen = itemStyle.length
      for(var i = 0; i < gradientLen; i++) {
        // 渐变色配置项
        var colors = [
          {
            color: itemStyle[i].areaPath.fill,
            id: 'BeColor' + (i+1) + ''
          }
        ]
        // 调用渐变
        commonUnit.addGradient(id, colors, config.gradientCfg)  
      }
      // 渲染图表元素
      var fillId = [1, 2, 3]
      for(var i = 0, len = newData.length; i < len; i++) {
        // 获取配置项
        if(legendId != 0) {
          switch(legendId) {
            case 4:  // 破案率
              fillId = [4, 7, 7]
              break;
            case 5:  // 110投诉率
              fillId = [7, 5, 7]
              break;
            case 6:  // 受案立案审查达标率
              fillId = [7, 7, 6]
              break;
            default:
              break;    
           }
        }
        var j = fillId[i] - 1
        var opts = {
          id: 'url(#BeColor' + fillId[i] + ')',
          areaPath: itemStyle[j].areaPath,
          linePath: itemStyle[j].linePath,
          legendId: legendId,
          index: fillId[i]
        } 
        
        var group =  svg.select('.group' + (i+1))
        // 获取value  
        var dataset = []
        for(var j = 0; j < data.length; j++) {
          dataset.push(data[j]['value' + (i+1)] * 100)  
        }  
        // 调用
        this.addElems(group, dataset, opts) 
      }
    },

    /**
     *  添加图形元素
     *  @param    {object}  group   [g元素]
     *  @param    {array}   dataset [path数据]
     *  @param    {object}  opt     [配置项]
     */
    addElems: function(group, dataset, opt) {
      // 区域路径
      if(group.selectAll('.area-path').node()) {
        // 选择区域path   
        group.select('.area-path')
          .call(this.areaPathAttr, dataset, opt)   
      }else {
        // 添加区域path
        group.append('path')
         .call(this.areaPathAttr, dataset, opt)  
      }

      // 线条路径
      if(group.selectAll('.line-path').node()) {
        // 选择线段path  
        group.select('.line-path')
        .call(this.linePathAttr, dataset, opt)    
      }else {
         // 添加线段path  
        group.append('path')
          .call(this.linePathAttr, dataset, opt)
      }
    },
   
    /**
     *  区域路径属性设置
     *  @param    {string}  dom     [g元素]
     *  @param    {array}   dataset [path数据]
     *  @param    {object}  opt     [配置项]
     */
    areaPathAttr: function(dom, dataset, opt) {
      this.attr({
        stroke: opt.areaPath.stroke,
        'stroke-width': opt.areaPath.strokeWidth,
        fill: opt.id,
        class: 'area-path',
        d: areaPath(nullData)
      }) 
      .transition()
      .duration(750)
      .attr({
        d: areaPath(dataset)
      })
    },

    /**
     *  线段路径属性设置
     *  @param    {string}  dom     [g元素]
     *  @param    {array}   dataset [path数据]
     *  @param    {object}  opt     [配置项]
     */
    linePathAttr: function(dom, dataset, opt) {
      this.attr({
        stroke: opt.linePath.stroke,
        'stroke-width': function() {
          // 高亮的线条加粗
          if(opt.legendId != 0 && opt.index !=7) {
           return 3 
          }
          // 默认为配置项的
          return opt.linePath.strokeWidth
        }, 
        fill: opt.linePath.fill,
        filter: 'url(#filter1)',
        class: 'line-path',
        d: linePath(nullData)
      })
      .transition()
      .duration(750)
      .attr({
        d: linePath(dataset),
      })
    }
  }
  return charts
}) 