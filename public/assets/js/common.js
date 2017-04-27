requirejs.config({
	"baseUrl": "assets/js",
	"paths": {
		"jquery": [
			"//ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min",
			//if the CDN location fails, load from local directory
			"js/vendor/jquery-1.12.0.min"
		],
		"jquery-ui": ["//code.jquery.com/ui/1.11.4/jquery-ui"],
		"bootstrap": ["js/vendor/bootstrap.min"]
	}
});
