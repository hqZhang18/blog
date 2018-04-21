/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-09-01 12:49:26
 * @Description:  车辆分布左上角总数统计
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-10-13 10:15:42
 */

define(function (require) {
  require('handlebars')
  var countNum = function (data) {
    var motorVehicle = []
    // 机动车总数
    for (var i = 0; i < data.motorVehicle.length; i++) {
      motorVehicle.push(data.motorVehicle.charAt(i))
    }
    
    data.motorVehicle = motorVehicle
    
    // 网约车总数
    var networkCar = []
    for (var i = 0; i < data.networkCar.length; i++) {
      networkCar.push(data.networkCar.charAt(i))
    }
    data.networkCar = networkCar
    
    // 两客一危总数
    var keyCar = []
    for (var i = 0; i < data.keyCar.length; i++) {
      keyCar.push(data.keyCar.charAt(i))
    }
    data.keyCar = keyCar
    
    // 货车总数
    var truck = []
    for (var i = 0; i < data.truck.length; i++) {
      truck.push(data.truck.charAt(i))
    }
    data.truck = truck
    
    // 需求改动(货船总数-客船总数不显示)
    // //货船总数
    // var cargoShip = []
    // for (var i = 0; i < data.cargoShip.length; i++) {
    //     cargoShip.push(data.cargoShip.charAt(i))
    // }
    // data.cargoShip = cargoShip
    
    // // 客船总数
    // var passengerShip = []
    // for (var i = 0; i < data.passengerShip.length; i++) {
    //     passengerShip.push(data.passengerShip.charAt(i))
    // }
    // data.passengerShip = passengerShip
    // 模板加载
    var tpl = require('../../../templates/sheqing/vehicle/countList.tpl')
    var countListHtml = Handlebars.compile(tpl)
    
    $('.count-list').html(countListHtml(data))
  }
  return countNum
})