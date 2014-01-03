require.config({
	//"baseUrl": directory.path,
	"baseUrl":'http://localhost:8888/civ/kalakala/wp-content/themes/kalakala/vendor/',
	"paths": {
		"jquery": "jquery/jquery",
		"fitvids": "fitvids/jquery.fitvids",
		"swiper": "swiper/dist/idangerous.swiper-2.4",
		"approach": "../js/src/approach",
		"mobile": "../js/src/mobile"
	},
	shim:
	{
		"fitvids": ["jquery"],
		"mag_pop": ["jquery"],
		"mobile": ["jquery"],
		"approach": ["jquery"]
	}
});

require(['jquery', 'fitvids', 'swiper', 'mobile', 'approach'], function($) {
	console.log(directory.path);
	function loadActiveVideo() {
		$activeVideo = $('.project.active').attr('data-video');
		$activeProjectImage = $('.project.active').attr('data-large');
		$('#playArea').append("<img class='placeholder' src="+$activeProjectImage+" /><a href='#' class='playButton'>Play</a>");
		$('.playButton').on('click', function(e) {
			e.preventDefault();
			$('#playArea .placeholder, .playButton').remove();
			$('#playArea').append($activeVideo);
			$('#playArea').fitVids();

		});
	}
	

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
		$('.series-wrapper').hide();
		$('.swiper-slide').hover(
			
			function(){
				$(this).children('.series-wrapper').fadeIn();
				$nav.hide();

			},
			function(){
				$(this).children('.series-wrapper').fadeOut();
				$nav.show();
			}

		);
		$(".work-slide").click(function(){
		     window.location=$(this).find("a").attr("href");  
		     return false;
		});

		// PAGE: SERIES
		loadActiveVideo();

		$('.series__Navigation a').click(function(e) {
			e.preventDefault();
			$('.project.active').removeClass('active');
			var newSeries = $(this).attr('href');
			$(newSeries).addClass('active');
			$('#playArea .placeholder, .playButton, .fluid-width-video-wrapper').remove();
			loadActiveVideo();
		});

		

		

		

	});

		
});
