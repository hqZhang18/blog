// 页面缩放
function zoom(width, height){

  var x = window.innerWidth / width
  var y = window.innerHeight / height
  $('body').css('webkitTransform','scale(' + x + ',' + y + ')')   /* for Chrome || Safari */
  $('body').css('msTransform','scale(' + x + ',' + y + ')')       /* for Firefox */
  $('body').css('mozTransform','scale(' + x + ',' + y + ')')      /* for IE */
  $('body').css('oTransform','scale(' + x + ',' + y + ')')        /* for Opera */  
}
zoom(1920, 1080)
window.addEventListener('resize', function () {
  zoom(1920, 1080)
})