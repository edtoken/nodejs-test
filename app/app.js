'use strict';

var express = require('express')
	, app = express()
	, cons = require('consolidate')

	, IndexController = require(__dirname + '/controllers/indexController')
	, AgregateController = require(__dirname + '/controllers/agregateController');


/**
 * routes
 */
app.get('/', IndexController.home);
app.get('/agregateresult', AgregateController.index);
app.get('/agregateresultfile', AgregateController.savefile);


app.engine('html',cons.underscore);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/../public/'));

module.exports = app;