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
	setShareUrls();
}

function setShareUrls() {
	$("#share-fb").attr('href', $('.project.active').attr('share-fb'));
	$("#share-twitter").attr('href', $('.project.active').attr('share-twitter'));
	$("#share-tumblr").attr('href', $('.project.active').attr('share-tumblr'));
	$("#share-email").attr('href', $('.project.active').attr('share-email'));
}


jQuery(function($){ $('#singleProjectVideo').fitVids(); });
jQuery(document).ready(function($) {
	if (window.location.hash) {
		window.scrollTo(0,0);
	}
	if (!window.location.hash) {
		//window.history.pushState($('.project.active').attr('id'), $('.project.active').attr('id'), '#' + $('.project.active').attr('id'));
		setShareUrls();
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

	$('.pop').click(function() {
		window.open($(this).attr('href'),'t','toolbar=0,resizable=1,status=0,width=640,height=528');
			return false;
	});
});
	