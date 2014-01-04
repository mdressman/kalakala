<?php
/*
Template Name: Full Screen Video
*/

get_header(); ?>
<?php if (is_page()): the_post() ?>

	<?php

	$video_loop = get_field('video_loop');
		
	
		
			$attachment_id = get_field('fallback_image');
			$size = "full"; 
			 
			$fallbackImage = wp_get_attachment_image_src( $attachment_id, $size );
			

	?>
		<div id="homepageVideoWrapper">

			<div class="screen" id="videoBG" data-video="<?php the_field('video_url'); ?>">
	        	<img src="<?php echo $fallbackImage[0]; ?>" class="big-image" />
	    	</div>
	    	<div class="loading">
	    		<span class="circle"></span>
	    		<span class="circle"></span>
	    		<span class="circle"></span>
	    	</div>



	    </div>
	    <a id="soundControl" class="muted" href="#">VOLUME</a>
	
<?php endif; ?>



<?php get_footer(); ?>
