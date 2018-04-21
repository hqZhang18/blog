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
  /**
   *  默认配置项
   */
  var defaultSetting = {
    width: 1025,
    height: 940,
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
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
    {
      name: "入警训练",
      value: 6025
    }, {
      name: "晋升训练",
      value: 4928
    }, {
      name: "专业训练",
      value: 3831
    }, {
      name: "发展训练",
      value: 5839
    }, {
      name: "专业训练",
      value: 3831
    }, {
      name: "发展训练",
      value: 5839
    }, {
      name: "专业训练",
      value: 3831
    }, {
      name: "发展训练",
      value: 5839
    } ,
    {
      name: "发展训练",
      value: 5839
    },
    {
      name: "发展训练",
      value: 5839
    },
    {
      name: "发展训练",
      value: 5839
    } 

  ]
  var dataLeng = 0
  var m=-480;
  var n=480;
  var y=0; 
  var x=0;

   /**
   *  组元素属性设置
   *  @param    {array}   roots  根元素
   *  @param    {string}  id   容器id
   *  @param    {array}   data 数据
   */
  function groupAttr() {
    this.attr({
      transform: 'translate(' + (config.width / 2) + ',' + (config.height / 2) + ')',
      class: 'group'
    })
  }


  function outerCircle() {
    this.attr({
      'xlink:href': IMG_PATH + 'index/smallCircle.png',
      width: 51,
      height: 51,
      class: 'small-circle',
      transform: function(d, i) {
        // 运动轨迹椭圆方程 (x/480)2+(y/130)2=1 
        if(m<480) {
          x=m
          b()
        }else {
          var addX=n
          //dataLeng位奇数时在dataLeng/2+1处需做位置调整
          if (dataLeng%2===1) {     
            addX =n - (m-480)  
          }
          x=addX
          a()
          if(x<-480) {
            m=-480;
            n=480;
          }
        }
        y = parseInt(y)
        return 'translate(' + x + ' ' + y + ') '
      }
    })
    .append('animateMotion')
    .attr({
      dur: '6s',
      fill: 'freeze',
      rotate: 'auto'
    })
    .append('mpath')
    .attr({
      'xlink:href': '#cubicCurve'
    })
  }

  function  a(){
    y=Math.sqrt(1-Math.pow(x/480, 2))*130;
    n-=480*2*2/dataLeng;
  } 
  function  b(){  
    y=Math.sqrt(Math.abs(1-Math.pow(x/480, 2)))*(-130);
     m+=480*2*2/dataLeng;
  }
 

  function drawCharts(id, data1, opt) {
    // 合并配置项
    config = _.merge({}, defaultSetting, opt)
    // 获取数据
    var data = data1 || defaultDataSource
    var width = config.width
    var height = config.height
    dataLeng = data.length

    // 创建svg
    var svg = commonUnit.addSvg(id, config)
    // svg.append('ellipse')
    //   .attr({
    //     cx: width / 2,
    //     cy: height / 1.9,
    //     rx: 480,
    //     ry: 130,
    //     fill: 'none',
    //     stroke: '#fff',
    //     class: 'outer-circle',
    //     id: 'cubicCurve'
    //   })
    // 添加动画路径
    // svg.append('path')
    //   .attr({
    //     d: 'M481.312,6.968 C744.476,6.968 938.312,67.096 951.312,141.968 C964.634,218.693 747.355,270.935 486.312,268.969 C222.035,266.978 -0.134,210.484 7.312,132.969 C14.312,60.096 218.149,6.968 481.312,6.968 Z',
    //     fill: 'none',
    //     stroke: '#fff',
    //    id: 'cubicCurve',
    //    transform: 'translate(33, 360) '
    //   })
 

    dataset = []
    data.forEach(function(item) {
      dataset.push(item.value)
    })
    // 定义比例尺
    linear = d3.scale.linear()
      .domain([0, d3.max(dataset)])
      .range([0, width])

    pie = d3.layout.pie()
      .value(function() {
        return 1
      })
      .sort(null)
                  
    pieData = pie(dataset)
    var innerRadius = 90
    var outerRadius = 80
    // 创建弧生成器
    arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)  

    // 获取update部分
    var update = svg.selectAll('.group')
      .data(pieData)
      .call(groupAttr)

    /**
     *  处理enter部分
     */
    
    var enterG = update.enter().append('g')
      .call(groupAttr)

    enterG.append('image')
      .call(outerCircle)

  }   

  var result = {
    drawCharts: drawCharts
  } 
  return result 

})