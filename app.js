'use strict';

// Dependencies
// ------------------------------------------------------
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const app = express();
const PORT = process.env.PORT || '3000';
const logger = require('./logger');
const mongoose = require('mongoose');
let hbs = require('hbs');


// Express Configuration
// ------------------------------------------------------------
// MongoDB connection setup
const MONGODB = 'mongodb://localhost/Movies';
mongoose.connect(MONGODB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middlewares setup
// Turn off morgan logging during testing
if (process.env.NODE_ENV !== 'test') {
	app.use(morgan('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// ----------------------------------------------------------
app.use('/', routes);

// Listen
// ----------------------------------------------------------
app.listen(PORT, function (err, res) {
	if (err) {
		logger.error(err);
		return;
	}
	logger.info('Listening on port: ', PORT);
});

module.exports = app;
