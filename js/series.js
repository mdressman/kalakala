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
	