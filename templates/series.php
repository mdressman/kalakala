<?php
/*
Template Name: Series
*/
get_header(); ?>
<?php if (is_page()): the_post() ?>


	
	<script>var video = 'http://vimeo.com/api/oembed.json?url=http%3A//vimeo.com/http://vimeo.com/<?php echo get_field('video_id'); ?>';
	</script>
<?php endif;?>



<?php get_footer(); ?>