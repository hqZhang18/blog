
	$(function(){
	var locahost = window.global.baseUrl
	var dateRadar = new Date()
/*	var url9 = locahost+"/hy-radarmap/init.java?"*/
	var url9 = "../fe/data/2017left.json"
	var getDataRadar = function (getYear, getQuarter, getMonth, getWeek) {
    //调用初始化接口
    $.get(url9, {
                year:getYear,
                quarter:getQuarter,
                month:getMonth,
                week:getWeek
            },
    function (responseData) {
        if (responseData.state) {
			$(".loading").css("display","none");
			window.radar.renderList(responseData.data,responseData.data.yujing, getYear)
        } else {
            alert(responseData.message)
        }
 
    })
}


/**
 * 重新封装预警的数据
 * @param  {[object]} data [预警的数据]
 * @return {[object]}      [重新封装后的数据]
 */
/*var packageData = function(data){
	var yujing = {
		jingq: [],
		penal:[],
		admin: [],
		pa: [],
		qj: []
	}
	if(data.length){
		for (var i = 0; i < data.length; i++) {
			for(var key in data[i]){
				var newData = {
					advise:"",
					forecast:""
				}
				switch(key){
					case "advise":
						newData.advise = data[i][key]
						newData.forecast = data[i].forecast
						var advise = newData.advise
						var forecast = newData.forecast
						if(advise!='' || forecast != '')
							yujing.jingq.push(newData)
						break
					case "PADdvise":
						newData.advise = data[i][key]
						newData.forecast = data[i].PAForecast
						var advise = newData.advise
						var forecast = newData.forecast
						if(advise!='' || forecast != '')
							yujing.pa.push(newData)
						break
					case "QJDdvise":
						newData.advise = data[i][key]
						newData.forecast = data[i].QJForecast
						var advise = newData.advise
						var forecast = newData.forecast
						if(advise!='' || forecast != '')
							yujing.qj.push(newData)
						break
					case "adminDdvise":
						newData.advise = data[i][key]
						newData.forecast = data[i].adminForecast
						var advise = newData.advise
						var forecast = newData.forecast
						if(advise!='' || forecast != '')
							yujing.admin.push(newData)
						break
					case "penalDdvise":
						newData.advise = data[i][key]
						newData.forecast = data[i].penalForecast
						var advise = newData.advise
						var forecast = newData.forecast
						if(advise!='' || forecast != '')
							yujing.penal.push(newData)
						break
				}
			}
		};

		return yujing
	}else{
		return yujing
	}

}
*/
getDataRadar( parseInt(dateRadar.getFullYear()),"","","")

	})
