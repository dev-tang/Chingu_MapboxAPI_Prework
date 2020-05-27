//GEOJSON FEATURES
mapboxgl.accessToken = 'pk.eyJ1IjoicG90YXRvYnVybnMiLCJhIjoiY2thYWg5aG90MDIxYjJzbzEzcjV5emJydiJ9.JQxucnVy4mrRmzcLH0K0bw';
var places = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			properties: {
				title: 'Caffe Bene',
				description: 'Open-Late Coffeeshop',
			},
			geometry: {
				coordinates: [-118.309302, 34.063064],
				type: 'Point',
			},
			id: '028ac67e4b4878cebec73c7557131aeb',
		},
		{
			type: 'Feature',
			properties: {
				title: 'Beer Belly',
				description: 'A local Pub',
			},
			geometry: {
				coordinates: [-118.308532, 34.064366],
				type: 'Point',
			},
			id: '36c95384d6aaf2187d5e9f291afd747a',
		},
		{
			type: 'Feature',
			properties: {
				title: "Monty's Good Burger",
				description: 'A Family-Friendly Vegan Burger Joint',
			},
			geometry: {
				coordinates: [-118.308883, 34.064775],
				type: 'Point',
			},
			id: '9a643f29e26150a0fd0ec958fa500973',
		},
		{
			type: 'Feature',
			properties: {
				title: 'I Love Boba',
				description: 'a local boba shop',
			},
			geometry: {
				coordinates: [-118.308912, 34.064292],
				type: 'Point',
			},
			id: 'd8059df45afdaa56665903aa9c0bd81a',
		},
		{
			type: 'Feature',
			properties: {
				title: 'The Wiltern Theatre',
				description: 'Popular Venue for Events and Concerts',
			},
			geometry: {
				coordinates: [-118.308567, 34.061274],
				type: 'Point',
			},
			id: 'f2aa8e47ad082eade5a0ca1cde2477a1',
		},
	],
};

//////////////////////////////

const locationList = document.getElementById('locationList');
const searchBar = document.getElementById('searchBar');
let locations = [];

searchBar.addEventListener('keyup', (e) => {
	const searchString = e.target.value.toLowerCase();
	const filteredLocations = locations.filter((location) => {
		var yo = location.properties.title.toLowerCase().includes(searchString);
		return yo;
	});
	displayCharacters(filteredLocations);
});

const loadCharacters = async () => {
	try {
		locations = places.features;
		displayCharacters(locations);
	} catch (err) {
		console.error(err);
	}
};

const displayCharacters = (characters) => {
	const htmlString = characters
		.map((location) => {
			return `
            <li class="character">
                <h2>${location.properties.title}</h2>
            </li>
        `;
		})
		.join('');
	locationList.innerHTML = htmlString;
};

loadCharacters();

///////////////////////

var layerIDs = []; // Will contain a list used to filter against.
var filterInput = document.getElementById('searchBar');
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/potatoburns/ckaahqrjq121g1imgln6x2rc5',
	center: [-118.308792, 34.063164],
	zoom: 16.5,
});

map.on('load', function () {
	map.loadImage('https://i.imgur.com/MK4NUzI.png', function (error, image) {
		if (error) throw error;
		map.addImage('marker_icon', image);
		map.addSource('places', {
			type: 'geojson',
			data: places,
		});

		places.features.forEach(function (feature) {
			var symbol = feature.properties['title'];
			var layerID = symbol;

			// Add a layer for this symbol type if it hasn't been added already.
			if (!map.getLayer(layerID)) {
				map.addLayer({
					id: layerID,
					type: 'symbol',
					source: 'places',
					layout: {
						'icon-image': 'marker_icon',
						'icon-size': 1,
					},
					filter: ['==', 'title', symbol],
				});

				layerIDs.push(layerID);
			}
		});

		filterInput.addEventListener('keyup', function (e) {
			layerIDs.forEach(function (layerID) {
				var value = e.target.value.toLowerCase();
				map.setLayoutProperty(
					layerID,
					'visibility',
					layerID.toLowerCase().includes(e.target.value.toLowerCase()) ? 'visible' : 'none'
				);
			});
		});
	});

	// add markers to map
	places.features.forEach(function (marker) {
		// create a HTML element for each feature

		var el = document.createElement('div');
		el.className = 'marker';

		new mapboxgl.Marker(el)
			.setLngLat(marker.geometry.coordinates)
			.setPopup(
				new mapboxgl.Popup({ closeOnMove: true, closeButton: false, offset: 25 }) // add popups
					.setHTML(' <h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p> ')
					.trackPointer()
			)

			.addTo(map);
	});
});

///////////////

/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function myFunction() {
	var x = document.getElementById('container');
	if (x.style.display === 'block') {
		x.style.display = 'none';
	} else {
		x.style.display = 'block';
	}
}
