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

function setActiveVideo(selection) {
	$('.project.active').removeClass('active');
	$(selection).addClass('active');
	window.history.pushState(selection, selection, selection);
	
}

jQuery(document).ready(function($) {

	if (!window.location.hash) {
		window.location = window.location + '#' + $('.project.active').attr('id');
	} else {
		setActiveVideo('#' + window.location.hash.substr(1));
	}

	loadActiveVideo();
	

	

	$('.series__Navigation a').click(function(e) {
		e.preventDefault();
		setActiveVideo($(this).attr('href'));
		$('#playArea .placeholder, .playButton, .fluid-width-video-wrapper').remove();
		loadActiveVideo();
	});
});
	