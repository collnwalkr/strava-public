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
                segments[segment]["athlete_showcase"], segments[segment]["map"], 
                segments[segment]["start_latlng"], segments[segment]["end_latlng"]]);
        }

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


function popUp(){
    var pop_up_panel = document.getElementById('pop-up-panel');

    while (pop_up_panel.firstChild) {
        pop_up_panel.removeChild(pop_up_panel.firstChild);
    }
    // Segment Name
    segmentName = document.createElement('li');
    segmentName.className += 'li-segment-name';
    segmentName.appendChild(document.createTextNode(current_segment_detail[0]));
    pop_up_panel.appendChild(segmentName);

    // Segment attempts by athletes
    segmentAttemptsByAthletes = document.createElement('li');
    segmentAttemptsByAthletes.className += 'li-segment-attempts-by-athletes';
    var text = current_segment_detail[1] + " attempts by " + current_segment_detail[2] + " people";
    segmentAttemptsByAthletes.appendChild(document.createTextNode(text));
    pop_up_panel.appendChild(segmentAttemptsByAthletes);


    // Segment description
    segmentDescription1 = document.createElement('li');
    segmentDescription1.className += 'li-segment-description';
    var span_distance = document.createElement('span');
    span_distance.className += "value"
    span_distance.appendChild(document.createTextNode(current_segment_detail[3].toFixed(1)));

    var span_distance_unit = document.createElement('span');
    span_distance_unit.className += "unit";
    span_distance_unit.appendChild(document.createTextNode("km"));


    var span_ave_grade = document.createElement('span');
    span_ave_grade.className += "value"
    span_ave_grade.appendChild(document.createTextNode(current_segment_detail[4].toFixed(1)));

    var span_ave_grade_unit = document.createElement('span');
    span_ave_grade_unit.className += "unit";
    span_ave_grade_unit.appendChild(document.createTextNode("%"));

    var span_ele_low = document.createElement('span');
    span_ele_low.className += "value"
    if (current_segment_detail[5] != "null")
        span_ele_low.appendChild(document.createTextNode(current_segment_detail[5].toFixed(1)));

    var span_ele_low_unit = document.createElement('span');
    span_ele_low_unit.className += "unit";
    span_ele_low_unit.appendChild(document.createTextNode("m"));

    segmentDescription1.appendChild(span_distance);
    segmentDescription1.appendChild(span_distance_unit);
    segmentDescription1.appendChild(span_ave_grade);
    segmentDescription1.appendChild(span_ave_grade_unit);
    segmentDescription1.appendChild(span_ele_low);    
    segmentDescription1.appendChild(span_ele_low_unit);
    pop_up_panel.appendChild(segmentDescription1);

    segmentDescription1Tag = document.createElement('li');
    segmentDescription1Tag.className += 'li-segment-description-tag';
    var span_distance_tag = document.createElement('span');
    span_distance_tag.appendChild(document.createTextNode("Distance"));
    span_distance_tag.className += "unit-name"
    var span_ave_grade_tag = document.createElement('span');
    span_ave_grade_tag.appendChild(document.createTextNode("Ave Grade"));
    span_ave_grade_tag.className += "unit-name"
    var span_ele_low_tag = document.createElement('span');
    span_ele_low_tag.appendChild(document.createTextNode("Lowest Elev"));
    span_ele_low_tag.className += "unit-name"
    segmentDescription1Tag.appendChild(span_distance_tag);
    segmentDescription1Tag.appendChild(span_ave_grade_tag);
    segmentDescription1Tag.appendChild(span_ele_low_tag);
    pop_up_panel.appendChild(segmentDescription1Tag);

    segmentDescription2 = document.createElement('li');
    segmentDescription2.className += 'li-segment-description';
    var span_ele_high = document.createElement('span');
    if (current_segment_detail[6] != "null")
        span_ele_high.appendChild(document.createTextNode(current_segment_detail[6].toFixed(1)));
    span_ele_high.className += "value"

    var span_ele_high_unit = document.createElement('span');
    span_ele_high_unit.className += "unit";
    span_ele_high_unit.appendChild(document.createTextNode("m"));

    var span_ele_diff = document.createElement('span');
    if (current_segment_detail[7] != "null")
        span_ele_diff.appendChild(document.createTextNode(current_segment_detail[7].toFixed(1)));
    span_ele_diff.className += "value"

    var span_ele_diff_unit = document.createElement('span');
    span_ele_diff_unit.className += "unit";
    span_ele_diff_unit.appendChild(document.createTextNode("m"));


    var span_climb = document.createElement('span');
    span_climb.appendChild(document.createTextNode(current_segment_detail[8]));
    span_climb.className += "value"
    segmentDescription2.appendChild(span_ele_high);
    segmentDescription2.appendChild(span_ele_high_unit);
    segmentDescription2.appendChild(span_ele_diff);
    segmentDescription2.appendChild(span_ele_diff_unit);
    segmentDescription2.appendChild(span_climb);
    pop_up_panel.appendChild(segmentDescription2);

    segmentDescription2Tag = document.createElement('li');
    segmentDescription2Tag.className += 'li-segment-description-tag';
    var span_ele_high_tag = document.createElement('span');
    span_ele_high_tag.appendChild(document.createTextNode("Highest Elev"));
    span_ele_high_tag.className += "unit-name"
    var span_ele_diff_tag = document.createElement('span');
    span_ele_diff_tag.appendChild(document.createTextNode("Elev Difference"));
    span_ele_diff_tag.className += "unit-name"
    var span_climb_tag = document.createElement('span');
    span_climb_tag.appendChild(document.createTextNode("Climb Category"));
    span_climb_tag.className += "unit-name"
    segmentDescription2Tag.appendChild(span_ele_high_tag);
    segmentDescription2Tag.appendChild(span_ele_diff_tag);
    segmentDescription2Tag.appendChild(span_climb_tag);
    pop_up_panel.appendChild(segmentDescription2Tag);

    segmentShowcaseTitle = document.createElement('li');
    segmentShowcaseTitle.className += 'li-segment-showcase-title';
    segmentShowcaseTitle.appendChild(document.createTextNode("Top 5 Club Segment Effort"));
    pop_up_panel.appendChild(segmentShowcaseTitle);

    segmentHeader = document.createElement('li');
    segmentHeader.className += 'li-segment-description-tag';
    var span_athlete = document.createElement('span');
    span_athlete.appendChild(document.createTextNode("Athlete"));
    span_athlete.className += "unit-name"
    var span_time = document.createElement('span');
    span_time.appendChild(document.createTextNode("Time"));
    span_time.className += "unit-name"
    var span_speed = document.createElement('span');
    span_speed.appendChild(document.createTextNode("Speed"));
    span_speed.className += "unit-name"
    segmentHeader.appendChild(span_athlete);
    segmentHeader.appendChild(span_time);
    segmentHeader.appendChild(span_speed);
    pop_up_panel.appendChild(segmentHeader);

    var showcases = current_segment_detail[9];
    for (var showcase in showcases){
        var athlete_name = showcases[showcase][0];
        var athlete_time = showcases[showcase][1];
        var athlete_speed = showcases[showcase][2];

        var li_showcase = document.createElement('li');
        li_showcase.className += 'li-segment-showcase';

        var span_athlete_name = document.createElement('span');
        span_athlete_name.appendChild(document.createTextNode(athlete_name));
        var span_athlete_time = document.createElement('span');
        span_athlete_time.appendChild(document.createTextNode(athlete_time));
        var span_athlete_speed = document.createElement('span');
        span_athlete_speed.appendChild(document.createTextNode(athlete_speed));
        li_showcase.appendChild(span_athlete_name);
        li_showcase.appendChild(span_athlete_time);
        li_showcase.appendChild(span_athlete_speed);
        pop_up_panel.appendChild(li_showcase);

    }
}

function hightLightEvent(){
    var event = new Event('highlight',{"bubbles":true, "cancelable":false});
    document.dispatchEvent(event);
}

function click_table_row(){
    var segment_entires = document.getElementsByClassName('li-segment-s');
    for (var i = 0; i < segment_entires.length; i++) {
        segment_entires[i].onclick = function(e) {

            var clicked_row_index = e.target.id.split("-")[1];
            
            current_segment_detail = sorted_current_segment[clicked_row_index];
            popUp();
            hightLightEvent();
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

d3.json("data/processed_segment_complete.json", function(error, data){
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
