//Global to store the temps
var temps;
var dates;

function makeD3Chart(dates, dataset){
	//Clear the container each time a new chart is made
	$('#container').html('');

	var w = $('#container').width();
	var h = 300;

	var barPadding = 2;


	var dataMin = d3.min(dataset, function(d){
		                   return d; });
	var dataMax = d3.max(dataset, function(d) {
		                   return d; });


  var colors = d3.scale.linear()
	               .domain([dataMin, dataMax])
								 .range(["#00e6e6", "#FFB3D9"]);

	var yScale = d3.scale.linear()
		.domain([dataMin, dataMax])
		.range([50,h - 50]);

	//Create SVG element
	var svg = d3.select('#container')
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	svg.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
			return i * (w / dates.length);
		})
		.attr("y", function(d) {
			//return h - d;
			return h - (yScale(d));
		})
		.attr("width", w / dates.length - barPadding)
		.attr("height", function(d) {
			//return d;
			return yScale(d);
		})
		.attr("fill", function(d){
			// var red = Math.min(Math.round(d), 255);
			// var color = 'rgb(' + red + ',20,80)';
			// return color;
			return colors(d);
		})

		// .attr("class", "rects")
		// .transition()
		// .attr("y", function(d){
		//  	return h - d;
		// })
		// .duration(5000);

		.on('click', function(d){
			console.log("The temp is " + d);
			d3.select(this)
				.transition()
				.attr("y", h)
				.attr("fill", "#00e6e6")
				.duration(1000)
				.transition()
				.attr("y", function(d) {
					//return h - d;
					return h - (yScale(d));
				})
				.attr("fill", function(d){
					// var red = Math.min(Math.round(d), 255);
					// var color = 'rgb(' + red + ',20,80)';
					// return color;
					return colors(d);
				});

		})

		.on('mouseover', function(d){
			d3.select(this)
				.style('opacity', .5)
		})
		.on('mouseout', function(d){
			d3.select(this)
				.style('opacity', 1)
		});


	svg.selectAll("text")
		.data(dataset)

		.enter()
		.append("text")

		.text(function(d) {
			return d.toString();
		})
		.attr("text-anchor", "middle")
		.attr("x", function(d, i) {
			return i * (w / dates.length) + (w / dates.length - barPadding) / 2;
		})
		.attr("y", function(d) {
			return h - d + 10;
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", "12px")
		.attr("fill", "blue");
}

function requestWeatherData(num){

	var weatherURL = 'http://api.openweathermap.org/data/2.5/forecast?id=524901&units=metric&cnt='+num;

	var weatherKEY = '&appid=' + 'f13376c2e0e2dd300fbbc29672653cd0';

	$.ajax({
		url: weatherURL + weatherKEY,
		type: 'GET',
		dataType: 'json',
		error: function(err){
			console.log(err);
		},
		success: function(data){
			// debugger;
			console.log(data);
			var days = data.list;
			//console.log(days);

			//Make an array with just the temps
			temps = _.map(days, function(day){
				return day.main.temp;
			});

			dates = _.map(days, function(day){
				//return day.main.temp_min;
				return day.dt;
			});
			console.log(dates);
			console.log(temps);
			makeD3Chart(dates,temps);
		}
	});
}

$(document).ready(function(){
	requestWeatherData(7);

	//Redraw on resize
	$(window).resize(function(){
		console.log("Resizing");
		makeD3Chart(dates,temps);
	});
});
