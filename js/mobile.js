$(function() {
    FastClick.attach(document.body);
    console.log('fastclick in the house');
});
$header = $('#page-header');
$shareButtons = $('.shareButtons');
$shareContainer = $('.shareContainer');
$('#mobileMenuToggle').on('click', function(e) {
	$header.toggleClass('active');	
	$(this).toggleClass('active');
});
$('.shareToggle').on('click', function(e) {
	e.preventDefault();
	$toggle = $(this);
	$toggle.toggleClass('active');
	$shareButtons.toggleClass('active');
});

$('.home .big-image').on('click', function() {
    window.location= window.location + '/work';
    return false;
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

if($('body').hasClass('home'))   {
	var videoURL = $('#videoBG').attr('data-video');
	
	$bgImage = $('.big-image');
	$src = $bgImage.attr('src');
	$bgImage.hide();
	$.backstretch($('.big-image').attr('src'));
	
}