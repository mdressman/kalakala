$(function() {
    FastClick.attach(document.body);
    console.log('fastclick in the house');
});
$header = $('#page-header');
$shareButtons = $('.shareButtons');
$shareContainer = $('.shareContainer');
$('#mobileMenuToggle').on('click', function(e) {
	$header.toggleClass('active');
});
$('.shareToggle').on('click', function(e) {
	e.preventDefault();
	$shareButtons.toggleClass('active');
});
var previousScroll = 0;
if(isMobile === true) {
$(window).scroll(function(){
	var currentScroll = $(this).scrollTop();
	if (currentScroll > previousScroll){
	    console.log('down');
	    $shareContainer.fadeOut();
	} else {
		console.log('up');
		$shareContainer.fadeIn();
	}
	previousScroll = currentScroll;
});
}