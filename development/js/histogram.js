// Test bring in club activity data
d3.json("data/small_club_activity_5_30.json", function(data){
  // Convert start_date into a Date variable
  var formatDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ"),
      formatNumber = d3.format(",d"),
      //formatChange = d3.format("+,d"),
      formatTime = d3.time.format("%I:%M %p");
  // Format the Date variable for display
  var showFormat = d3.time.format("%B %d");
  
  var nestByDate = d3.nest()
      .key(function(d) { return d3.time.day(d.date); });
  
  // Raw start_date example: 2016-05-31T02:16:19Z
  data.forEach(function(d, i) {
    d.index = i;
    d.date = formatDate.parse(d.start_date);
    //d.show_date = showFormat(d.start_date);
  });
  console.log("Parsed Date looks like:", data[0].date);


  var activity = crossfilter(data),
      all = activity.groupAll(),
      date = activity.dimension(function(d) { return d.date;}),  
      dates = date.group(d3.time.day);
      date_to_show = activity.dimension(function(d) { return d.date;}),  
      dates_to_show = date_to_show.group(d3.time.day);
  var charts = [
          barChart()
              .dimension(date)
              .group(dates)
              .round(d3.time.day.round)
            .x(d3.time.scale()
              .domain([new Date(2016, 4, 20), new Date(2016, 5, 1)])
              .rangeRound([0, 12 * 15]))
              .filter([new Date(2016, 5, 20), new Date(2016, 5, 31)])
              ];
  var chart = d3.selectAll(".chart")
        .data(charts)
        .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });
  console.log(dates_to_show.all());
  charts[0].filter(null);
  d3.selectAll("#start")
      .text(showFormat(new Date(2016, 4, 20)));

  d3.selectAll("#end")
      .text(showFormat(new Date(2016, 4, 31)));
  renderAll();

  // Renders the specified chart or list.
  function render(method) {
    d3.select(this).call(method);
  }

  // Whenever the brush moves, re-rendering everything.

  function renderAll() {
    chart.each(render);
    var start = -1, end = -1;
    var s_date = "", e_date = "";
    var dict_group = dates_to_show.all();
    for (var i = 0; i < dict_group.length; i++){
      if ((start == -1) && (dict_group[i].value != 0)){
        start = 0;
        var start_date_show = dict_group[i].key;
        s_date = showFormat(start_date_show);
      }
      
      if ((end == -1) && (start == 0) && (dict_group[i].value == 0)){
        end = 0;
        var end_date_show = dict_group[i-1].key;
        e_date = showFormat(end_date_show);
        break;
      }
      
      if (i == dict_group.length - 1){
        end = 0;
        var end_date_show = dict_group[i].key;
        e_date = showFormat(end_date_show);
        break;
      }
      
      
    }
    d3.selectAll("#start").text(s_date);
    d3.selectAll("#end").text(e_date);
  }
  
  window.filter = function(filters) {
    filters.forEach(function(d, i) { charts[i].filter(d); });
    renderAll();
  };

  window.reset = function(i) {
    charts[i].filter(null);
    renderAll();
  };
  //然后要写什么？看crossfilter的说明
  console.log(data[0].start_date);
  console.log(data[0].show_date);

  function barChart() {
    if (!barChart.id) barChart.id = 0;

    var margin = {top: 10, right: 20, bottom: 20, left: 20},
        x,
        y = d3.scale.linear().range([50, 0]),
        id = barChart.id++,
        axis = d3.svg.axis().orient("bottom"),
        brush = d3.svg.brush(),
        brushDirty,
        dimension,
        group,
        round;

    function chart(div) {
      var width = x.range()[1],
          height = y.range()[0];
      y.domain([0, group.top(1)[0].value]);

      div.each(function() {
        var div = d3.select(this),
            g = div.select("g");

        // Create the skeletal chart.
        if (g.empty()) {
          div.select(".title").append("a")
              .attr("href", "javascript:reset(" + id + ")")
              .attr("class", "reset")
              .text("reset")
              .style("display", "none");

          g = div.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.append("clipPath")
              .attr("id", "clip-" + id)
            .append("rect")
              .attr("width", width)
              .attr("height", height);
          console.log(width,height);
          g.selectAll(".bar")
              .data(["background", "foreground"])
            .enter().append("path")
              .attr("class", function(d) { return d + " bar"; })              
              .datum(group.all());
          g.selectAll(".foreground.bar")
              .attr("clip-path", "url(#clip-" + id + ")");
          /*
          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(axis);
          */
          // Initialize the brush component with pretty resize handles.
          var gBrush = g.append("g").attr("class", "brush").call(brush);
          gBrush.selectAll("rect").attr("height", height);
          gBrush.selectAll(".resize").append("path").attr("d", resizePath);
        }

        // Only redraw the brush if set externally.
        if (brushDirty) {
          brushDirty = false;
          g.selectAll(".brush").call(brush);
          div.select(".title a").style("display", brush.empty() ? "none" : null);
          if (brush.empty()) {
            g.selectAll("#clip-" + id + " rect")
                .attr("x", 0)
                .attr("width", width);
          } else {
            var extent = brush.extent();
            g.selectAll("#clip-" + id + " rect")
                .attr("x", x(extent[0]))
                .attr("width", x(extent[1]) - x(extent[0]));
          }
        }

        g.selectAll(".bar").attr("d", barPath);
      });

      function barPath(groups) {
        var path = [],
            i = -1,
            n = groups.length,
            d;
        while (++i < n) {
          d = groups[i];
          path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
        }
        return path.join("");
      }

      function resizePath(d) {
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = height / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }
    }

    brush.on("brushstart.chart", function() {
      var div = d3.select(this.parentNode.parentNode.parentNode);
      div.select(".title a").style("display", null);
    });

    brush.on("brush.chart", function() {
      var g = d3.select(this.parentNode),
          extent = brush.extent();
      if (round) g.select(".brush")
          .call(brush.extent(extent = extent.map(round)))
        .selectAll(".resize")
          .style("display", null);
      g.select("#clip-" + id + " rect")
          .attr("x", x(extent[0]))
          .attr("width", x(extent[1]) - x(extent[0]));
      dimension.filterRange(extent);
    });

    brush.on("brushend.chart", function() {
      if (brush.empty()) {
        var div = d3.select(this.parentNode.parentNode.parentNode);
        div.select(".title a").style("display", "none");
        div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
        dimension.filterAll();
      }
    });

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      axis.scale(x);
      brush.x(x);
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.dimension = function(_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = function(_) {
      if (_) {
        brush.extent(_);
        dimension.filterRange(_);
      } else {
        brush.clear();
        dimension.filterAll();
      }
      brushDirty = true;
      return chart;
    };

    chart.group = function(_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    chart.round = function(_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    return d3.rebind(chart, brush, "on");
  }
});