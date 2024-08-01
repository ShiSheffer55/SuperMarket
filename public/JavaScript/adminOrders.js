async function fetchData() {
    const alertContainer = document.getElementById('alert-container');
    try {
        // Fetch data from the server
        const response = await fetch('/admin/orders/average-per-day');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        // Show an alert if there's an error
        showAlert('An unexpected error occurred. Please try again.');
        return []; // Return an empty array to avoid further errors in rendering
    }
}

function renderChart(data) {
    // Set up chart dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create an SVG container
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up the x-axis scale (time scale for dates)
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.date))) // Use extent to get min and max dates
        .range([0, width]);

    // Set up the y-axis scale (linear scale for number of orders)
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count) || 0]) // Use max to get the highest count of orders
        .nice() // Round the domain values for better display
        .range([height, 0]);

    // Set a fixed width for the bars (make bars thinner by reducing this value)
    const barWidth = 12; // Adjust the bar width to make it thinner

    // Create the bars for the chart
    svg.append("g")
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(new Date(d.date)) - barWidth / 2)
        .attr("y", d => y(d.count))
        .attr("width", barWidth)
        .attr("height", d => height - y(d.count))
        .attr("fill", "steelblue");

    // Add the x-axis to the chart
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)) // Use d3.axisBottom for the x-axis
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Date");

    // Add the y-axis to the chart
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y)) // Use d3.axisLeft for the y-axis
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .text("Number of Orders");
}

// Fetch data and render the chart if data is available
fetchData().then(data => {
    if (data.length > 0) {
        renderChart(data);
    } else {
        showAlert('No data available to display.');
    }
});

// Function to show alert messages
function showAlert(message) {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.textContent = message;
        alertContainer.style.display = 'block';
        setTimeout(() => {
            alertContainer.style.display = 'none';
        }, 5000);
    }
}
