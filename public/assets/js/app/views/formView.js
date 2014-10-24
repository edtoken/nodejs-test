define([
		'jquery',
		'underscore',
		'backbone'
	], function(
		$,
		_,
		Backbone
	) {

		var FormView = Backbone.View.extend({

			el:document.getElementById('formParseUrl'),

			initialize:function(){
				var self = this;
				this.errorsBlock = $('.errors_block');
				this.resultBlock = $('.results_block');
			},

			events:{
				'submit':'submitForm'
			},

			renderError:function(text){
				var $message = $('<p class="error">'+text+'</p>');
				this.errorsBlock.append($message);
				setTimeout(function() {
					$message.remove();
				}, 2000);

			},

			submitForm:function(e){

				e.preventDefault();
				var self = this;
				this.$el.removeClass('error');
				this.$el.addClass('preload');
				this.resultBlock.val('');

				var data = this.$el.serializeArray();

				if(this.$el.find('input[name="savetofile"]').is(':checked')){
					self.$el.removeClass('preload');
					document.location.href = '/agregateresultfile?'+this.$el.serialize();
					return;
				}

				$.ajax({
					url: '/agregateresult',
					type: 'GET',
					data:data,
					success:function(d){

						self.$el.removeClass('preload');

						if(d.error){
							self.renderError(d.message);
						}else{
							self.resultBlock.val(d.data);
						}

					},
					error:function(){
						self.$el.removeClass('preload');
						self.renderError('unknow error');
						self.$el.addClass('error');
					}
				});

			}

		});

		return FormView;
	}
);