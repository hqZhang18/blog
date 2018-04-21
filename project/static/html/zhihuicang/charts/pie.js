/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-24 17:21:40
 * @Description: 事后监督(顶部各类型汇总)
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-24 17:21:40
 */

define(function(require) {
  require('d3')
  require('lodash')

  var commonUnit = require('./commonUnit.js')
 

  var theAmazingPie = {
    defaultSetting: function(){
      return{
        width: 1064,
        height: 310,
        itemStyle: {
          innerRadius: 135,
          outerRadius: 180,
          colors: ['#38f3ff', '#fff838', '#da2c59', '#4088ff', '#9f2cda'],
          ratio: false
        },
      }

    },

    constructor: function (selector, opt) {
        this.selector = selector
       // 合并配置项
        var config = _.merge({}, this.defaultSetting, opt)
        this.config = config

        this.width = config.width;
        this.height = config.height;
        this.radius = Math.min(this.width, this.height) / 2.8;

        this.color = d3.scale.category20();

        this.pie = d3.layout.pie()
            .sort(d3.ascending);

        var innerRadius = this.radius - 135
        var outerRadius = this.radius - 90
        this.arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)
        // hover事件用的  
       this.arc2 = d3.svg.arc()
        .innerRadius(innerRadius - (innerRadius) / 15 )   
        .outerRadius(outerRadius + (outerRadius) / 30 )       

        this.svg = d3.select(selector).append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')')

        //Create/select <g> elements to hold the different types of graphics
        //and keep them in the correct drawing order

        // 圆弧组元素
        this.pathGroup = this.svg.select("g.piePaths");
        if (this.pathGroup.empty()){
          this.pathGroup = this.svg.append('g')
            .attr('class', 'piePaths')
        }

        // 连线组元素
        this.pointerGroup = this.svg.select('g.piePaths');
        if (this.pointerGroup.empty()){
          this.pointerGroup = this.svg.append('g')
            .attr('class', 'pointers')
        }
 
        // value组元素      
        this.labelGroup = this.svg.append('g')
              .attr('class', 'labels')

        // 名字组元素
        this.nameGroup = this.svg.append('g')
              .attr('class', 'names')
            


    },
    oldPieData: '',
    pieTween: function (d, i) {
        var self = this;

        var theOldDataInPie = theAmazingPie.oldPieData;
        // Interpolate the arcs in data space

        var s0;
        var e0;

        if (theOldDataInPie[i]) {
            s0 = theOldDataInPie[i].startAngle;
            e0 = theOldDataInPie[i].endAngle;
        } else if (!(theOldDataInPie[i]) && theOldDataInPie[i - 1]) {
            s0 = theOldDataInPie[i - 1].endAngle;
            e0 = theOldDataInPie[i - 1].endAngle;
        } else if (!(theOldDataInPie[i - 1]) && theOldDataInPie.length > 0) {
            s0 = theOldDataInPie[theOldDataInPie.length - 1].endAngle;
            e0 = theOldDataInPie[theOldDataInPie.length - 1].endAngle;
        } else {
            s0 = 0;
            e0 = 0;
        }

        var i = d3.interpolate({
            startAngle: s0,
            endAngle: e0
        }, {
            startAngle: d.startAngle,
            endAngle: d.endAngle
        });

        return function (t) {
            var b = i(t);
            return theAmazingPie.arc(b);
        };
    },
    removePieTween: function (d, i) {
        var self = this;
        s0 = 2 * Math.PI;
        e0 = 2 * Math.PI;
        var i = d3.interpolate({
            startAngle: d.startAngle,
            endAngle: d.endAngle
        }, {
            startAngle: s0,
            endAngle: e0
        });

        return function (t) {
            var b = i(t);
            return theAmazingPie.arc(b);
        };
    },
    /**
   *  获取饼图填充色
   *  @example: [example]
   *  @param    {numbter}  idx [下标]
   */
  getColor: function(idx) {
    // 默认颜色
    var defauleColor = [
      '#38f3ff', '#da2c59', '#5ab1ef', '#ffb980', '#d87a80',
      '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
      '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
      '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
    ]

    var palette = _.merge([], defauleColor, this.config.itemStyle.colors)
    return palette[idx % palette.length]  
  },

    render: function (data) {

       // 创建饼图布局
       this.pie = d3.layout.pie()
          .sort(null)
          .value(function(d) {
            return d.value
          })
        // 转换数据  
        this.piedata = this.pie(data)
        // 渲染name
        this.rednerLabels(this.labelGroup, data, 1)
        // 渲染 value
        this.rednerLabels(this.nameGroup, data, 2)
        // 渲染path
        this.renderPath()
        // 渲染连线
        this.renderPointers()       
        
    },

    rednerLabels: function(g, data, type) {
      var self = this;
      var labels = g.selectAll('text')
            .data(this.piedata
              .sort(function(p1,p2) { return p1.startAngle - p2.startAngle}) 
            )
        labels.enter()
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('fill', function(d, i) {
              return theAmazingPie.getColor(i)
            })
            .attr('font-size', 30)
            .attr('dy', function() {
              var dy = ''
              type === 1 ? dy = '1.5em' : dy = ''
              return dy
            })
        labels.exit()
            .remove()
        
        var labelLayout = d3.geom.quadtree()
            .extent([[-self.width,-self.height], [self.width, self.height] ])
            .x(function(d){return d.x})
            .y(function(d){return d.y})
            ([]) //create an empty quadtree to hold label positions
        var maxLabelWidth = 0
        var maxLabelHeight = 0
        
        labels.text(function (d, i) {
            // Set the text *first*, so we can query the size
            // of the label with .getBBox()
            var text = ''
            type === 1 ? text = d.value : text = data[i].name
            return text
        })
        .each(function (d, i) {
            // Move all calculations into the each function.
            // Position values are stored in the data object 
            // so can be accessed later when drawing the line
            
            /* calculate the position of the center marker */
            var a = (d.startAngle + d.endAngle) / 2 
            
            //trig functions adjusted to use the angle relative
            //to the '12 o'clock' vector:
            d.cx = Math.sin(a) * (self.radius - 140)
            d.cy = -Math.cos(a) * (self.radius - 140)
            
            /* calculate the default position for the label,
               so self the middle of the label is centered in the arc*/
            var bbox = this.getBBox()
            //bbox.width and bbox.height will 
            //describe the size of the label text
            var labelRadius = self.radius + 20
            d.x =  Math.sin(a) * (labelRadius)
            d.l = d.x - bbox.width / 2 - 2
            d.r = d.x + bbox.width / 2 + 2
            d.y = -Math.cos(a) * (self.radius + 20)
            d.b = d.oy = d.y + 5
            d.t = d.y - bbox.height - 5 
            
            /* check whether the default position 
               overlaps any other labels*/
            var conflicts = []
            labelLayout.visit(function(node, x1, y1, x2, y2){
                //recurse down the tree, adding any overlapping 
                //node is the node in the quadtree, 
                //node.point is the value self we added to the tree
                //x1,y1,x2,y2 are the bounds of the rectangle self
                //this node covers
                
                if (  (x1 > d.r + maxLabelWidth/2) 
                        //left edge of node is to the right of right edge of label
                    ||(x2 < d.l - maxLabelWidth/2) 
                        //right edge of node is to the left of left edge of label
                    ||(y1 > d.b + maxLabelHeight/2)
                        //top (minY) edge of node is greater than the bottom of label
                    ||(y2 < d.t - maxLabelHeight/2 ) )
                        //bottom (maxY) edge of node is less than the top of label
                    
                      return true //don't bother visiting children or checking this node
                
                var p = node.point
                var v = false, h = false
                if ( p ) { //p is defined, i.e., there is a value stored in this node
                    h =  ( ((p.l > d.l) && (p.l <= d.r))
                       || ((p.r > d.l) && (p.r <= d.r)) 
                       || ((p.l < d.l)&&(p.r >=d.r) ) ) //horizontal conflict
                
                    v =  ( ((p.t > d.t) && (p.t <= d.b))
                       || ((p.b > d.t) && (p.b <= d.b))  
                       || ((p.t < d.t)&&(p.b >=d.b) ) ) //vertical conflict
                
                    if (h&&v)
                        conflicts.push(p) //add to conflict list
                }
                     
            })
            
            if (conflicts.length) {
                var rightEdge = d3.max(conflicts, function(d2) {
                    return d2.r
                })

                d.l = rightEdge
                d.x = d.l + bbox.width / 2 + 5
                d.r = d.l + bbox.width + 10
            }
            
            /* add this label to the quadtree, so it will show up as a conflict
               for future labels.  */
            labelLayout.add( d )
            var maxLabelWidth = Math.max(maxLabelWidth, bbox.width+10)
            var maxLabelHeight = Math.max(maxLabelHeight, bbox.height+10)
            
        })
        .transition()//we can use transitions now!
        .attr('x', function (d) {
                    return d.x
                })
                .attr('y', function (d) {
                    return d.y
                })
         
    },

    /**
     *  渲染路径(弧形)
     *  @example: [example]
     *  @return   {[type]}  [description]
     */
    renderPath: function() {
      var self = this
      this.path = this.pathGroup.selectAll('path.pie')
        .data(this.piedata);

        this.path.enter().append('path')
          .attr('class', 'pie')
          .attr('fill', function (d, i) {
          return theAmazingPie.getColor(i)
        })
          .on('mouseover', function(d) {
            d3.select(this)
              .attr({
                cursor: 'pointer',
                'fill': '#e6e752'
              })
              .transition()
              .attr('d', function(d) {
                return self.arc2(d)
              })
              // 添加提示框
            commonUnit.addTooltip(this.selector, d.data)  
            d3.selectAll('.charts-tooltip')
              .style('display', 'block')
          })
          .on('mouseout', function(d, i) {
            d3.select(this)
              .attr({
                fill: function() {
                  return self.getColor(i)
                }
              })
              .transition()
              .attr('d', function(d) {
                return self.arc(d)
              })
            // 隐藏提示框  
            d3.selectAll('.charts-tooltip')
              .style('display', 'none')  
          })

        this.path.transition()
            .duration(300)
            .attrTween('d', self.pieTween);

        this.path.exit()
            .transition()
            .duration(300)
            .attrTween('d', self.removePieTween)
            .remove()
    },

    renderPointers: function() {
      var pointers = this.pointerGroup.selectAll('path.pointer')
            .data(this.piedata)
        pointers.enter()
            .append('path')
            .attr('class', 'pointer')
            .style('fill', 'none')
            .style('stroke', function(d, i) {
              return theAmazingPie.getColor(i)
            })
    
        pointers.exit().remove()
        
        pointers.transition().attr('d', function (d) {
            if (d.cx > d.l) {
                return 'M' + (d.l+2) + ',' + d.b + 'L' + (d.r-2) + ',' + d.b + ' ' + d.cx + ',' + d.cy
            } else {
                return 'M' + (d.r-2) + ',' + d.b + 'L' + (d.l+2) + ',' + d.b + ' ' + d.cx + ',' + d.cy
            }
        })
        this.oldPieData = this.piedata
    }
  }
  return theAmazingPie
})
