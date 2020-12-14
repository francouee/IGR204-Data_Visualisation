var d3 = require("d3"),
    cloud = require("d3-cloud");

function wordcloud(data){
  var wordsMap = {};
  var words = [];

  data.map(function(d){
    d.text.map(word => {
      if (wordsMap.hasOwnProperty(word)) {
        wordsMap[word]++;
      } else {
        wordsMap[word] = 1;
      }
    }) 
  })
  for (const [key, value] of Object.entries(wordsMap)) {
    words.push({text: key, size: 5 + wordsMap[key]})
  }

  words = words.sort(function(a, b){
    return b.size - a.size
  })

  var width = document.body.clientWidth/2,
      height = document.body.clientHeight/2

  var layout = cloud()
    .size([width, height])
    .words(words.slice(0, 100))
    .padding(5)
    .font("Impact")
    .rotate(function() { return ~~(Math.random() * 2) * 45; })
    .fontSize(function(d) { return d.size; })
    .on("end", draw);

  layout.start();

  function draw(words) {
    d3.select("#wordcloud").append("svg")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
      .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    };
}

  function change(data){
    d3.select("#wordcloud").selectAll("svg > *").remove();
    wordcloud(data)
  }

module.exports.wordcloud = wordcloud;
module.exports.change = change;
