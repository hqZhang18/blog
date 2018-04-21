define(function(require) {
	var warningCondition = {
		initWarning:function(data,url,index){
			//警情添加三条信息
			var alarm = function(data){
				//动态添加三条信息
				var span=""
				for (var i = 0; i < data.length; i++) {
					var num = i%2
					if (num=="0") {
						span = span+"<span class='spanOdd'>"+data[i]+"</span>"
					}else{
						span = span+"<span>"+data[i]+"</span>"	
					}
					
				}
				$(".right01_title").append(span)
			}
			//破刑事案件
			var penal = function(data){
				var laberdata = ["案件类别","案情","进展"]
				//动态添加三条信息
				var span=""
				for (var i = 0; i < data.length; i++) {
					span = span+"<span><label>"+laberdata[i]+"</label>"+data[i]+"</span>"
				}
				$(".right01_title").append(span)
			}
			//治安行政
			var admin = function(data){
				var laberdata = ["案件类别","案情","进展"]
			//动态添加三条信息
				var span=""
				for (var i = 0; i < data.length; i++) {
					span = span+"<span><label>"+laberdata[i]+"</label>"+data[i]+"</span>"
				}
				$(".right01_title").append(span)
				
			}
			switch(index){
				case "02":
					alarm(data)
					break
				case "03":
					penal(data)
					break
				case "05":
					admin(data)
				default:
					break
			}
			var dataUrl = window.global.baseUrl+"/hy-radarmap/leader"
			//点击领导跳转
			var alterUrl = url
			$('#url').click(function(){
				window.open(alterUrl)
				//window.parent.location.href = url
			})
			//点击修改url
			$('#show').click(function(){
				$(".alterUrl").show()
				$(".alterUrl input").val(alterUrl)
			})
			//点击取消
			$('.cancel').click(function(){
				$(".alterUrl").hide()
			})
			//点击保存
			$(".save").click(function(){
				alterUrl = $(".alterUrl input").val()
				var ajaxData = {
					pageCode:index,
					url:alterUrl 
				}
				$.ajax({
					type:"post",
					url:dataUrl,
					data:JSON.stringify(ajaxData),
					dataType:"json",
					contentType: "application/json;charset=utf-8",
					success:function(responseData){
						if (!responseData.state) {
							alert("保存失败")
							return false
						}
						$(".alterUrl").hide()
					}
				})

			})
		}
	}
	return warningCondition
})
