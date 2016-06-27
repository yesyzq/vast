/* get data and create buttons*/
var data={};
var floor="";
var zone="";
var sensor="";

$(document).ready(function(){
    $.getJSON("dict.json", function (json){
        data=json;
        for(key in json){
            var i=key[2];
            var j=key[6];
            var id_name='F_'+i+'_Z_'+j;
            var parent=document.getElementById("sensor");
            var ul=document.createElement("ul");
            //ul.setAttribute({'id':id_name,'class':'dropdown-menu','role':'menu','style':'display:none'});
            ul.setAttribute('id',id_name);
            ul.setAttribute('class','dropdown-menu');
            ul.setAttribute('role','menu');
            ul.setAttribute('style','display:none');
            parent.appendChild(ul);

            for(key in json[key]){
                var grand_parent=document.getElementById(id_name);
                var parent=document.createElement("li");
                grand_parent.appendChild(parent);
                var child=document.createElement("a");
                child.setAttribute('class','sensor_button');
                child.innerHTML=key;
                parent.appendChild(child);
            }
        }

        /* manipulate the button */
        $('.select_button').on('click', toggle_floor);
        function toggle_floor(){
            floor=$(this).text();
            $('#'+floor).show();
            if(floor=='Floor1'){
                $('#para_coord').attr('src','pc1.html');
            }
            else if(floor=='Floor2'){
                $('#para_coord').attr('src','pc2.html');
            }
            else if(floor=='Floor3'){
                $('#para_coord').attr('src','pc3.html');
            }
            
        }
        $('#zone_bt').on('click', function(){
            $('#'+floor).toggle();
        })


        $('.zone_button').on('click', toggle_sensor);
        function toggle_sensor(){
            zone=$(this).text();
            var id_name='F_'+floor[5]+'_Z_'+zone[4];
            console.log(id_name);
            $('#'+id_name).show();
        }
        $('#sensor_bt').on('click', function(){
            var id_name='F_'+floor[5]+'_Z_'+zone[4];
            $('#'+id_name).toggle();
        })


        $('.sensor_button').on('click', function(){
            sensor=$(this).text();
            console.log(sensor);
            draw_canvas();
        });


        function draw_canvas() {
            /* get the data array */
            zone1="F_"+floor[5]+"_Z_"+zone[4];
            console.log(zone1);
            var prox = data[zone1][zone1];
            var reheat = data[zone1][sensor];

            for (var i = 0; i < 24; i++) {
                eval("prox_h" + i + "=[\"h" + i + "\"];");
            }
            for (var i = 0; i < 24; i++) {
                eval("reheat_h" + i + "=[\"h" + i + "_x\"];");
            }

            var counter = 0;
            //data是从0点开始的还是什么?
            for (var i = 0; i < prox.length; i++) {
                if (counter % 24 != 0 || counter == 0) {
                    eval("prox_h" + counter + ".push(" + prox[i] + ");");
                    eval("reheat_h" + counter + ".push(" + reheat[i] + ");");
                }
                counter++;
                if (counter == 24) {
                    counter = 0;
                }
            }

            var xs = {};
            for (var i = 0; i < 24; i++) {
                eval("xs.h" + i + "= \'h" + i + "_x\';");
            }
            var column = [];
            for (var i = 0; i < 24; i++) {
                eval("column.push(reheat_h" + i + ");");
            }
            for (var i = 0; i < 24; i++) {
                eval("column.push(prox_h" + i + ");");
            }


            var obj = {
                data: {
                    xs: xs,
                    // data
                    columns: column,
                    type: 'scatter'
                },
                axis: {
                    x: {
                        label: 'F2_Z2 VAV REHEAT Damper Position',
                        tick: {
                            fit: false
                        }
                    },
                    y: {
                        label: 'F2_Z6 PROX'
                    }
                }
            };

            var chart = c3.generate(obj);

        }

    });
});

//document.getElementById('pc').src='pc.html?floor='+floor;

