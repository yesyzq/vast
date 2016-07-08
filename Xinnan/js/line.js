/**
 * Created by Xinnan on 6/23/2016.
 */
// loading json file and setup global variable "data"
	function loadJSON() {
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', 'building_json/route.json', false);
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				window.data = JSON.parse(xobj.responseText);
			}
			else
				window.data = null;
		};
		xobj.send(null);
	}
	loadJSON();

	// setup parameters for svg
	var margin = {top: 40, right: 100, bottom: 130, left: 100},
	//margin2 = {top: 400, right: 100, bottom: 20, left: 100},
	width = 1920 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;
	//height2 = 600 - margin2.top - margin2.bottom;
	// generating dataset
	function generateDataset(start,end) {
		dataset = [];
		time = [], value_y = [];
		format = d3.time.format("%Y-%m-%d");
		var referenceDate = format.parse("2016-5-31").getTime();
//		beginDate = format.parse(document.getElementById("sd").value).getTime(),
//		endDate = format.parse(document.getElementById("ed").value).getTime();
		beginDate = referenceDate+start*86400*1000,
		endDate = referenceDate+end*86400*1000;

		for (var i=0;i<data.length;i++) {
			var tmp = [];
			for (var x in data[i].route){
				var zone = parseInt(data[i].route[x].zone);
				if (isNaN(zone)) {
					continue;
				}
				var x_new = new Date(data[i].route[x].time * 1000 + referenceDate);
				if ((x_new > endDate) || (x_new < beginDate))
					continue;
				tmp.push({x: x_new , y: (data[i].route[x].floor * 10 + zone),id:data[i].card_nanme});
			}
			dataset.push({card_name : data[i].card_nanme ,office: data[i].office, department : data[i].Department, coordinate : tmp});
		}
	}


	$("#day_slider").rangeSlider({
	step: 100/14,
	formatter:function(val) {
		return Math.floor(val /7).toString();
	},
	defaultValues:{min: 0, max: 10}
	});
	$("#day_slider").bind("valuesChanged", function(e, date){
		var endday = Math.floor(date.values.max/7);
		var startday = Math.floor(date.values.min/7);
		console.log("Values just changed. min: " + startday + " max: " + endday);
		generateDataset(startday,endday);
		refreshGraph();
	});
	generateDataset(0,14);
	// create svg ground
	var svg = d3.select("#chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	function getRandomColor() {
		var  color = [
			'#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
			'#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
			'#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
			'#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
		];
		var random =  Math.floor(Math.random()*20);
		return color[random];
	}

	function drawCoordinate(dataset) {
		xScale = d3.time.scale().range([0, width])
		.domain([beginDate, endDate ]);

		// xScale2 = d3.time.scale().range([0, width])
		// .domain(xScale.domain());

		yScale = d3.scale.linear()
		.domain([0, 40])
		.range([height, 0]);

		// yScale2 = d3.scale.linear()
		// .range([height2, 0])
		// .domain(yScale.domain());

		xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.innerTickSize(-height)
		.outerTickSize(0)
		.tickPadding(10);

		// xAxis2 = d3.svg.axis()
		// .scale(xScale2)
		// .orient("bottom")
		// .innerTickSize(-height)
		// .outerTickSize(0)
		// .tickPadding(10);

		yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.innerTickSize(-width)
		.outerTickSize(0)
		.tickPadding(10);

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

		svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

		svg.append("text")
		.attr("text-anchor", "middle")
		.attr("font-size", "18px")
		.attr("transform", "translate("+ (-margin.left/2) +","+(height/2)+")rotate(-90)")
		.text("Floor_Zone");

		svg.append("text")
		.attr("text-anchor", "middle")
		.attr("font-size", "18px")
		.attr("transform", "translate("+ (width/2) +","+(height + margin.top*1.5)+")")
		.text("Date");
	}
	function fade(opacity) {
		return function(g, i) {
			svg.selectAll(" path")
					.filter(function(d) {
						//console.log(d[3]);
						if(d==0)
							return true;
						else
							return d[0].id !=g[0].id;
					})
					.transition()
					.style("opacity", opacity);
		};
	}
    var drawCircles = function (dataset) {
        var classname = "circle."+dataset.card_name;
        svg.selectAll("classname")
            .data(dataset.coordinate)
            .enter()
            .append("circle")
            .attr("class",dataset.card_name)
			.attr("fill","grey")
            .attr("cx", function(d) { return xScale(d.x); })
            .attr("cy", function(d) { return yScale(d.y); })
            .attr("r",5)
            .attr("opacity",0)
            .on("mouseover",function (g,i) {
				svg.selectAll("path")
					.filter(function(d) {
						//console.log(d[3]);
						if(d==0)
							return true;
						else
							return d[0].id !=g.id;
					})
					.transition()
					.style("opacity", 0.05);


                svg.selectAll("circle")
					.filter(function(d) {
						//console.log(d[3]);
						if(d==0)
							return true;
						else
							return d.id !=g.id;
					})
					.transition()
					.style("opacity", 0);
                var floor = Math.floor(g.y/10);
                var zone = g.y - floor*10;
                document.getElementById("detail").innerHTML = "Time: "+g.x.toString().slice(15,24)+"\n"+"Location: "+"floor"+floor+" zone"+zone;
            })
            .on("mouseleave",function (g,i) {
                document.getElementById("detail").innerHTML = "**Nothing**";
				svg.selectAll("circle")
					.filter(function(d) {
						//console.log(d[3]);
						if(d==0)
							return true;
						else
							return d.id !=g.id;
					})
					.transition()
					.style("opacity", 0);
				svg.selectAll("path")
					.filter(function(d) {
						//console.log(d[3]);
						if(d==0)
							return true;
						else
							return d[0].id !=g.id;
					})
					.transition()
					.style("opacity", 0.8);

            })
    };

	var showGraph = function(dataset){
		//console.log(dataset);
		// xScale and yScale defined in drawCoordinate(), changing with dataset
		var line = d3.svg.line()
		.x(function(d) {return xScale(d.x); })
		.y(function(d) { return yScale(d.y); });
       //console.log(dataset.coordinate);

		////////////////////////////
		/*
		var brush = d3.svg.brush()
		.x(xScale2)
		.on("brush", brushed);

		svg.append("defs").append("clipPath")
		.attr("id", "clip")
		.append("rect")
		.attr("width", width)
		.attr("height", height);

		var focus = svg.append("g")
		.attr("class", "focus")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var context = svg.append("g")
		.attr("class", "context")
		.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

		context.append("g")
		.attr("class", "x brush")
		.call(brush)
		.selectAll("rect")
		.attr("y", -6)
		.attr("height", height2 + 7);
		*/
		//////////////////////////
		//var color20 = d3.scale.category20();
		svg.append("path")
		.data([dataset.coordinate])
		.attr("class", "line")
		.attr("d", line)
		.attr("opacity", 0.8)
		.attr("stroke", function(d,i){
			//console.log(i);
			return getRandomColor();
			//return "hsl(" + Math.random() * 360 + ",100%,50%)";
		})
			.attr("id",function(d,i){
				if(d==0)
					return "";
				else
					return d[0].id;
			})
		.attr("stroke-width", '1.5px')
		.on("mouseover",function(g,i) {
			//console.log(d);
            svg.selectAll("path")
					.filter(function(d) {
						//console.log(d[3]);
						if(d==0)
							return true;
						else
							return d[0].id !=g[0].id;
					})
					.transition()
					.style("opacity", 0.05);
			d3.select(this).attr("opacity", 0.8);
			d3.select(this).attr("stroke-width", '3px');
			var innerInfo = dataset.card_name + "  " + dataset.office+"     ";
			for(var i=0;i<dataset.coordinate.length;i++){
				var floor = Math.floor(dataset.coordinate[i].y / 10);
				var zone = dataset.coordinate[i].y - floor*10;
				innerInfo=innerInfo+"->"+floor+"_"+zone+"("+dataset.coordinate[i].x.toString().slice(15,21)+")";
			}
			document.getElementById("info").innerHTML = innerInfo;
		})
		.on("mouseleave",function(d) {
			d3.select(this).attr("opacity", 0.8);
			d3.select(this).attr("stroke-width", '1.5px');
			document.getElementById('info').innerHTML = "** No Information Available **";
		})
				//.on("mouseover", )
				.on("mouseout", fade(0.8));
	};

	function brushed() {
		xScale.domain(brush.empty() ? xScale2.domain() : brush.extent());
		focus.select(".area").attr("d", area);
		focus.select(".xScale.axis").call(xAxis);
	}

	var departmentFilter = function(dataset, department) {
		if(department=="all")
			return dataset;
		else{
			var criteria = function(value) {
				if (value.department == department)
					return true;
				return false;
			};
			return dataset.filter(criteria);
		}
	};
	function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}
	var refreshGraph = function() {
		d3.select("svg").remove();
		svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var data2Draw = departmentFilter(dataset, document.getElementById("positionForm").value);
		var staffArray=[];
		var staff_html = '<option value="All">' + "All" + '</option>';
		$('#names').empty();
		for (var i = 0 ; i < data2Draw.length; i++) {
			staffArray.push(data2Draw[i].card_name);
			if (i == 0){
				drawCoordinate(data2Draw[i].coordinate);
			}
			showGraph(data2Draw[i]);
            drawCircles(data2Draw[i]);
		}
		var unique_staff = staffArray.filter(onlyUnique);
		unique_staff.sort();
		var staff_len = unique_staff.length;
		for (let i = 0; i <= staff_len - 1; i++) {
			staff_html += '<option value="' + unique_staff[i] + '">' + unique_staff[i] + '</option>';
		}
		$('#names').append(staff_html);
	};
	$("#names").change(function(){
		var id = document.getElementById("names").value;
		if(id == "All"){
			d3.selectAll("path").style("opacity", 0.8);
		}
		else{

			d3.selectAll("path").style("opacity",0.01);
			d3.selectAll("#"+id)
				.transition()
				.style("opacity", 1)
				.attr("stroke-width",function(d,i){
					if(d!=0){
						var innerInfo = d[0].id + "  " ;
						for(var i=0;i<d.length;i++){
							var floor = Math.floor(d[i].y / 10);
							var zone = d[i].y - floor*10;
							innerInfo=innerInfo+"->"+floor+"_"+zone+"("+d[i].x.toString().slice(15,21)+")";
						}
						document.getElementById("info").innerHTML = innerInfo;
					}
					return "3px";
				});
		}
	});
	refreshGraph();