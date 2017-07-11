'use strict';

$(document).ready(function () {
	// Initialize Google Map
	initMap();

	// Makes ajax request with the form data
	$('.movieForm').submit(function (event) {
		event.preventDefault();
		$.ajax({
			type: 'POST',
			data: { search: $('#search').val() }
		}).done(function (data) {
			// Reset google map markers
			markers = [];
			// Google map locations
			locations = data.geocodes;
			// Google map movie details
			movieDetails = data.movieDetails;
			initMap();
		});
	});

	// Typeahead autocomplete configuration
	const movie_title = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: '/titles/%QUERY',
			// url: '/titles?query=%QUERY',
			wildcard: '%QUERY'
		},
		limit: 20
	});

	$('#scrollable-dropdown-menu .typeahead').typeahead({
		highlight: true,
		limit: 20

	},
	{
		name: 'Title',
		source: movie_title,
		limit: 50
	});
});
