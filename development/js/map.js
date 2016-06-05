
mapboxgl.accessToken = 'pk.eyJ1IjoiY29sbG53YWxrciIsImEiOiJjaW95d2FmOTcwMGNmejBtNWw3ZHRuanQzIn0.0ykYaYqPm-P6WgXabZEN_g';

//var grid = turf.hex([-121, 46, -120.5, 49], .04);


var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/outdoors-v9', //stylesheet location
    center: [-122.17, 47.65], // starting position
    zoom: 10 // starting zoom
});

// DISABLE rotation
map.dragRotate.disable();

// PLACE navigation
map.addControl(new mapboxgl.Navigation({position: 'top-left'}));

// LAT and LONGs are swapped between Strava and Mapbox
var flip_lat_long = function(arr){
    var flipped_array = [];
    for(var i = 0; i < arr.length; i++){
        var flipped_array_element = arr[i].reverse();

        flipped_array.push(flipped_array_element);
    }

    return flipped_array;
};

// SORT Javascript Object -> array of Athletes by activity count
var sort_athletes = function(athletes){
    var sorted_athletes = [];

    for (var athlete in athletes)
        sorted_athletes.push([athletes[athlete], athletes[athlete].count])
    sorted_athletes.sort(function(a, b) {return a[1] - b[1]});

    return sorted_athletes.reverse();

};

// PUT top athletes into DOM
var display_top_athletes = function(sorted_athletes){
    var ul_athletes = document.getElementById('ul-athletes');

    // EMPTY ul
    while (ul_athletes.firstChild) {
        ul_athletes.removeChild(ul_athletes.firstChild);
    }

    for(var i = 0; i < sorted_athletes.length; i++){

        // first and last name
        var name = sorted_athletes[i][0].athlete.firstname + ' ' + sorted_athletes[i][0].athlete.lastname;
        // number of activities
        var athlete_count = sorted_athletes[i][1];


        //var athlete_picture = sorted_athletes[i][0].athlete.profile_medium;

        var span_name = document.createElement('span');
        span_name.className += 'span-name';

        var span_count = document.createElement('span');
        span_count.className += 'span_count';

        var li_athlete = document.createElement('li');
        li_athlete.className += 'li-athlete';
        var t_name = document.createTextNode(name);
        var t_count = document.createTextNode(athlete_count);

        span_name.appendChild(t_name);
        span_count.appendChild(t_count);

        li_athlete.appendChild(span_name);
        li_athlete.appendChild(span_count);

        ul_athletes.appendChild(li_athlete);
    }

};

map.on('load', function () {

    // GET ACTIVITY DATA
    d3.json('data/small_club_activity_5_30.json', function(err, activity_data) {
        // GET COORDINATES DATA
        d3.json('data/small_club_coordinates.json', function(err, coordinates_data) {

            // Create feature collection
            var activity_collection = {
                'type': 'FeatureCollection',
                'features':[]
            };

            // Athletes object for keeping track of most active
            var athletes = {};

            activity_data.forEach(function(activity) {
                // Retrive polyline property
                var poly = activity.map.summary_polyline;


                // IF activity is a ride
                if(poly){


                    // BEGIN athlete count
                    var athlete = activity.athlete;
                    if(!(athlete.id in athletes)){
                        athletes[athlete.id] = {
                            'athlete': athlete,
                            'count':1
                        };
                    } else{
                        athletes[athlete.id].count += 1;
                    }
                    // END athlete count




                    // convert polyline to lat_long
                    var lat_long = polyline.decode(poly);
                    // change date to time stamp in seconds
                    var activity_time = Math.round(new Date(activity.start_date_local).getTime()/1000);

                    var activity_element = {
                        'type': 'Feature',
                        'properties': {
                            'time': activity_time,
                            'athlete': athlete
                        },
                        'geometry':{
                            "type": "LineString",
                            "coordinates": flip_lat_long(lat_long)
                        }

                    };

                    // PUSH activity into collection
                    activity_collection.features.push(activity_element);

                } // END IF
            }); // END forEach


            map.addSource("heat-map", {
                "type": "geojson",
                "data": activity_collection
            });

            map.addLayer({
                "id": "heat-map",
                "type": "line",
                "source": "heat-map",
                "layout": {
                    "line-join": "miter",
                    "line-cap": "butt",
                    'visibility': 'visible'
                },
                "paint": {
                    "line-color": "#ff1a1a",
                    "line-width": 15,
                    "line-opacity": 0.15,
                    "line-blur":20
                }
            });

            // TRYING to bin
            /*
             var hexCount = turf.count(grid,activity_collection,'pt_count');

             var numberBreaks = 6;
             console.log(hexCount);
             var jenksbreaks = turf.jenks(hexCount,'pt_count', numberBreaks);
             var colors = ['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026'];
             var transparency = [.3,0.5,0.5,0.5,0.5,0.5];

             jenksbreaks.forEach(function(element,i){
             if (i > 0){
             jenksbreaks[i] = [element, colors[i-1],transparency[i-1]];
             }
             else{
             jenksbreaks[i] = [element, null];
             }
             });

             //console.log(grid);
             console.log(hexCount);
             //console.log(jenksbreaks);
             //console.log(activity_collection);


             map.addSource('hexGrid',{
                "type": "geojson",
                "data": grid
            });

            for(var i = 0; i < jenksbreaks.length; i++) {
                if (i > 0) {
                    map.addLayer({
                        "id": "hexGrid-" + (i - 1),
                        "type": "fill",
                        "source": "hexGrid",
                        "layout": {},
                        "paint": {
                            'fill-color': jenksbreaks[i][1],
                            'fill-opacity': jenksbreaks[i][2]
                        }
                    }, "airports");
                }
            }
            */



            map.addLayer({
                "id": "heat-map",
                "type": "circle",
                "source": "heat-map",
                "layout": {
                    'visibility': 'visible'
                },
                "paint": {
                    "circle-color": "#ff1a1a",
                    "circle-radius": 25,
                    "circle-opacity": 0.55,
                    "circle-blur":8
                }
            });



            // SORT athletes by activity count
            var sorted_athletes = sort_athletes(athletes);
            sorted_athletes = sorted_athletes.slice(0,5);


            display_top_athletes(sorted_athletes);

        }); //END d3 activity

    }); //END d3 coordinates
});

addLayer('Heat Map', 'heat-map');
//addLayer('Museums', 'museums');

function addLayer(name, id) {
    var label = document.createElement('label');
    label.innerHTML = name;

    var checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = true;

    label.appendChild(checkbox);

    checkbox.onclick = function (e) {

        var visibility = map.getLayoutProperty(id, 'visibility');

        if (visibility === 'visible') {
            checkbox.checked = false;
            map.setLayoutProperty(id, 'visibility', 'none');
            this.className = '';
        } else {
            checkbox.checked = true;
            this.className = 'active';
            map.setLayoutProperty(id, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('checkboxes');
    layers.appendChild(label);
}