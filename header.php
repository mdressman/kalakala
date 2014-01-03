<!DOCTYPE html>
<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7" <?php language_attributes() ?>><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8" <?php language_attributes() ?>><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9" <?php language_attributes() ?>><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js" <?php language_attributes() ?>><!--<![endif]-->
    <head>
        <meta charset="<?php bloginfo( 'charset' ) ?>">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width">
        <?php if(is_page('the-goods')): ?>
        	<script type="text/javascript" src="//use.typekit.net/pom2awi.js"></script>
			<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
		<?php else: ?>
        	<script type="text/javascript" src="//use.typekit.net/ytw0jtp.js"></script>
			<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
		<?php endif; ?>
        <title><?php wp_title( '|', true, 'right' ) ?></title>
		<meta name="author" content="">
		<link rel="author" href="">
		<?php wp_head() ?>
    </head>
    <body <?php body_class() ?>>
		<header id="page-header">
			<h1>
			
					<a href="<?php bloginfo('url') ?>" title="<?php bloginfo('name') ?> - <?php bloginfo('description') ?>" class="logo">
						<?php bloginfo('name') ?>
					</a>
				
			</h1>
			<?php wp_nav_menu(array(
				'theme_location' => 'main-nav',
				'container'      => false,
				'menu_class'      => 'menu',
			)) ?>
			<?php get_template_part('social', 'nav'); ?>
			<a href="#" id="mobileMenuToggle"><span class="icon-menu"></span></a>
		</header>

		<div id="content-wrap">