
// data from JSON file
var data;
var day=1,starttime,endtime=3600;
// scale up for map
var scale = 4;
// setInterval timer for refreshGraph
var animaiton_timer = null;
// set same color for each id instead of random color
var checkTable = [];
// used by filter to get the data of one minute, starting for "offset=lowerBound"
// set the value of lowerBound to change the data interval
// for example, see function addLowerBound(). No need to change other codes to set data interval
var lowerBound = 32400.0;
// begin date. Used for showing date information
var beginDate = new Date('2016-5-31');
// array for robot route coordinates and index of previous floor number
var routes = [], floorIndex = 1;
// boolean indicate the state of animation
var finished = false;

// Ajax for data
function loadJSON(callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'building_json/mobile.json', true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}
$("#clear").click(function(){
	d3.selectAll("circle").data([]).exit().remove();
	d3.selectAll("path").data([]).exit().remove();
	d3.selectAll("image").data([]).exit().remove();
	d3.selectAll("rect").data([]).exit().remove();
	console.log("clear");
	routes = [];
});
// start animaiton_timer
function startAnimation() {
	if (animaiton_timer == null && finished != true)
		animaiton_timer = setInterval('refreshGraph()', 200);
}
// pause animaiton_timer
function pauseAnimation() {
	if (animaiton_timer != null)
		clearInterval(animaiton_timer);
	animaiton_timer = null;
}

// adding 23 hours to the data interval's starting point 
var addLowerBound = function() {
	lowerBound += 1380 * 60;
}
// generate a unique color for each prox card
function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
var decideColor = function(proxCard){
	for (var i = 0; i < checkTable.length; i++ ){
		if (checkTable[i].proxCard == proxCard){
			return checkTable[i].color;
		}
	}
	var newColor = getRandomColor();
	checkTable.push({proxCard:proxCard, color:newColor});
	return newColor;
};

// Data Filter. Return data of one minute, starting from lowerBound
var dataSlice = function(data,lowerBound){
	var timeInterval = function(value){
		return (value.offset >= lowerBound)
		&& (value.offset < lowerBound + 60.0);
	};
	return data.filter(timeInterval);
};

// Coordinates functions. Mapping the mobile.json data to SVG coordinates
var getX = function(d) {
    if(d.message.floor == "1"){
        return (d.message.X * scale);
    }
    else if(d.message.floor == "2" || d.message.floor == "3" ){
        return (d.message.X * scale + 756);
    }
};
var getY = function(d) {
    if(d.message.floor == "1" || d.message.floor == "2"){
        return (111 - d.message.Y) * scale;
    }
    else if(d.message.floor == "3"){
        return (111 - d.message.Y) * scale + 444;
    }
};

// Calculating the supposing position of the robot.
// return an array of coordinates in the SVG Canvas
var getAndroidIconPosition = function(data) {
	var x = 0, y = 0;
	for (var i = 0; i < data.length; i++) {
		x += getX(data[i]);
		y += getY(data[i]);
	}
	x = Math.floor(x/data.length);
	y = Math.floor(y/data.length);
	return [x, y,data[0].message.datetime];
};

