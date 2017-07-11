'use strict';

// Dependencies
const express = require('express');
const router = express.Router();
const movie_controller = require('../controller/movie_controller');

// Routes
router.post('/', movie_controller.search);
router.get('/', movie_controller.create);
router.get('/titles/:title', movie_controller.find_titles);

module.exports = router;

