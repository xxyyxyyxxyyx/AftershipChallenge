'use strict';

process.env.NODE_ENV = 'test';

// Dependencies
const request = require('supertest');
const expect = require('expect');
const app = require('./../app');
const Movie = require('../models/movies');
const movie_controller = require('../controller/movie_controller');

describe('Test Database Initialization', function () {
	// Clear database
	before(function (done) {
		Movie.remove({}).then(function (err) {
			done();
		});
	});
	// Populate Database
	it('should populate database from remote json file', function (done) {
		this.timeout(100000);
		const URL = 'https://data.sfgov.org/resource/wwmu-gmzc.json';
		movie_controller.populate_database(URL, function (err, res) {
			Movie.find().then(function (records) {
				expect(records.length).toNotBe(0);
				done();
			});
		});
	});
});

describe('Test Database', function () {

	it('should update database records for the title with geocode values', function (done) {
		// The chosen title has 4 records asscoiated with it
		let title = 'A Night Full of Rain';
		request(app)
			.post('/')
			.send({ search: title })
			.expect(200)
			.expect(function (res) {
				// Check if the the title of the returned result matches
				expect(res.body.movieDetails[0].title).toBe(title);
			})
			.end(function (err, res) {
				if (err) {
					return done(err);
				}
				// Check if the records for 
				Movie.find({ title: title }).then(function (records) {
					expect(records.length).toBe(4);
					expect(records[0].geocode).toIncludeKeys(['lat', 'lng']);
					done();
				}).catch(function (err) {
					done(err);
				});
			});
	});

	it('should find movie titles starting with the given string', function (done) {
		// There are 9 movie titles starting with letter 'a'
		let starting_string = 'a';
		request(app)
			.get(`/titles/${starting_string}`)
			.expect(200)
			.expect(function (res) {
				expect(res.body.length).toBe(9);
			})
			.end(done);
	});


});
