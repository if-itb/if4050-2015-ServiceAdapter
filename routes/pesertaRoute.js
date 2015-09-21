/**
 * Created by baharudinafif on 9/19/15.
 */
/*
 * Requirement
 * */
var express = require('express');

/*
 * Routes
 * */
var routes = function () {
	var route = express.Router();
	var controllers = require('../controllers/pesertaController')();

	/*
	 * Route Assignment
	 * */
	route.route('/').get(controllers.getPeserta);
	return route;
}

module.exports = routes;