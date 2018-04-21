/**
 * @Author:      zhanghq
 * @DateTime:    2017-05-18 10:54:43
 * @Description: 饼图组件
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-05-18 10:54:43
 */
 

define(function(require) {
 

    var splitPie = {
        /**
         * 饼图默认配置项
         */
        defaultSetting: function() {
            var width = 260
            var height = 260
            return {
                width: width,
                height: height,
                min: 0,
                max: 40, //限制平分最多个数
                scale: 0.6, //用于控制平分后圆的大小
                outerRadius: width/4,
                innerRadius: width/3,
                color: ['#c00cee', '#351393'],
                stroke: '#051046',
                strokeWidth: 3
            }
        },
        /**
         * 绘制饼图
         */
        drawSplitPie: function(id, data, opt) {
            var config = _.merge({}, this.defaultSetting(), opt)
            var width = config.width
            var height = config.height
            var svg = null
            if(d3.select(id).selectAll('svg')[0].length > 0) {
              svg = d3.select(id).selectAll('svg')
            } else {
              svg = d3.select(id)
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                
            } 
            var color = config.color;
            var dataset = data

            var pie = d3.layout.pie().sort(null); //饼图布局
            var pieData = []
            var pieDatas = []
            var nums = []
            var w = config.width
            var h = config.height

            var max = config.max
            var min = config.min
            var scale = config.scale
            
            //计算一个比例
            var unit = Math.ceil(d3.max(dataset) * scale/ (max - min))
  
            for(var i=0; i<dataset.length; i++){
                //根据比例得到每个值平分多少份
                var num = Math.ceil(dataset[i]/unit)
                for(var j = 1; j < num+1; j++){
                    pieData.push(1)
                }
                //保存平分多少份的值用于后面填充颜色
                nums.push(num)
            }

            var outerRadius = config.outerRadius;  //外半径
            var innerRadius = config.innerRadius; //内半径
            var arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(outerRadius)

            /**
             * 获取update部分
             */
            var update = svg.selectAll('.arc')
                .data(pie(pieData))
            
            //获取enter部分
            var enter = update.enter()

            //获取exit部分
            var exit = update.exit()

            var c =0
            var cc = nums[0]

            //处理update部分
            update.attr('transform', 'translate('+w/2+', '+(h/2)+')')
                .append('path')
                .attr({
                  fill: function(d, i){
                    if(i==cc){
                        c++
                        cc += nums[c]
                    }
                    return color[c]
                  },
                  d: arc,
                  stroke: config.stroke,
                  'stroke-width': config.strokeWidth
                })

            //处理enter部分
            enter.append('g')
                .attr('class', 'arc')
                .attr('transform', 'translate('+w/2+', '+(h/2)+')')
                .append('path')
                .attr({
                  fill: function(d, i){
                    if(i==cc){
                        c++
                        cc += nums[c]
                    }
                    return color[c]
                  },
                  d: arc,
                  stroke: config.stroke,
                  'stroke-width': config.strokeWidth
                })
 





            //处理exit部分
            
        }
    }

    return splitPie
})