<?php get_header(); ?>

<?php if (have_posts()): while (have_posts()) : the_post() ?>
<section class="page__Container">
	<a href="<?php bloginfo('url') ?>/work" class="backToMainMenu"><span class="icon-back"></span><span>back to the main menu</span></a>
	<h1 class="page__Title"><?php the_title(); ?></h1>
	<div id="playArea" class="video">
		<nav class="singlePost__Nav">
		 <?php $prev_post = get_previous_post();
		if (!empty( $prev_post )): ?>
  			<a href="<?php echo get_permalink( $prev_post->ID ); ?>" class="nextPost">
  				<span class="icon-next icon-big"></span>	
  				<i>Next Series</i>
			</a>
		<?php endif; 
			  $next_post = get_next_post();
		if (!empty( $next_post )): ?>
  			<a href="<?php echo get_permalink( $next_post->ID ); ?>" class="prevPost">
  				<span class="icon-prev icon-big"></span>
  				<i>Prev Series</i>
  			</a>
		<?php endif; ?>


	</nav>

	</div>

	<div class="series">
	<?php 
	
	$projects = get_field('projekts');
	
	$projectData = array(); 
	$c = 0;
	if( $projects ): ?>
	    
	    <?php 

	    while(has_sub_field('projekts')): // variable must be called $post (IMPORTANT) 
	    	$post_object = get_sub_field('projekt');

	    	$post = $post_object;
	    	$c++;
	    	//var_dump($post);
	    	
	    	$thumbnail_large =  get_post_meta($post->ID, 'thumbnail_large');
	    	if(!$thumbnail_large[0]) {
	    		$thumbnail_large[0] = get_template_directory_uri() .'/css/kalakala_placeholder.jpg';
	    	}
	    	

	    	if ($c == 1) { $active = 'active';} else {$active = '';}
	        setup_postdata($post); 

	        $share_url = 'http://' . $_SERVER[HTTP_HOST] . $_SERVER[REQUEST_URI] . '#' . $post->post_name;
	        ?>



	        <div id="<?php echo $post->post_name; ?>" 
	        	 class="project <?php echo $active; ?>" 
	        	 data-large="<?php echo $thumbnail_large[0];  ?>" 
	        	 data-small="<?php echo $thumbnail_small[0];  ?>" 
	        	 data-video="<iframe src='//player.vimeo.com/video/<?php the_field('vimeo_id'); ?>?autoplay=1' width='900' height='506' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>"
	        	 share-fb="http://www.facebook.com/sharer/sharer.php?s=100&p[url]=<?php echo urlencode($share_url); ?>&p[title]=<?php echo get_the_title(); ?>&p[images][0]=<?php echo $thumbnail_large[0]; ?>&p[summary]=<?php echo strip_tags(get_field('description')); ?>"
	        	 share-twitter="http://www.twitter.com/share?text=<?php echo get_the_title(); ?>&url=<?php echo urlencode($share_url); ?>&via=<?php the_field('twitter_handle', 'option'); ?>"
	        	 share-tumblr="http://www.tumblr.com/share/link?url=<?php echo urlencode($share_url); ?>&name=<?php echo get_the_title(); ?>&description=<?php echo strip_tags(get_field('description')); ?>"
	        	 share-email="mailto:?subject=<?php echo get_the_title(); ?>&body=<?php echo $share_url; ?>">

	            <h2><?php the_title(); ?></h2>
	            
	            <?php // the_field('project_image'); ?>
	            <?php //the_field('sub_title'); ?>
	            <?php if(get_field('description')): ?>
	            	<div class="project__Description"><?php the_field('description'); ?></div>
	            <?php endif; ?>
	            <?php if(get_field('project_category')): ?>
	            	<p><b>Category: </b><?php $cat = get_field('project_category'); $catOb = get_category($cat[0]); echo $catOb->name; ?></p>
	            <?php endif; ?>
	            <?php if(get_field('year')): ?>
	            	<p><b>Year: </b><?php the_field('year'); ?></p>
	            <?php endif; ?>
	            <?php if(get_field('client')): ?>
	            	<p><b>Client: </b><?php the_field('client'); ?></p>
	            <?php endif; ?>
	            <?php if(get_field('collaborator')): ?>
	            	<div class="collaborators"><b>Collaborators: </b><?php linkRepeaterField( 'collaborator', 'link', 'name', 'the_collaborators' ); ?></div>
	            <?php endif; ?>
	            <?php if(get_field('press')): ?>
	            	<p><b>Press: </b><?php the_field('press'); ?></p>
	            <?php endif; ?>
	        </div>
	        <?php 
	        
	        $project['title'] = get_the_title(); 

	        $project['url'] = 'http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/'.get_field('vimeo_id'); 
	        $projectData[] = $project;
	        ?>
	
	
	    <?php 
	    wp_reset_postdata();
	    endwhile;  ?>
	    <nav class="series__Navigation">
	    <h3>Other Videos In Series</h3>
	    <?php
	    $c = 0;
	    while(has_sub_field('projekts')): 
	    	$c++;
	    	$post_object = get_sub_field('projekt');
	    	$post = $post_object;

	    	$thumbnail_small =  get_post_meta($post->ID, 'thumbnail_small'); 
			if(!$thumbnail_small[0]) {
	    		$thumbnail_small[0] = get_template_directory_uri() .'/css/kalakala_thumb_placeholder.jpg';
	    	}
	    	?>
	    	<a href="#<?php echo $post->post_name; ?>"><img src="<?php echo $thumbnail_small[0];?>" alt="<?php the_title(); ?>"/></a>
	    	<?php 
	    	wp_reset_postdata();
	    endwhile; 



	    ?>
	    </nav>

	    
	    <?php wp_reset_postdata(); ?>
	   	
	<?php endif; ?>

	</div>
	<?php get_template_part('share'); ?>
	</section>
	
<?php endwhile; endif ?>



<?php get_footer(); ?>