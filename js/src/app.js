import * as d3 from "d3";


function getFill(winner){
	const opacity = .5
	return winner == "trump" ? `rgba(255, 0, 0, ${opacity})` : `rgba(0, 0, 255, ${opacity})`;
}

function drawMap(dataSelection, data, map){
	console.log(`drawing map of ${dataSelection}`);

	const circleScale = '';

	// Draw boundaries

	let demoMap = d3.select(map).select('.map__container');
;

	const containerBox = demoMap.node().getBoundingClientRect(),
		height = containerBox.height,
		width = containerBox.width;



		demoMap = demoMap.append('svg')
			.attr( "width", width )
			.attr( "height", height )

		/*
		 * Uses method of generating projection by Bostock from this Stack Overflow question:	
		 * http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
		 */

		// Create a unit projection.
		var projection = d3.geoMercator()
			.scale(1)
			.translate([0, 0]);

		var midwestGeoPath = d3.geoPath().projection(projection);

		// Compute the bounds of a feature of interest, then derive scale & translate.
		var bounds = midwestGeoPath.bounds(data),
			dx = bounds[1][0] - bounds[0][0],
			dy = bounds[1][1] - bounds[0][1],
			x = (bounds[0][0] + bounds[1][0]) / 2,
			y = (bounds[0][1] + bounds[1][1]) / 2,
			s = 1 / Math.max(dx / width, dy / height),
			t = [width / 2 - s * x, (height / 2 - s * y)];
  			
		// Update the projection to use computed scale & translate.
		projection
			.scale(s)
			.translate(t);


		demoMap.append('g')
			.classed('counties', true)

		demoMap.append('g')
			.classed('circles', true);

		demoMap.select('.counties')
			.selectAll( "path" )
			.data(data.features)
			.enter()
				.append( "path" )
					.classed('midwest-map', true)
					.style('fill', '#e0e0e0')
					.style('stroke', '#ffffff')
					.style('stroke-width', 1)
					.attr( "d", midwestGeoPath)
					.each((d)=>{
						let centroid = d.properties.centroid_coordinates;
						let winner = d.properties.voting_clinton_trump;
						demoMap.select('.circles')
							.append('circle')
							.attr('cx', projection(centroid)[0])
							.attr('cy', projection(centroid)[1])
							.attr('r',10)
							.style('fill', getFill(winner));
					})

}

window.onload = function(){
	d3.json(`http://${window.ROOT_URL}/data/test-with-centroid.geojson`, (data) => {
		console.log(data);
		document.querySelectorAll('.map').forEach((map, idx)=>{
		let dataSelection = map.dataset.map;
		
		// This logic is just for byulding while the data remains out.
		// if (dataSelection != "x"){
			drawMap(dataSelection,data, map);
		// }

	})	
	})


}