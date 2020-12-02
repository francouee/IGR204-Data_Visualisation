
var d3 = require("d3")
var d3legend = require("d3-svg-legend")
let color_scale

var tooltip = d3.select("body")
.append("div")  
.style('position','absolute')
.style("opacity", 0)
.style("background-color", "lightsteelblue")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "5px")
.style("padding", "10px");

var mouseover = function(d, country_count){
    tooltip.transition()    
    .duration(200)    
    .style("opacity", 1);

    tooltip.html("<p>Name: " + d["properties"]["name"] + "<br/>Number of movies: " + country_count[d["properties"]["name"]] + "</p>")
    .style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY - 15) + "px")

    }

var mouseout = function(d){
    tooltip.transition()    
    .duration(200)    
    .style("opacity", 0)
}

function map(data){
    var [country_count, country_max] = count_country(data)

    color_scale = d3.scaleLog()
        .domain([1, country_max])
        .range([d3.interpolateBlues(0), d3.interpolateBlues(1)])

    var map_legend = d3legend.legendColor()
        .scale(color_scale);

    var margin = { top: 50, left:50, right: 50, bottom: 50},
        width = document.body.clientWidth/2 - margin.left - margin.right,
        height = document.body.clientHeight/2 - margin.top - margin.bottom

    var svg = d3.select("#map").style("height", height + margin.top + margin.bottom + 'px')
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate("+ margin.left + "," + margin.top + ")");
    
    //Read Data
    d3.json("./data/map/countries.json").then((d) => {
        ready( d , country_count)

        //Color Legend container
        // var legendsvg = svg.append("g")
        //     .attr("class", "legendWrapper")
        //     .attr("transform", "translate(" + (width - 50) + "," + 70 + ")");

        // console.log(map_legend)
        
        // legendsvg.append("g")
        //     .call(map_legen  d)
            
        // //Append title
        // legendsvg.append("text")
        //     .attr("class", "legendTitle")
        //     .attr("x", 0)
        //     .attr("y", -2)
        //     .text("Legend");
    })

    //Create projection and center it (translate) and scaleit
    var projection = d3.geoMercator()
        .translate([ width / 2, height / 2 ])
        .scale(100)

    //Create the path using the projection
    var path = d3.geoPath()
        .projection(projection)

    function ready (country_data, country_count) {

        // Transform raw country_data
        var countries = topojson.feature(country_data, country_data.objects.units).features

        var countries_name = countries.map(function(d) {
            return {
                name: d["properties"]["name"]
            };
        })

        for (const i in countries_name){
            if (!(countries_name[i]['name'] in country_count)){
                country_count[countries_name[i]['name']] = 1
            }
        }

        //Create path for each country (path are needed for geometry)
        svg.selectAll(".country")
            .data(countries)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("fill", (d) => color_scale(country_count[d["properties"]["name"]]))
            .on("mouseover", (d) => mouseover(d, country_count) )
            .on("mouseout", (d) => mouseout(d));

    }

};

function change(data){
    var svg = d3.select("#map")
        svg.selectAll(".country")

    d3.json("./data/map/countries.json").then((country_data) => {
            
        var [country_count, country_max] = count_country(data)

        color_scale = d3.scaleLog()
        .domain([1, country_max])
        .range([d3.interpolateYlGnBu(0), d3.interpolateYlGnBu(1)])

        // Transform raw country_data
        var countries = topojson.feature(country_data, country_data.objects.units).features

        var countries_name = countries.map(function(d) {
            return {
                name: d["properties"]["name"]
            };
        })

        for (const i in countries_name){
            if (!(countries_name[i]['name'] in country_count)){
                country_count[countries_name[i]['name']] = 0
            }
        }
        //Update Color
        svg.selectAll(".country")
            .attr("fill", (d) => color_scale(country_count[d["properties"]["name"]]))
            .on("mouseover", (d) => mouseover(d, country_count))
            .on("mouseout", (d) => mouseout(d));
    })
};

function count_country(data){
    let initialValue = {}

    var country_count = data.map(d => d.country).reduce(function (accumulator, currentValue) {
        if (!(currentValue in accumulator)){
            accumulator[currentValue] = 1
        }
        else{
            accumulator[currentValue] += 1
        }
        return accumulator
    }, initialValue)

    var country_max = Object.entries(country_count).map(d => d[1]).reduce(( acc, cur ) => Math.max( acc, cur), -Infinity)
    return [country_count, country_max]
}

module.exports.map = map;
module.exports.change = change; 
