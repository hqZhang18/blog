$.ajax({
	type:"get",
	url:"data/01.json",
	success: function(data){
		packageData(data.data.list)
		window.radar.renderList(data.data, packageData(data.data.list))
	}
});


var packageData = function(data){
	
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
		console.log(yujing)
		return yujing
	}else{
		return yujing
	}
	
}