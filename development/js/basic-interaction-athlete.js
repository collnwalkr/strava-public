(function(){



    var set_toggle_athlete_table = function(){
        var athlete_list_chevron_right = document.getElementById('list-activity-chevron-right');
        var athlete_list_chevron_down = document.getElementById('list-activity-chevron-down');
        var athlet_list          = document.getElementById('list-table-athlete');

        athlete_list_chevron_down.onclick = function(e){
            athlete_list_chevron_down.classList.add('hidden');
            athlete_list_chevron_right.classList.remove('hidden');
            athlet_list.style.maxHeight = 0;
        };

        athlete_list_chevron_right.onclick = function(e){
            athlete_list_chevron_down.classList.remove('hidden');
            athlete_list_chevron_right.classList.add('hidden');
            athlet_list.style.maxHeight = '365px';
        };

    };

    set_toggle_athlete_table();


}());

