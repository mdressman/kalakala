require.config({
	"baseUrl": directory.path,
	"paths": {
		"jquery": "jquery/jquery"
	}
});

require(['jquery'], function($) {
	console.log('Working!!');
});
