var current_segment_ids = [1212,48, 23]; // a list of segment id, changing as the current window changes

var sorted_segment_info = function (segments){
        var sorted_segments = [];
        for (var segment in segments)
            //console.log("From the function: ", segment)
            sorted_segments.push([segments[segment]["Name"], segments[segment]["# of Attempts"]]);

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

d3.csv("data/segment_info.csv", function(error, data){
    var current_segment_info = []

    data.forEach(function(d) {

        d['# of Attempts'] = +d['# of Attempts'];
        d['segment_id'] = +d['segment_id'];
        var segment_id = d.segment_id;
        if (current_segment_ids.indexOf(segment_id) !== -1){
            current_segment_info.push(d);            
        }
    });
  
    var sorted_current_segment_info = sorted_segment_info(current_segment_info);
    //sorted_current_segment_info = sorted_current_segment_info.slice(0,30);
    display_top_segments(sorted_current_segment_info);


});
