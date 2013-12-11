require.config({
	"baseUrl": directory.path,
	"paths": {
		"jquery": "jquery/jquery",
		"fitvids": "fitvids/jquery.fitvids"
	},
	shim:
	{
		"fitvids": ["jquery"]
	}
});

require(['jquery', 'fitvids'], function($, fitvids) {
	
	function loadActiveVideo() {
		$activeVideo = $('.project.active').attr('data-video');
		$activeProjectImage = $('.project.active').attr('data-large');
		$('#playArea').append("<img class='placeholder' src="+$activeProjectImage+" /><a href='#' class='playButton'>Play</a>");
		$('.playButton').on('click', function() {
			$('#playArea .placeholder, .playButton').remove();
			$('#playArea').append($activeVideo);
			$('#playArea .video').fitVids();

		});
	}
	

	//$('#playArea').append($activeVideo);
	jQuery(document).ready(function($) {
		loadActiveVideo();
	});

	
});
