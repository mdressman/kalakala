require.config({
	"baseUrl": directory.path,
	"paths": {
		"jquery": "jquery/jquery",
		"fitvids": "fitvids/jquery.fitvids",
		"me_player": "mediaelement/build/mediaelement-and-player.min",
		"me": "mediaelement/build/mediaelement.min"
	},
	shim:
	{
		"fitvids": ["jquery"],
		"mag_pop": ["jquery"],
		'me_player': ["me"]
	}
});

require(['jquery', 'fitvids', 'me_player', 'me'], function($) {
	
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
