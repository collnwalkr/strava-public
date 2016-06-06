var selected_segment = [1,2]; // a list of segment id, changing as the current window changes


d3.csv("../data/segment_info.csv", function(error, data){
    data.forEach(function(d) {
        d['# of Attempts'] = +d['# of Attempts'];
    });

    // render the table
    var peopleTable = tabulate(data, ["Name", "# of Attempts"]);
    
    function render(method){
        d3.select(this).call(method);
    }

    function filter(){
        // To get the filtered data for table
    }

    function tabulate(data, columns) {
        var table = d3.select("#list-segment").append("table")
                .attr("style", "margin-left: 10px"),
            thead = table.append("thead"),
            tbody = table.append("tbody");

        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
                .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append("td")
            .attr("style", "font-family: Courier") // sets the font style
                .html(function(d) { return d.value; });
        
        return table;
    }

});
