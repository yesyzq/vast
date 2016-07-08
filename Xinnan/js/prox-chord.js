 $(document).ready(function() {
     var day=1;
     var department ="all";
     var starttime = 0;
     var endtime = 3600;
        $.getJSON('building_json/route.json', function(data) {
    /*
     {
        "Department": "Administration",
        "route": [
            {
                "floor_zone": "1_1",
                "card_num": 1,
                "zone": "1",
                "floor": 1,
                "time": 26100.0,
                "day": 1
            },

    * */
            var line = echarts.init(document.getElementById('linechart'));
            var option = {
                title : {
                    left:'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:[]
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        type:'line',
                        data:[],
                        markLine : {
                            data : [
                                {type : 'average', name: 'average'}
                            ]
                        }
                    }
                ]
            };
            line.setOption(option);
            var getTotal=function(data,day){
                var start = (day-1)*86400;
                var end = day*86400;
                var line_data=[24];
                for(var i=0;i<24;i++){
                    line_data[i]=0;
                }
                for(var i=0;i<data.length;i++){
                        for(var j=0;j<data[i].route.length;j++){
                            var hour = Math.floor((data[i].route[j].time - start)/3600);
                            if(hour>=0 && hour<24){
                                line_data[hour]+=1;
                            }
                        }
                };
                return line_data;
            };

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            function get_staff(data) {
                var staff_array = [],
                    len = data.length;
                var staff_html = '<option value="All">' + "All" + '</option>';
                $('#names').empty();
                for (var i = 0; i <= len - 1; i++) {
                    if(data[i].route.length !=0)
                        staff_array.push(data[i].id);
                }
                var unique_staff = staff_array.filter(onlyUnique);
                unique_staff.sort();
                var staff_len = unique_staff.length;
                for (var i = 0; i <= staff_len - 1; i++) {
                    staff_html += '<option value="' + unique_staff[i] + '">' + unique_staff[i] + '</option>';
                }
                $('#names').append(staff_html);
            };

            var dayFilter = function(data,day){
                var tempData=[];
                for(var i=0;i<data.length;i++){
                    var tempElm = {"Department":data[i].Department,"route":[]};
                    var tempRoute=[];
                    for(var j=0;j<data[i].route.length;j++){
                        if(data[i].route[j].day == day){
                            tempRoute.push(data[i].route[j]);
                        }
                    }
                    tempElm.route = tempRoute;
                    tempData.push(tempElm);
                }
                //console.log(tempData);
                return tempData;

            };
            var timeFilter = function(data,start,end){
                console.log("start:"+start+"  end:"+end);
                var tempData=[];
                for(var i=0;i<data.length;i++){
                    var tempElm = {"Department":data[i].Department,"id":data[i].card_nanme,"route":[]};
                    var tempRoute=[];
                    for(var j=0;j<data[i].route.length;j++){
                        if(data[i].route[j].time >=start && data[i].route[j].time<=end){
                            tempRoute.push(data[i].route[j]);
                        }
                    }
                    tempElm.route = tempRoute;
                    tempData.push(tempElm);
                }
                //console.log(tempData);
                return tempData;
            };
            var departmentFilter = function(data,department){
                console.log(department);
                if(department=="all"){
                    return data;
                }
                else{
                    var tempData=[];
                    for(var i=0;i<data.length;i++){
                        if(data[i].Department == department)
                            tempData.push(data[i]);
                    }
                    return tempData;
                }
            };
            var createZone = function(){
                    var zones=[];
                    for(var i=1;i<9;i++){
                        var zone = "1_"+ i;
                        zones.push(zone);
                    }
                    for(var i=1;i<8;i++){
                        var zone = "2_"+ i;
                        zones.push(zone);
                    }
                    for(var i=1;i<7;i++){
                        var zone = "3_"+ i;
                        zones.push(zone);
                    }
                    zones.push("3_Server Room");
                    return zones;
                };
                var createMatrix = function(){
                    var zones = createZone();
                    var matrix = [];
                    for (var i = 0; i < zones.length; i++) {
                        matrix[zones[i]] = [];
                        for (var j = 0; j < zones.length; j++) {
                            matrix[zones[i]][zones[j]] = 0;
                        }
                    }
                    return matrix;
                };
            var matrixCal = function(data){
                var total=0;
                var matrix = createMatrix();
                var zones = createZone();

                for(var i=0;i<data.length;i++){
                    for(var j=0;j<data[i].route.length-1;j++){
                        // if(typeof(matrix[data[i].route[j].floor_zone]) == "undefined") {
                        //     zones.push(data[i].route[j].floor_zone);
                        //     matrix[data[i].route[j].floor_zone] = [];
                        //     matrix[data[i].route[j].floor_zone][data[i].route[j+1].floor_zone]=1;
                        //     total+=1;
                        // }
                        // else if(typeof(matrix[data[i].route[j].floor_zone][data[i].route[j+1].floor_zone]) == "undefined") {
                        //     matrix[data[i].route[j].floor_zone][data[i].route[j + 1].floor_zone] = 1;
                        //     total+=1;
                        // }
                        // else {
                        //     matrix[data[i].route[j].floor_zone][data[i].route[j + 1].floor_zone] += 1;
                        //     total+=1;
                        // }
                        matrix[data[i].route[j].floor_zone][data[i].route[j + 1].floor_zone] += 1;
                        total+=1;
                    }
                }
                //console.log(matrix);
                return {matrix,zones,total};
            };
            //console.log(matrix.zones);
            var cal_chord=function(matrix){
                var zone_num = matrix.zones.length;
                var chord_data = [zone_num];
                for (var i = 0; i < zone_num; i++) {
                    chord_data[i] = [zone_num];
                    for (var j = 0; j < zone_num; j++) {
                        chord_data[i][j] = 0
                    }
                }
                for (var i = 0; i < zone_num; i++) {
                    for (var j = 0; j < zone_num; j++) {
                        if (typeof(matrix.matrix[matrix.zones[i]][matrix.zones[j]]) != "undefined")
                            chord_data[i][j] = matrix.matrix[matrix.zones[i]][matrix.zones[j]];
                    }
                }
                return chord_data;
            };

            function CalRoute(tempR,id) {
                var positionTable = {
                    "11": {
                        "x": 550,
                        "y": 100
                    },
                    "12": {
                        "x": 100,
                        "y": 105
                    },
                    "13": {
                        "x": 50,
                        "y": 290
                    },
                    "14": {
                        "x": 160,
                        "y": 240
                    }, // (260, 240) ,(450, 240)
                    "15": {
                        "x": 310,
                        "y": 90
                    },
                    "16": {
                        "x": 310,
                        "y": 323
                    },
                    "17": {
                        "x": 496,
                        "y": 419
                    },
                    "18": {
                        "x": 550,
                        "y": 419
                    },
                    "21": {
                        "x": 774,
                        "y": 332
                    },
                    "22": {
                        "x": 650,
                        "y": 230
                    },
                    "23": {
                        "x": 1041,
                        "y": 60
                    },
                    "24": {
                        "x": 731,
                        "y": 240
                    }, //(834, 240) , (1020, 240)
                    "25": {
                        "x": 685,
                        "y": 325
                    },
                    "26": {
                        "x": 950,
                        "y": 340
                    },
                    "27": {
                        "x": 970,
                        "y": 150
                    },
                    "31": {
                        "x": 775,
                        "y": 600
                    },
                    "32": {
                        "x": 960,
                        "y": 680
                    },
                    "33": {
                        "x": 656,
                        "y": 710
                    },
                    "34": {
                        "x": 730,
                        "y": 690
                    }, //(830, 690)
                    "35": {
                        "x": 1060,
                        "y": 690
                    },
                    "36": {
                        "x": 660,
                        "y": 518
                    }
                };
                var result = [];
                //console.log(tempR);
                for (var i = 0; i < tempR.length; i++) {
                    var zone = parseInt(tempR[i].zone);
                    if ((typeof tempR[i].floor === 'number') && (!isNaN(zone))) {
                        var obj = {"floor":tempR[i].floor,"zone":zone,"id":id,"position":positionTable[(zone + tempR[i].floor * 10).toString()]};
                        result.push(obj);
                    } else if ((typeof tempR[i].floor === 'number') && (isNaN(zone))) {

                    }
                }
                return result;
            }
            var renderRoute=function(data){
                var drawn = d3.select("#route").selectAll("svg").data([]);
                drawn.exit().remove();
                var width = 1200,
                    height = 900;
                var svg  = d3.select("#route").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .style("position","relative")
                    .style("top",-840);
                for(var i=0;i<data.length;i++){
                    drawRoute(data[i].route,svg,data[i].id);
                   // console.log(data[i]);
                }
            };
            var drawRoute = function(data,svg,id){
                var route = CalRoute(data,id);
                var length = route.length;
                if(length>=2){
                    for(var i=0;i<length-1;i++){
                        var out = "("+route[i].position.x+","+route[i].position.y+")"+"-->("+route[i+1].position.x+","+route[i+1].position.y+")";
                        // console.log(out);
                        var color="black";
                        if(route[i].zone == 1)
                            color = "red";
                        else if(route[i+1].zone == 1 && route[i].zone!=4)
                            color = "blue";
                        if(route[i].floor>route[i+1].floor)
                            color = "blue";
                        else if(route[i].floor<route[i+1].floor)
                            color = "red";

                        var random = Math.floor(Math.random()*15);
                        var startx = route[i].position.x+random;
                        var starty = route[i].position.y+random;
                        var endx = route[i+1].position.x+random;
                        var endy = route[i+1].position.y+random;
                        var line = svg.data(route).append("line")
                            .attr("x1",startx)
                            .attr("y1",starty)
                            .attr("x2",endx)
                            .attr("y2",endy)
                            .attr("stroke",color)
                            .attr("stroke-width",2)
                            .attr("opacity",0.5)
                            .on("mouseover",function(){
                                svg.selectAll("line")
                                    .filter(function(d) {
                                        if(d==0)
                                            return true;
                                        else
                                            return d.id !=id;
                                    })
                                    .transition()
                                    .style("opacity", 0.01);
                                d3.select(this).attr("opacity", 1);
                                d3.select(this).attr("stroke-width", '3px');
                                svg.selectAll("circle")
                                    .filter(function(d) {
                                        if(d==0)
                                            return true;
                                        else
                                            return d.id !=id;
                                    })
                                    .transition()
                                    .style("opacity", 0.01);
                            })
                            .on("mouseout", function () {
                                svg.selectAll("line")
                                    .filter(function(d) {
                                        if(d==0)
                                            return true;
                                        else
                                            return d.id !=id;
                                    })
                                    .transition()
                                    .style("opacity", 0.5);
                                d3.select(this).attr("opacity", 0.5);
                                d3.select(this).attr("stroke-width", '2px');
                                svg.selectAll("circle")
                                    .filter(function(d) {
                                        if(d==0)
                                            return true;
                                        else
                                            return d.id !=id;
                                    })
                                    .transition()
                                    .style("opacity", 0.5);
                            });
                        line.append("title").text(id);
                        var circle = svg.data(route).append("circle")
                            .attr("fill",color)
                            .attr("cx",endx )
                            .attr("cy", endy)
                            .attr("r",4)
                            .attr("opacity",0.5);
                        circle.append("title").text(id);
                    }
                }
                //var line = svg.append("line")
                //    .attr("x1",0)
                //    .attr("y1",0)
                //    .attr("x2",200)
                //    .attr("y2",50)
                //    .attr("stroke","red")
                //    .attr("stroke-width",2)
                //    .attr("marker-end","url(#arrow)");
            };

            var draw = function(chord_data,zones,total) {
                var drawn = d3.select("#chord").selectAll("svg").data([]);
                drawn.exit().remove();
                //2.转换数据，并输出转换后的数据
                var chord_layout = d3.layout.chord()
                        .padding(0.03)		//节点之间的间隔
                        .sortSubgroups(d3.descending)	//排序
                        .matrix(chord_data);	//输入矩阵

                var groups = chord_layout.groups();
                var chords = chord_layout.chords();

                //console.log(groups);
                //console.log(chords);

                //3.SVG，弦图，颜色函数的定义
                var width = 1500;
                var height = 1500;
                var innerRadius = width / 2 * 0.7;
                var outerRadius = innerRadius * 1.1;

                var color20 = d3.scale.category20();

                var svg = d3.select("#chord").append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + (width / 2 +100) + "," + (height / 2 + 100) + ")");

                //4.绘制节点（即分组，有多少个城市画多少个弧形），及绘制城市名称
                var outer_arc = d3.svg.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(outerRadius);

                var g_outer = svg.append("g");

                g_outer.selectAll("path")
                        .data(groups)
                        .enter()
                        .append("path")
                        .style("fill", function (d) {
                            return color20(d.index);
                        })
                        .style("stroke", function (d) {
                            return color20(d.index);
                        })
                        .attr("d", outer_arc)
                        .on("mouseover", fade(.1))
                        .on("mouseout", fade(1));

                g_outer.selectAll("text")
                        .data(groups)
                        .enter()
                        .append("text")
                        .each(function (d, i) {
                            d.angle = (d.startAngle + d.endAngle) / 2;
                            d.name = zones[i] + "";
                        })
                        .attr("dy", ".35em")
                        .style("fill", "red")
                        .style("font-weight","bold")
                        .attr("transform", function (d) {
                            return "rotate(" + ( d.angle * 180 / Math.PI ) + ")" +
                                    "translate(0," + -1.0 * (outerRadius + 40) + ")" +
                                    ( ( d.angle > Math.PI * 3 / 4 && d.angle < Math.PI * 5 / 4 ) ? "rotate(-90)" : "rotate(-90)");
                        })
                        .text(function (d) {
                            return d.name;
                        });


                //5.绘制内部弦（即所有城市人口的来源，即有5*5=25条弧）
                var inner_chord = d3.svg.chord()
                        .radius(innerRadius);
                var ticks = svg.append("g").selectAll("g")
                        .data(groups)
                        .enter().append("g").selectAll("g")
                        .data(groupTicks)
                        .enter().append("g")
                        .attr("transform", function (d) {
                            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                                    + "translate(" + outerRadius + ",0)";
                        });

                ticks.append("line")
                        .attr("x1", 1)
                        .attr("y1", 0)
                        .attr("x2", 5)
                        .attr("y2", 0)
                        .style("stroke", "#000");

                ticks.append("text")
                        .attr("x", 8)
                        .attr("dy", ".35em")
                        .attr("transform", function (d) {
                            return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
                        })
                        .style("text-anchor", function (d) {
                            return d.angle > Math.PI ? "end" : null;
                        })
                        .text(function (d) {
                            return d.label;
                        });


                svg.append("g")
                        .attr("class", "chord")
                        .selectAll("path")
                        .data(chords)
                        .enter()
                        .append("path")
                        .attr("d", inner_chord)
                        .style("fill", function (d) {
                            return color20(d.source.index);
                        })
                        .style("opacity", 1)
                        .on("mouseover", function (d, i) {
                            d3.select(this).style("fill", "black");
                        })
                        .on("mouseout", function (d, i) {
                            d3.select(this)
                                    .transition()
                                    .style("fill", color20(d.source.index));
                        });

                function groupTicks(d) {
                    var k = (d.endAngle - d.startAngle) / d.value;
                    return d3.range(0, d.value, 10).map(function (v, i) {
                        return {
                            angle: v * k + d.startAngle,
                            label: v
                        };
                    });
                };
                function fade(opacity) {
                    return function(g, i) {
                        svg.selectAll(".chord path")
                                .filter(function(d) { return d.source.index != i && d.target.index != i; })
                                .transition()
                                .style("opacity", opacity);
                    };
                }
            };
            var render=function(starttime,endtime,day,department,data,chart){
                var startHour = Math.floor(starttime/3600);
                var startMinute = Math.floor((starttime%3600)/60);
                var endHour = Math.floor(endtime/3600);
                var endMinute = Math.floor((endtime%3600)/60);
                $('.slider-time').html(startHour + ':' + startMinute);
                $('.slider-time2').html(endHour + ':' + endMinute);
                var format = d3.time.format("%Y-%m-%d");
		        var referenceDate = format.parse("2016-5-31").getTime();
                var myDate = new Date((day-1)*86400*1000+referenceDate).toLocaleString().slice(0,9);
               // myDate = format.parse(myDate);
                $('#day').html(myDate);
                $("#dept_info").html(department);
                var mydata = departmentFilter(data,department);
                //console.log(mydata);
                var linedata = getTotal(mydata,day);
                var hours = [];
                for(var i=0;i<24;i++){
                    hours.push(i+" to "+(i+1));
                }
                chart.setOption({
                    title : {
                    text: 'total number of prox record in day '+day+" in "+department+" department "
                    },
                    xAxis : [
                    {
                        data : hours
                    }
                    ],
                    series : [
                    {
                        data:linedata
                    }
                ]
                });
                //console.log(hours);
                mydata = timeFilter(mydata,starttime+(day-1)*86400,endtime+(day-1)*86400);
                get_staff(mydata);
                //data = dayFilter(data,1);
                //console.log(mydata);
                renderRoute(mydata);
                var matrix = matrixCal(mydata);
                var chord_data = cal_chord(matrix);
                //console.log(mydata);
                $('#total').html(matrix.total);
                draw(chord_data,matrix.zones,matrix.total);
                console.log("rendered!");
            };
            //var mydata = timeFilter(data,0,86400*14);
            ////data = dayFilter(data,1);
            ////console.log(mydata);
            //var matrix = matrixCal(mydata);
            //var chord_data = cal_chord(matrix);
            //draw(chord_data,matrix.zones);
            $("#All").click(function(){
                department="all";
               render(starttime,endtime,day,department,data,line);
            });
            $("#Administration").click(function(){
                department="Administration";
               render(starttime,endtime,day,department,data,line);
            });
            $("#Engineer").click(function(){
                department="Engineering";
               render(starttime,endtime,day,department,data,line);
            });
            $("#Executive").click(function(){
                department="Executive";
               render(starttime,endtime,day,department,data,line);
            });
            $("#Facilities").click(function(){
                department="Facilities";
               render(starttime,endtime,day,department,data,line);
            });
            $("#HR").click(function(){
                department="HR";
               render(starttime,endtime,day,department,data,line);
            });
            $("#IT").click(function(){
                department="Information Technology";
               render(starttime,endtime,day,department,data,line);
            });
            $("#Security").click(function(){
                department="Security";
               render(starttime,endtime,day,department,data,line);
            });
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
                render(starttime,endtime,day,department,data,line);
            });

            $("#slider").rangeSlider({
                range: {min: 0, max: 86400},
                formatter:function(val){
                    return Math.round(val*864).toString();
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
                render(starttime,endtime,day,department,data,line);

            });
            $("#names").change(function(){
                var id = document.getElementById("names").value;
                if(id == "All"){
                    d3.selectAll("line").style("opacity", 0.5);
                    d3.selectAll("circle").style("opacity", 0.5);
                }
                else{
                    d3.selectAll("line").style("opacity", 0.5);
                    d3.selectAll("circle").style("opacity", 0.5);
                    d3.selectAll("circle")
                        .filter(function(d) {
                            if(d==0)
                                return true;
                            else
                                return d.id !=id;
                        })
                        .transition()
                        .style("opacity", 0.005);

                    d3.selectAll("line")
                        .filter(function(d) {
                            if(d==0)
                                return true;
                            else
                                return d.id !=id;
                        })
                        .transition()
                        .style("opacity", 0.005);
                }
            });
            });
    });