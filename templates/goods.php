<?php
/*
Template Name: The Goods
*/?>

<?php get_header(); ?>
<?php if (is_page()): the_post() ?>

	<?php

	

	?>
		
	    <section id="goods" class="whiteBG">
	    	<div class="bigPad">
	    		<div class="section__Title">
	    			<h1 class="titleContainer">
	    				<span><?php the_title(); ?></span>
	    			</h1>
	    			<div class="subHeading"><?php the_content(); ?></div>
	    		</div>
	    		<div class="tumblrBlog alpha" id="pickings">
	    			<div class="logoColumn"><a target="_blank" href="http://historyofthebanjo.tumblr.com/" class="b_logo"></a></div>
	    			<script type="text/javascript" src="http://historyofthebanjo.tumblr.com/js?num=1"></script>
	    		</div>
	    		<div class="tumblrBlog" id="periscope">
	    			<div class="logoColumn"><a target="_blank" href="http://kalakalaperiscope.tumblr.com" class="b_logo"></a></div>
	    			<script type="text/javascript" src="http://kalakalaperiscope.tumblr.com/js?num=1"></script>
	    		</div>
	    		<div class="tumblrBlog" id="lightbox">
	    			<div class="logoColumn"><a target="_blank" href="http://kalakalalightbox.tumblr.com/" class="b_logo"></a></div>
	    			<script type="text/javascript" src="http://kalakalalightbox.tumblr.com/js?num=1"></script>
	    		</div>
	    		<div class="tumblrBlog" id="makeyourslikemine">
	    			<div class="logoColumn"><a target="_blank" href="http://makeyourslikemine.tumblr.com/" class="b_logo"></a></div>
	    			<script type="text/javascript" src="http://makeyourslikemine.tumblr.com/js?num=1"></script>
	    		</div>
	    		<div class="tumblrBlog" id="eveningredness">
	    			<div class="logoColumn"><a target="_blank" href="http://kalakalaeveningredness.tumblr.com/" class="b_logo"></a></div>
	    			<script type="text/javascript" src="http://kalakalaeveningredness.tumblr.com/js?num=1"></script>
	    		</div>


	    	</div>
	    	
	    </section>
	
<?php endif; ?>
<?php get_footer(); ?>