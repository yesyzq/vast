$(document).ready(function() {
    var floor1 = [ '1', '2','3', '4','5', '7','8A', '8B'],
        floor2 = [ '1','2','3','4','5','6', '7','8','9','10','11','12A','12B','12C','14','15','16'],
        floor3 = [ '1','2','3','5','6','7', '8', '9','10','11A', '11B','11C', '12'];
    var color ="black";
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
        var drawPower = function(floor,floorArray,suffix,id){
            var F1Power = echarts.init(document.getElementById(id),building_theme);
            var F1PowerSeries = [];
            var names = [];
            for(var zone of floorArray){
                var name = "F_"+floor+"_Z_" + zone+suffix;
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
        var drawcoolingcoil = function(){
            var temp = echarts.init(document.getElementById("coolingcoil"),building_theme);
            var F1 = "F_1_VAV_SYS COOLING COIL Power";
            var F2 = "F_2_VAV_SYS COOLING COIL Power";
            var F3 = "F_3_VAV_SYS COOLING COIL Power";
            var Series = [{
                name: F1,
                type: 'line',
                data: data[F1]
            }, {
                name: F2,
                type: 'line',
                data: data[F2]
            }, {
                name: F3,
                type: 'line',
                data: data[F3]
            }];
            temp.setOption(getOption(x_axis,Series,[F1,F2,F3]));
        };
        drawTotalElec();
        drawPower(1,floor1,": Equipment Power",'F1Power');
        drawPower(1,floor1," REHEAT COIL Power",'reheat');
        drawcoolingcoil();
        $("#floor1").click(function(){
            drawPower(1,floor1,": Equipment Power",'F1Power');
            drawPower(1,floor1," REHEAT COIL Power",'reheat');
        });
        $("#floor2").click(function(){
            drawPower(2,floor2,": Equipment Power",'F1Power');
            drawPower(2,floor2," REHEAT COIL Power",'reheat');
        });
        $("#floor3").click(function(){
            drawPower(3,floor3,": Equipment Power",'F1Power');
            drawPower(3,floor3," REHEAT COIL Power",'reheat');
        });
        $("#black").click(function () {
            color = "white";
            $("h2").css("color","white");
            $("body").css("background-color","#0f0f0f");
            drawTotalElec();
            drawcoolingcoil();
            drawPower(1,floor1,": Equipment Power",'F1Power');
            drawPower(1,floor1," REHEAT COIL Power",'reheat');
        });
        $("#white").click(function () {
            color = "black";
            $("h2").css("color","black");
            $("body").css("background-color","white");
            drawTotalElec();
            drawcoolingcoil();
            drawPower(1,floor1,": Equipment Power",'F1Power');
            drawPower(1,floor1," REHEAT COIL Power",'reheat');
        });
    });
});
