// MS BGD 2019-2020 - HIROTO YAMAKAWA 
var d3 = require("d3")

var x, 
    y, 
    yAxis,
    xAxis,
    xaxislabel, 
    yaxislabel, 
    svg,
    i,
    topData, 
    mouseover, 
    mouseout

var format = d3.format(',')

function top10(data){

  // set the and margins of the graph
  var margin = {top: 20, right: 80, bottom: 20, left: 230},
      width = document.body.clientWidth/2 - margin.left - margin.right,
      height = document.body.clientHeight/2 - margin.top - margin.bottom

  // append the svg object to the body of the page
  svg = d3.select("#top10")
      .style("height", height + margin.top + margin.bottom + 'px')
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 20)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      

  ////////////////////////////////////////////////////////////////////////////////////////////////

  // create variables
  x = d3.scaleLinear()
  .range([ 0, width]);

  y = d3.scaleBand()
  .range([ 0, height ])
  .padding(1);

  // create labels
  yaxislabel =svg.append("text")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(0)")
  .attr("y", 0)
  .attr("x", -15);        

  xaxislabel = svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height + margin.top + 20);
      
  // create axis
  xAxis = svg.append("g")
  .call(d3.axisLeft(x))
  .attr("transform", "translate(0," + height + ")");

  yAxis = svg.append("g")
  .call(d3.axisLeft(y));

  // set i to "revenue" (default choice)
  i = "revenue"

  // create mouseover and mouseout functions
  mouseover = function(d){
    tooltip.transition()    
    .duration(200)    
    .style("opacity", 1);

    tooltip .html("name: " + d.name + "<br/>" + i + " : " + format(d[i]) + "<br/>" + "genre : "+ d.genre)
    .style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY - 15) + "px")

    }

  mouseout = function(d){
    tooltip.transition()    
    .duration(200)    
    .style("opacity", 0)
  }

  // create tooltips
  var tooltip = d3.select("body")
      .append("div")  
      .style('position','absolute')
      .style("opacity", 0)
      .style("background-color", "lightsteelblue")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");
    

  ////////////////////////////////////////////////////////////////////////////////////////////////


   //./data/tmdb-movie-metadata/tmdb_5000_movies.csv
    //initiate graph
  initialGraph(data);

    //update graph based on selection from HTML dragdown
  //d3.select("#label-option").on("change", () => change(data));

  topData = data.slice(0, 20)

    ////////////////////////////////////////////////////////////////////////////////////////////////

  // create function initialGraph
  function initialGraph(data){

    var selectValue = d3.select('select').property('value')

    // select topData based on i
    var topData = data.sort(function(a, b) {
      return d3.descending(+a[i], +b[i]);
      }).slice(0, 21);

    // rescale the domain
    x.domain([0, d3.max(topData, function(d) { return d[i] ;} )]);
    y.domain(topData.map(function(d) { return d.name; }));

    
    //initiate X axis
    xAxis
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end");

    //initiate Y axis
    yAxis
    .call(d3.axisLeft(y));


    //initiate X axis label
    xaxislabel.text(i);

    //initiate Y axis label
    yaxislabel.text("movies");

    //initiate bars, all starting at 0 at the beginning
    svg.selectAll(".bar")
    .data(topData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x",  function(d) {return  x(0);})
    .attr("y", function(d) { return y(d.name); })
    .attr("width",function(d){return x(0);} )
    .attr("height", 15)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);


    //update the bar with the transition
    svg.selectAll(".bar")
    .transition()
    .duration(500)
    .attr("width",function(d) { return  x(d[i]);}  )
    .attr("y", function(d) { return y(d.name); })
    .attr("height", 15)
    .attr("fill", function(d) {
      return "rgb(200, 80, " + (y(d.name)/2 ) + ")"});;

    // add label next to bar
    svg.append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .style("font", "12px sans-serif")
    .selectAll("label-top10")
    .data(topData)
    .enter().append("text")
    .attr("class", "label-top10")
    .attr("x", d => x(d[i]) - 4)
    .attr("y", d => y(d.name) + y.bandwidth() / 2+10)
    .text(d => format(d[i]));

  };
  ////////////////////////////////////////////////////////////////////////////////////////////////
}

//create update function 

function change(data) {

  var selectValue = d3.select('#label-option').property('value');
  //update topData

  var remake

  if (topData.length < 20){
    remake = true
  }else{
    remake = false
  }

  topData = data.sort(function(a, b) {
    return d3.descending(+a[selectValue], +b[selectValue]);
  }).slice(0, 20);


  // update x and y domain / scale       
  x
  .domain([0, d3.max(topData, function(d) { return d[selectValue] ;} )])
  .call(d3.axisBottom(x));
    
  y
  .domain(topData.map(function(d) { return d.name; }))
  .call(d3.axisLeft(y));
    

  // Update x axis label   (y axis remains unchanged)
  xaxislabel
  .attr("text-anchor", "end")
  .text(selectValue);
  
  
  // Update the Y-axis and X-axis
  yAxis
  .transition()
  .duration(1500)
  .call(d3.axisLeft(y));
  
  xAxis
  .transition()
  .duration(1500)
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-20)")
  .style("text-anchor", "end");

  
  // console.log(d3.event, d3.event.target == d3.select('#label-option')._groups[0][0], d3.select('#label-option')._groups[0][0])

  var event_is_select = d3.event.target == d3.select('#label-option')._groups[0][0]
  // console.log(event_is_select)
  if (remake){

    var bar = svg.selectAll('.bar')
    bar.remove()

    svg.selectAll(".bar")
        .data(topData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x",  function(d) {return  x(0);})
        .attr("y", function(d) { return y(d.name); })
        .attr("width",function(d){return x(0);} )
        .attr("height", 15)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    svg.selectAll(".bar")
      .transition()
      .duration(500)
      .attr("width",function(d) { return  x(d[i]);}  )
      .attr("y", function(d) { return y(d.name); })
      .attr("height", 15)
      .attr("fill", function(d) {
      return "rgb(200, 80, " + (y(d.name)/2 ) + ")"});

  }else{
    var bar = svg.selectAll('.bar').data(topData);
    bar.exit().remove(); 
    // Update data:
    bar
    .transition()
    .duration(500)
    .attr("x",  function(d) {return  x(0);})
    .attr("y", function(d) { return y(d.name); })
    .attr("width",function(d){return x(0);} )
    .attr("width",function(d) { return  x(d[selectValue]);}  )
    .attr("height", 15)
    .attr("fill", function(d) {
      return "rgb(200, 80, " + (y(d.name)/2 ) + ")"});
  }

  // add label next to bar

  var textlabel = svg.selectAll(".label-top10").data(topData)
  textlabel.exit().remove()

  textlabel.transition().duration(300)
    .attr("x", d => x(d[selectValue]) - 4)
    .attr("y", d => y(d.name) + y.bandwidth() / 2+10)
    .text(d => format(d[selectValue]));

}

module.exports.top10 = top10; 
module.exports.change = change; 

// export default {top10, change};
  

  
       
