var filterdata  = require("./filter.js");
var top10  = require("./top10_movies.js");
var wordcloud = require("./wordcloud.js");
var d3 = require("d3")
var map = require("./map.js")
var scatter = require("./scatter.js");

var data; 

d3.csv("./data/tmdb-movie-metadata/tmdb_5000_movies_clean.csv").then(function(raw_data) {
    // Convert quantitSative scales to floats

    data = raw_data.map(function(d) {
      try{
        return {
          budget: parseFloat(d["budget"]) / 1e6, 
          revenue: parseFloat(d["revenue"]) / 1e6, 
          vote_average: parseFloat(d["vote_average"]), 
          popularity: parseFloat(d["popularity"]),
          genre: d["genres"].split('-').flat()[0] ,
          name: d["original_title"],
          year: parseInt(d["release_date"].slice(0, 4)),
          country: eval(d["production_countries"])[0]["name"], //["iso_3166_1"]
          text: d["genres"].concat(d["keywords"]).split('-').flat()
        };
      }catch{
        return {
          budget: parseFloat(d["budget"]) / 1e6, 
          revenue: parseFloat(d["revenue"] / 1e6), 
          vote_average: parseFloat(d["vote_average"]), 
          popularity: parseFloat(d["popularity"]),
          genre: "unknown",
          name: d["original_title"],
          year: parseInt(d["release_date"].slice(0, 4)),
          country: "unknown",
          text: d["genres"].concat(d["keywords"]).split('-').flat()
        };
      }
    });

    filterdata.filterdata(data)
    top10.top10(data)
    scatter.scatter(data)
    map.map(data)
    wordcloud.wordcloud(data)
  });