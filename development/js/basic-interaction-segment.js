(function(){



    var set_toggle_segment_table = function(){
        var segment_list_chevron_right = document.getElementById('list-activity-chevron-right-s');
        var segment_list_chevron_down = document.getElementById('list-activity-chevron-down-s');
        var segment_list          = document.getElementById('list-table-segment');

        segment_list_chevron_down.onclick = function(e){
            segment_list_chevron_down.classList.add('hidden');
            segment_list_chevron_right.classList.remove('hidden');
            segment_list.style.maxHeight = 0;
        };

        segment_list_chevron_right.onclick = function(e){
            segment_list_chevron_down.classList.remove('hidden');
            segment_list_chevron_right.classList.add('hidden');
            segment_list.style.maxHeight = '365px';
        };

    };

    set_toggle_segment_table();


}());

