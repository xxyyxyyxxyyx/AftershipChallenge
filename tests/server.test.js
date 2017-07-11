'use strict';

process.env.NODE_ENV = 'test';

const request = require('supertest');
// const rewire = require('rewire');
const expect = require('expect');
const app = require('./../app');

// const path = require('path');
// let template = {
// 	compile: expect.createSpy()
// };
// app.__set__('hbs', template);
describe('Test Server', function () {
	describe('GET /', function () {
		it('should render index.hbs with status code 200', function (done) {
			request(app)
				.get('/')
				.expect(200)
				// .expect(function (res) {
				// 	expect(template.compile).toHaveBeenCalled();//With(path.join(__dirname, '../views/index.hbs'));
				// })
				.end(done);
		});
	});

	describe('POST /', function () {
		it('should return an object of geocodes and movieDetails', function (done) {
			request(app)
				.post('/')
				.expect(200)
				.expect(function (res) {
					expect(res.body).toBeA('object').toIncludeKeys(['geocodes', 'movieDetails']);
				})
				.end(done);
		});
	});

	describe('GET /Ttitle/:title', function () {
		it('should return an array of movie titles starting with the given substring', function (done) {
			let starting_string = 'a';
			request(app)
				.get(`/titles/${starting_string}`)
				.expect(200)
				.expect(function (res) {
					expect(res.body).toBeA('array');
					expect(res.body.length).toBe(9);
					expect(res.body[0]).toContain('A Night Full of Rain');
				})
				.end(done);
		});
	});
});
