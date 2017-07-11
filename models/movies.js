'use strict';

// Dependencies
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Creating schema 
const MovieSchema = new mongoose.Schema({
	actor_1: String,
	actor_2: String,
	actor_3: String,
	director: String,
	distributor: String,
	fun_facts: String,
	locations: String,
	production_company: String,
	release_year: String,
	title: String,
	writer: String,
	geocode: Object
});

module.exports = mongoose.model('Movie', MovieSchema);
