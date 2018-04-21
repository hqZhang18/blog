define(function(require){
	// 引入公用文件
	require('d3')
	require('lodash')
	// 引入公用的方法组件
    var commonUnit = require('../commonUnit')
    var circleArow = {
    	/**
    	 * 默认设置
    	 * @type {Object}
    	 */
    	defaultSetting: {
    		width: 829,
    		height: 529,
    		padding: {
    			top: 0,
    			right: 40,
    			bottom: 0,
    			left: 40
    		},
    		flagStyle: {
    			width: 8,
    			height: 24,
    			fontSize: 24,
    			color : '#fff',
    			position: 'left',
    			gap: 40,
    			textAnchor: 'middle'
    		}
    	},
    	/**
    	 * 画图方法
    	 * @param  {[type]} id   svg添加位置ID
    	 * @param  {[type]} data 数据
    	 * @param  {[type]} opt  组件设置
    	 * @return {[type]}     
    	 */
    	drawCharts: function(id,data,opt){
    		// 合并设置
    		var config = _.merge({},this.defaultSetting,opt)
    		// 添加svg元素
    		var svg = commonUnit.addSvg(id,config)
    		// 添加标志元素
    		this.addFlag(svg,data,config)
    		// 添加数据图形
    		this.addCharts(svg,data,config)
    	},
    	/**
    	 * 添加数据标志
    	 * @param {[type]} svg    
    	 * @param {[type]} data   
    	 * @param {[type]} config 
    	 */
    	addFlag: function(svg,data,config){
    		// 标志g元素
    		var flagG = svg.select('.flag')
    		// 颜色集
    		var color = d3.scale.category10()
    		if (!flagG[0][0]){
    			flagG = svg.append('g').attr('class','flag')
    		}
    		var dataN = []
    		data.forEach(function(d){
    			dataN.push(d.name.length)
    		})
    		var maxNameL = d3.max(dataN)
    		var flagGL = flagG.selectAll('rect').data(data)
    		var flagEnter = flagGL.enter()
    		var flagExit = flagGL.exit()

    		var flagTextGL = flagG.selectAll('text').data(data)
    		var flagTextEnter = flagTextGL.enter()
    		var flagTextExit = flagTextGL.exit()

    		// exit部分处理
    		flagExit.remove()
    		// update部分处理
    		flagGL.attr({
    			width: config.flagStyle.width,
				height: config.flagStyle.height,
				fill: function(d,i){
					return color(i)
				},
				x: function(d,i){
					// 朝左边的位置
					var leftOffset = 40
					// 朝右边的位置
					var rightOffset = config.width 
							- config.padding.right
							- 70
						    - maxNameL*config.flagStyle.fontSize
					if (config.flagStyle.position == 'left'){
						return leftOffset
					}
					return rightOffset
				},
				y: function(d,i){
					var offsetY = config.height - 100 - i*(config.flagStyle.gap + config.flagStyle.height)
					return offsetY
				}
    		})
    		// enter部分处理
    		flagEnter.append('rect')
    			.attr({
    				width: config.flagStyle.width,
    				height: config.flagStyle.height,
    				fill: function(d,i){
    					return color(i)
    				},
    				x: function(d,i){
    					// 朝左边的位置
    					var leftOffset = config.padding.left
    					// 朝右边的位置
    					var rightOffset = config.width 
    							- config.padding.right
    							- 70
    						    - maxNameL*config.flagStyle.fontSize
    					if (config.flagStyle.position == 'left'){
    						return leftOffset
    					}
    					return rightOffset
    				},
    				y: function(d,i){
    					var offsetY = config.height - 100 - i*(config.flagStyle.gap + config.flagStyle.height)
    					return offsetY
    				}
    			})
    		// update部分处理
    		flagTextGL.attr({
    			fill: config.flagStyle.color,
				'font-size': config.flagStyle.fontSize,
				'text-anchor': config.flagStyle.textAnchor,
				x: function(d,i){
					// 朝左边的位置
					var leftOffset = config.padding.left + 30
					// 朝右边的位置
					var rightOffset = config.width 
							- config.padding.right
							- 70
						    - maxNameL*config.flagStyle.fontSize
						    + 30
					if (config.flagStyle.position == 'left'){
						return leftOffset
					}
					return rightOffset
				},
				y: function(d,i){
					var offsetY = config.height 
					    - 100 
					    - i*(config.flagStyle.gap + config.flagStyle.height)
					    + config.flagStyle.height/1.2
					return offsetY
				}
    		})
    		.text(function(d){
    			return d.name
    		})
    		// enter部分处理
    		flagTextEnter.append('text')
    			.attr({
    				fill: config.flagStyle.color,
    				'font-size': config.flagStyle.fontSize,
    				'text-anchor': config.flagStyle.textAnchor,
    				x: function(d,i){
    					// 朝左边的标志位置
    					var leftOffset = config.padding.left + 30
    					// 朝右边的标志位置
    					var rightOffset = config.width 
    							- config.padding.right
    							- 70
    						    - maxNameL*config.flagStyle.fontSize
    						    + 30
    					if (config.flagStyle.position == 'left'){
    						return leftOffset
    					}
    					return rightOffset
    				},
    				y: function(d,i){
    					var offsetY = config.height 
    					    - 100 
    					    - i*(config.flagStyle.gap + config.flagStyle.height)
    					    + config.flagStyle.height/1.2
    					return offsetY
    				}
    			})
    			.text(function(d){
    				return d.name
    			})
    		// exit部分处理
    		flagTextExit.remove()
    	},
    	addCharts: function(svg,data,config){
    		// 颜色集
    		var color = d3.scale.category10()
    		var defs = svg.select('defs')
    		if (!defs[0][0]){
    			defs = svg.append('defs')
    		}
    		// 添加标记
    		var markers = defs.selectAll('.arrow').data(data)
    		var markerEnter = markers.enter()
    		var markerExit = markers.exit()
    		// uodate部分处理
    		markers.attr({
    			id: function(d,i){
    				var _id = 'arrow' + i
    				return _id
    			},
    			markerUnits: 'strokeWidth',
    			markerWidth: 9,
    			markerHeight: 28,
    			
    		})
    		// if (!marker[0][0]){
    		// 	marker = defs.append('marker')
    		// 		.attr({
    		// 			id: 'arrow',
    		// 			markerUnits: 'strokeWidth',
		    // 			markerWidth: 9,
		    // 			markerHeight: 28,
		    // 			viewBox: '0 0 18 28',
		    // 			refx: 9,
		    // 			refy: 14,
		    // 			orient: 'auto'
    		// 		})
    		// 	marker.append('path')
    		// 		.attr({
    		// 			d: 'm9,0 l9,-14 l-6,0 l-10,14 l10,14 l6,0 l-9-14',
    		// 			fill: 'red'
    		// 		})
    		// }

    	}
    }
    return circleArow
})