'use strict';

// Dependencies
const Movie = require('../models/movies');
const axios = require('axios');
const geocode = require('../geocode/geocode');
const path = require('path');
const logger = require('../logger');

// API endpoint for San Francisco film locations data
const URL = 'https://data.sfgov.org/resource/wwmu-gmzc.json';

// Searches for queried movie from the database, gets the geocode from the database if available
// or makes a call to geocode api to get the coordinates
exports.search = function (req, res) {
	const SEARCHED_ITEM = req.body.search;
	logger.info(`Getting locations for movie title '${SEARCHED_ITEM}'`);
	Movie.find({ title: SEARCHED_ITEM }, function (err, movies) {
		const GEOCODES = [];
		// Variable for monitoring end of locations to be queried
		let length = movies.length;
		movies.forEach(function (location) {
			// Gets geocode from database
			if (location.geocode !== undefined) {
				logger.debug(`Getting geocode from database for '${location.locations}'`);
				GEOCODES.push(location.geocode);
			}
			else {
				// Gets geocode from google apis
				logger.warn(`Getting geocode from google api for '${location.locations}'`);
				// Concatenating SF 415 for more accurate results
				geocode.geocode_address(location.locations + ' SF 415', function (error, results) {
					if (error) {
						logger.error(error, location.locations);
						length--;
					}
					else {
						Movie.update({ _id: location._id }, { geocode: { lat: results.latitude, lng: results.longitude } }, function (err) {
							if (err) {
								logger.error(err);
							}
							else {
								logger.debug(`Updated ${location.locations} with geocode values`);
							}
						});
						GEOCODES.push({
							lat: results.latitude,
							lng: results.longitude
						});
					}
					// Check whether all locations have been updated
					if (GEOCODES.length === length) {
						res.send({
							geocodes: GEOCODES,
							movieDetails: movies
						});
					}
				});
			}
		});
		// Check whether all locations have been updated
		if (GEOCODES.length === length) {
			res.send({
				geocodes: GEOCODES,
				movieDetails: movies
			});
		}
	});
};

// Finds the list of directors from the database ( test feature)
exports.find_directors = function (req, res) {
	const REG_EXP = new RegExp('^' + req.query.query);
	Movie.find({ director: { $regex: REG_EXP, $options: 'i' }, locations: { '$exists': false } }).distinct('director', function (err, data) {
		res.send(data);
	});
};

// Finds the list of movie titles from the database
exports.find_titles = function (req, res) {
	const REG_EXP = new RegExp('^' + req.params.title);
	Movie.find({ title: { $regex: REG_EXP, $options: 'i' }, locations: { '$exists': true } }).distinct('title', function (err, data) {
		logger.info(`Getting auto complete results for '${req.params.title}'`);
		res.send(data);
	});
};

// Helper function for populating database
const populate_database = function (url, callback) {
	axios.get(url)
		.then(function (response) {
			logger.warn('Creating database collection from remote source');
			Movie.insertMany(response.data, function (error, result) {
				callback(undefined, result);
			});
		})
		.catch(function (error) {
			logger.error(error);
		});
};
// Populates database from remote on a daily basis 
exports.create = function (req, res) {
	let today = new Date().toDateString();
	Movie.find({}, function (err, results) {
		// Check if database is already populated
		if (results.length !== 0) {
			// Check if the records were created today
			if (results[0]._id.getTimestamp().toDateString() === today) {
				logger.info('Database already configured');
				res.render('index');
			}
			else {
				// Remove old database records
				Movie.remove({}, function (err, result) {
					logger.warn('Removed outdated collection from database');
				});
				populate_database(URL, function (err, result) {
					res.render('index', result);
				});
			}
		}
		else {
			populate_database(URL, function (err, result) {
				res.render('index', result);
			});
		}
	});
};
// Exporting helper function for unit testing
exports.populate_database = populate_database;