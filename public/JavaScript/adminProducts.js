// Function to fetch product data from the server
async function fetchProductData() {
    try {
        const response = await fetch('/admin/products/most-sold');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data
        renderProductChart(data); // Pass data to D3.js rendering function
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// Function to render the chart using D3.js
function renderProductChart(data) {
    const margin = { top: 20, right: 30, bottom: 60, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Convert data values for rendering
    const x = d3.scaleBand()
        .domain(data.map(d => d._id)) // Use product names for x-axis
        .range([0, width])
        .padding(0.1); // Adjust padding for spacing

        const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.minAmount) || 0]) // Sets the domain from 0 to the maximum value in the data
        .nice() // Makes the y-axis ticks more readable by rounding domain values
        .range([height, 0]); // Maps the domain to the pixel range of the SVG
    

    // Create bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d._id))
        .attr("y", d => y(d.minAmount))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.minAmount))
        .attr("fill", "steelblue");

    // Add x-axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // Add y-axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .text("Minimum Amount Sold");
}

// Call fetchProductData to initiate the process
fetchProductData();
