require(['config'], function(cfg){

	require.config(cfg);
	
	require(['app'], function(App){
		App.initialize();
	});
});