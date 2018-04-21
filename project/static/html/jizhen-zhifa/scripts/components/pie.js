/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-24 17:21:40
 * @Description: 事后监督(顶部各类型汇总)
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-24 17:21:40
 */

define(function(require) {

  var commonUnit = require('../components/commonUnit.js')
  var pie
  var pie2
  
  var max
  var max2

  var pie = {
    defaultSetting: function() {
      return {
        width: 1400,
        height: 165,
        id: '#behaviorCount',
        padding: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },
        gradientCfg: {
          x1: '0%',
          y1: '0%',
          x2: '0%',
          y2: '100%',
          offset1: '0%',
          offset2: '100%',
          opacity1: 1,
          opacity2: 1,
          colors: [
            {
              color: ['#0605ff', '#a179ff'],
              id: 'pieColor0'
            },{
              color: ['#a179ff', '#0605ff'],
              id: 'pieColor1'
            },{
              color: ['#de3271', '#8143d0'], 
              id: 'pieColor2'
            },{
              color: ['#07bcfe', '#4270f6'],
              id: 'pieColor3'
            },{
              color: ['#07bcfe', '#4270f6'],
              id: 'pieColor4'
            }
          ]
        }
      }
    },

    drawCharts: function(id, data, opt) {
     
      var config = _.merge({}, this.defaultSetting(), opt)
      var width = 165
      var height = 165
      var dataset = []
      var dataset2 = [];  
      var names = ['待检查', '已检查', '整改中']
      var dataset = []
      var dataset2 = [] //中间三个小圆的值
      data.forEach(function(item){
        var name = item.name
        var isName = names.indexOf(name)
        if(isName==-1){
          dataset.push(item.value)
        }else{
          dataset2.push(item.value)
        }
      })
   
      max = d3.max(dataset)
      max2 = d3.max(dataset2)
        
      //创建svg
      var svg = commonUnit.addSvg(id, config)
          
      pie = d3.layout.pie() 
        // .startAngle(0)
        // .endAngle(2*Math.PI)

      pie2 = d3.layout.pie() 
        .startAngle(0)
        .endAngle(-2*Math.PI)
      
        
     //定义一个线性渐变 (案卷)
      var colors1 = [
        {
          color: ['#0605ff', '#a179ff'],
          id: 'pieColor1'
        }
      ] 

      //渐变配置项
      var gradientCfg = config.gradientCfg
      var colors = config.gradientCfg.colors
      for(var i = 0, len = colors.length; i<len; i++) {
        var color = [
          {
            color: colors[i].color,
            id: colors[i].id
          }
        ]
        //调用渐变
        commonUnit.addGradient(id, color, gradientCfg)  
      }
       d3.select(id).selectAll('g').remove()
      //五个大圆
      var outerRadius = width / 2;  
      var innerRadius = width / 2.3;  
      var arc = d3.svg.arc()  
            .innerRadius(innerRadius)  
            .outerRadius(outerRadius)
      var transX = [0, 215, 420, 1005, 1200]  
      var newData = []
      //重装组装数据，画圆
      
      for(var i=0, len=dataset.length; i<len; i++){
        var value = dataset[i]
        if(value == max){
           newData = [0]
         }else{
           newData = [max]
           value =(value/max)*max/(1-value/max)
         }
        var group = svg.append('g')
        .attr({
          class: 'group'+i,
          transform: 'translate('+transX[i]+', 0)'
        })
 
        newData.push(value)
        

        this.addArcs(group, newData, arc, innerRadius, outerRadius, max)
      }  



      //中间三个小圆
      var outerRadius2 = width / 5;  
      var innerRadius2 = width / 8;  
      var arc2 = d3.svg.arc()  
            .innerRadius(outerRadius2)  
            .outerRadius(innerRadius2)

      //画圆的背景
      var dataset3 = {
        startAngle: 0,
        endAngle: 360
      }    
            
      var transX2 = [640, 775, 900]  
      var newData2 = []
      for(var i = 0, len = dataset2.length; i < len; i++){
        var value = dataset2[i]
        if(value == max2){
           newData2 = [0]
         }else{
           newData2 = [max2]
           value =(value/max2)*max2/(1-value/max2)
         }
        var group = svg.append('g')
        .attr({
          class: 'group-s',
          transform: 'translate('+transX2[i]+', 20)'
        })
       
        //圆的背景层
       
        group.append('path')
          .attr({
            d: arc2(dataset3),
            fill: '#13337d',
            filter: 'url(#filter1)',
            transform: 'translate('+ (outerRadius/2 - 8) +','+ (outerRadius/2 - 8) +')',
            class: 'bgpie'
          })
    
        
        newData2.push(value)
        this.addArcs(group, newData2, arc2, innerRadius2, outerRadius2, max2)
      }
 
    },

    /**
     *  @describe [describe]
     */
    
    addArcs: function(group, dataset, arc, innerRadius, outerRadius, max) {
  
      var j = 0
      var value = dataset[1]
      var data = pie(dataset)
      if(value<max){
        data = pie2(dataset)
      }
      var arcs = group.selectAll('g')
          .data(data)  
          .enter()  
          .append('g')  
          .attr('class', function(d, i){
            return 'arcs-group' + i
          })  
          .attr({
            class: function(d, i){
              return 'arcs-group' + i 
            },
            fill: function(d, i){
               if(i == 1){
                j++
               } 
              var d = d.value

              if(d === max ) {
                //第一个要填充满 
                if(i == 1 && d == max){
                  return 'url(#pieColor3)'
                }else{
                  return 'none'
                }
              }else{
                return 'url(#pieColor3)'
              }
            },
            transform: 'translate('+outerRadius+','+outerRadius+')'
          })
         arcs.append('path')   
          .attr({
            d: function(d){
              return arc(d)
            }
          })

       for(var i = 0; i<5; i++){
        d3.select('.group' + i)
        .select('.arcs-group1')
        .attr('fill', 'url(#pieColor'+i+')')  
       }    

       d3.selectAll('.group-s').selectAll('.arcs-group1')
        .attr('fill', 'url(#pieColor2)')

      

        
      
     }

  }

  return pie
})