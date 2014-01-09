jQuery(document).ready(function($) {
	
	// PAGE: WORKS
	windowHeight = $(window).height() - 104;
	$('.swiper-container').css('height', windowHeight, 'important');
	var slides = 3;
	if(isMobile === true) {
		slides = 1;
	}

	

    var workSwiper = new Swiper('.swiper-loop',{
	    slidesPerView: slides,
	    loop: true
	  });
    $('.previous').click(function(e){
			e.preventDefault();
			workSwiper.swipePrev();
	});
    $('.next').click(function(e){
			e.preventDefault();
			workSwiper.swipeNext();
	});

    
	$(".nextPrevIcon i").approach({
		"opacity": 1
	}, 200);
	
	$nav = $('.nextPrevIcon.previous');
	
	
	$(".work-slide").click(function(){
	     window.location=$(this).find("a").attr("href");  
	     return false;
	});

	

});