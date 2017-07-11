'use strict';

// Dependencies
const request = require('request');

// Transcodes an address to geocode
const geocode_address = function (address, callback) {
	const URI = encodeURIComponent(address);
	request({
		url: `https://maps.googleapis.com/maps/api/geocode/json?address=${URI}`,
		json: true
	}, function (error, response, body) {
		if (error) {
			callback('Unble to connect to Google Server');
		}
		else if (body.status === 'ZERO_RESULTS') {
			callback('Unable to get any result for');
		}
		else if (body.status === 'OVER_QUERY_LIMIT') {
			callback('Query over limit');
		}
		else if (body.status === 'OK') {
			callback(undefined, {
				latitude: body.results[0].geometry.location.lat,
				longitude: body.results[0].geometry.location.lng
			});
		}
	});
};

module.exports.geocode_address = geocode_address;
