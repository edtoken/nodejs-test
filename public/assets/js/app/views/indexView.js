define([
		'jquery',
		'underscore',
		'backbone',
		'views/formView'
	], function(
		$,
		_,
		Backbone,
		FormView
	){
		var IndexView = Backbone.View.extend({

			el:$('body'),

			initialize:function(){
				var self = this;
				this.children = {};

				$(document).ready(function(){
					self.render();
				});
			},

			render:function(){
				this.children.formView = new FormView({parent:this});
			}

		});

		return IndexView;
	}
);