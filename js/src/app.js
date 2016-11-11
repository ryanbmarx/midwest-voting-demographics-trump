import * as d3 from "d3";


function getFill(winner){
	const opacity = .25
	return winner == "trump" ? `rgba(193,27,23, ${opacity})` : `rgba(0,78,135, ${opacity * 1.2 })`;
}

function drawMap(dataSelection, data, map, dataType){
	console.log(`drawing map of ${dataSelection}`);

	// Define scale ... use SQRT b/c these are circles and it is their AREA which must scale, not the r
	const maxCircleSize = dataType == "pct" ? 15 : 40;

	const dmax = dataType == "pct" ? 1 : d3.max(data.features, d => {
		return parseFloat(d['properties'][dataSelection]);
	});

	const dmin = d3.min(data.features, d => {
		return parseFloat(d['properties'][dataSelection]);
	});

	const r = d3.scaleLinear() 
		.domain([0, dmax])
		.range([0, maxCircleSize]); 

	// Draw boundaries
	let demoMap = d3.select(map).select('.map__container');

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

		// These three <g> elements are created here so that they layer in the proper order.
		// I want the circles to be on top of the borders on top of the counties.
		
		demoMap.append('g')
			.classed('counties', true)

		demoMap.append('g')
			.classed('state-boundaries', true)

		demoMap.append('g')
			.classed('circles', true);

		demoMap.select('.counties')
			.selectAll( "path" )
			.data(data.features)
			.enter()
				// .append( "path" )
				// 	.classed('midwest-map', true)
				// 	.style('fill', function(d){
				// 		let winner = d.properties.clinton_trump;
				// 		// console.log(winner);
				// 		return '#e0e0e0';
				// 		return getFill(winner);
				// 	})
				// 	.style('stroke', '#ccc')
				// 	.style('stroke-width', 1)
				// 	.attr( "d", midwestGeoPath)
					.each((d)=>{
						let centroid = [d.properties.centroid_x, d.properties.centroid_y];
						let winner = d.properties.clinton_trump;
						let stat = d.properties[dataSelection];
						demoMap.select('.circles')
							.append('circle')
							.attr('cx', projection(centroid)[0])
							.attr('cy', projection(centroid)[1])
							.attr('r',function(){
								// console.log(d.properties.GEOID, stat, r(stat))	
								
								return r(parseFloat(stat));
							})
							.attr('data-county', `${d.properties.census_name}, ${d.properties.state}`)
							.attr('data-stat',stat)
							.style('fill', getFill(winner));
					})
		demoMap.select('.state-boundaries')
			.selectAll('path')
			.data(window.STATE_BOUNDARIES.features)
			.enter()
				.append('path')
					.style('fill', '#eee')
					.style('stroke', '#888')
					.style('stroke-width', 1)
					.attr( "d", midwestGeoPath)




}

window.onload = function(){
	d3.json(`http://${window.ROOT_URL}/data/state-boundaries.geojson`, data => {
		window.STATE_BOUNDARIES = data;
	})

	d3.json(`http://${window.ROOT_URL}/data/midwest-counties-with-centroid.geojson`, (data) => {
		console.log(data);
		document.querySelectorAll('.map').forEach((map, idx)=>{
		let dataSelection = map.dataset.map;
		let dataType = map.dataset.type;
		// This logic is just for byulding while the data remains out.
		// if (dataSelection != "x"){
			drawMap(dataSelection,data, map, dataType);
		// }

	})	
	})


}