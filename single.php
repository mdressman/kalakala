<?php get_header(); ?>
<div id="page-content">
<h1><?php the_title(); ?></h1>
<?php the_field('video'); ?>
	<?php the_field('project_image'); ?>
	<?php //the_field('sub_title'); ?>
	<div class="project__Description"><?php the_field('description'); ?></div>
	<p><b>Category: </b><?php the_field('project_category'); ?></p>
	<p><b>Year: </b><?php the_field('year'); ?></p>
	<p><b>Client: </b><?php the_field('client'); ?></p>
	<p><b>Collaborators: </b><?php the_field('collaborators'); ?></p>
	<p><b>Category: </b><?php //the_field('press'); ?></p>


	
</div>
<?php get_sidebar(); ?>
<?php get_footer(); ?>
