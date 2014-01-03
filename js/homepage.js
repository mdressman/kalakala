jQuery(document).ready(function($) {


			// Use Modernizr to detect for touch devices, 
            // which don't support autoplay and may have less bandwidth, 
            // so just give them the poster images instead
            var screenIndex = 1,
                numScreens = $('.screen').length,
                isTransitioning = false,
                transitionDur = 1000,
                BV,
                videoPlayer,
                isTouch = Modernizr.touch,
                $bigImage = $('.big-image'),
                $window = $(window),
                $bvWRAP = $('#big-video-wrap');
            
            if (!isTouch) {
                // initialize BigVideo
                BV = new $.BigVideo({
					ratio: '4/3',
					forceAutoplay:isTouch
                });
                BV.init();
                console.log('loaded');
               
                BV.show($('#videoBG').attr('data-video'),{ambient:true});
                
				BV.getPlayer().on('loadedmetadata', function() {
					console.log('show player');
                    $('.loading').remove();
					$('#big-video-wrap').animate({
						opacity: 1
					}, 500);
				});
                //console.log(BV.getPlayer());
                
                
            }
            
            

            function adjustImagePositioning() {
                $bigImage.each(function(){
                    var $img = $(this),
                        img = new Image();

                    img.src = $img.attr('src');

                    var windowWidth = $window.width(),
                        windowHeight = $window.height(),
                        r_w = windowHeight / windowWidth,
                        i_w = img.width,
                        i_h = img.height,
                        r_i = i_h / i_w,
                        new_w, new_h, new_left, new_top;

                    if( r_w > r_i ) {
                        new_h   = windowHeight;
                        new_w   = windowHeight / r_i;
                    }
                    else {
                        new_h   = windowWidth * r_i;
                        new_w   = windowWidth;
                    }

                    $img.css({
                        width   : new_w,
                        height  : new_h,
                        left    : ( windowWidth - new_w ) / 2,
                        top     : ( windowHeight - new_h ) / 2
                    });

                });

            }


			$('body').on('click', function() {
				//BV.getPlayer().pause();
				var video = BV.getPlayer();
				if(!video.paused()) {
					video.pause();
				} else {
					video.play();
				}
			});
});