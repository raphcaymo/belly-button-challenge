// // Set up URL for data
const url =
    "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise pending for obtaining JSON data from URL
const dataPromise = d3.json(url);
//console.log("Data Promise: ", dataPromise);

// Read the JSON url
d3.json(url).then(function(data){
//console.log(data);

});
// Set up variables and get data from JSON for chart creation
let samples;
let meta_data;
d3.json(url).then(function (data) {
    let selector = d3.select("#selDataset");
    meta_data = data.metadata;
    samples = data.samples;
    data.names.forEach((id) => {
        selector.append("option").text(id).property("value", id);
    });
    metaData(meta_data[0]);
    hbarChart(samples[0]);
    bubbleChart(samples[0]);
    gaugeWfreq(meta_data[0]);
});



//function to populate demo info
function metaData(demographicInfo) {
    let demoSelect = d3.select("#sample-metadata");

    demoSelect.html(
        `id: ${demographicInfo.id} <br> 
        ethnicity: ${demographicInfo.ethnicity} <br>
        gender: ${demographicInfo.gender} <br>
        age: ${demographicInfo.age} <br>
        location: ${demographicInfo.location} <br>
        bbtype: ${demographicInfo.bbtype} <br>
        wfreq: ${demographicInfo.wfreq}`
    );
}

//function for hbarChart
function hbarChart(selectedId) {
    let x_axis = selectedId.sample_values
        .slice(0, 10)
        .reverse();
    let y_axis = selectedId.otu_ids
        .slice(0, 10)
        .reverse()
        .map((item) => `OTU ${item}`);
    let text = selectedId.otu_labels
        .slice(0, 10)
        .reverse();

    barChart = {
        x: x_axis,
        y: y_axis,
        text: text,
        type: "bar",
        orientation: "h",
    };

    let chart = [barChart];

    let layout = {
        margin: {
            l: 100,
            r: 100,
            t: 0,
            b: 100,
        },
        height: 500,
        width: 600,
    };

    Plotly.newPlot("bar", chart, layout);
}

//function for bubble chart
function bubbleChart(selectedId) {
    let x_axis = selectedId.otu_ids;
    let y_axis = selectedId.sample_values;
    let marker_size = selectedId.sample_values;
    let color = selectedId.otu_ids;
    let text = selectedId.otu_labels;

    bubble = {
        x: x_axis,
        y: y_axis,
        text: text,
        mode: "markers",
        marker: {
            color: color,
            colorscale: "Electric",
            size: marker_size,
            opacity:0.6,
        },
        type: "scatter",
    };
    let chart = [bubble];

    let layout = {
        xaxis: {
            title: { text: "OTU ID" },
        },
    };
    Plotly.newPlot("bubble", chart, layout);

}

//function for gauge
function gaugeWfreq(demographicInfo){
    let data = [
	    {
		    domain: { x: [0, 1], y: [0, 1] },
		    value: demographicInfo.wfreq,
		    title: { text: "Belly Button Wash Frequency" },
		    type: "indicator",
		    mode: "gauge+number",
            gauge: {
                bar: {color: "gray"},
                axis: { range: [null, 12] },
                steps: [
                  { range: [0, 2], color: "#fafa6e" },
                  { range: [2, 4], color: "c4ec74" },
                  { range: [4, 6], color: "92dc7e" },
                  { range: [6, 8], color: "64c987" },
                  { range: [8, 10], color: "39b48e" },
                  { range: [10, 12], color: "089f8f" },
                ],
            }
        }
    ];

    let layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot("gauge", data, layout);
}

//funtion when changing option
function optionChanged(value) {
    const selectedId = samples.find((item) => item.id === value);
    const demographicInfo = meta_data.find((item) => item.id == value);

    //Demo Data
    metaData(demographicInfo);

    //Bar Chart
    hbarChart(selectedId);

    //Bubble Chart
    bubbleChart(selectedId);

    //Gauge
    gaugeWfreq(demographicInfo);
}