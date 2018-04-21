/**
 * @Author:      zhanghq
 * @DateTime:    2017-08-21 20:41:14
 * @Description: 中间星球
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-08-21 20:41:14
 */

define(function(require) {
  /**
  * 引入公用的文件
  */
  require('d3')
  require('lodash')
  var commonUnit = require('./commonUnit.js')
  var IMG_PATH = commonUnit.imgPath()

  var config
  var isInit = 0
  var timer = null // 定时器
  /**
   *  默认配置项
   */
  var defaultSetting = {
    width: 1125,
    height: 940,
    padding: {
      top: 315,
      right: 0,
      bottom: 0,
      left: 20
    },
    time: 30,
    itemStyle: {
      innerRadius: 50,
      outerRadius: 80,
      colors: [
        {
          id: 'drill1',
          color: ['#e63140', '#e68359']
        }, {
          id: 'drill2',
          color: ['#01c19c', '#01c19c']
        }, {
          id: 'drill3',
          color: ['#2443e9', '#7718e8']
        },{
          id: 'drill4',
          color: ['#f2fe08', '#1faf71']
        },
        {
          id: 'drill5',
          color: ['#086ad7', '#0056bb']
        }
      ],
      circleBor: '#0a0c3f',
      circleBorW: 20
    },
    gradient: {
      id: 'drillCharts',
      x1: '0%',
      y1: '0%',
      x2: '0%',
      y2: '100%',
      offset1: '20%',
      offset2: '100%',
      opacity1: 1,
      opacity2: 1
    },
    lineStyle: {
      fill: '#174793',
      strokeWidth: 2
    },
    text: {
      fontSize: 16,
      fill: '#fff',
      textAnchor: 'middle'
    }
  }

  /**
   *  默认数据源
   */
  var defaultDataSource = [
     
  ]

  /**
   *  设置图片元素属性
   *  @param    {array}   roots 根元素
   *  @param    {object}  cfg   配置项
   *  @param    {array}    data  数据
   */
  function outerCircle(roots, cfg, data) {
    roots.attr({
      'xlink:href': function(d, i) {
        if(cfg.type==1) {
          var href = ''
          i === 0 ? href = IMG_PATH + 'index/inner-circle.png' : href = cfg.href
          return href
        }
        return cfg.href
      },
      width: cfg.width,
      height: cfg.height,
      class: function(d, i) {
        // 添加样式，自动切换使用
        return cfg.class + ' '+cfg.class + i+''
      },
      x: cfg.x,
      y: cfg.y
    })
    .on('click', function(d, i) {
      if(cfg.type==1) {
        toggleData(d3.select(this), i)
        clearTimeout(timer)  // 停止自动切换
        // 重新调用setInterVal方法，时间15秒
        setInterVal(data, 15000)
      }
    })
    .call(addAnimateMotion, cfg)
  } 

  /**
   * 切换数据
   * @param  {array} self  当前选择的元素
   * @param  {number} i    下标
   */
  function toggleData(self, i) {
     // 选择所有分局隐藏
     d3.selectAll('.fenju-group')
       .style({
          animation: '',
          display: 'none'
       })
     // 选择所有内圆变默认颜色
     d3.selectAll('.innter-circle')  
       .attr({
        'xlink:href': IMG_PATH + 'index/inner-circle2.png'
      })
      //  选择所有内圆上的文字变默认颜色
       d3.selectAll('.train-text')  
       .attr({
         fill: '#00ffff'
      })
     // 当前圆改变颜色  
    self.attr({
        'xlink:href': IMG_PATH + 'index/inner-circle.png'
      })
     // 当前圆的文字改变颜色   
    d3.select('.train-text' + i)
      .attr({
        fill: '#ffbf00'
      })  
    // 显示当前训练中心的所有分局
    d3.select('.fenju-group' + i)
      .style({
        display: 'block',
        animation: 'opacity_ani_01 1.5s 1'
      })
  }

  /**
   *  添加分局文字
   *  @param    {array}  roots 根元素
   *  @param    {object}  cfg   配置项
   */
  function addFJText(roots, cfg) {
    this.attr({
      'font-size': 12,
      fill: '#f2f2f2',
      x: cfg.x + 30,
      y: cfg.y + 15,
      class: 'fenju-text'
    })
    .text(function(d) {
      return d.name
    })
    .call(addAnimateMotion, cfg)
  }

  /**
   *  添加训练中心文字
   *  @param    {array}  roots 根元素
   *  @param    {object}  cfg   配置项
   */
  function addXLText(roots, cfg) {
    this.attr({
      'font-size': 13,
      fill: function(d, i) {
        if(i===0) {
          return '#ffbf00'
        }
        return '#00ffff'
      }, 
      x: cfg.x + 80,
      y: cfg.y + 8,
      class: function(d, i) {
        return 'train-text train-text' + i
      }
    })
    .call(addAnimateMotion, cfg)
    .selectAll("tspan")  
    .data(function(d,i){
      var tspandata = []
      var str = d.name
      var str1 = str.substr(0, 4)
      var str2 = str.substr(4)
      tspandata.push(str1)
      tspandata.push(str2)
      return tspandata
   })  
   .enter()
   .append('tspan')
   .text(function(d, i) {
    return d
   })
   .attr({
      x: 80,
      dy: 20
   })    
  }

  /**
   *  添加动画
   *  @param    {object}  cfg   动画配置项
   */
  function addAnimateMotion(roots, cfg) {
    roots.append('animateMotion')
    .attr({
      begin: function(d, i) {
         return i * cfg.begin
      },
      dur: cfg.dur,
      fill: 'freeze',
     // rotate: 'auto',
      repeatCount: 'indefinite',
    })
    .append('mpath')
    .attr({
      'xlink:href': cfg.mpath
    })
  }

  /**
   *  定时切换分局展示
   */
  function setInterVal(data, time) {
    var t = 0
    timer = setTimeout(function () {
      t++
      time  = config.time * 1000 + 7500
      if(t==4) {
        t=0
      }
      var self = d3.select('.innter-circle' + t)  
      // 调用数据切换
      toggleData(self, t)
      // 回调
      timer = setTimeout(arguments.callee, time)
      },time)
  }

  /*
    训练中心svg属性设置
   */
  function addSvg2() {
    this.attr({
        width: 1105,
        height: 640,
        class: 'train-svg'
      })
      .style({
        padding: '320px 0 0 130'
       // 'pointer-events': 'none'
      })
  }

  /**
   *  绘制图表
   *  @example: [example]
   *  @param    {string}  id    容器id
   *  @param    {object}  data1 数据
   *  @param    {object}  opt   配置项
   */
  function drawCharts(id, data1, opt) {
    // 合并配置项
    config = _.merge({}, defaultSetting, opt)
    // 获取数据
    var data = data1 || defaultDataSource
    var trainData = data.trainingCenter    // 训练中心数据
    var width = config.width
    var height = config.height
    
    if(!isInit) {
      var time = config.time * 1000 - 7500
      setInterVal(trainData, time)
      isInit++
    }

    // 创建外层svg
    var svg = commonUnit.addSvg(id, config)
      svg.classed('fenju-svg', true)
      
     // 添加最外层动画路径
     svg.append('path')
      .attr({
        d: 'M474.355,6.586 C731.169,9.309 921.500,70.804 921.500,148.329 C921.500,225.854 728.360,285.500 471.531,285.500 C214.701,285.500 6.500,222.653 6.500,145.128 C6.500,67.603 219.408,3.882 474.355,6.586 Z',
        fill: 'none',
        stroke: 'none',
        id: 'cubicCurve',
 
      })
    
      var svg2 = null
      if(d3.select(id).selectAll('.train-svg').node()) {
        svg2 = d3.select(id).select('.train-svg')
        .call(addSvg2)
      }else {
        svg2 = d3.select(id).append('svg')
          .call(addSvg2)
      }

       // 添加内层动画路径  
      svg2.append('path')
      .attr({
        d: 'M350.044,6.554 C152.733,8.282 6.500,47.295 6.500,96.478 C6.500,145.660 154.890,183.500 352.214,183.500 C549.538,183.500 709.500,143.630 709.500,94.447 C709.500,45.264 545.922,4.839 350.044,6.554 Z',
        fill: 'none',
        stroke: 'none',
        id: 'cubicCurve2',
      })  
   
      // 获取并处理所有训练中心update部分
     var updatetrain = svg2.selectAll('.innter-circle')
      .data(trainData) 
     // 获取并处理文字update部分
     var updatetrain2 = svg2.selectAll('.train-text')
      .data(trainData)  

      var cfg = {
        href: IMG_PATH + 'index/inner-circle2.png',
        width: 74,
        height: 74,
        x: 0,
        y: 0,
        begin: config.time/trainData.length,
        dur: config.time,
        type:1,
        class: 'innter-circle',
        mpath: '#cubicCurve2'
      }
      // 添加图片
      updatetrain.enter() 
        .append('image')
        .call(outerCircle, cfg, trainData) 
      // 添加文字
      updatetrain2.enter()
        .append('text')
        .call(addXLText, cfg)   
      // 处理图片exit部分
      updatetrain.exit().remove()    
      // 处理文字exit部分
      updatetrain2.exit().remove() 

     // 渲染所有分局数据 
    for(var i=0, len = trainData.length; i<len; i++) {
      // 创建每个分局的组元素
      var fenju = null
      if(svg.selectAll('.fenju-group' + i).node()){
        fenju = svg.select('.fenju-group' + i)
          .classed('fenju-group fenju-group' + i, true)
      }else {
        fenju = svg.append('g')
         .classed('fenju-group fenju-group' + i, true)
      }
        // 获取各分局数据 
       var fenjuData =  trainData[i].allFenju
      // 图片属性及动画配置项
      var cfg1 = {
        href: IMG_PATH + 'index/smallCircle.png',
        width: 51,
        height: 51,
        x: 0,
        y: 0,
        begin: 22/fenjuData.length,
        dur: 22,
        type:2,
        class: 'small-circle',
        mpath: '#cubicCurve'
      }
      var cfg2 = {
        href: IMG_PATH + 'index/title-bg.png',
        width: 110,
        height: 24,
        y: -20,
        x: -30,
        dur: 22,
        type:2,
        class: 'outer-title-bg',
        begin: 22/fenjuData.length,
        mpath: '#cubicCurve'
      }

      // 获取所有分局小球update部分  
      var updatefenju1 = fenju.selectAll('.small-circle')
        .data(fenjuData)
        .call(outerCircle, cfg1)
      // 获取所有分局标题背景update部分   
      var updatefenju2 = fenju.selectAll('.outer-title-bg')
        .data(fenjuData)
        .call(outerCircle, cfg2)  

      var updateText = fenju.selectAll('.fenju-text')
        .data(fenjuData) 
        .call(addFJText, cfg2) 

      /**
       *  处理所有分局enter部分
       */
      
      // 添加小球
      updatefenju1.enter() 
        .append('image')
        .call(outerCircle, cfg1)
      // 添加文字背景  
      updatefenju2.enter()
        .append('image')
        .call(outerCircle, cfg2)  
      // 添加文字  
      updateText.enter()
        .append('text')
        .call(addFJText, cfg2)   
      // 处理小球exit部分  
      updatefenju1.exit().remove()
      // 处理文字背景exit部分
      updatefenju2.exit().remove()
      // 处理文字exit部分
      updateText.exit().remove()
       
    }  
  }   

   /**
   *  暴露出一个方法供外调用
   */
  var result = {
    drawCharts: drawCharts
  } 
  return result 

})