// load the data from a local file
d3.csv("Life_Expectancy_Data.csv").then(fullData => {

  // clean full data
  let cleanFullData = cleanData(fullData);

  // filter data by year 2015 para grafica principal
  let data = cleanFullData.filter(d => d.year == "2015")
  console.log(data)

  let height = 600
  let width = 600
  let margin = {
    top: 40,
    botton: 40,
    left: 40,
    right: 40     
  };

  // life expentancy
  let escalaX = d3.scaleLinear() 
    .domain(d3.extent (data, d => d.lifeExpentancy))
    .range ([0 + margin.left, width - margin.right])
    
  // icor
  let escalaY = d3.scaleLinear()
    .domain(d3.extent (data, d => d.icor ))
    .range ([height-margin.botton, 0 + margin.top])

  let sizeScale = d3.scaleLinear()
    .domain(d3.extent (data, d => d.lifeExpentancy ))
    .range(["3", "10"]);

  let colorScale = d3.scaleLinear()
    .domain(d3.extent (data, d => d.icor ))
    .range (["red", "grey", "blue"]);

  let element = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  element
    .selectAll ("circle")
    .data(data)
    .enter()
    .append ("circle")
    .attr ("r", d => sizeScale(d.lifeExpentancy))
    .attr("cx", d => escalaX(d.lifeExpentancy))
    .attr("cy", d => escalaY(d.icor))
    .attr("fill", d => colorScale(d.icor))
    .on("click", d => details(d.country)); // on click pintamos detalles en grafico secundario

  /** ejes de la grafica principal */
  // eje y 
  let ejeY = d3
    .axisLeft(escalaY)
    .ticks(10);
  element
    .append("g")
    .attr("transform", "translate (" + margin.left + ",0)")
    .call (ejeY);
  
  // eje x
  let ejeX = d3
    .axisBottom(escalaX)
    .ticks(10)
    .tickFormat (d3.format(".3s"));
  element
    .append("g")
    .attr("transform", "translate (0, " + (height - margin.botton) + ")")
    .call(ejeX);
  
  // pinta estructura de grafica secundaria
  let elementDetails = detailsGraph(width, height, margin, ejeX);
  
  // nuevo eje y para grafica secundaria in a variable to reuse later
  let gEjeYDetails =  
    elementDetails
      .append("g")
      .attr("transform", "translate (" + margin.left + ",0)");
  
  /** 
   * pinta grafica histograma con eje y el valor g
   * parametro de entrada country para recuperar el array con todos los anios del full data
   */
  function details(country) {
    console.log(country)

    // recuperamos los detalles de una country para todos los anios para mostrar su histograma
    let detailsData = findDataByCountry(cleanFullData, country);
    console.log(detailsData)

    // eje y de grafica secundaria => icor
    let escalaYDetails = d3.scaleLinear()
      .domain (d3.extent(detailsData, d => d.icor))
      .range ([height - margin.botton, 0 + margin.top])
    let ejeYDetails = d3.axisLeft(escalaYDetails)
        .ticks(10);
    // pinta sobre la misma g del eje Y
    gEjeYDetails.call(ejeYDetails); 

  // reusa circulos existentes
  elementDetails
    .selectAll("circle") 
    .data(detailsData)
    .attr("r", d => sizeScale(d.lifeExpentancy)) 
    .attr ("cx", d => escalaX(d.lifeExpentancy))
    .attr("cy",d => escalaYDetails(d.icor))
    .attr ("fill", d => colorScale(d.icor))
   

  // anade nuevos circulos
  elementDetails
    .selectAll("circle") 
    .data(detailsData) 
    .enter() // toma los circulos que no existen
    .append ("circle")
    .attr("r",d => sizeScale(d.lifeExpentancy)) 
    .attr ("cx", d => escalaX(d.lifeExpentancy))
    .attr("cy",d => escalaYDetails(d.icor))
    .attr ("fill", d => colorScale(d.icor))
  }

});

/** 
 * funcion auxiliar para pintar structura de grafica secundaria solo una vez 
 * devuelve el object elemetDetails 
 */
function detailsGraph(width, height, margin, ejeX) {
  let elementDetails = d3
    .select("body")
    .append("svg");
  
  elementDetails
    .attr ("width", width)
    .attr ("height", height)
    .append("g")
    .attr("transform", "translate (0," + (height - margin.botton) + ")")
    .call(ejeX); // mismo eje x para que este alineado con la principal
  
    return elementDetails;
}

/** 
 * filtra el full data por country
 * devuelve un array de details para una misma country desde 2000 a 2015
 */
function findDataByCountry(cleanFullData, country) {
  return cleanFullData.filter(d => d.country == country)
}