<div id="menu-social-nav" class="menu">
<?php if(get_field('email_link', 'option')): ?>
	<a href="mailto:<?php the_field('email_link', 'option'); ?>?subject=Email sent from Kalakala.co"><span class="icon-envelope"></span></a>
<?php endif; ?>	

<?php if(get_field('facebook_link', 'option')): ?>
	<a target="_blank" href="<?php the_field('facebook_link', 'option'); ?>"><span class="icon-facebook"></span></a>
<?php endif; ?>	

<?php if(get_field('instagram_link', 'option')): ?>
	<a target="_blank" href="<?php the_field('instagram_link', 'option'); ?>"><span class="icon-instagram"></span></a>
<?php endif; ?>	

<?php if(get_field('tumblr_link', 'option')): ?>
	<a target="_blank" href="<?php the_field('tumblr_link', 'option'); ?>"><span class="icon-tumblr"></span></a>
<?php endif; ?>	

<?php if(get_field('twitter_link', 'option')): ?>
	<a target="_blank" href="<?php the_field('twitter_link', 'option'); ?>"><span class="icon-twitter"></span></a>
<?php endif; ?>	

<?php if(get_field('pinterest_link', 'option')): ?>
	<a target="_blank" href="<?php the_field('pinterest_link', 'option'); ?>"><span class="icon-pinterest"></span></a>
<?php endif; ?>	
</div>


