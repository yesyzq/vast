$(document).ready(function() 
{
        $.getJSON('route.json', function(data)
        {   
            var de_array = [];
            var de_html = '';
            var len = data.length;
            for (var i = 0; i <= len -1; i++)
                {
                    de_array.push(data[i].Department);
                }
            function onlyUnique(value, index, self)
            {
                return self.indexOf(value) === index;
            }
            var unique_dp = de_array.filter(onlyUnique);
            var dp_len = unique_dp.length;
            for (var i = 0; i <= dp_len - 1; i++)
                {
                    de_html += '<option value="' + unique_dp[i] + '">' + unique_dp[i] + '</option>';
                }
            $('.department').append(de_html);
            
            var day=1;
            var dayFilter = function(data,day)
            {
                var tempData=[];
                for(var i=0;i<data.length;i++)
                {
                    var tempElm = {"Department":data[i].Department,"route":[]};
                    var tempRoute=[];
                    for(var j=0;j<data[i].route.length;j++)
                    {
                        if(data[i].route[j].day == day)
                        {
                            tempRoute.push(data[i].route[j]);
                        }
                    }
                    tempElm.route = tempRoute;
                    tempData.push(tempElm);
                }
                //console.log(tempData);
                return tempData;
            };

            var timeFilter = function(data,start,end)
            {
                var tempData=[];
                for(var i=0;i<data.length;i++)
                {
                    var tempElm = {"Department":data[i].Department,"route":[]};
                    var tempRoute=[];
                    for(var j=0;j<data[i].route.length;j++)
                    {
                        if(data[i].route[j].time >start && data[i].route[j].time<end)
                        {
                            tempRoute.push(data[i].route[j]);
                        }
                    }
                    tempElm.route = tempRoute;
                    tempData.push(tempElm);
                }
                return tempData;
            };
            
            var staff_array = [];
            var staff_html = '';
            for (var i = 0; i <= len -1; i++)
                {
                    staff_array.push(data[i].card_nanme);
                }
            var unique_staff = staff_array.filter(onlyUnique);
            var staff_len = unique_staff.length;
            for (var i = 0; i <= staff_len - 1; i++)
                {
                    staff_html += '<option value="' + unique_staff[i] + '">' + unique_staff[i] + '</option>';
                }
            $('.staff').append(staff_html);
            
            var mydata = timeFilter(data,0,86400*14);
            $("#day_slider").rangeSlider({
                step: 100/14,
                formatter:function(val) 
                {
                    return Math.floor(val /7).toString();
                },
                defaultValues:{min: 0, max: 10}
            });
            
            
            $("#day_slider").bind("valuesChanged", function(e, data)
            {
              console.log("Values just changed. min: " + data.values.min + " max: " + data.values.max);
                day = Math.floor(data.values.max/7);
                $('#day').html(day);
            });

            $("#slider").rangeSlider({
                range: {min: 0, max: 86400},
                formatter:function(val)
                {
                    return Math.round(val*864).toString();
                },
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

            $("#slider").bind("valuesChanged", function(e, timedata)
            {
                total=0;
                var start = Math.round(timedata.values.min*864);
                var end = Math.round(timedata.values.max*864);
                var startHour = Math.floor(start/3600);
                var startMinute = Math.floor((start%3600)/60);
                var endHour = Math.floor(end/3600);
                var endMinute = Math.floor((end%3600)/60);
                $('.slider-time').html(startHour + ':' + startMinute);
                $('.slider-time2').html(endHour + ':' + endMinute);
                $('#day').html(day);
                var mydata = timeFilter(data,start+(day-1)*86400,end+(day-1)*86400);
            });
        });
});