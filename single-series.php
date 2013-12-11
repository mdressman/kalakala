<?php get_header(); 

if (have_posts()):
		while (have_posts()) : the_post() ?>
			<section class="series__Container">
				<div id="playArea" class="video"></div>
				<h1 class="series__Title"><?php the_title(); ?></h1>

				<div class="series">
		<?php 
			
			$projects = get_field('projects');
			
			$projectData = array(); 
			$c = 0;
			if( $projects ): ?>
			    
			    <?php foreach( $projects as $post): // variable must be called $post (IMPORTANT) ?			>
			    	$c++;
			    	//var_dump($post);
			    	
			    	$thumbnail_large =  get_post_meta($post->ID, 'thumbnail_large');
			    	

			    	if ($c == 1) { $active = 'active';} else {$active = '';}
			        setup_postdata($post); ?>
			        <div id="project<?php echo $c; ?>" class="project <?php echo $active; ?>" data-large="<?php echo $thumbnail_large[0];  ?>" data-small="<?php echo $thumbnail_small[0];  ?>" data-video="<iframe src='//player.vimeo.com/video/<?php the_field('vimeo_id'); ?>' frameborder='0' autoplay webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>">
			            <h2><?php the_title(); ?></h2>
			            
			            <?php the_field('project_image'); ?>
			            <?php //the_field('sub_title'); ?>
			            <div class="project__Description"><?php the_field('description'); ?></div>
			            <p><b>Category: </b><?php the_field('project_category'); ?></p>
			            <p><b>Year: </b><?php the_field('year'); ?></p>
			            <p><b>Client: </b><?php the_field('client'); ?></p>
			            <p><b>Collaborators: </b><?php the_field('collaborators'); ?></p>
			            <p><b>Category: </b><?php the_field('press'); ?></p>
			        </div>
			        <?php 
			        
			        $project['title'] = get_the_title(); 

			        $project['url'] = 'http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/'.get_field('vimeo_id'); 
			        $projectData[] = $project;
			        ?>
			
			
			    <?php endforeach;  ?>
			    <nav class="series__Navigation">
			    <h3>Other Videos In Series</h3>
			    <?php
			    $c = 0;
			    foreach( $projects as $post): // variable must be called $post (IMPORTANT) ?			>
			    	$c++;
			    	$thumbnail_small =  get_post_meta($post->ID, 'thumbnail_small'); ?>
			    	<a href="#project<?php echo $c; ?>"><img src="<?php echo $thumbnail_small[0];?>" alt="<?php the_title(); ?>"/></a>
			    	<?php 
			    endforeach; 



			    ?>
			    </nav>
			    
			    <?php wp_reset_postdata(); ?>
			   	<script type="text/javascript">
					var projectData = <?php echo json_encode($projectData); ?>;
					console.log(projectData);
				</script>
			<?php endif; ?>

			</div>
			</section>
		<?php endwhile; ?>

<?php endif; ?>



<?php get_footer(); ?>