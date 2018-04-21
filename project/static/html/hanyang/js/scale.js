 function scale(){
			var x2 = 0
			var y2 = 0
			var a = 0
			var b = 0
			var x=window.innerWidth/2688
			var y=window.innerHeight/1080
			$("body").css("webkitTransform",'scale('+x+','+y+')')   /* for Chrome || Safari */
			$("body").css("msTransform",'scale('+x+','+y+')')       /* for Firefox */
			$("body").css("mozTransform",'scale('+x+','+y+')')      /* for IE */
			$("body").css("oTransform",'scale('+x+','+y+')')        /* for Opera */	 
			if(x2!=x){
			  a=1;
		    b=x/y;
			}
			if(y2!=y ){
			  a=y/x*0.8 ;
		    b=1*0.8 ;
			}
			x2 = x
			y2 = y
			//雷达图圆形缩放
			$(".radar-wrap").css("webkitTransform",'scale('+a+','+b+')')   /* for Chrome || Safari */
			$(".radar-wrap").css("msTransform",'scale('+a+','+b+')')       /* for Firefox */
			$(".radar-wrap").css("mozTransform",'scale('+a+','+b+')')      /* for IE */
			$(".radar-wrap").css("oTransform",'scale('+a+','+b+')')        /* for Opera */
			
			//雷达图圆形缩放
			$("#rotate1").css("webkitTransform",'scale('+a+','+b+')')   /* for Chrome || Safari */
			$("#rotate1").css("msTransform",'scale('+a+','+b+')')       /* for Firefox */
			$("#rotate1").css("mozTransform",'scale('+a+','+b+')')      /* for IE */
			$("#rotate1").css("oTransform",'scale('+a+','+b+')')        /* for Opera */

			//图例圆形缩放
			$("#legend").css("webkitTransform",'scale('+a+','+b+')')   /* for Chrome || Safari */
			$("#legend").css("msTransform",'scale('+a+','+b+')')       /* for Firefox */
			$("#legend").css("mozTransform",'scale('+a+','+b+')')      /* for IE */
			$("#legend").css("oTransform",'scale('+a+','+b+')')        /* for Opera */
			
			//饼图
			$(".pieChart").css("webkitTransform",'scale('+a+','+b+')')   /* for Chrome || Safari */
			$(".pieChart").css("msTransform",'scale('+a+','+b+')')       /* for Firefox */
			$(".pieChart").css("mozTransform",'scale('+a+','+b+')')      /* for IE */
			$(".pieChart").css("oTransform",'scale('+a+','+b+')')        /* for Opera */
			$(".pieChartBg").css("webkitTransform",'scale('+a+','+b+')')   /* for Chrome || Safari */
			$(".pieChartBg").css("msTransform",'scale('+a+','+b+')')       /* for Firefox */
			$(".pieChartBg").css("mozTransform",'scale('+a+','+b+')')      /* for IE */
			$(".pieChartBg").css("oTransform",'scale('+a+','+b+')')        /* for Opera */
			
			$(".box").css("webkitTransform",'scale('+a+','+b+')')   /* for Chrome || Safari */
			$(".box").css("msTransform",'scale('+a+','+b+')')       /* for Firefox */
			$(".box").css("mozTransform",'scale('+a+','+b+')')      /* for IE */
			$(".box").css("oTransform",'scale('+a+','+b+')')        /* for Opera */

			// 强戒中间饼图
			$(".contenBox").css("webkitTransform",'scale('+a+','+b+')')   /* for Chrome || Safari */
			$(".contenBox").css("msTransform",'scale('+a+','+b+')')       /* for Firefox */
			$(".contenBox").css("mozTransform",'scale('+a+','+b+')')      /* for IE */
			$(".contenBox").css("oTransform",'scale('+a+','+b+')')        /* for Opera */

			// 强戒右边饼图
			$(".strongPie").css("webkitTransform",'scale('+a+','+b+')')   /* for Chrome || Safari */
			$(".strongPie").css("msTransform",'scale('+a+','+b+')')       /* for Firefox */
			$(".strongPie").css("mozTransform",'scale('+a+','+b+')')      /* for IE */
			$(".strongPie").css("oTransform",'scale('+a+','+b+')')        /* for Opera */
			// 强戒右边饼图
			$("#drugTypeGauge").css("webkitTransform",'scale('+a+','+b+')')   /* for Chrome || Safari */
			$("#drugTypeGauge").css("msTransform",'scale('+a+','+b+')')       /* for Firefox */
			$("#drugTypeGauge").css("mozTransform",'scale('+a+','+b+')')      /* for IE */
			$("#drugTypeGauge").css("oTransform",'scale('+a+','+b+')')        /* for Opera */



			
			
			
			
		}
self.scale()
			window.onresize = function() {
				self.scale()
			}
