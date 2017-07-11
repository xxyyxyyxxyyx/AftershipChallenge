'use strict';

process.env.NODE_ENV = 'test';

// Dependencies
const geocode = require('../geocode/geocode');
const expect = require('expect');

describe('Test Geocode', function () {
	it('should return an an object of latitude and longitude', function (done) {
		const address = 'Wanchai Hong Kong';
		geocode.geocode_address(address, function (err, res) {
			expect(res).toBeA('object').toIncludeKeys(['latitude', 'longitude']);
			done();
		});
	});
});
