/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-24 17:21:40
 * @Description: 事后监督(顶部各类型汇总)
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-24 17:21:40
 */

define(function(require) {
  require('d3')
  var commonUnit = require('./commonUnit.js')
  var pie
  var outerRadius
  var innerRadius
  var arc
  var max

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
        }
      }
    },

    drawCharts: function(id, data, opt) {
     
      var config = _.merge({}, this.defaultSetting(), opt)
      var width = 165
      var height = 165
      var dataset = [100, 30]
      var dataset2 = [100, 50];  
      var names = ['待检查', '已检查', '整改中']
      var dataset = []
      data.forEach(function(item){
        var name = item.name
        var isName = names.indexOf(name)
        if(isName==-1){
          dataset.push(item.value)
        }
      })
      max = d3.max(dataset)
        
      //创建svg
      var svg = commonUnit.addSvg(id, config)
          
      pie = d3.layout.pie() 
        .startAngle(0)
        .endAngle(-2*3.14)
      outerRadius = width / 2;  
      innerRadius = width / 2.3;  
      arc = d3.svg.arc()  
            .innerRadius(innerRadius)  
            .outerRadius(outerRadius)
        
     //定义一个线性渐变 (案卷)
      var colors1 = [
        {
          color: ['#0605ff', '#a179ff'],
          id: 'pieColor1'
        }
      ] 

      //渐变配置项
      var gradientCfg = {
        x1: '0%',
        y1: '0%',
        x2: '0%',
        y2: '100%',
        offset1: '0%',
        offset2: '100%',
        opacity1: 1,
        opacity2: 1
      } 
      //调用渐变
      commonUnit.addGradient(svg, colors1, gradientCfg)  
      
      var transX = [0, 185, 420, 1005, 1200]  
      
      for(var i=0, len=dataset.length; i<len; i++){
        var newData = [max]
        var group = svg.append('g')
        .attr({
          class: 'group'+i,
          transform: 'translate('+transX[i]+', 0)'
        })
        newData.push(dataset[i])
        this.addArcs(group, newData)
      }  
 
    },

    /**
     *  @describe [describe]
     */
    addArcs: function(group, dataset, x, y) {
      var arcs = group.selectAll('g')  
          .data(pie(dataset))  
          .enter()  
          .append('g')  
          .attr('transform','translate('+outerRadius+','+outerRadius+')')
                      
       arcs.append('path')   
          .attr({
            fill: function(d, i){
              var d = d.value
              console.log('d', d)
              if(d==max) {
                return 'none'
              }else{
                return 'url(#pieColor1)'
              }
            },
            d: function(d){
              return arc(d)
            }
          })
    }

  }

  return pie
})