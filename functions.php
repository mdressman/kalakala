<?php







$url = 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js'; // the URL to check against  
$test_url = @fopen($url,'r'); // test parameters  
if( $test_url !== false ) { // test if the URL exists  

    function load_external_jQuery() { // load external file  
        wp_deregister_script( 'jquery' ); // deregisters the default WordPress jQuery  
        if(is_page('hello') || is_page('the-goods')):
        	wp_register_script('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', false, 02012014, false); // register the external file  
        else:
        	wp_register_script('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', false, 02012014, true); // register the external file  
        endif;
        wp_enqueue_script('jquery'); // enqueue the external file  
    }  

    add_action('wp_enqueue_scripts', 'load_external_jQuery'); // initiate the function  
} else {  

    function load_local_jQuery() {  
        wp_deregister_script('jquery'); // initiate the function 
        if(is_page('hello')):
        	wp_register_script('jquery', get_template_directory_uri().'/js/jquery.js', __FILE__, false, '1.7.2', false); // register the local file  
        else:
        	wp_register_script('jquery', get_template_directory_uri().'/js/jquery.js', __FILE__, false, '1.7.2', true); // register the local file  
        endif;
        wp_enqueue_script('jquery'); // enqueue the local file  
    }  

    add_action('wp_enqueue_scripts', 'load_local_jQuery'); // initiate the function  
} 
add_action('wp_enqueue_scripts', 'theme_enqueue_scripts');
function theme_enqueue_scripts(){
	
	//wp_dequeue_script( 'jquery' );
	//wp_enqueue_script('jquerycdn', '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min', array(), false, true);
	 



	//wp_register_script('modernizr', get_bloginfo('template_url') . '/js/vendor/modernizr/modernizr.js', array(), false, false);
	wp_register_script('modernizr', '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js', array(), false, false);
	wp_enqueue_script('modernizr');
	wp_register_script('require', get_bloginfo('template_url') . '/vendor/requirejs/require.js', array(), false, true);
	wp_register_script('mobile', get_bloginfo('template_url') . '/js/dist/mobile.min.js', array(), false, true);

	wp_register_script('home', get_bloginfo('template_url') . '/js/dist/homepage.min.js', array(), false, true);
	wp_register_script('work', get_bloginfo('template_url') . '/js/dist/work.min.js', array(), false, true);
	wp_register_script('series', get_bloginfo('template_url') . '/js/dist/series.min.js', array(), false, true);
	wp_register_script('goods', get_bloginfo('template_url') . '/js/dist/goods.min.js', array(), false, true);
	wp_register_script('backstory', get_bloginfo('template_url') . '/js/dist/backstory.min.js', array(), false, true);

	if(is_front_page() && !is_mobile()):
		wp_enqueue_script('home');
	elseif(is_page('work')):
		wp_enqueue_script('work');
	// elseif(is_page('the-goods')):
	// 	wp_enqueue_script('goods');
	elseif(is_page('backstory')):
		wp_enqueue_script('backstory');
	elseif ( 'series' == get_post_type() ) :
		wp_enqueue_script('series');
	else: 
		wp_enqueue_script('mobile');
	endif;


	wp_register_script('global', get_bloginfo('template_url') . '/js/global.js', array('require'), false, true);
	wp_register_script('livereload', 'http://localhost:35729/livereload.js?snipver=1', null, false, true);

	
	wp_enqueue_style('global', get_bloginfo('template_url') . '/css/global.css');
	
	//wp_enqueue_script('global');
	

	//$WP_DIRECTORY = array( 'path' => get_bloginfo('template_url') . '/vendor/' );
	//wp_localize_script( 'require', 'directory', $WP_DIRECTORY );

	
	wp_enqueue_script('livereload'); //keep this at the bottom
	
}


// ADD DATA ATTRIBUTE TO ENQUEUE SCRIPT
add_filter('clean_url','requirejs_script',10,2);

function requirejs_script( $url ) {
      if ( // comment the following line out add 'defer' to all scripts
	  FALSE === strpos( $url, 'require.js' )
	  )
	  { // not our file
	      return $url;
	  }
	  // Must be a ', not "!
	  return "$url' data-main='".get_template_directory_uri()."/js/global'";
}

//Add Featured Image Support
add_theme_support('post-thumbnails');

// Clean up the <head>
function removeHeadLinks() {
	remove_action('wp_head', 'rsd_link');
	remove_action('wp_head', 'wlwmanifest_link');
}
add_action('init', 'removeHeadLinks');
remove_action('wp_head', 'wp_generator');

function register_menus() {
	register_nav_menus(
		array(
			'main-nav' => 'Main Navigation',
			'social-menu' => 'Social Menu',
			'sidebar-menu' => 'Sidebar Menu'
		)
	);
}
add_action( 'init', 'register_menus' );

function register_widgets(){

	register_sidebar( array(
		'name' => __( 'Sidebar' ),
		'id' => 'main-sidebar',
		'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</li>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

}//end register_widgets()
add_action( 'widgets_init', 'register_widgets' );


//Page Slug Body Class
function add_slug_body_class( $classes ) {
	global $post;
	if ( isset( $post ) ) {
	$classes[] = $post->post_type . '-' . $post->post_name;
	}
	return $classes;
}
add_filter( 'body_class', 'add_slug_body_class' );


function singleRepeaterField( $fieldname, $subfield ) {

	if(get_field($fieldname))
	{
		echo '<ul>';
	 
		while(has_sub_field($fieldname))
		{
			echo '<li>' . get_sub_field($subfield) . '</li>';
		}
	 
		echo '</ul>';
	}
}
function linkRepeaterField( $fieldname, $linkfield, $textfield, $className ) {

	if(get_field($fieldname))
	{
		
	 	$total =  count(get_field($fieldname));
	 	$c = 1;
		while(has_sub_field($fieldname))
		{
			$c++;
			if($c == $total):
				$comma = ',';
			else:
				$comma = '';
			endif;
			
			echo '<a href="'.get_sub_field($linkfield).'">' . get_sub_field($textfield) . '</a>'.$comma.'&nbsp;&nbsp;';
		}
	 
		
	}
}


