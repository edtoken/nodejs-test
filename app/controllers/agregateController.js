'use strict';

var fs = require('fs');
var _ = require('underscore');

var AgregateModelClass = require('../models/agregateModel');

/**
 * index route
 * @param req
 * @param res
 */
exports.index = function(req, res) {

	var AgregateModel = new AgregateModelClass(req.query);
	AgregateModel.getCSVSTR(function(result){
		res.json(result);
	});

	return;
};

/**
 * save file route
 * @param req
 * @param res
 */
exports.savefile = function(req, res) {

	var AgregateModel = new AgregateModelClass(req.query);
	AgregateModel.getCSVSTR(function(result){
		if(result.error){
			res.send(result.message);
		}
		res.setHeader('Content-disposition', 'attachment; filename=output.csv');
		res.setHeader('Content-type', 'text/csv');
		res.charset = 'UTF-8';
		res.send(result.data);

	});

};
