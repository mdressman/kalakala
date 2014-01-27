<?php
/*
Template Name: Full Screen Video
*/

if(is_mobile()) {
	wp_redirect( site_url( 'work' ) );
}
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
	        	<img src="<?php echo $fallbackImage[0]; ?>" class="big-image" alt=""/>
	    	</div>
	    	<?php if(!is_mobile()): ?>
	    		<div class="loading">
	    			<span class="circle"></span>
	    			<span class="circle"></span>
	    			<span class="circle"></span>
	    		</div>
	    	<?php endif; ?>



	    </div>
	    <?php if(!is_mobile()): ?>
	    	<a id="soundControl" class="icon-volume-off" href="#"></a>
		<?php endif; ?>
	
<?php endif; ?>



<?php get_footer(); ?>
