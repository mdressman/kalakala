<?php
/*
Template Name: Hello
*/

get_header(); ?>
<?php if (is_page()): the_post() ?>

	<?php

	

	?>
		
	    <section id="hello" class="page__Container whiteBG">
	    	<div class="insetBorder bigPad">
	    			<div class="section__Title">
	    				<h1 class="titleContainer">
	    					<span><?php the_title(); ?></span>
	    				</h1>
	    			</div>
	    			<?php the_content(); ?>
	    			<div class="socialLinks">
	    				<a href="mailto:<?php the_field('email_link');?>?subject=Message from Kalakala Co. Website."><span class="icon-envelope"></span></a>
	    				<a target="_blank" href="<?php the_field('facebook_link');?>"><span class="icon-facebook"></span></a>
	    				<a target="_blank" href="<?php the_field('tumblr_link');?>"><span class="icon-tumblr"></span></a>
	    				<a target="_blank" href="<?php the_field('twitter_link');?>"><span class="icon-twitter"></span></a>
	    			</div>
	    			<?php the_field('contact_form'); ?>
	    		</div>

	    	</div>
	    	
	    </section>
	
<?php endif; ?>
<?php get_footer(); ?>