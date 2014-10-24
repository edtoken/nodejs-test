define([
		'jquery',
		'underscore',
		'backbone',
		'views/indexView'
	], function(
		$,
		_,
		Backbone,
		indexView
	) {

		/**
		 * parent app object
		 * @type {{views: {}}}
		 */
		var App = {
			views:{}
		};

		App.initialize = function(){
			App.views.index = new indexView({app:App});
		};

		return App;
	}
);