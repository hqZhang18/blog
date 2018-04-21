//设置页面缩放
  function scale(){

     var page = [1920, 1080]
        var screen = [window.innerWidth, window.innerHeight]
        var xScale = screen[0] / page[0]
        var yScale = screen[1] / page[1]
        $('.main').css('webkitTransform', 'scale(' + xScale + ',' + yScale + ') translate(0px,0px)') /* for Chrome || Safari */
        $('.main').css('mozTransform', 'scale(' + xScale + ',' + yScale + ') translate(0px,0px)')  /* for Firefox */
        $('.main').css('msTransform', 'scale(' + xScale + ',' + yScale + ') translate(0px,0px)')  /* for Firefox */
        $('.main').css('oTransform', 'scale(' + xScale + ',' + yScale + ') translate(0px,0px)')  /* for Firefox */
    }


  window.addEventListener("resize", function(){
      scale()
  })
  scale()




