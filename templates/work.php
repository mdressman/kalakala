<?php
/*
Template Name: Work
*/
get_header(); ?>

<div class="work-swiper swiper-container swiper-loop">
    
    <div class="swiper-wrapper">

	<?php
		$args = array(
	        'post_type'=> 'series',
			'postsperpage' => -1,
			'order' => 'ASC'
	    );
	    query_posts( $args );
	    if (have_posts()) : while (have_posts()) : the_post(); 

		$attachment_id = get_field('series_image');
		$size = "full"; 
							 
		// url = $image[0];
		// width = $image[1];
		// height = $image[2];
		$image = wp_get_attachment_image_src( $attachment_id, $size ); 

	?>

	  	<div class="swiper-slide work-slide" style="background: url(<?php echo $image[0]; ?>); ">
			<div class="series-wrapper">
				<?php get_template_part('templates/content', 'series'); 	?>			  
			</div>
	  	</div>

	<?php endwhile; endif; ?>	  
		
    </div><!--  end swiper-wrapper -->
    <div class="slide-direction-nav">
    	 <a class="previous" href="#"><i class="fa fa-chevron-circle-left"></i></a> 
    	 <a class="next" href="#"><i class="fa fa-chevron-circle-right"></i></a>
    </div>
</div> <!-- end swiper-container -->

<?php get_footer(); ?>