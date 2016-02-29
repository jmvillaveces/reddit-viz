function main(){
    
    var stories = {};
    var n = 2000;
    var events = [];
    var initial = true;

    var reddit = ""; // empty for frontpage
    var reddit_url = "http://www.reddit.com/" + reddit + ".json";
    var proxy = "https://cors-anywhere.herokuapp.com/";
    
    function handleRedditData(rawData) {
        var newData = formatSingleSubreddit(rawData);
        visualize(newData);
        
    }
    
    function fetch(url, cb, n){
        
        d3.json(url, function(error, data){
            if (error) return console.warn(error);
            cb(data);
            console.log('Got data!!');
        });
        
        setTimeout(fetch, n, url, cb, n);
    };
    
    //fetch( proxy + reddit_url, handleRedditData, n);
}

function formatSingleSubreddit(rawData) {
    return _.pluck(rawData.data.children, "data")
}

function visualize(redditActivitySources) {
    
    //Viz options
    var width = 500, barHeight = 20;
    
    data = _.sortBy(redditActivitySources, function(d) { return - d.score });
    
    //var scale 
    var scale = d3.scale.linear()
        .domain([0, d3.max(data, function(d){ return d.score; })])
        .range([0, width]);
    
    console.log(scale.domain());
    console.log(scale.range());
    
    var chart = d3.select("#viz")
        .attr("width", width)
        .attr("height", barHeight * data.length);
    
    
    // DATA JOIN
    // Join new data with old elements, if any.
    var bar = chart.selectAll("g")
        .data(data);
    
    //UPDATE
    // Update old elements as needed.
    chart.selectAll("rect")
        .attr("width", function(d){ return console.log(d); scale(d.score); });
    
    console.log('text', chart.selectAll("text"));
    chart.selectAll("text")
        .attr("x", function(d) { return scale(d.score) - 15; })
        .text(function(d) {return d.score; });
    
    // ENTER
    // Create new elements as needed.
    var g = bar.enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
    
    g.append("rect")
            .attr("width", function(d){ return scale(d.score); })
            .attr("height", barHeight - 1);
    
    g.append("text")
            .attr("x", function(d) { return scale(d.score) - 15; })
            .attr("y", barHeight / 2)
            .attr("dy", ".35em")
            .text(function(d) {return d.score; });
    
    // EXIT
    // Remove old elements as needed.
    bar.exit().remove();
}


main();

