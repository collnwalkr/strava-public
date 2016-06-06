
mapboxgl.accessToken = 'pk.eyJ1IjoiY29sbG53YWxrciIsImEiOiJjaW95d2FmOTcwMGNmejBtNWw3ZHRuanQzIn0.0ykYaYqPm-P6WgXabZEN_g';

var athletes = {};
var g_activity_data = {};
var activity_collection = {
    'type': 'FeatureCollection',
    'features':[]
};
var map_loaded = false;

var source = new mapboxgl.GeoJSONSource({
    data: activity_collection
});

var bounds = [
    [-121.17, 47.3], // Southwest coordinates
    [-123, 48]  // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/light-v9', //stylesheet location
    //style: 'mapbox://styles/collnwalkr/95e48988', //stylesheet location
    center: [-122.17, 47.65], // starting position
    zoom: 10,// starting zoom
    minZoom: 9,
    maxBounds: bounds // Sets bounds as max
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
    d3.json('data/small_club_activity_6_4.json', function(err, activity_data) {
        // GET COORDINATES DATA
        d3.json('data/small_club_coordinates.json', function(err, coordinates_data) {


            g_activity_data = activity_data;

            // Display the heat map
            displayHeatMap(activity_data, athletes);
            map_loaded = true;

            map.addSource('hexGrid', grid_source);

            makeSeattleHexGrid();

            // SORT athletes by activity count
            var sorted_athletes = sort_athletes(athletes);
            sorted_athletes = sorted_athletes.slice(0,5);


            display_top_athletes(sorted_athletes);

        }); //END d3 activity

    }); //END d3 coordinates
});

var grid = turf.hexGrid([-122.5, 47.5, -122.1, 47.8], 1, 'miles');


var grid_source = new mapboxgl.GeoJSONSource({
    data: grid
});

var jenksbreaks = {};

function makeSeattleHexGrid(){


    for(var i = 0; i < jenksbreaks.length; i++) {
        if (i > 0) {
            if (map.getLayer('hexGrid-' + (i - 1))) {
                map.removeLayer('hexGrid-' + (i - 1));
            }
        }
    }

    var hexCount = turf.count(grid, activity_collection,'pt_count');

    jenksbreaks = turf.jenks(hexCount,'pt_count', 6);

    var colors = ['#000000','#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026'];
    var transparency = [0,0.6,0.6,0.6,0.6,0.6];



    jenksbreaks.forEach(function(element,i){
        if (i > 0){
            jenksbreaks[i] = [element, colors[i-1],transparency[i-1]];
        }
        else{jenksbreaks[i] = [element, null];
        }
    });



    plotGrid(jenksbreaks);

}

function plotGrid(jenksbreaks){

    for(var i = 0; i < jenksbreaks.length; i++) {
        if (i > 0) {

            map.addLayer({
                "id": "hexGrid-" + (i - 1),
                "type": "fill",
                "source": "hexGrid",
                "layout": {},
                "paint": {
                    'fill-color': jenksbreaks[i][1],
                    'fill-opacity': jenksbreaks[i][2]}
            }, "heat-map");
        }
    }

    jenksbreaks.forEach(function(jenksbreak, i) {
        if (i > 0) {
            var filters = ['all', ['<=', 'pt_count', jenksbreak[0]]];
            if (i > 1) {
                filters.push(['>', 'pt_count', jenksbreaks[i - 1][0]]);
                map.setFilter('hexGrid-' + (i - 1), filters);
            }
        }
    });
}

function updateSeattleHexGrid(){
    for(var i = 0; i < jenksbreaks.length; i++) {
        if (i > 0) {
            if (map.getLayer('hexGrid-' + (i - 1))) {
                map.removeLayer('hexGrid-' + (i - 1));
            }
        }
    }

    turf.count(grid, activity_collection,'pt_count');

    grid_source.setData(grid);

    plotGrid(jenksbreaks);
}

function updateAthletes(athletes){
    var sorted_athletes = sort_athletes(athletes);
    sorted_athletes = sorted_athletes.slice(0,5);

    display_top_athletes(sorted_athletes);
}

function updateHeatMap(activity_data, athletes){

    if(map_loaded){
        activity_collection.features = [];

        createCollection(activity_data, athletes);

        source.setData(activity_collection);
        updateSeattleHexGrid();
    }

}

function displayHeatMap(activity_data, athletes){

    // Athletes object for keeping track of most active
    createCollection(activity_data, athletes);

    map.addSource("heat-map", source);

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

}

function createCollection(activity_data, athletes){

    // RESET athlete count
    for(var athlete in athletes){
        athletes[athlete].count = 0;
    }

    console.log(athletes);

    activity_data.forEach(function(activity) {
        // Retrive polyline property
        var poly = activity.map.summary_polyline;




        // IF activity is a ride
        if(poly){


            // convert polyline to lat_long
            var lat_long = polyline.decode(poly);
            // change date to time stamp in seconds
            var activity_time = Math.round(new Date(activity.start_date_local).getTime()/1000);
            var activity_id = activity.id;

            if(current_activities.indexOf(activity_id) !== -1){

                var coordinate_arr = flip_lat_long(lat_long);

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

                for(var j=0; j< coordinate_arr.length - 20; j += 20){
                    // BEGIN make feature
                    var activity_element = {
                        'type': 'Feature',
                        'properties': {
                            'time': activity_time,
                            'id': activity_id,
                            'athlete': athlete
                        },
                        'geometry':{
                            "type": "Point",
                            "coordinates": coordinate_arr[j]
                        }

                    };
                    // END make feature


                    // PUSH activity into collection
                    activity_collection.features.push(activity_element);
                }


            }


        } // END IF
    }); // END forEach
}

toggleLayer('Heat Map', 'heat-map');
//toggleLayer('Museums', 'museums');

function toggleLayer(name, id) {
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