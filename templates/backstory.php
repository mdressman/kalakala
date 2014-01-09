<?php
/*
Template Name: Backstory
*/

get_header(); ?>
<?php if (is_page()): the_post() ?>

	<?php

	
	$vimeoID = get_field('backstory_video_id'); 

	$attachment_id = get_field('backstory_video_placeholder');
	$size = "full"; 
	$fallbackImage = wp_get_attachment_image_src( $attachment_id, $size );
			

	?>
		<section id="backstory" class="page__Container">
			<h1 class="page__Title"><?php the_title(); ?></h1>
			<div class="videoContainer" data-video="<iframe src='//player.vimeo.com/video/<?php echo $vimeoID; ?>?autoplay=1' width='900' height='506' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>">
	        	<img src="<?php echo $fallbackImage[0]; ?>" class="big-image" />
	        	<a href='#' class='playButton'>Play</a>
	    	</div>
	    	<div class="textBlock">
	    		<?php the_field('backstory'); ?>
	    	</div>
	    	
	    	<?php get_template_part('share'); ?>

	    </section>
	    <section id="team" class="page__Container whiteBG">
	    	<div class="insetBorder bigPad">
	    	<div class="section__Title"><h2 class="titleContainer"><span>TEAM</span></h2></div>

	    		<?php 	$members = get_field('team_member');

	    				foreach($members as $member):
	    					$portrait = $member['team_image'];
	    					$portraitImage = wp_get_attachment_image_src($portrait, 'full');
	    					echo '<img class="portrait" src="'.$portraitImage[0].'"/>';
	    					echo '<div class="bio">'.$member['team_bio'].'</div>';
	    				endforeach;


	    		 ?>
	    	</div>
	    	
	    </section>
	
<?php endif; ?>
<?php get_footer(); ?>