<?php
/*
Template Name: Full Screen Video
*/
get_header(); ?>
<?php if (is_page()): the_post() ?>

	<?php

	$video_loop = get_field('video_loop');
		
	if ($video_loop):
		$c = 0;
		foreach ($video_loop as $video):
			$c++;
	?>
		

		<div class="screen" id="screen-<?php echo $c ?>" data-video="<?php echo $video['video_url']; ?>">
	        <img src="<?php echo $video['fallback_image']; ?>" class="big-image" />
	    </div>

		<?php endforeach; ?>



	<?php endif; ?>
		<nav id="next-btn">
	    	<a href="#" class="next-icon"></a>
		</nav>
  
	

	
<?php endif; ?>



<?php get_footer(); ?>
