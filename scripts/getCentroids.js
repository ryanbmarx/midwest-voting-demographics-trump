var turf = require('@turf/turf');
var fs = require('fs');


fs.readFile(`./data/test.geojson`, 'utf8', (err, data) => {
	if (err) throw err;
	const jsonData = JSON.parse(data);


	jsonData.features.forEach((feature, idx) => {
		feature.properties.centroid_coordinates = 	turf.centroid(feature).geometry.coordinates;
		// console.log(feature);

	})
	
	// console.log(jsonData.features[0]);

	fs.writeFile(`./data/test-with-centroid.geojson`, JSON.stringify(jsonData), (err) => {
		if(err) {
			return console.log(err.red.inverse);
		} else {
			return console.log('centroids found');
		}
	}); 
});