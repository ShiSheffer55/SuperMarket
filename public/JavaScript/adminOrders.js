async function fetchData() {
    try {
        const response = await fetch('/admin/orders/per-day');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Log the fetched data
        return data;
    } catch (error) {
        showAlert('An unexpected error occurred. Please try again.');
        return []; // Return an empty array to avoid further errors in rendering
    }
}

function renderChart(data) {
    // Set up chart dimensions
    const margin = { top: 20, right: 30, bottom: 60, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create an SVG container
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Convert date strings to Date objects and sort data by date
    data.forEach(d => {
        d.date = new Date(d.date);
    });
    data.sort((a, b) => a.date - b.date);

    // Define a range of dates to include in the x-axis, extending into the future
    const startDate = d3.min(data, d => d.date);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // Extend the end date to one month in the future

    // Set up the x-axis scale (time scale for dates)
    const x = d3.scaleTime()
        .domain([startDate, endDate]) // Extend domain to include future dates
        .range([0, width]);

    // Set up the y-axis scale (linear scale for number of orders)
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count) || 0])
        .nice()
        .range([height, 0]);

    // Define bar width and spacing
    const barWidth = 10; // Fixed width for bars
    const barSpacing = 2; // Space between bars
    const totalBarWidth = barWidth + barSpacing; // Total width for each bar plus spacing

    // Create the bars for the chart
    svg.append("g")
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.date)) // Center the bar over the date
        .attr("y", d => y(d.count))
        .attr("width", barWidth) // Use fixed bar width
        .attr("height", d => height - y(d.count))
        .attr("fill", "steelblue");

    // Add the x-axis to the chart
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .ticks(d3.timeDay.every(1)) // Display every day
            .tickFormat(d3.timeFormat("%d-%b"))
        )
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em") // Adjust spacing from the tick mark
        .attr("dy", ".15em") // Adjust vertical alignment
        .attr("transform", "rotate(-65)"); // Rotate labels for better fit

    // Add the y-axis to the chart with natural numbers only
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(d3.max(data, d => Math.ceil(d.count)) || 0).tickFormat(d3.format("d")))
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
