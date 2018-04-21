		var x2 = 0
		var y2 = 0
		var a = 0
		var b = 0
		window.onresize=function(){
			//页面初始化时两侧显示

		    scale()
		};  
	    var scale=function(){
	    	/*var x=window.innerWidth/1500
	    	var y=window.innerHeight/1080*/
	    	var x=773/1500
	    	var y=310/1080
	    	$("body").css("webkitTransform",'scale('+x+','+y+')')   /* for Chrome || Safari */
	    	$("body").css("msTransform",'scale('+x+','+y+')')       /* for Firefox */
	    	$("body").css("mozTransform",'scale('+x+','+y+')')      /* for IE */
	    	$("body").css("oTransform",'scale('+x+','+y+')')        /* for Opera */	 
/*	    	if(x2!=x){
	    	  a=1;
          b=x/y;
	    	}
	    	if(y2!=y ){
	    	  a=y/x*0.8 ;
          b=1*0.8 ;
	    	}
	    	x2 = x
	    	y2 = y*/
	    	var a = 0.54594
	    	var b = 0.978
	    	//雷达图圆形缩放
	    	$(".radar-wrap").css("webkitTransform",'scale('+a+','+b+')')   /* for Chrome || Safari */
	    	$(".radar-wrap").css("msTransform",'scale('+a+','+b+')')       /* for Firefox */
	    	$(".radar-wrap").css("mozTransform",'scale('+a+','+b+')')      /* for IE */
	    	$(".radar-wrap").css("oTransform",'scale('+a+','+b+')')        /* for Opera */
	    	var  c = 0.8455
	    	var d = 1.9
	    	//图例圆形缩放
	    	$("#legend").css("webkitTransform",'scale('+c+','+d+')')   /* for Chrome || Safari */
	    	$("#legend").css("msTransform",'scale('+c+','+d+')')       /* for Firefox */
	    	$("#legend").css("mozTransform",'scale('+c+','+d+')')      /* for IE */
	    	$("#legend").css("oTransform",'scale('+c+','+d+')')        /* for Opera */
	    }
		 scale()
		 		$('#right').css('visibility', 'hidden')
				$('#left').css('visibility', 'hidden')
				$('.time').hide()

/*		var showAll =false;



		//点击显示详情
		$('#showClick').on('click', function(){
			if (showAll) {
				$(this).css('opacity', 1).text("隐藏详情")
				$('#right').css('visibility', 'visible')
				$('#left').css('visibility', 'visible')
				$('.time').show()
			}else{
				$(this).css('opacity', 1).text("显示详情")
				$('#right').css('visibility', 'hidden')
				$('#left').css('visibility', 'hidden')
				$('.time').hide()
			}
			showAll=!showAll
		})*/
		//雷达图旋转 兼容ie9
		var angle = 0;
		setInterval(function(){
		    angle +=1;
		    $('#rotate').rotate(angle);
		}, 180);
