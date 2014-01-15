jQuery(document).ready(function($) {
	
	// PAGE: WORKS
	var windowWidth = $(window).width();
	var windowHeight = $(window).height() - 104;
	var mobileWindowHeight = $(window).height() - 65;
	if(isMobile)  {
		$('.swiper-container').css('height', mobileWindowHeight);
	}
	
	
	var slides = 3;
	var pagination = '';
	var createPagination = false;
	if(isMobile === true) {
		slides = 1;
		pagination = '.pagination';
		createPagination = true;
	}

	
	if(windowWidth > 1500) {
		slides = 5;
	}

    var workSwiper = new Swiper('.swiper-loop',{
	    slidesPerView: slides,
	    keyboardControl: true,
	    mousewheelControl: true,
	    loop: true,
	    pagination: pagination,
	    paginationClickable: true,
	    createPagination: createPagination
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


    $('.swiper-slide').each(function(i, slide) {
		var img = $(slide).find('img');
		var src = $(img).attr('src');
		$(img).hide();
		$(slide).backstretch(src);
    });
	
	
	$nav = $('.nextPrevIcon.previous');
	
	
	$(".work-slide").click(function(){
	     window.location=$(this).find("a").attr("href");  
	     return false;
	});




	if(!isMobile)  {
		// $('.work-slide').each(function() {
		// 	var $slide = $(this);
		// 	var $infoWindow = $slide.find('.series-wrapper');
		// 	var slideHeight = $slide.height();
		// 	var infoHeight = $infoWindow.height();
		// 	var diff = slideHeight - infoHeight;
		// 	//console.log(slideHeight+' - '+infoHeight+' = '+diff);
		// 	//$infoWindow.css('top', diff);
		// });

		// $('.series-wrapper').each(function() {
		// 	$seriesWrapper = $(this);
		// 	var wrapperHeight = $seriesWrapper.height();
		// 	var parentHeight = $seriesWrapper.parent().height();
		// 	var remainder = parentHeight - wrapperHeight;
		// 	console.log(remainder);
		// });
		
	}

});