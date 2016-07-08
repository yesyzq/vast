$(document).ready(function() {
    var floor1 = [ '1', '2','3', '4','5', '7','8A', '8B'],
        floor2 = [ '1','2','3','4','5','6', '7','8','9','10','11','12A','12B','12C','14','15','16'],
        floor3 = [ '1','2','3','5','6','7', '8', '9','10','11A', '11B','11C', '12'];
    var color = "black";
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
            console.log(legend);
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
        var drawinout = function(id,floor){
            var temp = echarts.init(document.getElementById(id),building_theme);
            var inlet = "F_"+floor+"_VAV_SYS AIR LOOP INLET Temperature";
            var outlet = "F_"+floor+"_VAV_SYS SUPPLY FAN OUTLET Temperature";
            var Series = [{
                name: inlet,
                type: 'line',
                data: data[inlet]
            }, {
                name: outlet,
                type: 'line',
                data: data[outlet]
            }];
            temp.setOption(getOption(x_axis,Series,[inlet,outlet]));
        };
        var drawF1InletTemp = function(){
            var F1InletTemp = echarts.init(document.getElementById('F1temp'),building_theme);
            var F1InletTempSeries = [];
            var names = [];
            for(var zone in floor1){
                var name = "F_1_Z_" + zone+" SUPPLY INLET Temperature";
                names.push(name);
                var tempObj = {
                    name: name,
                    type: 'line',
                    data: data[name]
                };
                F1InletTempSeries.push(tempObj);
            }
            console.log(F1InletTempSeries);
            F1InletTemp.setOption(getOption(x_axis,F1InletTempSeries,names));
        };

        var drawF2InletTemp = function(){
            var F1InletTemp = echarts.init(document.getElementById('F2temp'),building_theme);
            var F1InletTempSeries = [];
            var names = [];
            for(var zone in floor2){
                var name = "F_2_Z_" + zone+" SUPPLY INLET Temperature";
                names.push(name);
                var tempObj = {
                    name: name,
                    type: 'line',
                    data: data[name]
                };
                F1InletTempSeries.push(tempObj);
            }
            F1InletTemp.setOption(getOption(x_axis,F1InletTempSeries,names));
        };

        var drawF3InletTemp = function(){
            var F1InletTemp = echarts.init(document.getElementById('F3temp'),building_theme);
            var F1InletTempSeries = [];
            var names = [];
            for(var zone in floor3){
                var name = "F_3_Z_" + zone+" SUPPLY INLET Temperature";
                names.push(name);
                var tempObj = {
                    name: name,
                    type: 'line',
                    data: data[name]
                };
                F1InletTempSeries.push(tempObj);
            }
            F1InletTemp.setOption(getOption(x_axis,F1InletTempSeries,names));
        };
        drawfloor("F1temp",1,floor1,": Thermostat Temp");
        drawfloor("F2temp",2,floor2,": Thermostat Temp");
        drawfloor("F3temp",3,floor3,": Thermostat Temp");
        $("#temp").click(function(){
            drawfloor("F1temp",1,floor1,": Thermostat Temp");
            drawfloor("F2temp",2,floor2,": Thermostat Temp");
            drawfloor("F3temp",3,floor3,": Thermostat Temp");
        });
        $("#sethigh").click(function(){
            drawfloor("F1temp",1,floor1,": Thermostat Heating Setpoint");
            drawfloor("F2temp",2,floor2,": Thermostat Heating Setpoint");
            drawfloor("F3temp",3,floor3,": Thermostat Heating Setpoint");
        });
        $("#setlow").click(function(){
            drawfloor("F1temp",1,floor1,": Thermostat Cooling Setpoint");
            drawfloor("F2temp",2,floor2,": Thermostat Cooling Setpoint");
            drawfloor("F3temp",3,floor3,": Thermostat Cooling Setpoint");
        });
        $("#hvac").click(function(){
            drawinout("F1temp",1);
            drawinout("F2temp",2);
            drawinout("F3temp",3);
        });
        $("#hvac_zone").click(function(){
            drawF1InletTemp();
            drawF2InletTemp();
            drawF3InletTemp();
        });
        $("#black").click(function () {
            color = "white";
            $("h2").css("color","white");
            $("body").css("background-color","#0f0f0f");
            drawfloor("F1temp",1,floor1,": Thermostat Temp");
            drawfloor("F2temp",2,floor2,": Thermostat Temp");
            drawfloor("F3temp",3,floor3,": Thermostat Temp");
        });
        $("#white").click(function () {
            color = "black";
            $("h2").css("color","black");
            $("body").css("background-color","white");
            drawfloor("F1temp",1,floor1,": Thermostat Temp");
            drawfloor("F2temp",2,floor2,": Thermostat Temp");
            drawfloor("F3temp",3,floor3,": Thermostat Temp");
        });

    });
});
