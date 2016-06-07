var cached_segment;
var sorted_current_segment;
var current_segment_detail;
// should change to segments_in_view
var sorted_segment_info = function (segments){
        var sorted_segments = [];
        for (var segment in segments){
            sorted_segments.push([segments[segment]["segment_name"], segments[segment]["# of attempts"], 
                segments[segment]["# of athletes"],  segments[segment]["distance"], 
                segments[segment]["average_grade"], segments[segment]["elevation_low"], 
                segments[segment]["elevation_high"], segments[segment]["elevation_diff"], 
                segments[segment]["climb_category"], 
                segments[segment]["athlete_showcase"]]);
        }

        sorted_segments.sort(function(a, b) {return a[1] - b[1]});
        return sorted_segments.reverse();
        /*
         for (var segment in segments){
            sorted_segments.push({"segment_name" : segments[segment]["segment_name"], "# of attempts": segments[segment]["# of attempts"], 
                "# of athletes" : segments[segment]["# of athletes"],  "elevation_low" : segments[segment]["elevation_low"], 
                "elevation_high" : segments[segment]["elevation_high"], "elevation_diff" : segments[segment]["elevation_diff"], 
                "distance" : segments[segment]["distance"], "climb_category" : segments[segment]["climb_category"], 
                "athlete_showcase" : segments[segment]["athlete_showcase"]});
        }
        console.log("From the function: ", sorted_segments);
            

        sorted_segments.sort(function(a, b) {return a["# of attempts"] - b["# of attempts"]});
        return sorted_segments.reverse();
        */
    }

var display_top_segments = function(sorted_segments){
    var ul_segments = document.getElementById('ul-segments');

    // EMPTY ul
    while (ul_segments.firstChild) {
        ul_segments.removeChild(ul_segments.firstChild);
    }

    for(var i = 0; i < sorted_segments.length; i++){

        // first and last name
        var name = sorted_segments[i][0];
        // number of activities
        var attempt_count = sorted_segments[i][1];

        var span_name = document.createElement('span');
        span_name.className += 'span-name';
        span_name.id += 'segment-' + i;

        var span_count = document.createElement('span');
        span_count.className += 'span_count';
        span_count.id += 'segment-' + i;
        var li_segment = document.createElement('li');
        li_segment.className += 'li-segment-s';
        li_segment.id += 'segment-' + i;
        var t_name = document.createTextNode(name);
        var t_count = document.createTextNode(attempt_count);

        span_name.appendChild(t_name);
        span_count.appendChild(t_count);

        li_segment.appendChild(span_name);
        li_segment.appendChild(span_count);

        ul_segments.appendChild(li_segment);
    }

};

function updateSegments(segments_in_view){
    render_segment_tb(segments_in_view);
}

function render_segment_tb(segments_in_view){
    var current_segment_info = [];
    cached_segment.forEach(function(d) {

        d['# of attempts'] = +d['# of attempts'];
        d['segment_id'] = +d['segment_id'];
        var segment_id = d.segment_id;
        if (segments_in_view.indexOf(segment_id) !== -1){
            current_segment_info.push(d);            
        }
    });

 
    sorted_current_segment = sorted_segment_info(current_segment_info);
    sorted_current_segment = sorted_current_segment.slice(0,30);
    display_top_segments(sorted_current_segment);
    click_table_row();
}



//var segment = d3.json("data/processed_segment.json");
//render_segment_tb(segments_in_view);

function popUp(){
    var svgContainer = d3.select("#right-column")
    .append("svg")
    .attr("width", 200)
    .attr("height", 200);

    var circle = svgContainer
    .append("circle")
    .color("black")
    .attr("cx", 30)
    .attr("cy", 30)
    .attr("r", 20)
}

function click_table_row(){
    var segment_entires = document.getElementsByClassName('li-segment-s');
    for (var i = 0; i < segment_entires.length; i++) {
        segment_entires[i].onclick = function(e) {

            var clicked_row_index = e.target.id.split("-")[1];
            
            current_segment_detail = sorted_current_segment[clicked_row_index];
            popUp();
            /*
            var clicked_segment_id = sorted_current_segment[clicked_row_index][2];
            console.log(clicked_segment_id);
            
            cached_segment.forEach(function(d) {
                if (d["segment_id"] == clicked_segment_id){
                    console.log(d);
                }
            });
            */
        }
    }
}

d3.json("data/processed_segment.json", function(error, data){
    var current_segment_info = [];
    cached_segment = data;
    data.forEach(function(d) {

        d['# of attempts'] = +d['# of attempts'];
        d['segment_id'] = +d['segment_id'];
        var segment_id = d.segment_id;
        if (segments_in_view.indexOf(segment_id) !== -1){
            current_segment_info.push(d);            
        }
    });


    sorted_current_segment = sorted_segment_info(current_segment_info);

    sorted_current_segment = sorted_current_segment.slice(0,30);
    display_top_segments(sorted_current_segment);
    click_table_row();

});

