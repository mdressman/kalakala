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
  				<i>Previous Series</i>
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
	    	

	    	if ($c == 1) { $active = 'active';} else {$active = '';}
	        setup_postdata($post); ?>
	        <div id="project<?php echo $c; ?>" class="project <?php echo $active; ?>" data-large="<?php echo $thumbnail_large[0];  ?>" data-small="<?php echo $thumbnail_small[0];  ?>" data-video="<iframe src='//player.vimeo.com/video/<?php the_field('vimeo_id'); ?>?autoplay=1' width='900' height='506' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>">
	            <h2><?php the_title(); ?></h2>
	            
	            <?php // the_field('project_image'); ?>
	            <?php //the_field('sub_title'); ?>
	            <div class="project__Description"><?php the_field('description'); ?></div>
	            <p><b>Category: </b><?php the_field('project_category'); ?></p>
	            <p><b>Year: </b><?php the_field('year'); ?></p>
	            <p><b>Client: </b><?php the_field('client'); ?></p>
	            <div class="collaborators"><b>Collaborators: </b><?php linkRepeaterField( 'collaborator', 'link', 'name', 'the_collaborators' ); ?></div>
	            <p><b>Press: </b><?php the_field('press'); ?></p>
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
	    while(has_sub_field('projekts')): // variable must be called $post (IMPORTANT) ?			>
	    	$c++;
	    	$post_object = get_sub_field('projekt');
	    	$post = $post_object;

	    	$thumbnail_small =  get_post_meta($post->ID, 'thumbnail_small'); ?>
	    	<a href="#project<?php echo $c; ?>"><img src="<?php echo $thumbnail_small[0];?>" alt="<?php the_title(); ?>"/></a>
	    	<?php 
	    	wp_reset_postdata();
	    endwhile; 



	    ?>
	    </nav>

	    
	    <?php wp_reset_postdata(); ?>
	   	<script type="text/javascript">
			var projectData = <?php echo json_encode($projectData); ?>;
			console.log(projectData);
		</script>
	<?php endif; ?>

	</div>
	<?php get_template_part('share'); ?>
	</section>
	
<?php endwhile; endif ?>



<?php get_footer(); ?>