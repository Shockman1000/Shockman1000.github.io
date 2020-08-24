function buildMetadata(sample){
    d3.json("./samples.json").then(function(data) {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
    });
}

function buildCharts(sample) {
    d3.json("./samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var sample_values = result.sample_values;
        var otu_labels = result.otu_labels;

        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barchartData = [
            {
                y: yticks,
                x: sample_values.slice(0, 10),
                text: otu_labels.slice(0, 10),
                type: "bar",
                orientation: "h",
            }
        ];
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
        };
        Plotly.newPlot("bar", barchartData, barLayout);

        var bubblechart = [
            {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                size: sample_values,
                color: otu_ids}
            }
        ];
        Plotly.newPlot("bubble", bubblechart);
    });    
}

function init() {
    var selector = d3.select("#selDataset");
    d3.json("./samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

init();