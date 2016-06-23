$(document).ready(function () {
    'use strict';
    $.getJSON('route.json', function (data) {
        var de_array = [],
            de_html = '<option value="All">' + "All" + '</option>',
            len = data.length;
        for (var i = 0; i <= len - 1; i++) {
            de_array.push(data[i].Department);
        }

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        var unique_dp = de_array.filter(onlyUnique);
        var dp_len = unique_dp.length;
        for (var i = 0; i <= dp_len - 1; i++) {
            de_html += '<option value="' + unique_dp[i] + '">' + unique_dp[i] + '</option>';
        }
        $('#department').append(de_html);

        var day = 1;
        var dayFilter = function (data, day) {
            var tempData = [];
            for (var i = 0; i < data.length; i++) {
                var tempElm = {
                    "Department": data[i].Department,
                    "route": []
                };
                var tempRoute = [];
                for (var j = 0; j < data[i].route.length; j++) {
                    if (data[i].route[j].day == day) {
                        tempRoute.push(data[i].route[j]);
                    }
                }
                tempElm.route = tempRoute;
                tempData.push(tempElm);
            }
            return tempData;
        };

        var timeFilter = function (data, start, end) {
            var tempData = [];
            for (var i = 0; i < data.length; i++) {
                var tempElm = {
                    "Department": data[i].Department,
                    "route": []
                };
                var tempRoute = [];
                for (var j = 0; j < data[i].route.length; j++) {
                    if (data[i].route[j].time > start && data[i].route[j].time < end) {
                        tempRoute.push(data[i].route[j]);
                    }
                }
                tempElm.route = tempRoute;
                tempData.push(tempElm);
            }
            return tempData;
        };

        var staff_array = [];
        var staff_html = '<option value="All">' + "All" + '</option>';
        for (var i = 0; i <= len - 1; i++) {
            staff_array.push(data[i].card_nanme);
        }
        var unique_staff = staff_array.filter(onlyUnique);
        var staff_len = unique_staff.length;
        for (var i = 0; i <= staff_len - 1; i++) {
            staff_html += '<option value="' + unique_staff[i] + '">' + unique_staff[i] + '</option>';
        }
        $('#staff').append(staff_html);

        // get the selected department
        var dp_id_select = document.getElementById("department");
        var dp_id = dp_id_select.options[dp_id_select.selectedIndex].value;

        // get the selected staff
        var staff_id_select = document.getElementById("staff");
        var staff_id = staff_id_select.options[staff_id_select.selectedIndex].value;

        select_route(data, dp_id, staff_id);

        var mydata = timeFilter(data, 0, 86400 * 14);
        $("#day_slider").rangeSlider({
            step: 100 / 14,
            formatter: function (val) {
                return Math.floor(val / 7).toString();
            },
            defaultValues: {
                min: 0,
                max: 10
            }
        });


        $("#day_slider").bind("valuesChanged", function (e, data) {
            day = Math.floor(data.values.max / 7);
            $('#day').html(day);
            refreshRoute();
        });

        $("#slider").rangeSlider({
            range: {
                min: 0,
                max: 86400
            },
            formatter: function (val) {
                return Math.round(val * 864).toString();
            },
            defaultValues: {
                min: 0,
                max: 100 / 24
            },
            wheelMode: "scroll",
            wheelSpeed: 46.62,
            scales: [
                  // Primary scale
                {
                    first: function (val) {
                        return val;
                    },
                    next: function (val) {
                        return val + 100 / 24;
                    },
                    stop: function (val) {
                        return false;
                    },
                    label: function (val) {
                        return Math.round(val * 24) / 100;
                    },
                    format: function (tickContainer, tickStart, tickEnd) {
                        tickContainer.addClass("myCustomClass");
                    }
                  }
                ]
        });

        $("#slider").bind("valuesChanged", function (e, timedata) {
            var start = Math.round(timedata.values.min * 864);
            var end = Math.round(timedata.values.max * 864);
            var startHour = Math.floor(start / 3600);
            var startMinute = Math.floor((start % 3600) / 60);
            var endHour = Math.floor(end / 3600);
            var endMinute = Math.floor((end % 3600) / 60);
            $('.slider-time').html(startHour + ':' + startMinute);
            $('.slider-time2').html(endHour + ':' + endMinute);
            $('#day').html(day);
            var mydata = timeFilter(data, start + (day - 1) * 86400, end + (day - 1) * 86400);
        });

        function select_route(data, dp_id, staff_id) {
            if ((dp_id === "All") && (staff_id === "All")) {
                for (var i = 0; i <= data.length - 1; i++) {
                    draw_route(data, data[i].Department, data[i].card_nanme);
                }
            } else if ((dp_id === "All") && (staff_id !== "All")) {
                for (var i = 0; i <= data.length - 1; i++) {
                    if (data[i].card_nanme === staff_id) {
                        draw_route(data, data[i].Department, staff_id);
                        break;
                    }
                }
            } else if ((dp_id !== "All") && (staff_id === "All")) {
                for (var i = 0; i <= data.length - 1; i++) {
                    if (data[i].Department === dp_id) {
                        draw_route(data, dp_id, data[i].card_nanme);
                    }
                }
            } else if ((dp_id !== "All") && (staff_id !== "All")) {
                draw_route(data, dp_id, staff_id);
            }
        }

        var positionTable = {
            "11": {
                x: 550,
                y: 240
            },
            "12": {
                x: 100,
                y: 105
            },
            "13": {
                x: 50,
                y: 290
            },
            "14": {
                x: 160,
                y: 240
            }, // (260, 240) ,(450, 240)
            "15": {
                x: 310,
                y: 90
            },
            "16": {
                x: 310,
                y: 323
            },
            "17": {
                x: 496,
                y: 419
            },
            "18": {
                x: 550,
                y: 419
            },
            "21": {
                x: 774,
                y: 332
            },
            "22": {
                x: 650,
                y: 230
            },
            "23": {
                x: 1041,
                y: 60
            },
            "24": {
                x: 731,
                y: 240
            }, //(834, 240) , (1020, 240)
            "25": {
                x: 685,
                y: 325
            },
            "26": {
                x: 950,
                y: 340
            },
            "27": {
                x: 970,
                y: 150
            },
            "31": {
                x: 775,
                y: 770
            },
            "32": {
                x: 960,
                y: 680
            },
            "33": {
                x: 656,
                y: 710
            },
            "34": {
                x: 730,
                y: 690
            }, //(830, 690)
            "35": {
                x: 1060,
                y: 690
            },
            "36": {
                x: 660,
                y: 518
            },
        };

        function draw_route(data, dp_id, staff_id) {
            var temp = [];
            for (var i = 0; i <= data.length - 1; i++) {
                if ((data[i].Department === dp_id) && (data[i].card_nanme === staff_id)) {
                    for (var j = 0; j < data[i].route.length; j++) {
                        temp.push(data[i].route[j]);
                    }
                }
            }

            var location = MatrixCal(temp);

        }

        function MatrixCal(temp) {
            var result = [];
            for (var i = 0; i < data.length; i++) {
                var zone = parseInt(data[i].data);
                if ((typeof data[i].floor === 'number') && (!isNaN(zone))) {
                    result.push(positionTable[(zone + data[i].floor * 10).toString()]); //Bug here
                }
            }
            return result;
        }

        var refreshRoute = function () {

        }

        refreshRoute();
    });
});