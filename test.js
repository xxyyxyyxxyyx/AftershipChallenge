
// const mongoose = require('mongoose');
// const axios = require('axios');
const app = require('./app');
// const Movie = require('./models/movies').movie;
const Temp = require('./models/movies').temp;

// axios.get('https://data.sfgov.org/resource/wwmu-gmzc.json')
// 	.then(function (response) {
// 		Temp.insertMany(response.data, function (error, result) {
// 			console.log('done');
// 			Movie.distinct('title', function (err, result) {
// 				Temp.distinct('title', function (err, resultt) {
// 					var xxx = result.filter(function (title) {
// 						return resultt.indexOf(title) < 0;
// 					});
// 					xxx.forEach(function (title) {
// 						Movie.find({ title: title }, function (err, res) {

// 							Temp.collection.insert(res, function (err, res) {
// 								console.log('inserted');
// 							});
// 						});
// 					});
// 				});
// 			});
// 		});
// 	})
// 	.catch(function (error) {
// 		console.log(error);
// 	});
// // var array = [1,2,3,4];
// // var anotherOne = [2,4];
// // var filteredArray = array.filter(myCallBack);

// // function myCallBack(el){
// //   return anotherOne.indexOf(el) < 0;
// // }

// // console.log(filteredArray);
// persons = ['a', 'b', 'c'];
// persons.forEach(function (person, index) { // we add index param here, starts with 0
// 	//your code
// 	setTimeout(function () {
// 		console.log(index);
// 	}, 1000 * (index)) // or just index, depends on your needs

// }) 

const test_movie = {
	actor_1: 'sunil',
	actor_2: 'sunil',
	actor_3: 'sunil',
	director: 'sunil',
	distributor: 'sunil',
	fun_facts: 'sunil',
	locations: 'sunil',
	production_company: 'sunil',
	release_year: 'sunil',
	title: 'sunil',
	writer: 'sunil'
};
var test = new Temp(test_movie);
test.save(function(){
	console.log('saved');
});