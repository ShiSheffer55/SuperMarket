function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 8,
        center: { lat: 31.7683, lng: 35.2137 } // Default center, Jerusalem
    });

    // Fetch locations from the server
    fetch('/location/locations')
        .then(response => response.json())
        .then(locations => {
            locations.forEach(location => {
                new google.maps.Marker({
                    position: {
                        lat: location.location.coordinates[1],
                        lng: location.location.coordinates[0]
                    },
                    map: map,
                    title: location.name
                });
            });
        })
        .catch(error => console.error('Error fetching locations:', error));
}


// Call initMap when the window loads
window.onload = initMap;

document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            fetch(`/location/weather?lat=${lat}&lon=${lon}`)
                .then(response => response.json())
                .then(data => {
                    const weatherHtml = `
                        <h3>${data.name}</h3>
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
                        <p>${data.weather[0].description}</p>
                        <p>Temperature: ${data.main.temp}°C</p>
                        <p>Humidity: ${data.main.humidity}%</p>
                    `;
                    document.getElementById('weather').innerHTML = weatherHtml;
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    document.getElementById('weather').innerHTML = '<p>Error loading weather data.</p>';
                });
        }, (error) => {
            console.error('Error getting location:', error);
            document.getElementById('weather').innerHTML = '<p>Error getting location.</p>';
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        document.getElementById('weather').innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
});
