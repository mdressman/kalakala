<?php
/*
Template Name: The Goods
*/?>

<?php get_header(); ?>
<?php if (is_page()): the_post() ?>

		<script type="text/javascript">
		function outputBlogContent(tumblr_api_read) {
			if (tumblr_api_read['posts'][0]['type'] == 'photo') {
				document.write(
					'<a href="' + tumblr_api_read['posts'][0]['url'] + '"><ol class="tumblr_posts"><li class="tumblr_post tumblr_photo_post">' +
					'<img class="tumblr_photo" src="' + tumblr_api_read['posts'][0]['photo-url-1280'] + '" /></a>' +	
					'<div class="tumblr_caption">' + 
					tumblr_api_read['posts'][0]['photo-caption'] + 
					'</div></li></ol>'
				);
			} else if (tumblr_api_read['posts'][0]['type'] == 'audio') {
				document.write(
					'<ol class="tumblr_posts"><li class="tumblr_post tumblr_audio_post">' +
					'<div class="tumblr_audio">' + tumblr_api_read['posts'][0]['audio-player'] + '</div>' +	
					'<div class="tumblr_caption">' + 
					tumblr_api_read['posts'][0]['audio-caption'] + 
					'</div></li></ol>'
				);
			} else if (tumblr_api_read['posts'][0]['type'] == 'regular') {
				var bodyContent = tumblr_api_read['posts'][0]['regular-body'];
				var firstParagraph = $(bodyContent).find('p').first().text();
				var firstImage = $(bodyContent).find('img:first').attr('src');
				var postImageSrc = '';
				var postParagraph = '';
				if (firstImage){
					postImageSrc = '<a href="' + tumblr_api_read['posts'][0]['url'] + '"><img class="tumblr_photo" src="' + firstImage + '" /></a>';
				}

				if (firstParagraph) {
					postParagraph = '<p>'+ firstParagraph + '</p>';
				}

				document.write(
					'<ol class="tumblr_posts"><li class="tumblr_post tumblr_photo_post">' +
					postImageSrc +	
					'<div class="tumblr_title">' + 
					tumblr_api_read['posts'][0]['regular-title'] +
					'</div></li></ol>'
				);
			} else if (tumblr_api_read['posts'][0]['type'] == 'link') {
				document.write('<div class="blogTitle">' + tumblr_api_read['posts'][0]['link-title'] + '</div>');
				document.write('<div class="blogText">' + tumblr_api_read['posts'][0]['link-description'] + '</div>');
				document.write('<div class="blogText">' + tumblr_api_read['posts'][0]['link-url'] + '</div>');
			} else if (tumblr_api_read['posts'][0]['type'] == 'video') {
				document.write(
					'<ol class="tumblr_posts"><li class="tumblr_post tumblr_video_post">' +
					'<div class="tumblr_video">' + tumblr_api_read['posts'][0]['video-player'] + '</div>' +	
					'<div class="tumblr_caption">' + 
					tumblr_api_read['posts'][0]['video-caption'] + 
					'</div></li></ol>'
				);
			} else {
				document.write('<div class="blogText">whoops.</div>');	
			}
		}
		</script>
		
	    <section id="goods" class="whiteBG">
	    	<div class="bigPad">
	    		<div class="section__Title">
	    			<h1 class="titleContainer">
	    				<span><?php the_title(); ?></span>
	    			</h1>
	    			<div class="subHeading"><?php the_content(); ?></div>
	    		</div>
	    		<div class="tumblrBlog alpha" id="pickings">
	    			<div class="logoColumn"><a target="_blank" href="http://historyofthebanjo.tumblr.com/" class="b_logo"></a></div>
	    			<script type="text/javascript" src="http://historyofthebanjo.tumblr.com/api/read/json?num=1"></script>
	    			<script type="text/javascript">
	    				outputBlogContent(tumblr_api_read);
	    			</script>
	    		</div>
	    		<div class="tumblrBlog" id="periscope">
	    			<div class="logoColumn"><a target="_blank" href="http://kalakalaperiscope.tumblr.com" class="b_logo"></a></div>
	    			<script type="text/javascript" src="http://kalakalaperiscope.tumblr.com/api/read/json?num=1"></script>
					<script type="text/javascript">
	    				outputBlogContent(tumblr_api_read);
	    			</script>
	    		</div>
	    		<div class="tumblrBlog" id="lightbox">
	    			<div class="logoColumn"><a target="_blank" href="http://kalakalalightbox.tumblr.com/" class="b_logo"></a></div>
	    			<script type="text/javascript" src="http://kalakalalightbox.tumblr.com/api/read/json?num=1"></script>
	    			<script type="text/javascript">
		    			outputBlogContent(tumblr_api_read);
	    			</script>
	    		</div>
	    		<div class="tumblrBlog" id="makeyourslikemine">
	    			<div class="logoColumn"><a target="_blank" href="http://makeyourslikemine.tumblr.com/" class="b_logo"></a></div>
	    			<script type="text/javascript" src="http://makeyourslikemine.tumblr.com/api/read/json?num=1"></script>
	    			<script type="text/javascript">
		    			outputBlogContent(tumblr_api_read);
	    			</script>
	    		</div>
	    		<div class="tumblrBlog" id="eveningredness">
	    			<div class="logoColumn"><a target="_blank" href="http://kalakalaeveningredness.tumblr.com/" class="b_logo"></a></div>
	    			<script type="text/javascript" src="http://kalakalaeveningredness.tumblr.com/api/read/json?num=1"></script>
	    			<script type="text/javascript">
		    			outputBlogContent(tumblr_api_read);
	    			</script>
	    		</div>


	    	</div>
	    	
	    </section>
	
<?php endif; ?>
<?php get_footer(); ?>