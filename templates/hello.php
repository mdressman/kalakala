<?php
/*
Template Name: Hello
*/

get_header(); ?>
<?php if (is_page()): the_post() ?>


		
	    <section id="hello" class="page__Container whiteBG">
	    	<div class="insetBorder bigPad">
	    			<div class="section__Title">
	    				<h1 class="titleContainer">
	    					<span><?php the_title(); ?></span>
	    				</h1>
	    			</div>
	    			<?php the_content(); ?>
	    			
	    			<?php the_field('contact_form'); ?>
	    		

	    	</div>
	    	
	    </section>
	
<?php endif; ?>
<?php get_footer(); ?>