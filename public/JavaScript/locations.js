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



const apiKey = 'c90aacc7583863f6225f59439eeecbc7'; // Replace with your OpenWeather API key

function getWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const weatherHtml = `
                <h3>${data.name}</h3>
                <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
                <p>${data.weather[0].description}</p>
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Humidity: ${data.main.humidity}%</p>
            `;
            $('#weather').html(weatherHtml);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            $('#weather').html('<p>Error loading weather data.</p>');
        });
}

$(document).ready(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeather(lat, lon);
        }, function(error) {
            console.error('Error getting location:', error);
            $('#weather').html('<p>Error getting location.</p>');
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        $('#weather').html('<p>Geolocation is not supported by this browser.</p>');
    }
});