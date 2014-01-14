<?php get_header(); ?>
<div id="page-content">
<section class="page__Container">
<?php if (have_posts()): while (have_posts()) : the_post() ?>
<h1 class="page__Title"><?php the_title(); ?></h1>
	
	<div id="singleProjectVideo"><iframe  src='//player.vimeo.com/video/<?php the_field('vimeo_id'); ?>' width='900' height='506' frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>
	<?php $thumbnail_large =  get_post_meta($post->ID, 'thumbnail_large');?>
	<?php //the_field('sub_title'); ?>
	<div class="series singleProject">
		<div class="project__Description"><?php the_field('description'); ?></div>
		<p><b>Category: </b><?php $cat = get_field('project_category'); $catOb = get_category($cat[0]);  echo $catOb->name; ?></p>
		<p><b>Year: </b><?php the_field('year'); ?></p>
		<p><b>Client: </b><?php the_field('client'); ?></p>
		<div class="collaborators"><b>Collaborators: </b><?php linkRepeaterField( 'collaborator', 'link', 'name', 'the_collaborators' ); ?></div>
		<p><b>Press: </b><?php the_field('press'); ?></p>
	</div>
<?php endwhile; endif; ?>
</section>
</div>
<?php get_footer(); ?>
