// load the data from a local file
d3.csv("Life_Expectancy_Data.csv").then(data => {

  /** Cleaning data */

  // filter the data to use just Spanish data
  let esData = data.filter(d => d.Country == "Spain");
  console.log(esData);

  let byYear = data.filter(d => d.Year == "2015")
  console.log(byYear);

  // clean the data
  let cleanData = byYear.map(d => {
    return { 
      year: d.Year, 
      lifeExpentancy: d["Life expectancy "], 
      country: d.Country 
    }
  });

  /** Custom scales */
  let customScale = d3.scaleLinear()
    .domain(d3.extent(cleanData, d => d.lifeExpentancy))
    .range(["5px", "50px"]);
  
  let colorScale = d3.scaleLinear()
    .domain(d3.extent(cleanData, d => d.lifeExpentancy))
    .range(["black", "green"]);


  let element = d3
    .select("body")
    .append("ul");

  element
    .selectAll("li")
    .data(cleanData) // join
    .enter()
    .append("li")
    .text(d => d.country)
    .style("font-size", d => customScale(d.lifeExpentancy))
    .style("color", d => colorScale(d.lifeExpentancy))

});

    
    