$(document).ready(function() {
    var color = 'black';
    var floor1 = [ '1', '2','3', '4','5', '7','8A', '8B'],
        floor2 = [ '1','2','3','4','5','6', '7','8','9','10','11','12A','12B','12C','14','15','16'],
        floor3 = [ '1','2','3','5','6','7', '8', '9','10','11A', '11B','11C', '12'];
    var getOption = function(x_axis,series,legend) {
        var option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            legend: {
                data:legend,
                textStyle: {
                    color: color    // 图例文字颜色
                }
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                },
                y:'bottom'
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: x_axis,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: color
                    }
                }
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: color
                    }
                }
                //boundaryGap: [0, '100%']
            }],
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
            }, {
                start: 0,
                end: 100
            }],
            series:series
        };
        return option;
    };
    $.getJSON('building_json/hvac_processed2.json').done(function(data){
        var x_axis = data["Date/Time"];
        var drawTotalElec = function(){
            var totalElec = echarts.init(document.getElementById('totalElec'),building_theme);
            var totalElecSeries = [{
                name: 'HVAC Electric Demand Power',
                type: 'line',
                data: data["HVAC Electric Demand Power"]
            }, {
                name: 'Total Electric Demand Power',
                type: 'line',
                data: data["Total Electric Demand Power"]
            }];
            totalElec.setOption(getOption(x_axis,totalElecSeries,["HVAC Electric Demand Power","Total Electric Demand Power"]));
        };
        var drawF1Power = function(){
            var F1Power = echarts.init(document.getElementById('F1Power'),building_theme);
            var F1PowerSeries = [];
            var names = [];
            for(var zone of floor1){
                var name = "F_1_Z_" + zone+": Equipment Power";
                names.push(name);
                var tempObj = {
                    name: name,
                    type: 'line',
                    data: data[name]
                };
                F1PowerSeries.push(tempObj);
            }
            F1Power.setOption(getOption(x_axis,F1PowerSeries,names));
        };
        var drawF2Power = function(){
            var chart = echarts.init(document.getElementById('F2Power'),building_theme);
            var series = [];
            var names = [];
            for(var zone of floor2){
                var name = "F_2_Z_" + zone+": Equipment Power";
                names.push(name);
                var tempObj = {
                    name: name,
                    type: 'line',
                    data: data[name]
                };
                series.push(tempObj);
            }
            chart.setOption(getOption(x_axis,series,names));
        };
        var drawF3Power = function(){
            var chart = echarts.init(document.getElementById('F3Power'),building_theme);
            var series = [];
            var names = [];
            for(var zone of floor3){
                var name = "F_3_Z_" + zone+": Equipment Power";
                names.push(name);
                var tempObj = {
                    name: name,
                    type: 'line',
                    data: data[name]
                };
                series.push(tempObj);
            }
            chart.setOption(getOption(x_axis,series,names));
        };
        var drawVAVMassFlow = function(){
            var totalElec = echarts.init(document.getElementById('massflow'),building_theme);
            var totalElecSeries = [{
                name: 'F_1_VAV_SYS AIR LOOP INLET Mass Flow Rate',
                type: 'line',
                data: data["F_1_VAV_SYS AIR LOOP INLET Mass Flow Rate"]
            }, {
                name: 'F_1_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate',
                type: 'line',
                data: data["F_1_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate"]
            }, {
                name: 'F_2_VAV_SYS AIR LOOP INLET Mass Flow Rate',
                type: 'line',
                data: data["F_2_VAV_SYS AIR LOOP INLET Mass Flow Rate"]
            }, {
                name: 'F_2_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate',
                type: 'line',
                data: data["F_2_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate"]
            }, {
                name: 'F_3_VAV_SYS AIR LOOP INLET Mass Flow Rate',
                type: 'line',
                data: data["F_3_VAV_SYS SUPPLY FAN INLET Mass Flow Rate"]
            }, {
                name: 'F_3_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate',
                type: 'line',
                data: data["F_3_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate"]
            }];
            var legend = [];
            for(var i=1;i<4;i++){
                legend.push("F_"+i+"_VAV_SYS AIR LOOP INLET Mass Flow Rate");
                legend.push("F_"+i+"_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate")
            }
            totalElec.setOption(getOption(x_axis,totalElecSeries,legend));
        };
        var drawfloor = function(id,floor,floorArray,suffix){
            var chart = echarts.init(document.getElementById(id),building_theme);
            var series = [];
            var names = [];
            for(var zone of floorArray){
                var name = "F_"+floor+"_Z_" + zone+suffix;
                names.push(name);
                var tempObj = {
                    name: name,
                    type: 'line',
                    data: data[name]
                };
                series.push(tempObj);
            }
            chart.setOption(getOption(x_axis,series,names));
        };
        var drawoutair = function(id,suffix){
            var chart = echarts.init(document.getElementById(id),building_theme);
            var series = [];
            var names=[];
            for(var i=1;i<4;i++){
                var name = "F_"+i+suffix;
                names.push(name);
                var tempobj = {
                    name: name,
                    type: 'line',
                    data: data[name]
                };
                series.push(tempobj);
            }
            chart.setOption(getOption(x_axis,series,names));
        };
        drawVAVMassFlow();
        drawfloor("F1massflow",1,floor1," SUPPLY INLET Mass Flow Rate");
        drawfloor("damper",1,floor1," VAV REHEAT Damper Position");
        drawoutair("outair","_VAV_SYS Outdoor Air Mass Flow Rate");
        $("#floor1").click(function(){
            $("#floortitle").innerHTML = "Floor 1 mass flow";
            $("#dampertitle").innerHTML = "Floor 1 damper position";
            drawfloor("F1massflow",1,floor1," SUPPLY INLET Mass Flow Rate");
            drawfloor("damper",1,floor1," VAV REHEAT Damper Position");
        });
        $("#floor2").click(function(){
            $("#floortitle").innerHTML = "Floor 2 mass flow";
            $("#dampertitle").innerHTML = "Floor 2 damper position";
            drawfloor("F1massflow",2,floor2," SUPPLY INLET Mass Flow Rate");
            drawfloor("damper",2,floor2," VAV REHEAT Damper Position");
        });
        $("#floor3").click(function(){
            $("#floortitle").innerHTML = "Floor 3 mass flow";
            $("#dampertitle").innerHTML = "Floor 3 damper position";
            drawfloor("F1massflow",3,floor3," SUPPLY INLET Mass Flow Rate");
            drawfloor("damper",3,floor3," VAV REHEAT Damper Position");
        });
        $("#outflow").click(function(){
            drawoutair("outair","_VAV_SYS Outdoor Air Mass Flow Rate");
        });
        $("#outrate").click(function(){
            drawoutair("outair","_VAV_SYS Outdoor Air Flow Fraction");
        });
        $("#black").click(function () {
            color = "white";
            $("h2").css("color","white");
            $("body").css("background-color","#0f0f0f");
            drawVAVMassFlow();
            drawfloor("F1massflow",1,floor1," SUPPLY INLET Mass Flow Rate");
            drawfloor("damper",1,floor1," VAV REHEAT Damper Position");
            drawoutair("outair","_VAV_SYS Outdoor Air Mass Flow Rate");
        });
        $("#white").click(function () {
            color = "black";
            $("h2").css("color","black");
            $("body").css("background-color","white");
            drawVAVMassFlow();
            drawfloor("F1massflow",1,floor1," SUPPLY INLET Mass Flow Rate");
            drawfloor("damper",1,floor1," VAV REHEAT Damper Position");
            drawoutair("outair","_VAV_SYS Outdoor Air Mass Flow Rate");
        });
    });
});
