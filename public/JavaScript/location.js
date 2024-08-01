  // Initialize the Google Map
  function initMap() {
  var options = {
        zoom: 12,
        center: { lat: 	31.771959, lng: 35.217018 } // Default center, Jerusalem
    }
  const map = new google.maps.Map(document.getElementById('map'), options);
    // Fetch locations from the server
    // fetch('/location/locations')
    //     .then(response => response.json())
    //     .then(locations => {
    //         locations.forEach(location => {
    //             const marker = new google.maps.Marker({
    //                 position: {
    //                     lat: location.coordinates[1],
    //                     lng: location.coordinates[0]
    //                 },
    //                 map: map,
    //                 title: location.name
    //             });
    //         });
    //     })
    //     .catch(error => console.error('Error fetching locations:', error));
}

// Call initMap when the window loads
window.onload = initMap;