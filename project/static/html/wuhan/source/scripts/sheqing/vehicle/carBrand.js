/**
 * @Author:      zhanghq
 * @DateTime:    2017-09-01 14:39:05
 * @Description: 汽车品牌分布
 * @Last Modified By:   zhanghq
 * @Last Modified Time:    2017-09-01 14:39:05
 */

define(function(require) {
 
    var carBrandPie = require('carBrandPie')
 

    function renderCarBrand(data) {
      carBrandPie.drawCharts('.car-brand-chars', data.carBrand, '')
    }
 

    return renderCarBrand
})