$("#rodbtn").click(function(){
	console.log(routes);
	var routobj = [];
	for(let i=0;i<routes.length;i++){
		var temp = {
			"x":routes[i][0],
			"y":routes[i][1],
			"time": routes[i][2]
		};
		routobj.push(temp);
	}
	var first = new Date(routobj[0].time).getTime()/1000 - (1464624000+32400+(day-1)*86400);
	var last = new Date(routobj[routes.length-1].time).getTime()/1000 - (1464624000+32400+(day-1)*86400);
	console.log("first"+first+"last"+last);
	var rodsvg = d3.select("#rod").append("svg").attr("width",1000).attr("height",40);
	var rod = rodsvg.selectAll("circle").data([]);
	rod.data(routobj).enter()
		.append("rect")
		.attr("id",function(d){
			return d.time;
		})
		.attr("width",5)
		.attr("height",20)
		.attr("fill","grey")
		.attr("opacity",0.5)
		.attr("x",function(d,i){
			//console.log(d);
			var date = new Date(d.time);
			var timestemp = date.getTime()/1000 - (1464624000+32400+(day-1)*86400);
			var position = (timestemp-first)/(last-first)*900;
			console.log(position);
			return position+10;
		})
		.attr("y",function(d,i){return 10;})
		.on("mouseover",function(d){
			d3.select("#robot").data([]).exit().remove();
			svg.append("circle").attr("fill","blue")
				.attr("id","robot")
				.attr("r",10)
				.attr("cx", d.x)
				.attr("cy", d.y);
		})
		.append("title").text(function(d){
		return d.time;
	});
});
// refreshGraph helper function
var refreshGraph = function() {
	// filtering the data to plot
	var data2Draw = dataSlice(data,lowerBound);

	// remove previous circles on the svg canvas
	svg.selectAll("circle").data([]).exit().remove();

	// plot only if data2Draw is not empty
	if (data2Draw.length > 0) {
		// changing map image dynamically
		var newFloorIndex = parseInt(data2Draw[0].message.floor);
		// robot switching to another floor
//		if (newFloorIndex != floorIndex) {
//			// clean the path of previous floor
//			svg.selectAll("path").data([]).exit().remove();
//			$("#mapImage").attr("src", "F" + newFloorIndex + ".jpg");
//			floorIndex = newFloorIndex;
//			routes = [];
//		}

		var circle = svg.selectAll("circle").data([]);
		var route = svg.selectAll("path").data([]);
		circle.data(data2Draw).enter()
		.append("circle")
		.attr("id",function(d) {return d.message.proxCard})
		.attr("r", 5)
		.attr("fill", function(d) {return decideColor(d.message.proxCard)})
		.attr("opacity", 0.4)
		.attr("cx", function(d) { return getX(d) })
		.attr("cy", function(d) { return getY(d) });

		// Generate the route of the andriod
		routes.push(getAndroidIconPosition(data2Draw));

		route.data([routes]).enter()
		.append("path")
		.attr("d", function(d) {
			var p = "M " + d[0][0] + "," + d[0][1]+ " ";
			for (var i = 1; i < d.length; i++) {
				p += "L " + d[i][0] + "," + d[i][1]+ " ";
			}
			return p;
		})
		.attr("stroke-width", "3")
		.attr("stroke", "red")
		.attr("stroke-opacity", "0.3")
		.attr("stroke-dasharray", "20,10,5,5,5,10")
		.attr("fill", "none");

		// create svg image of android icon at the end of each route
		svg.selectAll("image").data([]).exit().remove();
		var img = document.createElementNS('http://www.w3.org/2000/svg','image');
		img.setAttributeNS(null,'height','20px');
		img.setAttributeNS(null,'width','15px');
		img.setAttributeNS('http://www.w3.org/1999/xlink','href','pic/AndroidIcon.png');
		img.setAttributeNS(null,'x',routes[routes.length-1][0] - 6);
		img.setAttributeNS(null,'y',routes[routes.length-1][1] - 8);
		img.setAttributeNS(null, 'visibility', 'visible');
		$("svg").append(img);

		// end of plotting svg elements
	}

	// updating date information
	var tempDate = new Date(beginDate.getTime()+lowerBound*1000);
	$("#date").html(tempDate.toString().substring(0,21));

	// updating lowerBound and check if it reaches the end of data
	lowerBound += 60.0;
	if (lowerBound >= 1176960) {
		pauseAnimation();
		finished = true;
		console.log("The end of data ...");
	}

	// finish one refreshing cycle
};
$("#day_slider").rangeSlider({
	step: 100/14,
	formatter:function(val) {
		return Math.floor(val /7).toString();
	},
	defaultValues:{min: 0, max: 10}
});
$("#day_slider").bind("valuesChanged", function(e, date){
	console.log("Values just changed. min: " + date.values.min + " max: " + date.values.max);
	day = Math.floor(date.values.max/7);
	lowerBound=(day-1)*86400+endtime;
	//getMobileRoute();
});

$("#slider").rangeSlider({
	range: {min: 0, max: 86400},
	formatter:function(val){
		var hour = Math.floor(Math.round(val*864)/3600);
		var minite = Math.floor((val*864 - hour*3600)/60);
		return hour+":"+minite;
	},
	//step:10,
	defaultValues:{min: 0, max: 100/24},
	wheelMode: "scroll", wheelSpeed: 46.62,
	scales: [
		// Primary scale
		{
			first: function(val){ return val; },
			next: function(val){ return val+100/24; },
			stop: function(val){ return false; },
			label: function(val){ return Math.round(val*24)/100; },
			format: function(tickContainer, tickStart, tickEnd){
				tickContainer.addClass("myCustomClass");
			}
		}
	]
});
$("#slider").bind("valuesChanged", function(e, timedata){
	//console.log("Values just changed. min: " + Math.round(timedata.values.min*864) + " max: " + Math.round(timedata.values.max*864));
	//console.log(department);
	starttime = Math.round(timedata.values.min*864);
	//var start = starttime;
	endtime = Math.round(timedata.values.max*864);
	//var end = endtime;
	lowerBound=(day-1)*86400+endtime;
	routes = [];

});
$("#route").click(function(){
	var mobileroute = [];
	var mobiledept = [];
	var time =(day-1)*86400;
	//console.log(data);
	for(time;time<day*86400;time+=60){
		var tempdata = dataSlice(data,time);
		if(tempdata != 0){
			mobileroute.push(getAndroidIconPosition(tempdata));
		}
	}
	for(let i = 0; i<mobileroute.length-1;i++){
		if(mobileroute[i][0]==mobileroute[i+1][0] && mobileroute[i][1] == mobileroute[i+1][1]){
			mobiledept.push(mobileroute[i]);
		}
	}
	console.log(mobiledept);
	console.log(routes);
});
// init function
$(document).ready(function () {
	// Generate SVG ground
	svg = d3.select("#F1M").append("svg:svg")
	.attr("width", 756*2)
	.attr("height", 444*2)
	.attr("version","1.1")
	.attr("xmlns","http://www.w3.org/2000/svg")
	.attr("xmlns:xlink", "http://www.w3.org/1999/xlink");

	// requesting for local json data.
	// saved in data, with JSON format.
	// {
	//        "message": {
	//            "Y": "15",
	//            "datetime": "2016-06-13 14:56:00",
	//            "X": "174",
	//            "proxCard": "vlagos001",
	//            "type": "mobile-prox",
	//            "floor": "1"
	//        },
	//        "offset": 1176960.0
	//    },
	loadJSON(function(response) {
		data = JSON.parse(response);
	});

});