jQuery(document).ready(function($) {
	var content = [];
	var blogs = [
	'http://historyofthebanjo.tumblr.com/api/read/json?num=1', 
	'http://kalakalaperiscope.tumblr.com/api/read/json?num=1',
	'ttp://kalakalalightbox.tumblr.com/api/read/json?num=1',
	'http://makeyourslikemine.tumblr.com/api/read/json?num=1',
	'http://kalakalaeveningredness.tumblr.com/api/read/json?num=1'];
	

	function getTumblrPosts(blogs) {
		$.each(blogs, function(key, url) {
			console.log(url);
		
			$.ajax({
				url: url,
				dataType: 'jsonp'
			}).done(function(data){
				//console.log(data);
				//console.log(data.posts[0]);
				content.push(data.posts[0]);
	
			});
	
		});
		
	}


	$.when(getTumblrPosts(blogs)).done(function(){
		console.log(content);
	});

	

});