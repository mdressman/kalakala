jQuery(document).ready(function($) {
	
	// PAGE: WORKS
	var windowWidth = $(window).width();
	var windowHeight = $(window).height() - 104;
	var mobileWindowHeight = $(window).height() - 65;
	if(!isMobile) {
		$('.swiper-container').css('height', windowHeight);
	} else {
		$('.swiper-container').css('height', mobileWindowHeight);
	}
	
	var slides = 3;
	if(isMobile === true) {
		slides = 1;
	}

	
	if(windowWidth > 1500) {
		slides = 5;
	}

    var workSwiper = new Swiper('.swiper-loop',{
	    slidesPerView: slides,
	    keyboardControl: true,
	    mousewheelControl: true,
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


    if(!isMobile) {
		$(".nextPrevIcon i").approach({
			"opacity": 1
		}, 200);
    }
	
	
	$nav = $('.nextPrevIcon.previous');
	
	
	$(".work-slide").click(function(){
	     window.location=$(this).find("a").attr("href");  
	     return false;
	});




	if(!isMobile)  {

		var slideImgHeight = $('.work-slide img').height();
		if(windowHeight > slideImgHeight) {
			$('.series-wrapper').css('bottom', windowHeight - slideImgHeight);
		}
	}

});