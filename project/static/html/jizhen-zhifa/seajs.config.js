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
        util: '../scripts/util'
    },
    alias: {
        util: 'util/util.js',
        constants: 'util/constants.js',
        request: 'util/request.js',
        datePicker: 'util/datePicker.js',

        //第三方库文件
        handlebars: 'handlebars.js',
        jquery: 'jquery.min.js',
        lodash: 'lodash.js',
        d3: 'd3.v3.min.js',
        echarts: 'echarts.js',
        apiURL: 'app/api.config.js'
    }
})