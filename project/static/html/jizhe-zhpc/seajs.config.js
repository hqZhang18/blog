/**
 * @Author:      baizn
 * @DateTime:    2017-01-17 09:24:27
 * @Description: seajs配置文件
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */

seajs.config({
    paths: {
        //modules: 'sea-modules',
        app: '../scripts',
        util: '../util'
    },
    alias: {
        common: 'util/util.js',
        constants: './constants.js',
        casing: 'app/casing.js',
        map: 'app/map.js',
        drawMap: 'app/common/drawMap.js',
        right: 'app/common/right.js',
        header: 'app/common/header.js',
        category: 'app/common/category.js',
        barCharts: 'app/common/barCharts.js',
        pieCharts: 'app/common/pieCharts.js',
        gauge: 'app/common/gauge.js',
        duibu: 'app/common/duibu.js',
        commons: 'app/common/common.js',
        request: 'app/common/request.js',
        caseNumbers: 'app/common/caseNumber.js',
        victoryAnimation: './victoryAnimation.js',
        navPage: 'app/common/navPage.js',

        //第三方库文件
        handlebars: 'handlebars.js',
        jquery: 'jquery.min.js',
        lodash: 'lodash.js',
        d3: 'd3.v3.min.js',
        echarts: 'echarts.js',
        timeSlider: 'selectToUISlider.jQuery.js',
        timeCustom: 'jquery-ui.js',
        topojson: 'topojson-client.js',
    }
})