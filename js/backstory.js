jQuery(document).ready(function($) {
	$videoContainer = $('.videoContainer');
	$video = $videoContainer.attr('data-video');
	console.log($video);
	$('.playButton').on('click', function(e) {
			e.preventDefault();
			$('.videoContainer img, .playButton').remove();
			$videoContainer.append($video);
			$videoContainer.fitVids();
	
	});
});