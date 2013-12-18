<div class="series">
	<h2 class="series-title upcase"><?php the_title(); ?></h2>
	<p class="series-desc"><?php the_field('description'); ?></p>
	<a class="series-link upcase" rel="<?php echo $post->ID; ?>" href="<?php the_permalink(); ?>">View Series</a>
</div>
