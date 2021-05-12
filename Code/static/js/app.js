// Set up the initial 
function init() {
        // select dropdown menu 
        var dropdown = d3.select("#selDataset");
    
        // read data from sample.json and print them 
        d3.json("samples.json").then((bdata)=> {
            console.log(bdata)
            // will need the id to be shown in the menu
            bdata.names.forEach(function(name) {
                dropdown.append("option").text(name).property("value");
            });
            // call the function to plot the graphs
            buildPlot(bdata.names[0]);
            // call the getdemo function
            demoinfo(bdata.names[0]);

        });
    }

//Change Event
function optionChanged(){
    buildPlot();
    demoinfo();
}

//Plotting the two graphs
function buildPlot(){
    //read data from json and print them
    d3.json("samples.json").then(bdata => { 
        console.log(bdata);
        // Grab values from samples.json
        var ids = bdata.samples[0].otu_ids;
        var sample_values = bdata.samples[0].sample_values.slice(0,10).reverse();
        var labels = bdata.samples[0].otu_labels.slice(0.10);
        var top_OTUs = labels.reverse();
        var OTU_id = top_OTUs.map(d => "OTU " + d);
        
        //Bar Chart
        var trace1 = {
            x: sample_values,
            y: OTU_id,
            text: labels,
            type: "bar",
            orientation: "h",
            marker: {
                color: 'blue'
            }};

        var data = [trace1];
        var layout = {
            title: "top 10 OTUs"
        };
        //Plot the bar chart
        Plotly.newPlot("bar", data, layout)

        //bubble chart
        var trace2 = {
            x: ids,
            y: bdata.samples[0].sample_values,
            mode: 'markers',
            marker: {
                size: bdata.samples[0].sample_values,
                color: ids,
            },
            text: bdata.samples[0].otu_labels
        };

        var data2 = [trace2]
        var layout2 = {
            title: "OTU ID Values"
        }
        //Plot the bubble chart
        Plotly.newPlot("bubble", data2, layout2)
    })};

//Demographic information
function demoinfo(){
    d3.json("samples.json").then((bdata)=> {
        var demochart = d3.select("#sample-metadata")
        // demo info is stored in metadata in json
        var metad = bdata.metadata;
        // filter metadata by id
        var info = metad.filter(me=> me.id==ids)[0];
    
        // clear up the existing data
        demochart.html("");
        
        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(info).forEach(([key,value])=>{  
        demochart.append("h3").text(`${key}${value}`)
        });
    });
}

init()

