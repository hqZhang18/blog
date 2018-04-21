/**
 * @Author:       lee
 * @Email:        liwei@hiynn.com
 * @DateTime:     2017-08-31 15:44:09
 * @Description:  获取缩放比
 */
define(function(require) {
  var getScale = function(features, width, height) {
    var longitudeMin = 100000;
    var latitudeMin = 100000;
    var longitudeMax = 0;
    var latitudeMax = 0;
    features.map(function(e) {
      var a = d3.geo.bounds(e);
      if (a[0][0] < longitudeMin) {
        longitudeMin = a[0][0];
      }
      if (a[0][1] < latitudeMin) {
        latitudeMin = a[0][1];
      }
      if (a[1][0] > longitudeMax) {
        longitudeMax = a[1][0];
      }
      if (a[1][1] > latitudeMax) {
        latitudeMax = a[1][1];
      }
    });
    var a = longitudeMax - longitudeMin;
    var b = latitudeMax - latitudeMin;
    return Math.min(width / a, height / b)
  }
  return getScale
})