  // Initialize the Google Map
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
                const marker = new google.maps.Marker({
                    position: {
                        lat: location.coordinates[1],
                        lng: location.coordinates[0]
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