var current_segment_ids = [1212,48, 23]; // a list of segment id, changing as the current window changes
var cached_segment;
// should change to segments_in_view
var sorted_segment_info = function (segments){
        var sorted_segments = [];
        for (var segment in segments)
            //console.log("From the function: ", segment)
            sorted_segments.push([segments[segment]["segment_name"], segments[segment]["# of attempts"]]);

        sorted_segments.sort(function(a, b) {return a[1] - b[1]});
        return sorted_segments.reverse();
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
        console.log(name);
        // number of activities
        var attempt_count = sorted_segments[i][1];
        console.log(attempt_count);

        var span_name = document.createElement('span');
        span_name.className += 'span-name';

        var span_count = document.createElement('span');
        span_count.className += 'span_count';

        var li_segment = document.createElement('li');
        li_segment.className += 'li-segment';
        console.log(li_segment);
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

    //console.log(segment)
  
    var sorted_current_segment_info = sorted_segment_info(current_segment_info);
    sorted_current_segment_info = sorted_current_segment_info.slice(0,5);
    display_top_segments(sorted_current_segment_info);
}


//var segment = d3.json("data/processed_segment.json");
//render_segment_tb(segments_in_view);

d3.json("data/processed_segment.json", function(error, data){
    var current_segment_info = [];
    console.log(segments_in_view);
    cached_segment = data;
    data.forEach(function(d) {

        d['# of attempts'] = +d['# of attempts'];
        d['segment_id'] = +d['segment_id'];
        var segment_id = d.segment_id;
        if (segments_in_view.indexOf(segment_id) !== -1){
            current_segment_info.push(d);            
        }
    });


    var sorted_current_segment_info = sorted_segment_info(current_segment_info);

    console.log(current_segment_info);
    //sorted_current_segment_info = sorted_current_segment_info.slice(0,30);
    display_top_segments(sorted_current_segment_info);


});

