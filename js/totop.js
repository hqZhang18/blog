(function($) {
    // When to show the scroll link
    // higher number = scroll link appears further down the page
    var upperLimit = 600;

    // Our scroll link element
    var scrollElem = $('#totop');


    // Scroll to top speed
    var scrollSpeed = 200;

    // Show and hide the scroll to top link based on scroll position
   
    $(window).scroll(function () {
        var scrollTop = $(document).scrollTop();
        if ( scrollTop > upperLimit ) {
            $(document).find('#totop').stop().fadeTo(100, 1); // fade back in
        }else{
             $(document).find('#totop').stop().fadeTo(100, 0); // fade out
        }
    });

    // Scroll to top animation on click
    $(document).on('click', '#totop' ,function(){
        $('html, body').animate({scrollTop:0}, scrollSpeed); return false;
    })
})(jQuery);