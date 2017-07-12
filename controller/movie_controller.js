'use strict';

// Dependencies
const Movie = require('../models/movies').movie;
const Temp = require('../models/movies').temp;
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
		// Arrays for stroing movies and their geocodes
		const GEOCODES = [];
		const MOVIES = [];
		// Variable for monitoring end of locations to be queried
		let length = movies.length;
		movies.forEach(function (movie, index) {
			// Gets geocode from database 
			if (movie.geocode !== undefined) {
				logger.debug(`Getting geocode from database for '${movie.locations}'`);
				GEOCODES.push(movie.geocode);
				MOVIES.push(movie);
			}
			else {
				// Set timeout for successive call to google api
				setTimeout(function () {
					// Gets geocode from google apis
					logger.warn(`Getting geocode from google api for '${movie.locations}'`);
					// Concatenating SF 415 for more accurate results
					geocode.geocode_address(movie.locations + ' SF 415', function (error, results) {
						if (error) {
							logger.error(error, movie.locations);
							length--;
						}
						else {
							Movie.update({ _id: movie._id }, { geocode: { lat: results.latitude, lng: results.longitude } }, function (err) {
								if (err) {
									logger.error(err);
								}
								else {
									logger.debug(`Updated ${movie.locations} with geocode values`);
								}
							});
							GEOCODES.push({
								lat: results.latitude,
								lng: results.longitude
							});
							MOVIES.push(movie);
						}
						// Send the result to the frontend
						if (GEOCODES.length === length) {
							res.send({
								geocodes: GEOCODES,
								movieDetails: MOVIES
							});
						}
					});
				}, 200 * (index));
			}
		});
		// Send the result to the frontend
		if (GEOCODES.length === length) {
			res.send({
				geocodes: GEOCODES,
				movieDetails: MOVIES
			});
		}
	});
};

// Finds the list of directors from the database ( test feature not implemented)
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

// Helper function for updating database from remote source
const update_database = function (url, callback) {
	axios.get(url)
		.then(function (response) {
			logger.warn('Creating temp collection from remote source');
			Temp.insertMany(response.data, function (err, temp) {
				logger.info('Created temp collection successfully');
				// Find all distinct titles in old collection
				Movie.distinct('title', function (err, movieTitles) {
					// Find all distinct titles in new collection
					Temp.distinct('title', function (err, tempTitles) {
						// Get the list of new titles
						let filtered = tempTitles.filter(function (title) {
							return movieTitles.indexOf(title) < 0;
						});
						// Call callback if no new records
						if (filtered.length === 0) {
							logger.info('No new updates');
							callback(undefined, tempTitles);
						}
						else {
							// For each new title, find the entries in new collection and insert it into old collection
							filtered.forEach(function (title) {
								Temp.find({ title: title }, function (err, res) {
									Movie.collection.insert(res, function (err, res) {
										callback(undefined, res);
									});
								});
							});
						}
					});
				});
			});
		})
		.catch(function (error) {
			logger.error(error);
		});
};

// Populates database from remote API endpoint on a daily basis 
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
				update_database(URL, function (err) {
					logger.warn('Removing temporary collection');
					Temp.remove({}, function () {
						res.render('index');
					});
				});
			}
		}
		else {
			populate_database(URL, function (err) {
				res.render('index');
			});
		}
	});
};

// Exporting helper function for unit testing
exports.populate_database = populate_database;
exports.update_database = update_database;
