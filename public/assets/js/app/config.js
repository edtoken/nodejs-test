define(function(){
	
	var cfg = {
		"paths": {
			"plugins":"../plugins",
			"appdir":"./",
			"jquery":"/assets/js/lib/jquery-1.11.1",
			"underscore":"../lib/underscore",
			"backbone":"../lib/backbone",
			"templates":"../../templates",
			"text":"../lib/text"
		},

		"shim": {

			"underscore":{
				"deps":["jquery"],
				"exports":"_"
			},
			
			"backbone":{
				"deps":["underscore"],
				"exports":"Backbone"
			}
		},

		"waitSeconds":200
	};

	return cfg;
});