'use strict';

// Initialize variables
let map;
let markers = [];
let locations = [];
let movieDetails = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 37.7749, lng: -122.4194 },
		zoom: 12
	});


	let largeInfoWindow = new google.maps.InfoWindow();
	let bounds = new google.maps.LatLngBounds();

	// Add marker and listener for each location 
	for (let i = 0; i < locations.length; i++) {
		let position = locations[i];
		let movie = movieDetails[i];

		let marker = new google.maps.Marker({
			position: position,
			movie: movie,
			animation: google.maps.Animation.DROP,
			id: i
		});

		markers.push(marker);
		bounds.extend(marker.position);
		marker.addListener('click', function () {
			console.log()
			populateInfoWindow(this, largeInfoWindow);
		});
	}

	// Populate marker pop up window with information
	function populateInfoWindow(marker, infoWindow) {
		infoWindow.marker = marker;
		infoWindow.setContent('<div><b> Movie Title: </b>' + marker.movie.title + '</div>' +
			'<div><b> Directed By: </b>' + marker.movie.director + '</div>' +
			'<div><b> Location: </b>' + marker.movie.locations + '</div>' +
			'<div><b> Casts: </b>' + (marker.movie.actor_1 !== undefined ? marker.movie.actor_1 + ', ' : '') +
			(marker.movie.actor_2 !== undefined ? marker.movie.actor_2 : '') +
			(marker.movie.actor_3 !== undefined ? ', ' + marker.movie.actor_3 : '') + '</div>' +
			'<div><b> Written By: </b>' + marker.movie.writer + '</div>' +
			(marker.movie.fun_facts !== undefined ? '<div><b> Fun Facts: </b>' + marker.movie.fun_facts + '</div>' : ''));

		infoWindow.open(map, marker);

		infoWindow.addListener('closeClick', function () {
			infoWindow.setMarker(marker);
		});
	}
	// Set custom zoom if there is only one marker
	if (markers.length === 1) {
		markers[0].setMap(map);
		map.setCenter(markers[0].position);
		map.setZoom(14);
	}
	else {
		for (let j = 0; j < markers.length; j++) {
			markers[j].setMap(map);
			bounds.extend(markers[j].position);
			map.fitBounds(bounds);
		}
	}
}
