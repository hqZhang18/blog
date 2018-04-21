window.global = {
	baseUrl :"http://192.168.1.69:8080",
	//存储cookie
     setCookie:function(name,value){ //name为cookie的名称,value为name值
        //var days = 1; //保存天数,可作为参数传进来
       // var expires = new Date(); //建立日期变量
        //expires.setTime(expires.getTime() + days * 30 * 24 * 60 * 60 * 1000); //expires过期时间 = 当前时间 +过期时间(秒)
        var str = name + '=' + value +';'//expires=' + expires.toGMTString(); //将值及过期时间一起保存至cookie中(需以GMT格式表示的时间字符串)
        //var str = name + ‘=’ + escape(value) +’;expires=’ + expires.toGMTString(); 
        document.cookie = str;
        console.log(str)
   },
    
    //获取cookie
	 getCookie:function(name){
	    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)")); //通过正则表达式获取cookie为name的字符组
	    if(arr!=null){
	        return unescape(arr[2]); //输入返回
	    }
	    return '';
	}


}